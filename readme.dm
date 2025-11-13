# 🎵 DJ Zen Eyer - Plataforma Oficial (Headless)

Este repositório contém o código-fonte da plataforma oficial do DJ Zen Eyer. O projeto utiliza uma arquitetura **Headless WordPress**, onde o WordPress serve apenas como API (Backend) e o React (via Vite) gerencia todo o Frontend.

---

## 🎹 Perfil Artístico & Identidade (Do Not Change)

Esta seção define a identidade do artista para fins de SEO, Metadados e IA.

* **Nome Artístico:** DJ Zen Eyer
* **Nome Real:** Marcelo Eyer Fernandes
* **Foco Principal:** **Brazilian Zouk** (Zouk Brasileiro)
* **Gêneros Tocados:**
    * Brazilian Zouk (Ênfase Absoluta)
    * Kizomba
    * RnB
    * Reggaeton
    * Moombahton
    * Dancehall
    * Afrohouse
    * Afrobeat
* **Nota:** **NÃO** classificar como "Electronic Music" ou "EDM" genérico.

### 🔗 Links Oficiais (Identity Linking)
* **Site:** [djzeneyer.com](https://djzeneyer.com)
* **Instagram:** [@djzeneyer](https://www.instagram.com/djzeneyer/)
* **Spotify:** [DJ Zen Eyer](https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw)
* **SoundCloud:** [soundcloud.com/djzeneyer](https://soundcloud.com/djzeneyer)
* **YouTube:** [youtube.com/@djzeneyer](https://youtube.com/@djzeneyer)
* **Facebook:** [facebook.com/djzeneyer](https://facebook.com/djzeneyer)
* **TikTok:** [tiktok.com/@djzeneyer](https://tiktok.com/@djzeneyer)
* **Mixcloud:** [mixcloud.com/djzeneyer/](https://www.mixcloud.com/djzeneyer/)
* **Bandcamp:** [zeneyer.bandcamp.com](https://zeneyer.bandcamp.com)

---

## 🏗️ Arquitetura do Sistema

O site opera com responsabilidades estritamente divididas para garantir performance máxima (Nota 96+ no PageSpeed).

### 1. Frontend (Este Repositório)
* **Tecnologia:** React 18 + TypeScript + Vite.
* **Estilização:** Tailwind CSS.
* **Build:** Gera arquivos estáticos na pasta `dist/` com hash para cache busting.
* **Responsabilidade:** Renderizar toda a interface, rotas (SPA) e consumir a API do WP.

### 2. Backend (WordPress)
* **Hospedagem:** Hostinger.
* **Função:** Apenas API REST (Headless). Não renderiza HTML visível.
* **Tema:** `zentheme` (Tema customizado mínimo).
* **Plugins Essenciais:** WooCommerce, GamiPress, Rank Math (apenas painel), Simple JWT Login.

### 3. Camada de Cache & Performance (Quem faz o que?)

| Ferramenta | Status | Responsabilidade | Configuração Crítica |
| :--- | :--- | :--- | :--- |
| **Cloudflare** | ✅ Ativo | **DNS, SSL, Edge Cache, Segurança.** É a porta de entrada. | **Rocket Loader: OFF** (Quebra o React). **Auto Minify: OFF**. SSL: Full (Strict). |
| **LiteSpeed Cache** | ✅ Ativo | **Cache de API REST.** Salva os JSONs em disco para resposta rápida. | **Otimização de CSS/JS: OFF** (Conflita com Vite). **Cache de Objeto: OFF**. |
| **Quic.cloud** | ⚠️ Parcial | **Otimização de Imagens.** | **CDN: OFF** (Para não conflitar com Cloudflare). |
| **.htaccess** | ✅ Ativo | **Headers de Segurança (CSP, HSTS) e Cache-Control.** | Gerencia MIME types e bloqueios de segurança. |

---

## 🚀 Pipeline de Deploy (CI/CD)

O deploy é automático via **GitHub Actions** (`.github/workflows/deploy.yml`).

**Fluxo:**
1.  **Push na `main`** aciona o workflow.
2.  **Build:** O ambiente instala dependências e roda `npm run build`.
3.  **Artifacts:** O sistema separa dois pacotes:
    * `build-dist`: A pasta `dist/` completa (incluindo a pasta oculta `.vite/` com o `manifest.json`).
    * `build-theme`: Arquivos PHP do tema (`functions.php`, `index.php`, `inc/`, etc).
4.  **Deploy (Rsync):** O GitHub conecta via SSH na Hostinger e sincroniza os arquivos, deletando versões antigas.
5.  **Verificação:** O script verifica se o `manifest.json` chegou no servidor.

**⚠️ Importante:** Nunca edite arquivos diretamente no servidor via FTP. Suas mudanças serão sobrescritas no próximo deploy.

---

## 📂 Estrutura do Tema WordPress (`zentheme`)

O tema reside em `wp-content/themes/zentheme/` e é composto por:

* **`functions.php`**: O "Maestro". Apenas carrega os módulos da pasta `inc/`.
* **`index.php`**: O "Esqueleto". Contém o HTML base, Preload de fontes (LCP) e a div `#root` onde o React monta.
* **`inc/` (Módulos PHP):**
    * `setup.php`: Configurações básicas, CORS e suporte ao tema.
    * `vite.php`: Lê o `manifest.json` e enfileira os scripts JS/CSS com hash corretos.
    * `spa.php`: Gerencia rotas e redireciona 404 para o React.
    * **`seo.php`**: Gera Sitemaps, Robots.txt e Meta Tags (Schema/OpenGraph) dinamicamente.
    * `api.php`: Endpoints customizados (Menu, GamiPress).
    * `cleanup.php`: Remove inchaço do WP (Emojis, Embeds, GTM fantasma).

---

## 🛠️ Comandos Úteis

### Instalação Local
```bash
npm install