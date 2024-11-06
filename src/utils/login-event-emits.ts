import { EventEmitter } from 'events'

// 定义事件名称
const eventNames = [
  'login-success',
  'login-failed',
  'login-cancelled'
] as const
type EventNames = (typeof eventNames)[number]

// 定义事件与回调参数的映射
interface EventMap {
  'login-success': [number] // 回调参数是数字
  'login-failed': [string] // 回调参数是字符串
  'login-cancelled': [] // 无参数
}

// 定义一个事件发射器类
class CustomEventEmitter extends EventEmitter {
  public on<T extends EventNames>(
    eventName: T,
    listener: (...args: EventMap[T]) => void
  ): this {
    return super.on(eventName, listener)
  }

  public emit<T extends EventNames>(
    eventName: T,
    ...args: EventMap[T]
  ): boolean {
    return super.emit(eventName, ...args)
  }

  public off<T extends EventNames>(
    eventName: T,
    listener: (...args: EventMap[T]) => void
  ): this {
    return super.off(eventName, listener)
  }
}

// 使用示例
const eventEmitter = new CustomEventEmitter()

export { eventEmitter }
