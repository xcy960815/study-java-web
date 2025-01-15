/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 代理的后端地址 */
  readonly VITE_API_DOMAIN: string
  /** 代理用的前缀 */
  readonly VITE_API_DOMAIN_PREFIX: string
  /** 项目名字 */
  readonly VITE_APP_TITLE: string
  /** 项目base */
  readonly VITE_BASE_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
