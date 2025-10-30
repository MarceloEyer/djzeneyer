Perfeito! Aqui está o **README.md** completo do plugin CSP:

# 📄 **`plugins/djz-csp-nonce-manager-pro/README.md` (v2.5.0)**

```markdown
# 🔒 DJ Zen Eyer - CSP Nonce Manager PRO

[![Version](https://img.shields.io/badge/version-2.5.0-blue.svg)](https://github.com/djzeneyer/djz-csp-nonce-manager-pro)
[![License](https://img.shields.io/badge/license-GPL%203.0-green.svg)](LICENSE)
[![WordPress](https://img.shields.io/badge/wordpress-5.9%2B-blue.svg)](https://wordpress.org)
[![PHP](https://img.shields.io/badge/php-7.4%2B-blue.svg)](https://www.php.net)

> **Segurança de Conteúdo dinâmica com nonce 256-bit, logging completo e dashboard admin profissional**

[English](#english) | [Português](#português)

---

## 📋 Português

### 🎯 O que é este plugin?

Um plugin WordPress profissional que implementa **Content Security Policy (CSP) Level 3** com **nonce dinâmico 256-bit**, logging estruturado, dashboard admin com 6 abas interativas e suporte completo para WordPress Headless com React/Next.js.

### ⚡ Features

- ✅ **Nonce 256-bit** - Segurança máxima (2^256 combinações)
- ✅ **CSP Level 3** com Strict-Dynamic
- ✅ **Logging Estruturado** - Rotação automática de logs
- ✅ **Dashboard Admin** - 6 abas com real-time updates
- ✅ **Report-To API** - Integração com report-uri.com
- ✅ **Rate Limiting** - Proteção contra DDoS
- ✅ **Cache Otimizado** - Performance máxima
- ✅ **Multisite Compatible** - Suporte total
- ✅ **Export Logs** - CSV + JSON
- ✅ **Health Check** - Diagnostics completos

### 📦 Instalação

1. **Download/Clone do repositório**
   ```
   git clone https://github.com/djzeneyer/djz-csp-nonce-manager-pro.git \
   wp-content/plugins/djz-csp-nonce-manager-pro
   ```

2. **Ative o plugin**
   - Dashboard do WordPress → Plugins
   - Procure por "CSP Nonce Manager PRO"
   - Clique em "Ativar"

3. **Configure**
   - Acesse: Settings → CSP Settings
   - Configure conforme necessário

### 🚀 Quick Start

#### 1️⃣ Meta Tag no Header

Adicione ao seu `header.php` ou use um hook:

```
<!-- template-parts/header.php -->
<meta name="csp-nonce" content="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
```

#### 2️⃣ Scripts Inline

Use o nonce em scripts inline:

```
<script nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
    console.log('🔒 Protegido por CSP!');
