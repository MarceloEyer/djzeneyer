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
 * Sanitiza uma string HTML para uso seguro em títulos e headings (inline tags only).
 * Retorna tags estritamente necessárias, evitando quebras de layout.
 */
export const sanitizeTitleHtml = (html: string | undefined | null): string => {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br'],
        ALLOWED_ATTR: ['class']
    }) as string;
};

/**
 * Lista de domínios confiáveis para prevenir Open Redirect e SSRF.
 */
const TRUSTED_DOMAINS = [
    'djzeneyer.com',
    'localhost',
    '127.0.0.1',
    'pagbank.com.br',
    'pagseguro.uol.com.br',
    'spotify.com',
    'soundcloud.com',
    'instagram.com',
    'facebook.com',
    'youtube.com',
    'wa.me',
    'whatsapp.com',
    'bandsintown.com',
    'google.com'
];

/**
 * Verifica se uma URL ou caminho é interno ao site.
 */
export const isInternalPath = (path: string | undefined | null): boolean => {
    if (!path) return false;
    const trimmed = path.trim();
    // Caminhos que começam com / mas não com // (que o navegador trata como protocolo atual)
    return (trimmed.startsWith('/') && !trimmed.startsWith('//')) ||
        trimmed.startsWith('./') ||
        trimmed.startsWith('../') ||
        trimmed === '#' ||
        trimmed.startsWith('#');
};

/**
 * Valida se uma URL é segura para uso em atributos href ou src.
 * Bloqueia javascript:, data: e outros esquemas perigosos.
 * Valida o domínio contra uma whitelist para links sensíveis.
 */
export const safeUrl = (url: string | undefined | null, fallback: string = '#'): string => {
    if (!url) return fallback;

    const trimmedUrl = url.trim();

    // Lista de protocolos permitidos
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

    try {
        // Se for um caminho interno, consideramos seguro (desde que não seja um //esquema)
        if (isInternalPath(trimmedUrl)) {
            return trimmedUrl;
        }

        // Se começar com //, verificamos o domínio
        if (trimmedUrl.startsWith('//')) {
            const domain = trimmedUrl.substring(2).split('/')[0].split(':')[0].toLowerCase();
            if (TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith('.' + trusted))) {
                return trimmedUrl;
            }
            return fallback;
        }

        const parsed = new URL(trimmedUrl);
        if (!allowedProtocols.includes(parsed.protocol)) {
            return fallback;
        }

        // Validação de Domínio
        const domain = parsed.hostname.toLowerCase();
        const isTrustedDomain = TRUSTED_DOMAINS.some(
            trusted => domain === trusted || domain.endsWith(`.${trusted}`)
        );

        // Para protocolos não-web (mailto/tel), aceitamos após validação de protocolo
        if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') {
            return trimmedUrl;
        }

        // Para links web, forçamos HTTPS em domínios externos e aceitamos HTTP apenas para domínios confiáveis.
        if (parsed.protocol === 'http:' && !isTrustedDomain) {
            return fallback;
        }

        return trimmedUrl;
    } catch {
        // Se não for uma URL válida (ex: caminhos internos complexos), mas contém esquemas perigosos, bloqueamos
        if (/^(javascript|data|vbscript|file|about):/i.test(trimmedUrl)) {
            return fallback;
        }
        // Se falhar o parse mas for algo como "tel:" ou "mailto:" que o URL() às vezes rejeita sem host
        if (allowedProtocols.some(proto => trimmedUrl.toLowerCase().startsWith(proto))) {
            return trimmedUrl;
        }
        return isInternalPath(trimmedUrl) ? trimmedUrl : fallback;
    }
};

/**
 * Garante que um redirecionamento seja para uma rota interna ou domínio confiável.
 * Previne ataques de Open Redirect (CWE-601).
 */
export const safeRedirect = (url: string | undefined | null, fallback: string = '/'): string => {
    if (!url) return fallback;

    // 1. Se for um caminho interno puro (começa com /), é seguro
    if (isInternalPath(url)) {
        return url;
    }

    // 2. Se for uma URL absoluta, verificamos se o host é confiável
    try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return fallback;
        }

        const domain = parsed.hostname.toLowerCase();

        if (TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith('.' + trusted))) {
            return url;
        }
    } catch {
        // Se o parse falhar e não for interno, por segurança retornamos o fallback
    }

    return fallback;
};

/**
 * Robust Path Sanitization to prevent XSS and malformed internal links.
 * Used primarily in navigation components.
 */
export const sanitizePath = (path: string): string => {
    if (!path) return '/';
    // Remove qualquer tentativa de protocolo ou host (ex: javascript:, http:, //example.com)
    // 1. Remove protocolos
    let clean = path.replace(/^[a-zA-Z]+:\/*|^[\\/]+/g, '/');
    // 2. Garante que comece com uma barra única e remove caracteres perigosos
    clean = '/' + clean.replace(/[^\w./?=&#%-]/g, '').replace(/\/+/g, '/').replace(/^\/+/, '');

    // 3. Bloqueia explicitamente esquemas perigosos se ainda restarem
    if (/^(javascript|data|vbscript):/i.test(clean)) return '/';

    return clean;
};
