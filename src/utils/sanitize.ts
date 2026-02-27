import DOMPurify from 'dompurify';

/**
 * Sanitiza uma string HTML para uso seguro com dangerouslySetInnerHTML.
 * Permite tags básicas de formatação mas remove scripts e atributos perigosos.
 * 
 * @param html String HTML vinda de fonte externa (ex: WP API)
 * @returns String HTML limpa
 */
export const sanitizeHtml = (html: string | undefined | null): string => {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'img', 'blockquote'
        ],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'id', 'title']
    }) as string;
};

/**
 * Valida se uma URL é segura para uso em atributos href ou src.
 * Bloqueia javascript: e outros esquemas perigosos.
 */
export const safeUrl = (url: string | undefined, fallback: string = '#'): string => {
    if (!url) return fallback;

    // Lista de protocolos permitidos
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

    try {
        // Se for um caminho relativo, consideramos seguro
        if (url.startsWith('/') || url.startsWith('#') || url.startsWith('./') || url.startsWith('../')) {
            return url;
        }

        const parsed = new URL(url);
        if (allowedProtocols.includes(parsed.protocol)) {
            return url;
        }
    } catch (e) {
        // Se não for uma URL válida (pode ser um caminho relativo complexo ou string inválida)
        // Mas se começar com esquemas conhecidos perigosos, bloqueamos
        if (/^(javascript|data|vbscript):/i.test(url)) {
            return fallback;
        }
        return url;
    }

    return fallback;
};
