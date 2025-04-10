import { createParser, type EventSourceParser } from 'eventsource-parser'
import { v4 as uuidv4 } from 'uuid'
import { encode } from 'gpt-tokenizer'
import { RoleEnum } from '@enums'

const KEEPALIVEFLAG = ' : keep-alive'

const DATAPREFIX = 'data:'

/**
 * 基础类 有一些公共方法
 * @internal
 */
export class Core {
  /** gpt 对话key */
  protected _apiKey: string
  /** gpt 请求域名 */
  protected _apiBaseUrl: string
  /** gpt 组织 */
  protected _organization?: string
  /** 是否开启debug */
  protected _debug: boolean
  /** 是否携带上下文 */
  protected _withContent: boolean
  /** 消息仓库 */
  protected _messageStore: Map<string, AI.Conversation>
  /** 最大请求token */
  protected _maxModelTokens: number
  /** 最多返回token */
  protected _maxResponseTokens: number
  /** 系统角色 */
  protected _systemMessage: string
  /** 取消fetch请求控制器 */
  protected _abortController: AbortController
  /** 超时时间 */
  protected _milliseconds: number
  /* 当前模型的请求地址 */
  private _completionsUrl: string | undefined

  /**
   * 当前正在处理的会话
   */
  protected _currentConversation: AI.Gpt.AssistantConversation | null = null;

  constructor(options: AI.CoreOptions) {
    const {
      apiKey,
      apiBaseUrl,
      organization,
      debug,
      withContent,
      maxModelTokens,
      maxResponseTokens,
      systemMessage,
      milliseconds,
      completionsUrl
    } = options

    this._apiKey = apiKey ?? ''

    this._apiBaseUrl = apiBaseUrl ?? 'https://api.AI.com'

    this._organization = organization

    this._debug = !!debug

    this._withContent = withContent === undefined ? true : withContent

    this._maxModelTokens = maxModelTokens ?? 4096

    this._maxResponseTokens = maxResponseTokens ?? 1000

    this._messageStore = new Map<string, AI.Conversation>()

    this._systemMessage =
      systemMessage ??
      `你是Ai助手,帮助用户使用代码。您聪明、乐于助人、专业的开发人员，总是给出正确的答案，并且只按照指示执行。你的回答始终如实，不会造假,返回结果用markdown显示`

    this._abortController = new AbortController()

    this._milliseconds = milliseconds ?? 1000 * 60

    this._completionsUrl = completionsUrl
  }

  /**
   * 获取当前 token 支持的模型的请求地址
   * @returns {string}
   */
  private get modelsUrl(): string {
    return `${this._apiBaseUrl}${'/v1/models'}`
  }

  /**
   * 当前模型的请求地址
   * @returns {string}
   */
  protected get completionsUrl() {
    return `${this._apiBaseUrl}${this._completionsUrl ?? '/v1/chat/completions'}`
  }

  /**
   * 生成随机id
   * @returns {string}
   */
  protected get uuid(): string {
    return uuidv4()
  }

