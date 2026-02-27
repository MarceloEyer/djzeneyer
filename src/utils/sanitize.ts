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
        // Se for um caminho relativo ou âncora, consideramos seguro
        if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
            // Prevenção de caminhos do tipo //evil.com que o navegador interpreta como protocolo atual
            if (trimmedUrl.startsWith('//')) {
                const domain = trimmedUrl.substring(2).split('/')[0].split(':')[0].toLowerCase();
                if (!TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith('.' + trusted))) {
                    return fallback;
                }
            }
            return trimmedUrl;
        }

        const parsed = new URL(trimmedUrl);
        if (!allowedProtocols.includes(parsed.protocol)) {
            return fallback;
        }

        // Validação de Domínio (opcional para links gerais, mas boa prática para segurança profunda)
        const domain = parsed.hostname.toLowerCase();
        const isTrusted = TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith('.' + trusted));

        // Se não for um domínio confiável, ainda permitimos se for HTTPS (para evitar quebrar links externos legítimos),
        // mas bloqueamos protocolos de dados e scripts.
        if (!isTrusted && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
            // Opcional: Logar domínios não confiáveis se necessário
        }

        return trimmedUrl;
    } catch (e) {
        // Se não for uma URL válida, mas contém esquemas perigosos, bloqueamos
        if (/^(javascript|data|vbscript|file|about):/i.test(trimmedUrl)) {
            return fallback;
        }
        return trimmedUrl;
    }
};

/**
 * Garante que um redirecionamento seja para uma rota interna ou domínio confiável.
 */
export const safeRedirect = (url: string | undefined | null, fallback: string = '/'): string => {
    const safe = safeUrl(url, fallback);

    // Se a safeUrl retornou o fallback, não é seguro
    if (safe === fallback) return fallback;

    try {
        // Se for URL absoluta, verificamos se o host é confiável
        if (safe.startsWith('http')) {
            const parsed = new URL(safe);
            const domain = parsed.hostname.toLowerCase();
            if (TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith('.' + trusted))) {
                return safe;
            }
            return fallback;
        }
    } catch (e) {
        return fallback;
    }

    return safe;
};
