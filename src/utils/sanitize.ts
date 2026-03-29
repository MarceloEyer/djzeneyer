import DOMPurify from 'dompurify';

// ---------------------------------------------------------------------------
// Hook global DOMPurify (registrado uma única vez por carregamento de módulo)
// ---------------------------------------------------------------------------
// 1. Força rel="noopener noreferrer" em <a target="_blank"> (previne tab-napping)
// 2. Remove href/src com protocolos perigosos que passem por brechas de parser
//    (DOMPurify já bloqueia a maioria, mas o hook adiciona defesa em profundidade)
// ---------------------------------------------------------------------------
if (typeof window !== 'undefined' && DOMPurify.isSupported) {
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        if (node instanceof Element) {
            // <a> com target="_blank" deve ter rel seguro
            if (node.tagName === 'A') {
                if (node.getAttribute('target') === '_blank') {
                    node.setAttribute('rel', 'noopener noreferrer');
                }
                const href = node.getAttribute('href');
                if (href && isDangerousUrl(href)) {
                    node.removeAttribute('href');
                }
            }
            // <img> (e qualquer outra tag com src): bloqueia protocolos perigosos
            if (node.hasAttribute('src')) {
                const src = node.getAttribute('src') ?? '';
                if (isDangerousUrl(src)) {
                    node.removeAttribute('src');
                }
            }
        }
    });
}

// ---------------------------------------------------------------------------
// sanitizeHtml — uso geral (conteúdo WordPress, descrições, etc.)
// ---------------------------------------------------------------------------
/**
 * Sanitiza HTML externo para uso seguro com dangerouslySetInnerHTML.
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
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'img', 'blockquote',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'id', 'title'],
        // FORCE_BODY: envolve o fragmento num <body> virtual, prevenindo ataques
        // de mXSS onde o parser reinterpreta o HTML fora de contexto.
        FORCE_BODY: true,
    }) as string;
};

// ---------------------------------------------------------------------------
// sanitizeTitleHtml — títulos e headings (inline tags apenas)
// ---------------------------------------------------------------------------
/**
 * Sanitiza HTML para uso em títulos — aceita apenas tags inline seguras.
 * Retorna tags estritamente necessárias, evitando quebras de layout.
 */
export const sanitizeTitleHtml = (html: string | undefined | null): string => {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br'],
        ALLOWED_ATTR: ['class'],
        FORCE_BODY: true,
    }) as string;
};

// ---------------------------------------------------------------------------
// safeUrl — validação de URLs em href / src
// ---------------------------------------------------------------------------
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
    'google.com',
    'googleusercontent.com',  // Google OAuth profile photos (lh3.googleusercontent.com)
    'gravatar.com',            // WordPress/Gravatar avatars
];

/**
 * Regex de protocolos perigosos (sem null-byte no pattern para satisfazer no-control-regex).
 * O null-byte é removido antes da checagem pela função isDangerousUrl().
 */
const DANGEROUS_PROTOCOL_RE = /^\s*(javascript|data|vbscript|file|about):/i;

/**
 * Remove null-bytes e outros caracteres de controle que browsers ignoram ao parsear URLs
 * mas que podem ser usados para bypass de validação (e.g. "java\x00script:").
 */
// eslint-disable-next-line no-control-regex
const STRIP_CTRL_RE = /[\x00-\x1f]/g;

const isDangerousUrl = (url: string): boolean =>
    DANGEROUS_PROTOCOL_RE.test(url.replace(STRIP_CTRL_RE, ''));

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
 * Lista de protocolos permitidos.
 */
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Valida se uma URL é segura para uso em atributos href ou src.
 * Bloqueia javascript:, data: e outros esquemas perigosos.
 * Valida o domínio contra uma allowlist para links externos.
 */
export const safeUrl = (url: string | undefined | null, fallback: string = '#'): string => {
    if (!url) return fallback;

    const trimmedUrl = url.trim();

    // Bloqueia protocolos perigosos antes de qualquer outro parse
    if (isDangerousUrl(trimmedUrl)) {
        return fallback;
    }

    try {
        // Se for um caminho interno, consideramos seguro (desde que não seja //esquema)
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
        if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
            return fallback;
        }

        // Para protocolos não-web (mailto/tel), aceitamos após validação de protocolo
        if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') {
            return trimmedUrl;
        }

        // Validação de domínio para links web
        const domain = parsed.hostname.toLowerCase();
        const isTrustedDomain = TRUSTED_DOMAINS.some(
            trusted => domain === trusted || domain.endsWith(`.${trusted}`)
        );

        // Para links web, forçamos HTTPS em domínios externos e aceitamos HTTP apenas em domínios confiáveis
        if (parsed.protocol === 'http:' && !isTrustedDomain) {
            return fallback;
        }

        return trimmedUrl;
    } catch {
        // Se não for uma URL válida mas não contém esquemas perigosos, tenta como caminho interno
        if (isDangerousUrl(trimmedUrl)) {
            return fallback;
        }
        if (ALLOWED_PROTOCOLS.some(proto => trimmedUrl.toLowerCase().startsWith(proto))) {
            return trimmedUrl;
        }
        return isInternalPath(trimmedUrl) ? trimmedUrl : fallback;
    }
};

// ---------------------------------------------------------------------------
// safeRedirect — previne Open Redirect (CWE-601)
// ---------------------------------------------------------------------------
/**
 * Garante que um redirecionamento seja para uma rota interna ou domínio confiável.
 */
export const safeRedirect = (url: string | undefined | null, fallback: string = '/'): string => {
    if (!url) return fallback;

    // 1. Bloqueia protocolos perigosos imediatamente
    if (isDangerousUrl(url)) {
        return fallback;
    }

    // 2. Se for um caminho interno puro (começa com /), é seguro
    if (isInternalPath(url)) {
        return url;
    }

    // 3. Se for uma URL absoluta, verificamos se o host é confiável
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

// ---------------------------------------------------------------------------
// sanitizePath — paths de navegação interna
// ---------------------------------------------------------------------------
/**
 * Sanitização robusta de paths para prevenir XSS e links malformados.
 * Usada principalmente em componentes de navegação.
 */
export const sanitizePath = (path: string): string => {
    if (!path) return '/';

    // Bloqueia protocolos perigosos antes de qualquer processamento
    if (isDangerousUrl(path)) return '/';

    // 1. Remove qualquer tentativa de protocolo ou host (ex: javascript:, http:, //example.com)
    let clean = path.replace(/^[a-zA-Z]+:\/*|^[\\/]+/g, '/');
    // 2. Garante que comece com uma barra única e remove caracteres perigosos
    clean = '/' + clean.replace(/[^\w./?=&#%-]/g, '').replace(/\/+/g, '/').replace(/^\/+/, '');

    // 3. Verificação final de esquemas perigosos (belt-and-suspenders)
    if (isDangerousUrl(clean)) return '/';

    return clean;
};