  /**
   * 请求头
   * @returns {HeadersInit}
   */
  protected get headers(): HeadersInit {
    // if (!this._apiKey) {
    //   throw new AiError('没有设置apiKey')
    // }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this._apiKey}`
    }
    if (this._organization) {
      headers['AI-Organization'] = this._organization
    }
    return headers
  }
  /**
   * 获取token数量
   * @param {string} text
   * @returns {Promise<number>}
   */
  protected getTokenCount(text: string): number {
    return encode(text).length
  }
  /** 函数重载 start */

  public buildConversation(role: RoleEnum.User, content: string, option: AI.CompletionsOptions): AI.Conversation

  public buildConversation(
    role: RoleEnum.Assistant,
    content: string,
    option: AI.CompletionsOptions
  ): AI.Gpt.AssistantConversation

  /** 函数重载 end */

  /**
   * 构建会话消息
   * @param { RoleEnum.User | RoleEnum.Assistant } role
   * @param {string} content
   * @param { AI.CompletionsOptions } option
   * @returns { AI.Conversation | AI.Gpt.AssistantConversation}
   */
  public buildConversation(
    role: RoleEnum.User | RoleEnum.Assistant,
    content: string,
    option: AI.CompletionsOptions
  ): AI.Conversation | AI.Gpt.AssistantConversation {
    if (role === RoleEnum.User) {
      return {
        role: RoleEnum.User,
        messageId: option.messageId || this.uuid,
        parentMessageId: option.parentMessageId || this.uuid,
        content
      }
    } else if (role === RoleEnum.Assistant) {
      return {
        role: RoleEnum.Assistant,
        messageId: '',
        parentMessageId: option.messageId || this.uuid,
        content,
        detail: null,
        thinking: true,
        done: false
      }
    } else {
      throw new Error('Invalid role type')
    }
  }

  /**
   * 获取对话
   * @param {string} id _messageStore 中的key
   * @returns {Promise<AI.Conversation | undefined>}
   */
  protected getConversation(id: string): Promise<AI.Conversation | undefined> {
    return new Promise((resolve) => {
      const message = this._messageStore.get(id)
      resolve(message)
    })
  }
  /**
   * 获取所有的对话
   * @returns {Promise<AI.Conversation[]>}
   */
  public getAllConversations(): Promise<AI.Conversation[]> {
    return new Promise((resolve) => {
      const messages = Array.from(this._messageStore.values())
      resolve(messages)
    })
  }
  /**
   * 更新对话
   * @param {AI.Conversation} message
   * @returns {Promise<void>}
   */
  protected upsertConversation(message: AI.Conversation): Promise<void> {
    return new Promise((resolve) => {
      // 这里做层浅拷贝 因为map存储的值如果是对象的话 会受到指针的影响
      this._messageStore.set(message?.messageId, {
        ...message
      })
      resolve()
    })
  }
  /**
   * 清空消息
   * @returns {Promise<void>}
   */
  protected _clearConversation(): Promise<void> {
    return new Promise<void>((resolve) => {
      this._messageStore.clear()
      resolve()
    })
  }
  /**
   * 输出debug参数
   * @param {string} action
   * @param {any[]} args
   * @returns {void}
   */
  protected _debugLog(action: string, ...args: any[]) {
    if (this._debug) {
      console.log(`AI-apis:DEBUG:${action}`, ...args)
    }
  }
  /**
   * 这个方法的作用是将一个 ReadableStream 对象转换成一个异步迭代器 AsyncIterable，
   * 该迭代器会在每次迭代中返回一个 Uint8Array 类型的数据块。具体来说，该方法会获取一个 ReadableStream 对象的读取器（reader），
   * 然后在一个无限循环中等待读取器返回数据。每次读取器返回数据时，该方法都会返回一个包含数据的 Uint8Array 对象。
   * 当读取器返回一个 done 属性为 true 的对象时，该方法就会结束迭代。最后，该方法会释放读取器的锁。
   * @param {ReadableStream<Uint8Array>} stream
   * @returns {AsyncIterable<Uint8Array>}
   */
  private async *streamAsyncIterable(stream: ReadableStream<Uint8Array>): AsyncIterable<Uint8Array> {
    const reader = stream.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        yield value!
      }
    } finally {
      reader.releaseLock()
    }
  }
  /**
   * 向OpenAI发送请求
   * @param {string} url
   * @param {AI.FetchSSEOptions} options
   * @returns {Promise<AI.GptResponse<R> | void>}
   */
  protected async _fetchSSE<R extends Object>(
    url: string,
    requestInit: AI.FetchRequestInit
  ): Promise<AI.AnswerResponse<R> | void> {
    const { onMessage, ...fetchOptions } = requestInit
    const response = (await fetch(url, {
      ...fetchOptions
    })) as AI.AnswerResponse<R>
    
    if (!response.ok) {
      const aiErrorOption: AI.AiErrorOption = {
        url: response.url,
        status: response.status,
        statusText: response.statusText
      }
      const { error } = JSON.parse(await response.text())

      throw new AiError(error.message, aiErrorOption)
    }
    /* 如果没有 onMessage 回调函数，直接返回 response */
    if (!onMessage) {
      return response
    }
    const parser = this._createParser(onMessage)
    const body = response.body
    for await (const chunk of this.streamAsyncIterable(body!)) {
      const chunkString = new TextDecoder().decode(chunk)
      parser.feed(chunkString)
    }
  }
  /**
   * 创建parser
   * @param {(p:string) => void} onMessage
   * @returns {EventSourceParser}
   */
  private _createParser(onMessage: (p: string) => void): EventSourceParser {
    return createParser({
      onEvent: (event) => {
        const data = event.data.trim()
        if (data) {
          if (data.startsWith(DATAPREFIX) && !data.startsWith(KEEPALIVEFLAG)) {
            // 兼容deepseek接口 deepseek 接口返回的数据是以data:开头的 且 有时候会带有 : keep-alive 这两种情况 JSON.parse 解析不了
            onMessage?.(data.slice(DATAPREFIX.length))
          } else {
            // 兼容chatgpt接口
            onMessage?.(data)
          }
        }
      }
    })
  }

  /**
   * 清空promise
   */
  protected clearablePromise<V extends Object>(inputPromise: PromiseLike<V>, options: AI.ClearablePromiseOptions):Promise<V> {
    const { milliseconds, message } = options
    let timer: ReturnType<typeof setTimeout> | undefined
    const wrappedPromise = new Promise<V>((resolve, reject) => {
      // 清空定时器
      if (milliseconds === Number.POSITIVE_INFINITY) {
        inputPromise.then(resolve, reject)
        return
      }
      try {
        timer = setTimeout.call(
          undefined,
          () => {
            const errorMessage = message ?? `Promise timed out after ${milliseconds} milliseconds`
            // 终止请求
            this._abortController.abort(errorMessage)
            const timeoutError = new AiError(errorMessage)
            reject(timeoutError)
          },
          milliseconds
        )
      } catch (error) {
        reject(error)
      } finally {
        inputPromise.then((inputPromiseResult) => {
          resolve(inputPromiseResult)
        })
      }
    })

    /**
     * 默认清除定时器
     */
    const cancelablePromise = wrappedPromise.finally(() => {
      clearTimeout.call(undefined, timer)
      timer = undefined
    })

    return cancelablePromise
  }
  /**
   * 取消对话
   * @param {string} reason 取消原因
   * @returns {Promise<void>}
   */
  public async cancelConversation(reason?: string): Promise<void> {
    // 如果有当前活跃的会话，先保存
    if (this._currentConversation) {
      const conversation = this._currentConversation;
      conversation.done = false;
      conversation.thinking = false;
      await this.upsertConversation(conversation);
      this._currentConversation = null;
    }
    
    // 终止请求
    this._abortController.abort(reason);
    
    this._abortController = new AbortController();
  }
  /**
   *
   * @returns {Promise<AI.Model[]>}
   */
  public getModels() {
    const requestInit = {
      method: 'GET',
      headers: this.headers
    }
    return this._fetchSSE(this.modelsUrl, requestInit)
  }
}

export class AiError extends Error {
  name: string
  status?: number
  statusText?: string
  url?: string
  constructor(message: string, option?: AI.AiErrorOption) {
    super(message)
    this.name = 'AIError'
    if (option) {
      const { status, statusText, url } = option
      this.status = status
      this.statusText = statusText
      this.url = url
    }
  }
}
