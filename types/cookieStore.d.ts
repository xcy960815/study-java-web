interface SetOption {
  name: string
  value: string
  expires?: number
}

interface GetOption {
  name?: string
  url?: string
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

interface CookieStore {
  set(option: SetOption): Promise<void>
  set(key: string, value: string): Promise<void>
  get(key: string): Promise<CookieResult | undefined>
  get(option: GetOption): Promise<CookieResult | undefined>
  remove(key: string): void
}

declare const cookieStore: CookieStore
