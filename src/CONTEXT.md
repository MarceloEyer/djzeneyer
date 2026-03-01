# Frontend Context - /src

> **Tech Stack:** React 18, Vite, Framer Motion, Tailwind CSS.

## Standards
- **Fetch Strategy:** React Query centralizado em `hooks/useQueries.ts`.
- **Styling:** Vanilla Tailwind CSS. Priorizar visual premium e micro-animações.
- **Data:** Usar `_fields` nas queries para performance.

## Structure Guide
- `assets/`: Imagens e SVGs otimizados.
- `components/`: Componentes UI (Navbar em `Layout/`).
- `config/`: Configurações de rotas e API.
- `hooks/`: Lógica de estado e fetching.
- `layouts/`: Master templates (MainLayout).
- `pages/`: Componentes de página (Lazy Loaded). **Importante:** Páginas não devem filtrar ou processar dados complexos; receba do backend já pronto.
- `utils/`: Funções puras e auxiliares.

## SEO & Accessibility
- Toda página deve injetar `<HeadlessSEO />`.
- URLs amigáveis traduzidas via `config/routes.ts`.

---
*Não esqueça: Visual 'Premium' é obrigatório.*
