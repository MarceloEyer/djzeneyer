/// <reference types="vite/client" />

interface WpData {
  restUrl?: string;
  nonce?: string;
  [key: string]: any;
}

interface Window {
  wpData?: WpData;
}
