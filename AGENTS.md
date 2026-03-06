# AGENTS.md - DJ Zen Eyer

> Instrucoes para agentes de IA neste repositorio.
> Idioma padrao: Portugues Brasileiro.

## Precedencia
- Este arquivo deve ser lido junto de `AI_CONTEXT_INDEX.md`.
- Em caso de conflito, **`AI_CONTEXT_INDEX.md` prevalece**.
- Se ainda houver conflito, prevalece o codigo real do repositorio.

## Resumo do Projeto
- Site/plataforma oficial do DJ Zen Eyer
- Arquitetura: WordPress Headless + React SPA
- Producao: https://djzeneyer.com

## Stack Canonica
- Frontend: React 18, TypeScript strict, Vite 7, Tailwind 3, React Query v5, React Router 7, i18next
- Backend: WordPress 6.0+, PHP 8.1+, WooCommerce, GamiPress
- Plugins customizados ativos no repo: `zeneyer-auth`, `zen-seo-lite`, `zen-bit`, `zengame`
- Infra: Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions
- Node: 20+

## Regras de Engenharia
1. Todo texto visivel deve usar i18n (`t('chave')`) em PT/EN
2. Data fetching deve ficar centralizado em `src/hooks/useQueries.ts`
3. Nao usar `fetch()` direto em componentes de pagina
4. Paginas devem ser lazy-loaded (`React.lazy` + `Suspense`)
5. Toda pagina deve configurar SEO com `<HeadlessSEO />`
6. Filtragem pesada deve ocorrer no backend
7. PHP com namespace, sanitizacao e queries preparadas
8. Nao atualizar ESLint para v10
9. Nunca commitar segredos

## Endpoints/Nomespaces de Referencia
- `djzeneyer/v1`
- `zeneyer-auth/v1`
- `zen-bit/v2`
- `zengame/v1`
- `zen-seo/v1`

## Verificacao local
```bash
npm run lint
npm run build
```