</script>
```

#### 3️⃣ React/Vite Setup

Em seu `main.tsx` ou `main.jsx`:

```
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
window.__vite_nonce__ = nonce;
window.__webpack_nonce__ = nonce;
```

#### 4️⃣ Função Helper

Use em qualquer arquivo PHP:

```
<?php
$nonce = djzeneyer_get_csp_nonce();
echo '<script nonce="' . esc_attr($nonce) . '">...';
?>
```

### 📊 Dashboard Admin

O plugin inclui um dashboard completo com 6 abas:

#### 📊 **Status**
- Estado do plugin
- Nonce atual (256-bit)
- Features de segurança ativas
- Estatísticas gerais

#### ⚙️ **Setup**
- Guia de implementação
- Exemplos de código
- Integração React/Vite
- Troubleshooting

#### 📖 **Documentação**
- O que é Nonce CSP?
- Diretivas de Segurança
- Integração React
- Monitoramento

#### 📋 **Logs**
- Visualização em tempo real
- Auto-refresh a cada 30s
- Export em CSV/JSON
- Limpeza de logs

#### 🔍 **Diagnostics**
- Health check completo
- Ambiente WordPress
- Configuração CSP
- Headers enviados

#### ⚙️ **Settings**
- Desabilitar logging
- Desabilitar rate limit
- Configurações avançadas

### 🔐 Diretivas de Segurança

O plugin envia os seguintes headers:

```
default-src 'none'                           # Tudo bloqueado por padrão
base-uri 'self'                              # Restrict base URL
form-action 'self'                           # Restrict form submission
frame-ancestors 'self'                       # Prevent clickjacking
object-src 'none'                            # Block plugins
script-src 'self' 'nonce-{nonce}' 'strict-dynamic'  # Scripts seguros
style-src 'self' https://fonts.googleapis.com        # Styles
img-src 'self' data: https: blob:            # Images
font-src 'self' https://fonts.gstatic.com    # Fonts
connect-src 'self' https://*.googleapis.com  # AJAX/Fetch
frame-src 'self' https://www.youtube.com     # Iframes
upgrade-insecure-requests                    # Force HTTPS
block-all-mixed-content                      # Block HTTP on HTTPS
report-uri https://djzeneyer.report-uri.com  # Report violations
report-to csp-endpoint                       # Report-To API
```

### 🎯 Uso em Temas

#### Twentythree (ou outro tema)
```
// functions.php
function my_theme_setup() {
    // Adiciona meta tag do CSP
    add_action('wp_head', function() {
        echo '<meta name="csp-nonce" content="' . esc_attr(djzeneyer_get_csp_nonce()) . '">';
    });
}
add_action('after_setup_theme', 'my_theme_setup');
```

#### WordPress Headless (React/Next.js)
```
// pages/_app.tsx
export default function App({ Component, pageProps }: AppProps) {
    const [nonce, setNonce] = useState<string | null>(null);

    useEffect(() => {
        const meta = document.querySelector('meta[name="csp-nonce"]');
        const nonceValue = meta?.getAttribute('content');
        setNonce(nonceValue || null);
        window.__CSP_NONCE__ = nonceValue || '';
    }, []);

    return <Component {...pageProps} />;
}
```

### 🐛 Troubleshooting

#### ❌ "Script bloqueado"
1. Verifique a aba **Logs**
2. Procure por "CSP_VIOLATION"
3. Veja qual diretiva está bloqueando
4. Configure a whitelist ou use nonce

#### ❌ "Meta tag vazia"
1. Certifique-se de que o plugin está ativado
2. Verifique se `djzeneyer_get_csp_nonce()` existe
3. Verifique os logs de erro do WordPress

#### ❌ "Erro no console do browser"
1. Acesse **Settings → CSP Settings → Diagnostics**
2. Verifique a configuração CSP
3. Veja os security headers enviados

### 📈 Performance

- **Cache:** Nonces em cache por 1 hora (transients)
- **Logs:** Rotação automática a cada 7 dias
- **Queries:** Otimizadas para performance
- **Rate Limit:** 1000 logs por IP por hora

### 🔐 Segurança

- **Sanitização:** 100% de todas as entradas
- **Validation:** Strict type checking
- **IP Detection:** Suporta Cloudflare, proxies
- **Rate Limiting:** Proteção contra abuso
- **Nonce:** Random bytes 256-bit (bin2hex)

### 🌍 Internacionalização

Suporte a traduções:
- Português (pt_BR) ✅
- English (en_US) ✅
- Outros idiomas (contribuir)

Pasta: `/languages/djzeneyer-csp-pt_BR.po`

### 🤝 Contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -am 'Add new feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### 📝 Licença

Este plugin está licenciado sob **GPL v3 or later**. Veja [LICENSE](LICENSE) para mais detalhes.

### 👨‍💻 Suporte

- 📧 Email: [support@djzeneyer.com](mailto:support@djzeneyer.com)
- 🐛 Issues: [GitHub Issues](https://github.com/djzeneyer/djz-csp-nonce-manager-pro/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/djzeneyer/djz-csp-nonce-manager-pro/discussions)

### 📚 Referências

- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Level 3](https://w3c.github.io/webappsec-csp/)
- [Report-To API](https://w3c.github.io/reporting/)
- [WordPress Plugin Development](https://developer.wordpress.org/plugins/)

### 🎉 Changelog

#### v2.5.0 (2025-10-30)
- ✅ Logging estruturado com JSON
- ✅ Rate limiting por IP
- ✅ Admin assets (CSS + JS)
- ✅ Export CSV/JSON
- ✅ Health check completo
- ✅ Auto-refresh em tempo real

#### v2.4.1
- Melhorias gerais
- Bug fixes

#### v2.0.0
- Release inicial

---

## 📋 English

### 🎯 What is this plugin?

A professional WordPress plugin that implements **Content Security Policy (CSP) Level 3** with **dynamic 256-bit nonce**, structured logging, professional admin dashboard with 6 interactive tabs, and full support for WordPress Headless with React/Next.js.

### ⚡ Features

- ✅ **256-bit Nonce** - Maximum security (2^256 combinations)
- ✅ **CSP Level 3** with Strict-Dynamic
- ✅ **Structured Logging** - Automatic log rotation
- ✅ **Admin Dashboard** - 6 tabs with real-time updates
- ✅ **Report-To API** - Integration with report-uri.com
- ✅ **Rate Limiting** - DDoS protection
- ✅ **Optimized Cache** - Maximum performance
- ✅ **Multisite Compatible** - Full support
- ✅ **Export Logs** - CSV + JSON
- ✅ **Health Check** - Complete diagnostics

### 📦 Installation

1. **Download/Clone the repository**
   ```
   git clone https://github.com/djzeneyer/djz-csp-nonce-manager-pro.git \
   wp-content/plugins/djz-csp-nonce-manager-pro
   ```

2. **Activate the plugin**
   - WordPress Dashboard → Plugins
   - Search for "CSP Nonce Manager PRO"
   - Click "Activate"

3. **Configure**
   - Go to: Settings → CSP Settings
   - Configure as needed

### 🚀 Quick Start

#### 1️⃣ Meta Tag in Header

Add to your `header.php` or use a hook:

```
<!-- template-parts/header.php -->
<meta name="csp-nonce" content="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
```

#### 2️⃣ Inline Scripts

Use the nonce in inline scripts:

```
<script nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
    console.log('🔒 Protected by CSP!');
