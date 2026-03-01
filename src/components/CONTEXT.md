# Components Context - /src/components

> **Philosophy:** Visual Excellence & Premium Feel.

## Rules
1. **No Ad-hoc Styles:** Usar tokens do Tailwind definidos em `tailwind.config.js`.
2. **Organization:**
   - `Layout/`: Componentes globais (Navbar, Footer).
   - `Common/`: Botões, inputs e elementos reutilizáveis.
   - `[Feature]/`: Componentes específicos de domínio (ex: `Events/`).
3. **Animations:** Usar `Framer Motion` para interações suaves.
4. **I18n:** Todas as strings devem vir de `t()` via `react-i18next`.

## Key Components
- `HeadlessSEO.tsx`: Obrigatório em todas as páginas.
- `Auth/`: Dialogs e lógica de login JWT.

---
*Detalhes importam. Se não impressionar o usuário, refaça.*
