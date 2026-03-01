# SEO Plugin Context - /plugins/zen-seo-lite

> **Purpose:** Bridge SEO metadata between WordPress and Headless React.

## Rules
1. **Meta Mapping:** Traduz campos de SEO do WordPress (como títulos e descrições do Polylang) para o formato JSON consumido pelo `HeadlessSEO.tsx`.
2. **Canonical URLs:** Deve garantir que as URLs canônicas reflitam o domínio da SPA (`djzeneyer.com`) e não a URL interna do WordPress backend.
3. **Rest API:** Adiciona campos customizados à resposta de `pages` e `posts` via `register_rest_field`.

## Guidelines
- Mantenha a lógica leve para não impactar o tempo de resposta da API (TTFB).
- Use `transients` para cachear metadados de páginas estáticas.

---
*SEO é a visibilidade do DJ. Não quebre os metadados do `HeadlessSEO`.*
