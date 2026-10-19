import { describe, expect, it } from 'vitest';
import { isInternalPath, safeRedirect, safeUrl, sanitizeHtml } from '../../utils/sanitize';

// Parseia via <template> (inerte): nada é executado nem carregado durante a inspeção.
const parse = (html: string): DocumentFragment => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};

const allElements = (html: string): Element[] => Array.from(parse(html).querySelectorAll('*'));

// Remove espaços/caracteres de controle que o browser ignora ao interpretar o esquema da URL.
const compact = (value: string | null | undefined): string =>
  Array.from(value ?? '')
    .filter((char) => char.charCodeAt(0) > 32)
    .join('')
    .toLowerCase();

const eventHandlerAttrs = (html: string): string[] =>
  allElements(html).flatMap((el) => el.getAttributeNames().filter((name) => name.toLowerCase().startsWith('on')));

describe('safeUrl', () => {
  describe('fallback (contrato do AGENTS.md)', () => {
    it('retorna "#" por padrão (truthy — por isso `safeUrl(x) || y` é errado)', () => {
      expect(safeUrl(null)).toBe('#');
      expect(safeUrl(undefined)).toBe('#');
      expect(safeUrl('')).toBe('#');
      expect(safeUrl('javascript:alert(1)')).toBe('#');
      expect(Boolean(safeUrl(null))).toBe(true);
    });

    it('respeita o fallback customizado em entradas vazias e inseguras', () => {
      expect(safeUrl(null, '/fallback.svg')).toBe('/fallback.svg');
      expect(safeUrl(undefined, '/fallback.svg')).toBe('/fallback.svg');
      expect(safeUrl('', '/fallback.svg')).toBe('/fallback.svg');
      expect(safeUrl('javascript:alert(1)', '/fallback.svg')).toBe('/fallback.svg');
      expect(safeUrl('//evil.example/x.png', '/')).toBe('/');
      expect(safeUrl('not a url', '/')).toBe('/');
    });

    it('não usa o fallback quando a URL é válida', () => {
      expect(safeUrl('/img/a.png', '/fallback.svg')).toBe('/img/a.png');
      expect(safeUrl('https://djzeneyer.com/a.png', '/fallback.svg')).toBe('https://djzeneyer.com/a.png');
    });
  });

  describe('casos legítimos', () => {
    it.each([
      '/events',
      '/events?city=rio&page=2',
      './relative',
      '../parent',
      '#',
      '#section',
    ])('aceita caminho interno %s', (path) => {
      expect(safeUrl(path)).toBe(path);
    });

    it.each([
      'https://djzeneyer.com/music',
      'https://www.djzeneyer.com/music',
      'https://open.spotify.com/artist/abc',
      'https://lh3.googleusercontent.com/a/photo',
      'http://djzeneyer.com/music',
      'http://localhost:5173/events',
      'mailto:contact@djzeneyer.com',
      'tel:+5521999999999',
    ])('aceita %s', (url) => {
      expect(safeUrl(url)).toBe(url);
    });

    it('aceita https em domínio fora da allowlist (apenas http é restrito)', () => {
      expect(safeUrl('https://example.org/page')).toBe('https://example.org/page');
    });

    it('remove espaços nas pontas', () => {
      expect(safeUrl('  https://djzeneyer.com/a  ')).toBe('https://djzeneyer.com/a');
      expect(safeUrl('  /events  ')).toBe('/events');
    });

    it('aceita protocol-relative apenas para domínios confiáveis', () => {
      expect(safeUrl('//djzeneyer.com/a.png')).toBe('//djzeneyer.com/a.png');
      expect(safeUrl('//cdn.djzeneyer.com/a.png')).toBe('//cdn.djzeneyer.com/a.png');
    });
  });

  describe('protocolos perigosos', () => {
    it.each([
      'javascript:alert(1)',
      'JAVASCRIPT:alert(1)',
      'JaVaScRiPt:alert(1)',
      '  javascript:alert(1)',
      '\tjavascript:alert(1)',
      'java\tscript:alert(1)',
      'java\nscript:alert(1)',
      'java\u0000script:alert(1)',
      'vbscript:msgbox(1)',
      'data:text/html,<script>alert(1)</script>',
      'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
      'file:///etc/passwd',
      'about:blank',
    ])('bloqueia %j', (url) => {
      expect(safeUrl(url, 'BLOCKED')).toBe('BLOCKED');
    });

    it.each(['ftp://djzeneyer.com/file', 'ws://djzeneyer.com/socket', 'blob:https://djzeneyer.com/uuid'])(
      'bloqueia protocolo fora da allowlist: %s',
      (url) => {
        expect(safeUrl(url, 'BLOCKED')).toBe('BLOCKED');
      },
    );
  });

  describe('domínios externos', () => {
    it('bloqueia http fora da allowlist', () => {
      expect(safeUrl('http://evil.example/x', 'BLOCKED')).toBe('BLOCKED');
    });

    it('bloqueia http em domínios que apenas imitam um confiável', () => {
      expect(safeUrl('http://spotify.com.evil.example/x', 'BLOCKED')).toBe('BLOCKED');
      expect(safeUrl('http://evilspotify.com/x', 'BLOCKED')).toBe('BLOCKED');
      expect(safeUrl('http://djzeneyer.com.evil.example/', 'BLOCKED')).toBe('BLOCKED');
    });

    it('bloqueia protocol-relative para domínios não confiáveis', () => {
      expect(safeUrl('//evil.example/x', 'BLOCKED')).toBe('BLOCKED');
      expect(safeUrl('//evil.example/djzeneyer.com', 'BLOCKED')).toBe('BLOCKED');
      expect(safeUrl('//djzeneyer.com.evil.example/x', 'BLOCKED')).toBe('BLOCKED');
      expect(safeUrl('//evildjzeneyer.com/x', 'BLOCKED')).toBe('BLOCKED');
    });

    it('bloqueia texto que não é URL nem caminho interno', () => {
      expect(safeUrl('example.com/path', 'BLOCKED')).toBe('BLOCKED');
      expect(safeUrl('events', 'BLOCKED')).toBe('BLOCKED');
    });
  });
});

