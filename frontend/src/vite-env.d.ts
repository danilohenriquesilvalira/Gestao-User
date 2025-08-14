/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_URL: string
  readonly VITE_API_URL: string
  // adicione mais variáveis de ambiente conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}