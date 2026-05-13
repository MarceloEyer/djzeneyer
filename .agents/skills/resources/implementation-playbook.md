# Implementation Playbook — DJ Zen Eyer

Este documento serve como o guia mestre para implementações recorrentes no projeto, garantindo consistência técnica e de arquitetura.

## 🚀 Fluxos de Implementação

### 1. Novas Funcionalidades (Feature Flow)
- **Análise:** Consultar `AI_CONTEXT_INDEX.md` e `LEARNINGS.md`.
- **Schema:** Definir Zod schemas em `src/schemas/`.
- **Hooks:** Criar/atualizar hooks em `src/hooks/useQueries.ts`.
- **UI:** Implementar componentes TSX usando i18n (`t('chave')`).
- **SEO:** Injetar `<HeadlessSEO />` com metadados corretos.

### 2. Segurança e Autenticação
- Seguir os padrões do plugin `zeneyer-auth`.
- Usar `safeUrl(url, fallback)` em todas as saídas de URL.
- Proteger rotas com `loadingInitial` do `UserContext`.

### 3. Gamificação (GamiPress)
- Acesso a arrays associativos sempre via `array_values()` ou `reset()`.
- Respeitar os nomes de ranks e tipos de pontos definidos no backend.

---
*Assinado: Orquestrador de Contexto (Zen Eyer)*