describe('isInternalPath', () => {
  it.each([null, undefined, '', '   '])('retorna false para vazio: %j', (value) => {
    expect(isInternalPath(value)).toBe(false);
  });

  it.each(['/', '/events', '/events?a=1#top', './x', '../x', '#', '#section', '  /events'])(
    'retorna true para %j',
    (path) => {
      expect(isInternalPath(path)).toBe(true);
    },
  );

  it.each([
    '//evil.example',
    '//evil.example/path',
    '  //evil.example',
    'https://djzeneyer.com/events',
    'http://localhost/events',
    'javascript:alert(1)',
    'mailto:a@b.com',
    'events',
    'evil.example/path',
  ])('retorna false para %j', (path) => {
    expect(isInternalPath(path)).toBe(false);
  });
});

describe('safeRedirect', () => {
  describe('fallback', () => {
    it('usa "/" por padrão para entradas vazias', () => {
      expect(safeRedirect(null)).toBe('/');
      expect(safeRedirect(undefined)).toBe('/');
      expect(safeRedirect('')).toBe('/');
    });

    it('respeita o fallback customizado', () => {
      expect(safeRedirect(null, '/dashboard')).toBe('/dashboard');
      expect(safeRedirect('https://evil.example', '/dashboard')).toBe('/dashboard');
    });
  });

  describe('casos legítimos', () => {
    it.each(['/', '/dashboard', '/dashboard?tab=orders', '/my-account#profile', './next', '../next', '#section'])(
      'aceita caminho interno %s',
      (url) => {
        expect(safeRedirect(url, 'BLOCKED')).toBe(url);
      },
    );

    it.each([
      'https://djzeneyer.com/dashboard',
      'https://www.djzeneyer.com/dashboard',
      'http://localhost:5173/dashboard',
      'https://DJZENEYER.COM/dashboard',
    ])('aceita URL absoluta em domínio confiável %s', (url) => {
      expect(safeRedirect(url, 'BLOCKED')).toBe(url);
    });
  });

  describe('open redirect (CWE-601)', () => {
    it.each([
      'https://evil.example',
      'https://evil.example/djzeneyer.com',
      'https://evil.example/?next=https://djzeneyer.com',
      'http://evil.example/login',
      '//evil.example',
      '//evil.example/path',
      '  //evil.example',
      '//djzeneyer.com.evil.example',
    ])('bloqueia redirect externo %s', (url) => {
      expect(safeRedirect(url, 'BLOCKED')).toBe('BLOCKED');
    });

    it.each([
      'https://djzeneyer.com.evil.example/',
      'https://evildjzeneyer.com/',
      'https://djzeneyer.com@evil.example/',
      'https://djzeneyer.com:pass@evil.example/',
      'https://notdjzeneyer.com/',
    ])('bloqueia domínio que imita o confiável: %s', (url) => {
      expect(safeRedirect(url, 'BLOCKED')).toBe('BLOCKED');
    });

    it.each(['ftp://djzeneyer.com/file', 'mailto:a@djzeneyer.com', 'tel:+5521999999999', 'ws://djzeneyer.com/s'])(
      'bloqueia protocolo que não é http(s): %s',
      (url) => {
        expect(safeRedirect(url, 'BLOCKED')).toBe('BLOCKED');
      },
    );

    it('bloqueia texto que não é URL nem caminho interno', () => {
      expect(safeRedirect('evil.example', 'BLOCKED')).toBe('BLOCKED');
      expect(safeRedirect('dashboard', 'BLOCKED')).toBe('BLOCKED');
    });
  });

  describe('protocolos perigosos', () => {
    it.each([
      'javascript:alert(1)',
      'JAVASCRIPT:alert(1)',
      '  javascript:alert(1)',
      'java\tscript:alert(1)',
      'java\u0000script:alert(1)',
      'vbscript:msgbox(1)',
      'data:text/html,<script>alert(1)</script>',
      'file:///etc/passwd',
      'about:blank',
    ])('bloqueia %j', (url) => {
      expect(safeRedirect(url, 'BLOCKED')).toBe('BLOCKED');
    });
  });
});

