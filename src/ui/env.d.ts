/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_HOST: string
  readonly VITE_TEST_VAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}