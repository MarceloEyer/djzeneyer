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

<<<<<<< ours
## Governanca de Contexto (Obrigatoria)
10. Sempre que houver mudanca importante (arquitetura, API, fluxo, seguranca, deploy), atualizar no mesmo trabalho os arquivos de contexto/documentacao correspondentes.
11. Se a mudanca afetar instrucoes de skills, atualizar tambem a skill relevante em `.agents/skills/*`.
12. Nao encerrar mudanca estrutural sem sincronizar contexto.
=======
O pipeline faz: build → prerender (SSG) → rsync para VPS → purge cache.

---

## Governança Canônica de IA

- Fonte operacional canônica de execução: `docs/AI_GOVERNANCE.md`.
- Em conflitos entre guias de assistentes, aplicar a hierarquia definida em `AI_GOVERNANCE.md`.
- Mudanças de processo de PR devem atualizar também `.github/pull_request_template.md`.

---

## Regras Importantes

1. **Não modificar ESLint para v10** — plugins React não suportam (ver `docs/ESLINT_ANALYSIS.md`)
2. **Navbar está em `src/components/Layout/Navbar.tsx`** (não em `common/`)
3. **Tradução é obrigatória** em ambos os idiomas (en + pt) para qualquer texto visível
4. **Nunca commitar** `.env`, `secrets`, ou credenciais
5. **O deploy apaga o dist/ antigo** — tudo deve estar no build
6. **PHP mínimo: 8.0**, Node mínimo: 20
>>>>>>> theirs
