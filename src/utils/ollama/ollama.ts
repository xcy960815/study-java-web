import { Core } from '../ai/core'

const MODEL = 'gpt-3.5-turbo'

export class Ollama extends Core {
  /**
   * 请求参数
   */
  private _requestParams: Partial<
    Omit<AI.Gpt.RequestParams, 'messages' | 'n' | 'stream'>
  >

  constructor(options: AI.Gpt.GptCoreOptions) {
    const { requestParams, ...coreOptions } = options
    super(coreOptions)
    this._requestParams = {
      model: MODEL, // 默认的model
      temperature: 0.8, // 默认的temperature (随机性)
      top_p: 1, // 默认的top_p
      presence_penalty: 1, // 默认的presence_penalty
      // 用户配置的参数
      ...requestParams
    }
  }
  /**
   * 构建fetch公共请求参数
   * @param {string} question
   * @param {AI.Gpt.GetAnswerOptions} options
   * @returns {Promise<AI.FetchRequestInit>}
   */
  private async _getFetchRequestInit(
    question: string,
    options: AI.Gpt.GetAnswerOptions
  ): Promise<AI.FetchRequestInit> {
    const {
      onProgress,
      stream = onProgress ? true : false,
      requestParams
    } = options
    // 获取用户和gpt历史对话记录
    const { messages, maxTokens } =
      await this._getConversationHistory(question, options)

    const body = {
      ...this._requestParams,
      ...requestParams,
      messages,
      stream,
      max_tokens: maxTokens
    }

    const requestInit: AI.FetchRequestInit = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
      signal: this._abortController.signal
    }
    return requestInit
  }

  /**
   * 当前模型的请求地址
   * @returns {string}
   */
  private get completionsUrl() {
    return `/ollama/chat`
  }

  /**
   * 获取答案
   * @param {string} question
   * @param {AI.Gpt.GetAnswerOptions} options
   * @returns {Promise<AI.Gpt.AssistantConversation>}
   */
  public async getAnswer(
    question: string,
    options: AI.Gpt.GetAnswerOptions
  ): Promise<AI.Gpt.AssistantConversation> {
    const {
      onProgress,
      stream = onProgress ? true : false
    } = options
    // 构建用户消息
    const userMessage = this.buildConversation(
      'user',
      question,
      options
    )
    // 保存用户对话
    await this.upsertConversation(userMessage)
    // 构建Ai助手消息
    const assistantMessage = this.buildConversation(
      'assistant',
      '',
      { ...options, messageId: userMessage.messageId }
    )
    // 包装成一个promise 发起请求
    const responseP =
      new Promise<AI.Gpt.AssistantConversation>(
        async (resolve, reject) => {
          try {
            const requestInit =
              await this._getFetchRequestInit(
                question,
                options
              )
            if (stream) {
              requestInit.onMessage = (data: string) => {
                if (data === '[DONE]') {
                  assistantMessage.content =
                    assistantMessage.content.trim()
                  return resolve(assistantMessage)
                }
                const response: AI.Gpt.Response =
                  JSON.parse(data)
                assistantMessage.messageId = response.id
                if (response?.choices?.length) {
                  const delta = response.choices[0].delta
                  if (delta?.content) {
                    assistantMessage.content +=
                      delta.content
                    if (this._markdown2Html) {
                      this._markdownToHtml(
                        assistantMessage.content
                      ).then((content) => {
                        assistantMessage.content = content
                      })
                    }
                  }
                  assistantMessage.detail = response
                  if (delta?.role) {
                    assistantMessage.role = delta.role
                  }
                  onProgress?.(assistantMessage)
                }
              }
              await this._fetchSSE<AI.Gpt.Response>(
                this.completionsUrl,
                requestInit
              ).catch(reject)
            } else {
              // 发送数据请求
              const response =
                await this._fetchSSE<AI.Gpt.Response>(
                  this.completionsUrl,
                  requestInit
                )
              const data = await response?.json()
              if (data?.id) {
                assistantMessage.messageId = data.id
              }
              if (data?.choices?.length) {
                const message = data.choices[0].message
                assistantMessage.content =
                  message?.content || ''
                assistantMessage.role =
                  message?.role || 'assistant'
              }
              assistantMessage.detail = data
              resolve(assistantMessage)
            }
          } catch (error) {
            console.error('AI EventStream error', error)
            return reject(error)
          }
        }
      ).then(async (Conversation) => {
        return this.upsertConversation(Conversation).then(
          () => {
            Conversation.parentMessageId =
              Conversation.messageId
            return Conversation
          }
        )
      })
    return this.clearablePromise(responseP, {
      milliseconds: this._milliseconds,
      message: ``
    })
  }

  /**
   * 获取会话消息历史
   * @param {string} text
   * @param {Required<AI.Gpt.SendMessageOptions>} options
   * @returns {Promise<{ messages: AI.Gpt.Message[]; }>}
   */
  private async _getConversationHistory(
    text: string,
    options: AI.Gpt.GetAnswerOptions
  ): Promise<{
    messages: Array<AI.Gpt.RequestMessage>
    maxTokens: number
  }> {
    const { systemMessage } = options
    const maxTokenCount =
      this._maxModelTokens - this._maxResponseTokens
    // 上次的会话id
    let parentMessageId = options.parentMessageId

    // 当前系统和用户消息
    const messages: Array<AI.Gpt.RequestMessage> = [
      {
        role: 'system',
        content: systemMessage || this._systemMessage
      },
      // 用户当前的问题
      {
        role: 'user',
        content: text
      }
    ]

    let tokenCount = 0
    let prompt = ''

    while (this._withContent) {
      // 计算
      messages.forEach((item) => {
        prompt += item.role
        prompt += item.content
      })

      tokenCount = await this.getTokenCount(prompt)

      // 当前 prompt token 数量大于最大 token 数量时，不再向上查找
      if (prompt && tokenCount > maxTokenCount) {
        break
      }
      if (!parentMessageId) {
        break
      }

      const parentMessage = await this.getConversation(
        parentMessageId
      )

      if (!parentMessage) {
        break
      }

      const historyConversation = {
        role: parentMessage.role,
        content: parentMessage.content
      }
      // 插入会话消息
      messages.splice(1, 0, historyConversation)

      // 上次对话id
      parentMessageId = parentMessage.parentMessageId
    }

    const maxTokens = Math.max(
      1,
      Math.min(
        this._maxModelTokens - tokenCount,
        this._maxResponseTokens
      )
    )

    return { messages, maxTokens }
  }
}
