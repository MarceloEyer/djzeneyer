# Engineering Standards & AI Directives
Version: 1.1.0

Este documento define os princípios de desenvolvimento e as restrições operacionais para agentes e humanos.

## 🏛️ Princípios de Design
- **KISS (Keep It Simple, Stupid):** Soluções simples primeiro. Evite overengineering que cause erros 429.
- **DRY (Don't Repeat Yourself):** Centralize lógica de tradução e formatação.
- **YAGNI (You Aren't Gonna Need It):** Não implemente o que não foi pedido para "o futuro".
- **SSOT (Single Source of Truth):**
    - Identidade: `.context/IDENTITY.md` + `src/data/artistData.ts`.
    - Rotas: `src/config/routes-slugs.json`.

---

## 🤖 Diretrizes para Agentes (Obrigatórias)
- **Economia de Créditos:** Priorizar **SEMPRE** ferramentas internas e CLI (`gh`, `npm`, `git`, `grep`). O navegador é o último recurso e exige justificativa.
- **Sem Suposições:** Em caso de dúvida sobre copy, design ou arquitetura, **pergunte** ao usuário.
- **Handoff:** Ao terminar uma tarefa, atualize o `LEARNINGS.md` com o que funcionou e o que falhou para o próximo agente.

---

## 🛠️ Qualidade de Código
- **i18n:** Nunca usar strings hardcoded. Toda UI deve usar `t('chave')`.
- **Higiene de Texto:** Zero Mojibake (ex: `Â©`). Salvar sempre em UTF-8 limpo.
- **Lint & Build:** O código deve passar em `npm run lint` e `npm run build` (com prerender) antes de qualquer push.
- **Hooks:** Dependências de `useMemo` e `useCallback` devem estar completas.

---

## 🌐 WordPress & PHP
- **HPOS:** Nunca usar SQL direto em `wp_posts` para pedidos; usar `wc_get_orders()`.
- **GamiPress:** Arrays associativos exigem `array_keys()` ou `reset()`.
- **Segurança:** SQL sempre preparado e inputs sanitizados.

---

## 📦 Fluxo de Trabalho (Workflow)
- **PR-First:** Jamais dar push direto na `main`.
- **Atomicidade:** Um domínio por PR (Frontend OU PHP).
- **Lockfile:** Alterações em `package.json` exigem atualização do `package-lock.json`.
