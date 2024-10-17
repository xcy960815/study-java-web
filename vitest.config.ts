import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
const mode = process.env.NODE_ENV || "dev"
const command = process.env.npm_lifecycle_event === 'build' ? 'build' : 'serve'

export default mergeConfig(
  viteConfig({ mode, command }),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
