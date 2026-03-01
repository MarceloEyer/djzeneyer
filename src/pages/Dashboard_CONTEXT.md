# Dashboard Context - DashboardPage.tsx

> **Responsibility:** User Gamification & Achievement Display.

## Rules
1. **Body Principle:** O `DashboardPage.tsx` nada resolve. Ele apenas pergunta ao plugin `zengame` (Cérebro).
2. **No Business Logic:** Nunca calcule porcentagens ou filtre conquistas ativas. Se o dado não veio pronto da API, a correção deve ser feita no **Plugin ZenGame**, não aqui.
3. **Power Bar Principle (MMORPG Style):** Barras de progresso devem evocar a sensação de um "Mana Bar" ou "Power Bar" de MMORPG.
   - **Cores:** Usar obrigatoriamente `primary` (#0D96FF) como cor base.
   - **Efeitos:** Incluir um "flare" animado (brilho que corre a barra) e uma ponta branca brilhante (Electric Tip).
   - **Forma:** Formato de cápsula (rounded-full).
4. **Visual Excellence:** Como o "Corpo" do site, o Dashboard deve ser o ponto alto da estética, com animações suaves via Framer Motion e micro-interações premiuim.

## UI/UX Goals
- Efeito visual de "Premium" em conquistas desbloqueadas.
- Feedback imediato de progresso (micro-animações).

---
*GamiPress é complexo. Deixe o WordPress ser o juiz, o React é apenas o palco.*