describe('sanitizeHtml', () => {
  describe('entradas vazias', () => {
    it.each([null, undefined, ''])('retorna string vazia para %j', (value) => {
      expect(sanitizeHtml(value)).toBe('');
    });
  });

  describe('conteúdo legítimo', () => {
    it('preserva formatação básica', () => {
      const out = parse(sanitizeHtml('<p>Olá <strong>mundo</strong> e <em>Zouk</em></p><ul><li>um</li></ul>'));
      expect(out.querySelector('p')?.textContent).toBe('Olá mundo e Zouk');
      expect(out.querySelector('strong')?.textContent).toBe('mundo');
      expect(out.querySelector('em')?.textContent).toBe('Zouk');
      expect(out.querySelectorAll('li')).toHaveLength(1);
    });

    it('preserva links https e atributos permitidos', () => {
      const out = parse(sanitizeHtml('<a href="https://djzeneyer.com/music" title="Música" class="btn" id="a1">ouvir</a>'));
      const a = out.querySelector('a');
      expect(a?.getAttribute('href')).toBe('https://djzeneyer.com/music');
      expect(a?.getAttribute('title')).toBe('Música');
      expect(a?.getAttribute('class')).toBe('btn');
      expect(a?.getAttribute('id')).toBe('a1');
    });

    it('preserva imagens com src https e alt', () => {
      const img = parse(sanitizeHtml('<img src="https://djzeneyer.com/a.jpg" alt="Capa">')).querySelector('img');
      expect(img?.getAttribute('src')).toBe('https://djzeneyer.com/a.jpg');
      expect(img?.getAttribute('alt')).toBe('Capa');
    });

    it('preserva caminhos relativos em href', () => {
      const a = parse(sanitizeHtml('<a href="/events">eventos</a>')).querySelector('a');
      expect(a?.getAttribute('href')).toBe('/events');
    });
  });

  describe('tentativas de XSS', () => {
    it('remove <script> e seu conteúdo', () => {
      const html = sanitizeHtml('<p>ok</p><script>alert(1)</script>');
      expect(html).not.toMatch(/<script/i);
      expect(html).not.toContain('alert(1)');
      expect(parse(html).querySelector('p')?.textContent).toBe('ok');
    });

    it.each([
      '<img src="x" onerror="alert(1)">',
      '<img src=x onerror=alert(1)>',
      '<p onclick="alert(1)">x</p>',
      '<a href="https://djzeneyer.com" onmouseover="alert(1)">x</a>',
      '<div onload="alert(1)">x</div>',
      '<svg onload="alert(1)"></svg>',
      '<body onload="alert(1)">x</body>',
    ])('remove atributos de evento: %s', (payload) => {
      expect(eventHandlerAttrs(sanitizeHtml(payload))).toEqual([]);
    });

    it.each([
      '<iframe src="https://evil.example"></iframe>',
      '<object data="https://evil.example/x.swf"></object>',
      '<embed src="https://evil.example/x.swf">',
      '<form action="https://evil.example"><input name="x"></form>',
      '<style>body{display:none}</style>',
      '<link rel="stylesheet" href="https://evil.example/x.css">',
      '<meta http-equiv="refresh" content="0;url=https://evil.example">',
      '<base href="https://evil.example/">',
      '<svg><script>alert(1)</script></svg>',
      '<math><mtext></mtext></math>',
    ])('remove tags não permitidas: %s', (payload) => {
      const tags = allElements(sanitizeHtml(payload)).map((el) => el.tagName.toLowerCase());
      for (const forbidden of ['iframe', 'object', 'embed', 'form', 'input', 'style', 'link', 'meta', 'base', 'script', 'svg', 'math']) {
        expect(tags).not.toContain(forbidden);
      }
    });

    it('remove o atributo style', () => {
      const p = parse(sanitizeHtml('<p style="background:url(javascript:alert(1))">x</p>')).querySelector('p');
      expect(p?.hasAttribute('style')).toBe(false);
    });

    it.each([
      '<a href="javascript:alert(1)">x</a>',
      '<a href="JAVASCRIPT:alert(1)">x</a>',
      '<a href=" javascript:alert(1)">x</a>',
      '<a href="java&#x09;script:alert(1)">x</a>',
      '<a href="java&#x0A;script:alert(1)">x</a>',
      '<a href="&#106;avascript:alert(1)">x</a>',
      '<a href="vbscript:msgbox(1)">x</a>',
      '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    ])('neutraliza href perigoso: %s', (payload) => {
      const a = parse(sanitizeHtml(payload)).querySelector('a');
      const href = compact(a?.getAttribute('href'));
      expect(href).not.toMatch(/^(javascript|vbscript|data):/);
    });

    it.each([
      '<img src="javascript:alert(1)">',
      '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">',
      '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
      '<img src="vbscript:msgbox(1)">',
    ])('neutraliza src perigoso: %s', (payload) => {
      const img = parse(sanitizeHtml(payload)).querySelector('img');
      const src = compact(img?.getAttribute('src'));
      expect(src).not.toMatch(/^(javascript|vbscript|data):/);
    });

    it.each([
      '<svg><style><img src=x onerror=alert(1)></style></svg>',
      '<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;img src=1 onerror=alert(1)&gt;">',
      '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
      '<p><svg></p><style><a id="</style><img src=1 onerror=alert(1)>">',
    ])('resiste a payloads de mutation XSS: %s', (payload) => {
      const out = sanitizeHtml(payload);
      expect(eventHandlerAttrs(out)).toEqual([]);
      expect(allElements(out).map((el) => el.tagName.toLowerCase())).not.toContain('script');
    });

    it('é idempotente: sanitizar duas vezes não reintroduz conteúdo perigoso', () => {
      const once = sanitizeHtml('<img src=x onerror=alert(1)><script>alert(1)</script><p>ok</p>');
      const twice = sanitizeHtml(once);
      expect(twice).toBe(once);
      expect(eventHandlerAttrs(twice)).toEqual([]);
    });
  });

  describe('defesa em profundidade (hook afterSanitizeAttributes)', () => {
    it('força rel="noopener noreferrer" em target="_blank"', () => {
      const a = parse(sanitizeHtml('<a href="https://djzeneyer.com" target="_blank">x</a>')).querySelector('a');
      expect(a?.getAttribute('target')).toBe('_blank');
      expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('sobrescreve rel malicioso/permissivo em target="_blank"', () => {
      const a = parse(sanitizeHtml('<a href="https://djzeneyer.com" target="_blank" rel="opener">x</a>')).querySelector('a');
      expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('remove src com data: em imagens', () => {
      const img = parse(sanitizeHtml('<img src="data:image/png;base64,iVBORw0KGgo=" alt="x">')).querySelector('img');
      expect(img?.hasAttribute('src')).toBe(false);
    });
  });
});
