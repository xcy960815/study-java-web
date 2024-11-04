// import EventEmitter from "events";

// const loginEventNames = [
//     'login-success',
//     'login-failed',
//     'login-cancelled'
// ] as const;

// type LoginEventNames = (typeof loginEventNames)[number];

// type Listener = (...args: any[]) => void;

// class LoginEventEmits  {

//     private listeners: Map<LoginEventNames, Set<Listener>> = new Map();

//     public on(eventName: LoginEventNames, listener: Listener): LoginEventEmits {
//         if (!this.listeners.has(eventName)) {
//             this.listeners.set(eventName, new Set());
//         }
//         this.listeners.get(eventName)!.add(listener);
//         return this;
//     }

//     public emit(eventName: LoginEventNames, ...args: any[]): boolean {
//         if (!this.listeners.has(eventName)) return false;
//         this.listeners.get(eventName)!.forEach((listener) => listener(...args));
//         return true;
//     }

//     public off(eventName: LoginEventNames, listener: Listener): LoginEventEmits {
//         this.listeners.get(eventName)?.delete(listener);
//         return this;
//     }
// }

// export default new LoginEventEmits();

const loginEventNames = [
  'login-success',
  'login-failed',
  'login-cancelled'
] as const

type LoginEventNames = (typeof loginEventNames)[number]

// 定义一个事件与回调参数的映射
interface LoginEventMap {
  'login-success': [number] // `login-success` 事件接受一个数字参数
  'login-failed': [string] // `login-failed` 事件接受一个字符串参数
  'login-cancelled': [] // `login-cancelled` 不需要参数
}

// 获取某个事件的回调类型
type Listener<T extends LoginEventNames> = (
  ...args: LoginEventMap[T]
) => void

class LoginEventEmits {
  private listeners: Map<
    LoginEventNames,
    Set<Listener<any>>
  > = new Map()

  public on<T extends LoginEventNames>(
    eventName: T,
    listener: Listener<T>
  ): this {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set())
    }
    this.listeners
      .get(eventName)!
      .add(listener as Listener<any>)
    return this
  }

  public emit<T extends LoginEventNames>(
    eventName: T,
    ...args: LoginEventMap[T]
  ): boolean {
    if (!this.listeners.has(eventName)) return false
    this.listeners
      .get(eventName)!
      .forEach((listener) =>
        (listener as Listener<T>)(...args)
      )
    return true
  }

  public off<T extends LoginEventNames>(
    eventName: T,
    listener: Listener<T>
  ): this {
    this.listeners
      .get(eventName)
      ?.delete(listener as Listener<any>)
    return this
  }
}

export default new LoginEventEmits()
