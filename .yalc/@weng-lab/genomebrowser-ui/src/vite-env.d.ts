/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_MUI_X_LICENSE_KEY?: string;
  readonly VITE_MUI_X_LICENSE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
