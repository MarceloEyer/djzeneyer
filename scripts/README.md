# scripts/

Scripts Node/Shell para build, deploy, SEO e operações do djzeneyer.com.

Todos são invocados via `npm run <script>` definido em `package.json`, exceto onde indicado.

## Mapa de responsabilidades

### Build e pré-renderização

| Script | Comando npm | Quando rodar |
|--------|-------------|--------------|
| `prerender.js` | `npm run prerender` | Pós-build, etapa de deploy. Pré-renderiza todas as rotas públicas via Puppeteer. Não é gate de build — roda no deploy. |
| `generate-sitemap.js` | `npm run generate-sitemaps` | Pós-build ou manualmente. Gera `sitemap-pages.xml` (rotas bilíngues) e `sitemap-events.xml` (eventos dinâmicos do WordPress). |

### SEO, discovery e indexação

| Script | Comando npm | Quando rodar |
|--------|-------------|--------------|
| `submit-indexnow.mjs` | `npm run indexnow` | Após deploy, para notificar Bing/outros buscadores de URLs atualizadas. Requer `INDEXNOW_KEY` no ambiente. |
| `generate-markdown.mjs` | `npm run generate-markdown` | Gera Markdown estático a partir do HTML pré-renderizado para consumo por agentes e LLMs. |
| `publish-dns-aid-cloudflare.mjs` | manual | Publica registros DNS-AID via Cloudflare API. Ver `docs/dns-aid-records.md`. Requer credenciais de Cloudflare. |
| `test-seo-ai.sh` | manual | Testes exploratórios de SEO e descoberta por IA. Não é parte do CI. |

### Qualidade e validação

| Script | Comando npm | Quando rodar |
|--------|-------------|--------------|
| `check-i18n-parity.mjs` | `npm run i18n:check` | CI e antes de PR. Valida paridade de chaves EN/PT em todos os namespaces de `src/locales/`. |
| `check-seo-invariants.mjs` | `npm run seo:check` | CI e antes de PR. Impede canonicals e outras props SEO baseadas em `window.location.origin`, que vira localhost durante prerender. |
| `check-utf8-content.mjs` | `npm run utf8:check` | CI. Detecta mojibake (`Ã§`, `Â©` etc.) em arquivos JSON de locale e MDs críticos. |
| `check-performance-budget.mjs` | `npm run perf:budget` | CI pós-build. Valida orçamentos de Lighthouse/bundle. Baseline atualizado em `lighthouserc.json`. |
| `perf-baseline.mjs` | `npm run perf:baseline` | Manual. Recalibra o baseline de performance após mudanças estruturais no bundle. |
| `pre-deploy-check.sh` | manual | Checklist pré-deploy: build limpo, testes, lock files, variáveis de ambiente. |
| `verify-namespaces.sh` | manual | Valida que os namespaces de i18n declarados no código batem com os arquivos em `src/locales/`. |
| `test-contracts.ts` | manual | Contract tests para endpoints da REST API do WordPress. Requer servidor WordPress acessível. |

### Contexto e automação de agentes

| Script | Comando npm | Quando rodar |
|--------|-------------|--------------|
| `sync-context-versions.mjs` | `npm run context:sync` | Manual. Sincroniza versões de arquivos de contexto (`.context/*.md`) para detectar drift. |

### Geração de assets

| Script | Quando rodar |
|--------|-------------|
| `generate-presskit-pdf.js` | Manual. Gera PDF do press kit a partir do HTML pré-renderizado. |
| `generate-bio-pdf.js` | Manual. Gera PDF da bio do artista. |

### Deploy e rollback

| Script | Quando rodar |
|--------|-------------|
| `quick-push.sh` | Manual. Atalho para push rápido em ambiente de desenvolvimento. |
| `rollback.js` | Emergência. Reverte para o deploy anterior. Ver comentários internos do script. |

## Dependências de ambiente

- **Node ≥ 22.13.0** — exigido por Puppeteer 25 e pelo toolchain atual.
- **`INDEXNOW_KEY`** — necessário para `submit-indexnow.mjs`.
- **Cloudflare API token** — necessário para `publish-dns-aid-cloudflare.mjs`.
- Não usar `pnpm`; o projeto usa `npm` (ver `.npmrc`).

## Ordem típica de deploy completo

```
npm run build:full          # type-check + build + sitemaps
npm run prerender           # SSG via Puppeteer (etapa de deploy)
npm run indexnow            # Notificar buscadores
```