</script>
```

#### 3️⃣ React/Vite Setup

In your `main.tsx` or `main.jsx`:

```
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
window.__vite_nonce__ = nonce;
window.__webpack_nonce__ = nonce;
```

#### 4️⃣ Helper Function

Use in any PHP file:

```
<?php
$nonce = djzeneyer_get_csp_nonce();
echo '<script nonce="' . esc_attr($nonce) . '">...';
?>
```

### 📊 Admin Dashboard

The plugin includes a complete dashboard with 6 tabs:

- **Status** - Plugin status, nonce display, security features
- **Setup** - Implementation guide, code examples
- **Documentation** - CSP basics, security directives
- **Logs** - Real-time viewer, export, clear
- **Diagnostics** - Health check, environment info
- **Settings** - Plugin configuration

### 🔐 Security Directives

The plugin sends the following headers:

```
default-src 'none'                           # Everything blocked by default
base-uri 'self'                              # Restrict base URL
form-action 'self'                           # Restrict form submission
frame-ancestors 'self'                       # Prevent clickjacking
object-src 'none'                            # Block plugins
script-src 'self' 'nonce-{nonce}' 'strict-dynamic'  # Safe scripts
style-src 'self' https://fonts.googleapis.com        # Styles
img-src 'self' data: https: blob:            # Images
font-src 'self' https://fonts.gstatic.com    # Fonts
connect-src 'self' https://*.googleapis.com  # AJAX/Fetch
frame-src 'self' https://www.youtube.com     # Iframes
upgrade-insecure-requests                    # Force HTTPS
block-all-mixed-content                      # Block HTTP on HTTPS
report-uri https://djzeneyer.report-uri.com  # Report violations
report-to csp-endpoint                       # Report-To API
```

### 🐛 Troubleshooting

**Script blocked?**
→ Check Logs tab for CSP violations

**Meta tag empty?**
→ Ensure plugin is activated

**Console errors?**
→ See Diagnostics tab

### 🌍 Internationalization

- Portuguese (pt_BR) ✅
- English (en_US) ✅
- Contribute more languages

### 📝 License

GPL v3 or later

### 👨‍💻 Support

- Email: [support@djzeneyer.com](mailto:support@djzeneyer.com)
- GitHub: [Issues](https://github.com/djzeneyer/djz-csp-nonce-manager-pro/issues)

---

## 📊 Estrutura de Arquivos

```
djz-csp-nonce-manager-pro/
├── djz-csp-nonce-manager-pro.php     # Plugin main file
├── assets/
│   ├── admin.css                      # Admin styles
│   ├── admin.js                       # Admin JavaScript
│   └── README.md                      # Assets documentation
├── logs/
│   ├── .htaccess                      # Security (auto-created)
│   └── index.php                      # Security (auto-created)
├── languages/
│   └── djzeneyer-csp-pt_BR.po         # Portuguese translation
├── README.md                          # This file
├── LICENSE                            # GPL v3 License
└── .gitignore                         # Git ignore rules
```

---

## 🚀 Made with ❤️ by DJ Zen Eyer

**Version:** 2.5.0 | **License:** GPL v3+ | **WordPress:** 5.9+ | **PHP:** 7.4+