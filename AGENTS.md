# Zen Eyer Project Agents — Master Instructions

Este é o ponto de entrada principal para todos os agentes de IA. A conformidade com estas diretrizes é **obrigatória**.

## 🏛️ Camadas de Contexto

1. Leia `.agents/GUIDELINES.md` para o manual técnico completo.
2. Leia `.context/IDENTITY.md` para branding e pronúncia (`/zɛn ˈaɪər/`).
3. Leia `AI_CONTEXT_INDEX.md` para entender a hierarquia de SSOT.

---

## 🚨 Regras Críticas (Bypass Proibido)

### 1. Sanitização de URLs (`safeUrl`)

A função `safeUrl(url)` retorna `'#'` (que é truthy).

- **ERRADO:** `safeUrl(url) || '/fallback.svg'`
- **CORRETO:** `safeUrl(url, '/fallback.svg')` para imagens; `safeUrl(url, '/')` para links.

### 2. Guards de Rota & Autenticação

- Use sempre `loadingInitial` (não `loading`) do `UserContext` para proteger rotas privadas.
- `loadingInitial` garante que a sessão foi restaurada antes de decidir pelo redirect.
- `loading` é para ações (login, logout) — default `false` — e causa tela branca no CTRL+F5 se usado em guards.

### 3. SEO & MusicEvent (Schema JSON-LD)

Para eventos de música (`MusicEvent`), os seguintes campos são **obrigatórios** (Google Search Console rejeita sem eles):

| Campo | Regra |
|---|---|
| `eventStatus` | Sempre `EventScheduled` — inclusive em eventos passados. Só mudar para `EventCancelled`/`EventPostponed` se a API retornar dado explícito. |
| `endDate` | Obrigatório. Fallback: `startDate` + 4 horas. |
| `location.address` | `PostalAddress` com sub-campos preenchidos. Nunca emitir string vazia — omitir sub-campo se vazio. Não usar nome do venue como `streetAddress`. |
| `description` | Obrigatório. Fallback: `"Live Brazilian Zouk DJ set by DJ Zen Eyer at {venue}."` |
| `image` | Obrigatório. Fallback: `/images/zen-eyer-og-image.png`. |
| `offers` | Obrigatório. Fallback: `Offer` com `url = canonical_url`, `availability = InStock` (futuro) ou `Discontinued` (passado). |
| `performer` | Sempre presente — entidade `MusicGroup` DJ Zen Eyer. |

Arquivos que implementam: `src/components/HeadlessSEO.tsx` e `plugins/zen-bit/includes/class-zen-bit-normalizer.php`.

### 4. GamiPress & PHP

- `gamipress_get_rank_types()` e similares retornam arrays associativos (slug como chave).
- **LEI:** Use sempre `array_values($array)[0]` ou `reset($array)` para acessar o primeiro elemento. Nunca use `$array[0]` direto.

### 5. Dados de Pagamento Publicos por Design

- Campos de pagamento e apoio (`payment`, Pix, PayPal, Wise, IBAN, SWIFT, banco) podem aparecer em endpoints e paginas publicas.
- **REGRA DE PRODUTO:** isso e intencional para receber doacoes, apoio financeiro e pagamentos alternativos.
- **NAO marcar como bug/vazamento:** nao recomendar tornar esses dados privados, remover de `/zen-seo/v1/profile`, nem separar em endpoint autenticado, salvo se o usuario pedir explicitamente.
- O que continua proibido: expor senhas, tokens, chaves secretas, credenciais SMTP/API ou dados de pagamento de terceiros/usuarios.

---

## ⚠️ Armadilhas Conhecidas

- **`lucide-react 1.x`:** Ícones Facebook, Instagram, YouTube foram removidos. Usar `src/components/icons/BrandIcons.tsx` (inline SVGs).
- **Vite base path / assets públicos:** URLs absolutas `/images/...` só chegam ao webroot quando `public/images/` é copiada pelo CI. Conferir `Prepare public assets` em `.github/workflows/deploy.yml`.
- **Zod v4 + PHP `false` returns:** `z.union([z.string(), z.literal(false)])` quebra em `null`/`undefined`. Padrão correto: `z.string().catch('')`.
- **`llms-full.txt`:** Arquivo deve ser UTF-8 limpo. Validar com `python3 -c "open('public/llms-full.txt').read()"` após edições.
- **robots.txt AhrefsBot:** `Allow: /` deve vir ANTES dos `Disallow` específicos no mesmo bloco (RFC 9309).
- **Sitemap:** Rotas privadas devem ter `excludeFromSitemap: true` em `src/config/routes-slugs.json`. Nunca editar o XML manualmente.
- **URL canônica em páginas:** Nunca hardcodar paths como `/about`. Usar `getLocalizedRoute('about', currentLang)`.
- **Class components:** Não podem usar `useTranslation()` — usar `withTranslation()` HOC.
- **Jules PRs duplicados:** Jules tende a criar PRs duplicados. Verificar antes de mergear.

---

## ❌ Proibições Absolutas

- Commitar `.env`, segredos ou credenciais.
- Deletar `.bolt`, `.devcontainer`, `.agents`, `.jules`, `.gemini` — usados por outros agentes.
- Remover lógica de renderização por slug em NewsPage/EventsPage — crítico para SEO.
- Remover PWA (`site.webmanifest`, service workers).
- Fazer "resumo executivo" de arquivos de contexto — preservar todo conteúdo técnico.
- Alterar ferramentas base (ESLint, TypeScript major, Vite major) sem aprovação explícita.
- `pnpm-lock.yaml` ou `plan.md` em PRs — o projeto usa npm.
- SQL direto em `wp_posts` para pedidos WooCommerce.
- Reintroduzir music player embutido sem decisão explícita.
- `minify: 'esbuild'` no Vite config (OXC é o padrão do Vite 8).
- **Editar dentro de `# BEGIN LSCACHE` / `# END LSCACHE` ou `# BEGIN NON_LSCACHE` / `# END NON_LSCACHE`** no `.htaccess` — esses blocos pertencem ao plugin LiteSpeed WP Cache e são sobrescritos automaticamente.
- **Adicionar regras NOCACHE para `/wp-json/`, `/feed/`, `/api/`** — o frontend é SSG (pré-renderizado em build time). Cachear essas rotas é CORRETO. Adicionar NOCACHE quebraria a estratégia de performance do site.
- **`Header unset Content-Security-Policy` ou `Header always unset Content-Security-Policy` no `.htaccess`** — `mod_headers` roda após o PHP e remove a CSP dinâmica gerada por `inc/csp.php`, deixando o cliente sem proteção.
- **`Strict-Transport-Security` no `.htaccess`** — HSTS é gerenciado pelo Cloudflare. Definir nos dois lugares cria duas fontes de verdade.

---

## 📂 Organização

- **`.agents/`**: Personas e Skills especializadas.
- **`.context/`**: Conhecimento técnico de domínio.
- **`.human/`**: Backlog para o Orquestrador Humano.
- **`LEARNINGS.md`**: Anti-erros e lições aprendidas.

*Assinado: Zen Eyer — Orquestrador Humano*
