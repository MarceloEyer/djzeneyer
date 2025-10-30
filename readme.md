# DJ Zen Eyer 🎵
## WordPress Headless Theme com React 18 + Vite + TypeScript

![Version](https://img.shields.io/badge/Version-12.1.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

**Tema WordPress Headless profissional especializado em DJ/Produtor Musical, com gamificação, React moderna e integração completa com Spotify, Mixcloud e outras plataformas.**

---

## 🎯 **Características Principais**

### 🏗️ **Arquitetura**
- ✅ **WordPress Headless** - Backend PHP puro, Frontend React isolado
- ✅ **React 18** - Component library moderna
- ✅ **TypeScript 5** - Type safety completo
- ✅ **Vite** - Build otimizado com code splitting automático
- ✅ **Tailwind CSS** - Estilização rápida e escalável

### 🔒 **Segurança (v12.1.0)**
- ✅ **CSP Nonce** - Proteção contra XSS em styles inline
- ✅ **REST API Segura** - Endpoints autenticados e filtrados
- ✅ **CORS Production-Only** - Sem localhost em produção
- ✅ **Headers HTTP** - HSTS, X-Frame-Options, nosniff
- ✅ **Validação** - WP_Error, sanitização completa

### 📊 **SEO & Metadata**
- ✅ **Schema.org JSON-LD** - Dados estruturados (Person, MusicGroup)
- ✅ **Open Graph & Twitter Cards** - Previews em redes sociais
- ✅ **Canonical URLs** - Sem duplicate content
- ✅ **Breadcrumbs** - Navegação SEO
- ✅ **Sitemap XML** - Indexação automática

### ⚡ **Performance**
- ✅ **Code Splitting** - Chunks automáticos para rotas
- ✅ **Tree Shaking** - Remove código não-utilizado
- ✅ **Lazy Loading** - React.lazy() em componentes pesados
- ✅ **Caching** - Headers cache-control otimizados
- ✅ **Asset Minification** - JS/CSS comprimidos

### 🎮 **Gamificação**
- ✅ **GamiPress Integration** - Pontos, badges, leaderboards
- ✅ **Custom Post Types** - Eventos, Tracks, Achievements
- ✅ **REST API Public** - `/wp-json/djz/v1/config`

### 🎵 **Integração Streaming**
- ✅ **Spotify** - Embeds, Player, Links
- ✅ **Mixcloud** - Show sets, Gravações
- ✅ **SoundCloud** - Tracks, Playlists
- ✅ **YouTube** - Vídeos, Canais
- ✅ **Apple Music** - Links, Integrações

---

## 📁 **Estrutura do Projeto**

djzeneyer-theme/
├── functions.php # Hooks WordPress, asset enqueue
├── template-parts/
│ ├── header.php # Header com React mount point
│ └── footer.php # Footer, scripts
├── inc/
│ ├── djz-config.php # ⭐ Configurações centralizadas
│ ├── djz-helpers.php # Funções auxiliares
│ └── djz-security.php # Headers de segurança
├── src/ # React TypeScript
│ ├── main.tsx # Entry point
│ ├── App.tsx # Root component
│ ├── components/
│ │ ├── Hero.tsx
│ │ ├── Player.tsx
│ │ └── SocialLinks.tsx
│ └── styles/
│ └── globals.css # Tailwind
├── dist/ # Build output (Vite)
│ ├── .vite/
│ │ └── manifest.json # Asset mapping
│ ├── js/
│ ├── css/
│ └── images/
├── vite.config.ts # Build otimizado
├── tsconfig.json # TypeScript strict
├── tailwind.config.js # Tailwind config
└── README.md

text

---

## 🚀 **Quick Start**

### 1️⃣ **Instalação**
Clone o repositório
git clone https://github.com/seu-usuario/djzeneyer-theme.git
cd djzeneyer-theme

Instale dependências
npm install

Build de produção
npm run build

Deploy para servidor
(Seu webhook GitHub → Bolt.new → Hostinger)
text

### 2️⃣ **Configuração**
Edite **`inc/djz-config.php`** com suas informações:
'site' => [
'name' => 'DJ Zen Eyer',
'tagline' => 'DJ e Produtor Musical',
],
'social' => [
'instagram' => 'https://...',
'spotify' => 'https://...',
],

text

### 3️⃣ **Ambiente**
Certifique-se que seu `wp-config.php` tem:
define('WP_DEBUG', false); // Production
define('WP_ENVIRONMENT_TYPE', 'production');

text

---

## 📚 **Documentação**

### ⚙️ **Usando Configurações**
// No PHP
djz_config('site.name') // 'DJ Zen Eyer'
djz_config('social.spotify') // 'https://...'
djz_config('colors.primary') // '#0A0E27'

// No JavaScript (via wp_localize_script)
djzConfig.siteName
djzConfig.social
djzConfig.colors

text

### 🔌 **REST API Endpoints**

**Público:**
GET /wp-json/djz/v1/config
GET /wp-json/djz/v1/social

text

**Admin Only:**
GET /wp-json/djz/v1/admin/config

text

Resposta exemplo:
{
"site": {"name": "DJ Zen Eyer", "tagline": "..."},
"social": {"instagram": "...", "spotify": "..."},
"colors": {"primary": "#0A0E27"}
}

text

### 🎨 **Customização**

**Cores:**
// inc/djz-config.php
'colors' => [
'primary' => '#0A0E27',
'accent' => '#3B82F6',
]

text

**Features:**
'features' => [
'gamipress' => true,
'newsletter' => true,
]

text

---

## 🧪 **Testing & Validation**

### PageSpeed Insights
https://pagespeed.web.dev/?url=djzeneyer.com

text
Esperado: **90+** Performance, **95+** SEO

### Security Headers
https://securityheaders.com/?q=djzeneyer.com

text
Esperado: **A+** Score

### Schema.org Validator
https://validator.schema.org/

text
Esperado: ✅ Sem erros

---

## 🔒 **Segurança (v12.1.0)**

### Correções Implementadas
- ✅ **CSP Nonce** nos `<style>` inline (previne XSS)
- ✅ **REST API** retorna apenas dados públicos
- ✅ **CORS** permite apenas domínios de produção
- ✅ **Headers HTTP** - HSTS, nosniff, X-Frame-Options

### Checklist de Segurança
- [ ] HTTPS ativado (SSL/TLS)
- [ ] CSP headers presentes no servidor
- [ ] REST API testada (/wp-json/djz/v1/config)
- [ ] WordPress atualizado
- [ ] Plugins auditados

---

## 📈 **Performance Metrics**

| Métrica | Target | Status |
|---------|--------|--------|
| **Performance** | >90 | ✅ |
| **SEO Score** | >95 | ✅ |
| **Bundle JS** | <300KB | ✅ |
| **Bundle CSS** | <100KB | ✅ |
| **CSP Grade** | A+ | ✅ |
| **Security** | A+ | ✅ |

---

## 🐛 **Troubleshooting**

### CSP Errors na Console
Refused to load the stylesheet because it violates CSP nonce

text
**Solução:** Verifique se `djzeneyer_get_csp_nonce()` está em `<style>` tag

### CORS Error
Access to XMLHttpRequest blocked by CORS policy

text
**Solução:** Adicione domínio em `inc/djz-config.php` → `allowed_origins`

### Build Fail
Error: Cannot find module 'react'

text
**Solução:** `npm install && npm run build`

---

## 📦 **Dependencies**

### PHP (WordPress)
- WordPress 6.0+
- PHP 8.1+
- MySQL 5.7+

### Frontend
- React 18
- TypeScript 5
- Tailwind CSS 3
- Vite 5

### Build Tools
- Node 18+
- npm 9+

---

## 🤝 **Contribuindo**

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit: `git commit -m 'Add: descrição'`
4. Push: `git push origin feature/sua-feature`
5. Abra um Pull Request

---

## 📝 **Changelog**

### v12.1.0 (30/10/2025)
- ✅ Fix: CSP nonce em inline styles
- ✅ Fix: REST API filtra dados sensíveis
- ✅ Fix: CORS production-only
- ✅ Feat: Endpoint admin autenticado

### v12.0.0 (29/10/2025)
- ✅ Initial release
- ✅ React 18 + TypeScript setup
- ✅ Gamificação com GamiPress
- ✅ SEO & Schema.org completo

---

## 📄 **License**

MIT License - veja LICENSE.md para detalhes

---

## 👤 **Autor**

**DJ Zen Eyer**  
🎵 DJ e Produtor Musical  
📧 contato@djzeneyer.com  
🌐 [djzeneyer.com](https://djzeneyer.com)

---

## 🙏 **Agradecimentos**

- [WordPress](https://wordpress.org)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Made with ❤️ by DJ Zen Eyer Team**