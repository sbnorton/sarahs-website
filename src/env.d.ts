/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PHOTOS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
