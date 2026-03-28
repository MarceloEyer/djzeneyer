# Frontend Context - /src

> **Tech Stack:** React 19, Vite 8, Framer Motion, Tailwind 4, React Query v5, i18next.

## Standards

- **Fetch Strategy:** React Query centralizado em `hooks/useQueries.ts`. Nunca `fetch()` direto em componentes.
- **Styling:** Tailwind 4 utilitário. Visual premium + mobile-first obrigatório. Sem gradientes chamativos em títulos principais.
- **i18n:** Todo texto visível usa `t('chave')` via `useTranslation()`. Strings hardcoded são BUG. Adicionar em PT e EN simultaneamente.
- **Data:** Backend filtra, frontend renderiza. Usar `_fields` nas queries para performance.
- **Lazy Loading:** Todas as páginas via `React.lazy()` + `Suspense`.

## Structure Guide

- `assets/`: Imagens e SVGs otimizados.
- `components/`: Componentes UI reutilizáveis. Ícones de redes sociais em `components/icons/BrandIcons.tsx` (lucide-react 1.x removeu Facebook/Instagram/YouTube).
- `config/`: Configurações de rotas (`routes.ts`, `routes-slugs.json`) e API. `routes-slugs.json` é o SSOT de slugs EN/PT.
- `contexts/`: Providers globais. Valores de Provider sempre em `useMemo`, funções em `useCallback`.
- `hooks/`: Lógica de estado e fetching. `useQueries.ts` é o cubo central.
- `layouts/`: Master templates (MainLayout).
- `pages/`: Componentes de página (Lazy Loaded). Páginas não devem filtrar ou processar dados complexos.
- `schemas/`: Zod schemas para validação de API. Campos de imagem/URL usam `.catch('')`, nunca `z.union([z.string(), z.literal(false)])`.
- `utils/`: Funções puras. `safeUrl(url, fallback)` — sempre passar fallback explícito (default '#' é truthy).

## SEO & Accessibility

- Toda página pública usa `<HeadlessSEO />` com schema JSON-LD adequado ao tipo de página.
- Rotas privadas (`dashboard`, `my-account`) usam `<HeadlessSEO noindex />` com OG image genérica.
- URL canônica: sempre via `getLocalizedRoute()` — nunca hardcodar paths.
- `AboutPage` → schema `ProfilePage`; `MusicPage` listagem → `CollectionPage` + `MusicGroup`; `PhilosophyPage` → `Article`.

## Mobile-First

- Gauge SVG: `viewBox` + `w-full max-w-[Xpx] aspect-square` — nunca tamanho fixo em px.
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N` — nunca começar com colunas fixas sem breakpoint mobile.
- Alturas fixas (`h-[500px]`): substituir por `max-h-[Xpx] overflow-y-auto` em listas/feeds.
- Texto truncado em containers flex: sempre `min-w-0` no elemento com `truncate`.

---
*Visual premium + mobile-first são obrigatórios. Backend filtra, frontend renderiza.*
