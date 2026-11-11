// src/types/global.d.ts
// Extensões do objeto global Window para variáveis injetadas pelo WordPress

declare global {
    interface Window {
        /** Dados injetados pelo PHP via wp_localize_script */
        wpData?: {
            nonce?: string;
            userId?: number;
            rootUrl?: string;
            siteUrl?: string;
            restUrl?: string;
        };
    }
}

// Necessário para que este arquivo seja tratado como módulo
export { };
