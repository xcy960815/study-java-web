/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 代理的后端地址 */
  readonly VITE_API_DOMAIN: string
  /** 代理用的前缀 */
  readonly VITE_API_DOMAIN_PREFIX: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
