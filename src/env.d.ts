/// <reference types="vite/client" />

/** Variables de entorno de la aplicación (ver `.env.example`). */
interface ImportMetaEnv {
  readonly VITE_FEATURE_HINTS?: string
  readonly VITE_FEATURE_CHALLENGE_MODE?: string
  readonly VITE_FEATURE_SYMBOL_ROUNDS?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_REPO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
