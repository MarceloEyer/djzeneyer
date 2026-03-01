# Pages Context - /src/pages

> **Responsibility:** Main route components and data orchestration.

## Rules
1. **Lazy Loading:** Todas as páginas em `App.tsx` devem usar `React.lazy()`.
2. **SEO First:** A primeira linha de cada página (após imports) deve ser a renderização do `<HeadlessSEO />`.
3. **Data Fetching:** Usar as chaves de query de `useQueries.ts`.
4. **Layout:** Quase todas as páginas devem estar envolvidas pelo `MainLayout.tsx`.

## Layout Details
- `EventsPage.tsx`: Foco em visual de calendário e links Apple/Google.
- `ProductPage.tsx`: Integração WooCommerce.
- `PayMePage.tsx`: Fluxos de pagamento e tradução rigorosa.

---
*Páginas pesadas = Tela branca. Otimize e use lazy loading.*
