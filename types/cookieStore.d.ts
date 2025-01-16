interface GetCookieOption {
  name?: string
  url?: string
}

interface GetAllCookieOption extends GetCookieOption {}
interface SetCookieOption {
  name: string
  value: string
  expires?: number
}

interface DeleteCookieOption {
  name: string
  domain?: string
  path?: string
  partitioned?: boolean
}

interface CookieResult {
  name: string
  value: string
  domain: string
  expires: number
  partitioned: boolean
  path: string
  sameSite: 'strict' | 'lax' | 'none'
  secure: boolean
}

interface CookieStore extends Event {
  get(key: string): Promise<CookieResult | undefined>
  get(
    option: GetCookieOption
  ): Promise<CookieResult | undefined>
  getAll(key: string): Promise<CookieResult[]>
  getAll(
    option: GetAllCookieOption
  ): Promise<CookieResult[]>
  set(option: SetCookieOption): Promise<void>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  delete(option: DeleteCookieOption): Promise<void>
  onchange(event: Event): void
}

declare const cookieStore: CookieStore
