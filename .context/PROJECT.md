# Project Context: Zen Eyer Ecosystem

Version: 1.2.0

## Objetivo

Plataforma oficial de Zen Eyer, unindo site institucional, autoridade publica, e-commerce (WooCommerce), gamificacao (GamiPress), comunidade/fan hub e superficies legiveis por IAs para discovery, grounding, indexacao e treinamento.

O site e diferente da maioria porque os arquivos publicos para IA (`llms.txt`, `llms-full.txt`, `.well-known/*`, schema, FAQ, robots Content Signals e dados estruturados) sao produto central, nao apenas documentacao tecnica.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind 4.
- **Backend:** WordPress 6.9+ (Headless), PHP 8.3.
- **Integracoes:** GamiPress, WooCommerce, MailPoet/newsletter, Google OAuth/JWT.
- **SEO/AI Discovery:** Prerender via Puppeteer, HeadlessSEO, schema JSON-LD, sitemaps, `llms.txt`, `llms-full.txt`, `.well-known/*`, IndexNow e DNS-AID.
- **Infra:** Hostinger VPS (Ubuntu), LiteSpeed Cache, Cloudflare, GitHub Actions.

---

## Organizacao de Contexto para Agentes

- **Indice canonico:** `AI_CONTEXT_INDEX.md`.
- **Entrada geral obrigatoria:** `AGENTS.md`.
- **Regras tecnicas globais:** `.agents/GUIDELINES.md`.
- **Identidade:** `.context/IDENTITY.md`.
- **Operacoes e memoria compartilhada:** `.context/OPERATIONS.md`.
- **Arquitetura:** `.context/ARCHITECTURE.md`.
- **Estrategia de paginas publicas:** `.context/SITE_PAGES_STRATEGY.md`.
- **Habilidades:** `.agents/skills/`.
- **Personas/overrides locais de agentes:** `.agents/personas/`.
- **Acoes humanas:** `.human/`.
- **Aprendizados consolidados:** `LEARNINGS.md`.

---

## Fronteiras de Responsabilidade

- **WordPress:** Gerencia conteudo, auth, endpoints REST, plugins, gamificacao, metadados e integracoes server-side.
- **React:** Gerencia UX, roteamento, hidratacao, i18n e SEO on-page via HeadlessSEO.
- **Plugins customizados:** Mantem regras de dominio como eventos, auth, SEO metadata e gamificacao.
- **Scripts:** Geram build, prerender, sitemap, markdown, IndexNow, DNS-AID e validacoes.
- **CI/CD:** Automatiza build, validacao, publicacao de assets publicos e deploy.
- **Agentes:** Podem editar codigo e docs, mas devem respeitar a hierarquia de contexto e nao transformar decisoes de produto em supostas correcoes de seguranca sem perguntar.