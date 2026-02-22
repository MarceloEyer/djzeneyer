# 🏗️ Guia de Instalação

Instruções completas de instalação do projeto DJ Zen Eyer (Headless WordPress + React).

---

## 📋 Pré-requisitos

- **Servidor**: LiteSpeed (Hostinger) ou Apache/Nginx
- **PHP**: 8.0+
- **Node.js**: 20+
- **Banco de Dados**: MySQL 5.7+

---

## 1. Instalação do WordPress

1. Instale o WordPress no servidor.
2. Edite `wp-config.php`:
    ```php
    define('WP_HOME', 'https://djzeneyer.com');
    define('WP_SITEURL', 'https://djzeneyer.com');
    ```
3. Configure Permalinks como **Post name** (`/%postname%/`).

---

## 2. Instalação de Plugins

### Essenciais (via WP Admin ou WP-CLI)
- **WooCommerce** — E-commerce
- **GamiPress** — Gamificação
- **Polylang** — Suporte multilíngue (EN/PT)
- **MailPoet** — Newsletter
- **LiteSpeed Cache** — Performance

### Customizados (neste repositório)
Faça upload a partir da pasta `plugins/`:
- `zeneyer-auth` — Autenticação JWT + Google OAuth
- `zen-seo-lite` — SEO para headless
- `zen-bit` — Integração Bandsintown
- `zen-ra` — Gamificação e Atividade Recente

---

## 3. Instalação do Tema

1. Navegue até `wp-content/themes/`
2. Crie a pasta `zentheme`
3. Faça upload dos arquivos PHP (`functions.php`, `index.php`, `header.php`, `footer.php`) e da pasta `inc/`
4. Ative o tema no WordPress

---

## 4. Frontend (React)

1. **Clonar e instalar:**
    ```bash
    git clone https://github.com/MarceloEyer/djzeneyer.git
    npm install
    ```

2. **Variáveis de ambiente** — crie `.env`:
    ```env
    VITE_WP_REST_URL=https://djzeneyer.com/wp-json
    VITE_SITE_URL=https://djzeneyer.com
    ```

3. **Desenvolvimento:**
    ```bash
    npm run dev
    ```

4. **Build:**
    ```bash
    npm run build
    ```

---

## 5. Deploy

O deploy é **automático** via GitHub Actions ao fazer `git push origin main`.

Para deploy manual, faça upload da pasta `dist/` para `wp-content/themes/zentheme/dist/`.

Detalhes: veja [Guia do Desenvolvedor](DEV_GUIDE.md) e [Configuração](CONFIGURATION.md).

---

**Atualizado:** Fevereiro 2026
