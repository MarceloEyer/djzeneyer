# GEMINI.md - DJ Zen Eyer

> Contexto para Gemini/Jules/Gemini Code Assist.
> Idioma padrao: Portugues Brasileiro.

## Precedencia

- Em caso de divergencia com outro arquivo, siga `AI_CONTEXT_INDEX.md`.
- Fonte final sempre e o codigo do repositorio.

## Baseline Tecnico

- WordPress Headless (REST) + React SPA
- React 18 + TypeScript + Vite 7 + Tailwind 3 + React Query v5 + React Router 7 + i18next
- WordPress 6.0+, PHP 8.1+, Node 20+

## Regras Obrigatorias

1. i18n para toda string visivel
2. Hooks React Query centralizados em `src/hooks/useQueries.ts`
3. Nao usar `fetch()` direto em componentes
4. Lazy loading para paginas
5. `<HeadlessSEO />` por pagina
6. Backend filtra; frontend renderiza
7. Nao migrar ESLint para v10
8. Nao usar segredos no git
9. **Resiliência de Dados**: Sempre validar se campos "Featured" do WordPress retornam Objeto ou Array (harden para ambos).
10. **Tipagem useQueries**: Interfaces no `useQueries.ts` são o Contrato Único (SSOT). Proibido inventar campos em componentes sem atualizar o Contrato.
11. **Atributos React**: Usar `camelCase` (ex: `fetchPriority`). Atributos `lowercase` da DOM quebram a tipagem e o Prerender.
12. **Zero Debt**: Proibido merge com warnings de TypeScript ou imports não utilizados em páginas principais.
13. **Segurança de Build**: Build local (`npm run build`) obrigatório antes de push (evita travamento de Prerender).
14. **Integridade i18n**: Arquivos i18n (`translation.json`) DEVEM ser salvos em UTF-8 (Strict).

## Namespaces Canonicos

- `djzeneyer/v1`
- `zeneyer-auth/v1`
- `zen-bit/v2`
- `zengame/v1`
- `zen-seo/v1`

## Preferencias do projeto

- Gradientes sutis/neon permitidos (sem gradientes em texto)
- Sem player de musica interno (apenas links externos)
- Solucoes simples e robustas
- Tom de voz: Conversa próxima, humilde e generosa ("Amigo Zen")
- Prioridade Máxima: Velocidade de carregamento e facilidade de audição (links diretos pro Spotify)
- Filtro de Estados: Facilitar para fãs locais encontrarem eventos
