# Engineering Standards & AI Directives

Version: 1.1.0

Este documento define os princípios de desenvolvimento e as restrições operacionais para agentes e humanos.

## 🏛️ Princípios de Design

- **KISS (Keep It Simple, Stupid):** Soluções simples primeiro. Evite overengineering que cause erros 429.
- **DRY (Don't Repeat Yourself):** Centralize lógica de tradução e formatação.
- **YAGNI (You Aren't Gonna Need It):** Não implemente o que não foi pedido para "o futuro".
- **SSOT (Single Source of Truth):**
    - Identidade: `.context/IDENTITY.md` + `src/data/artistData.ts`.
    - Rotas: `src/config/routes-slugs.json`.
- **Perfil operacional do site:** O site tem baixo volume de atualizacoes. Eventos costumam atualizar semanalmente; posts/releases/reviews e copy publica atualizam mensalmente, trimestralmente ou menos; identidade, links oficiais e dados de pagamento raramente mudam. Prefira caches longos, prerender, dados estaticos para identidade e reducao de requests rotineiros antes de criar endpoints/agregadores complexos.
- **Dados de pagamento publicos:** Dados de pagamento do artista (Pix, PayPal, Wise, IBAN, SWIFT, banco) sao publicos por design para doacoes/apoio/pagamentos alternativos. Nao tratar como vazamento nem recomendar endpoint privado sem pedido explicito do usuario. Segredos reais (tokens, senhas, credenciais SMTP/API) continuam proibidos.
- **SEO/GEO/AEO/Knowledge Panel:** Priorize informacao factual, rastreavel e estruturada para bots, com baixo consumo de recursos. Solucoes simples e cacheaveis vencem otimizacoes pequenas que aumentam fragilidade.

---

## 🤖 Diretrizes para Agentes (Obrigatórias)

- **Economia de Créditos:** Priorizar **SEMPRE** ferramentas internas e CLI (`gh`, `npm`, `git`, `grep`). O navegador é o último recurso e exige justificativa.
- **Sem Suposições:** Em caso de dúvida sobre copy, design ou arquitetura, **pergunte** ao usuário.
- **Handoff:** Ao terminar uma tarefa, atualize o `LEARNINGS.md` com o que funcionou e o que falhou para o próximo agente.

---

## 🛠️ Qualidade de Código

- **i18n:** Nunca usar strings hardcoded. Toda UI deve usar `t('chave')`. Ao adicionar chave nova: adicionar em AMBOS `src/locales/pt/translation.json` E `src/locales/en/translation.json`.
- **Higiene de Texto:** Zero Mojibake (ex: `Â©`). Salvar sempre em UTF-8 limpo.
- **Aspas:** Use aspas retas (`"` e `'`) em codigo, contexto e documentos humanos. Evite aspas tipograficas (U+201C/U+201D/U+2018/U+2019) porque dificultam diff, busca e reaproveitamento em JSX/JSON.
- **Lint & Build:** O código deve passar em `npm run lint` e `npm run build` (com prerender) antes de qualquer push.
- **Hooks:** Dependências de `useMemo` e `useCallback` devem estar completas.
- **safeUrl:** SEMPRE usar com fallback explícito: `safeUrl(url, '/fallback.svg')` para imagens, `safeUrl(url, '/')` para links. `safeUrl(null)` retorna `'#'` (truthy) — o padrão `safeUrl(url) || fallback` NUNCA executa.

---

## 🌐 WordPress & PHP

- **HPOS:** Nunca usar SQL direto em `wp_posts` para pedidos; usar `wc_get_orders()`.
- **GamiPress SSOT:** `gamipress_get_rank_types()` retorna array associativo (slug como chave). **Sempre use `array_values()` antes de `[0]` ou `reset()`**.
- **Segurança:** SQL sempre preparado e inputs sanitizados.
- **PHP false em imagens:** `get_avatar_url()`, `get_the_post_thumbnail_url()` retornam `false` quando não há imagem. Schemas Zod: usar `z.string().catch('')` (não `z.union([z.string(), z.literal(false)])`).

---

## 📦 Fluxo de Trabalho (Workflow)

- **PR-First:** Jamais dar push direto na `main`.
- **Atomicidade:** Um domínio por PR (Frontend OU PHP).
- **Lockfile:** Alterações em `package.json` exigem atualização do `package-lock.json`.

---

## 🏗️ Build & Deploy

- **Minificador:** OXC (padrão Vite 8) — nunca `minify: 'esbuild'`.
- **Prerender:** `scripts/prerender.js` via Puppeteer — nunca remover.
- **Deploy SPA:** Preservar assets Vite hashados antigos em `dist/assets` durante a troca `dist-next` → `dist`; abas abertas podem pedir chunks lazy da build anterior.
- **ESLint ignores obrigatórios:** `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`.
- **`fetch-depth: 2`** no CI — nunca `0`.
- **Vite base path:** Assets de `public/` ficam em `/wp-content/themes/zentheme/dist/`. Para servir da raiz, usar `public/images/` (deployado para webroot pelo CI). Não assumir que qualquer arquivo solto em `public/` vai para a raiz; verificar `Prepare public assets` em `.github/workflows/deploy.yml`.
