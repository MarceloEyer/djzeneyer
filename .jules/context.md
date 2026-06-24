# Contexto operacional do Jules — DJ Zen Eyer

Este arquivo existe para orientar o Jules antes de planejar ou abrir PR. Leia em conjunto com `AGENTS.md`, `AI_CONTEXT_INDEX.md` e `.jules/instructions.md`.

## Arquitetura resumida

- Projeto headless WordPress + React/Vite.
- Frontend principal em `src/`, com React 19, TypeScript strict, React Query v5, Tailwind 4 e i18n via `react-i18next`.
- Backend versionado em `plugins/`, com endpoints REST WordPress e integração WooCommerce/GamiPress quando aplicável.
- SEO depende de SSR/prerender, `HeadlessSEO.tsx`, rotas localizadas e schemas JSON-LD corretos.
- A fonte de verdade das rotas é `src/config/routes-slugs.json`.

## Papel esperado do Jules

Jules é executor assíncrono de tarefas específicas e auditorias programadas. Ele deve criar PRs pequenos e revisáveis quando houver pedido humano, issue atribuída, bug demonstrável ou achado relevante de uma rotina proativa.

Jules não deve atuar como reviewer automático de PRs de terceiros. Essa função pertence a CodeRabbit, Codex e revisão humana.

## O que costuma ser bom para Jules

- Corrigir bug pequeno e reproduzível.
- Adicionar ou ajustar teste focado.
- Implementar feature pequena com escopo claro.
- Fazer refactor local quando simplifica o código sem alterar comportamento.
- Melhorar performance quando há hot path comprovado e validação antes/depois.
- Rodar auditorias programadas de performance, segurança, cache, SEO técnico e rotas, abrindo PR somente para achados com evidência objetiva.

## O que costuma gerar ruído

- PR comment-only para trocar palavras como `FIX`, `CRITICAL`, `TODO` ou comentários históricos.
- Micro-otimizações de arrays pequenos, menus pequenos ou objetos estáticos sem profiler.
- PRs de performance PHP que alteram SQL/queries sem fixture, benchmark e revisão humana.
- PRs que trocam APIs WordPress/WooCommerce por SQL direto em `wp_usermeta` ou tabelas internas do WooCommerce para "otimizar" sem preservar hooks, cache, HPOS e contratos REST.
- PRs que espalham micro-cache de `function_exists()`/APCu em varias classes sem hot path medido.
- PRs de presskit/PDF que misturam copy, script e binarios gerados.
- Mudanças em SEO/head/SSR/schema sem validar duplicação de tags, status HTTP e guidelines do Google.
- Abrir múltiplos PRs para a mesma classe de problema.

## Classificação de risco

Baixo risco:
- Docs pedidas explicitamente.
- Ajustes pequenos em scripts de build com validação local.
- Correções pontuais de lint quando não mudam comportamento.

Risco médio:
- Memoização React, lazy loading e alteração de hooks.
- Mudanças em prerender, sitemap, robots ou rotas públicas.
- Refactor em normalizadores PHP sem alteração de contrato.

Risco alto:
- WooCommerce, GamiPress, autenticação, JWT, permissões, checkout, pagamentos.
- SEO/head/SSR/canonical/schema JSON-LD.
- SQL manual, cache priming, query batching e endpoints REST de lista.
- Workflows de deploy, secrets, SSH, ambiente de produção.

Para risco alto, abra PR somente com pedido humano explícito ou auditoria proativa com evidência forte, validação descrita e escopo pequeno.

## Validação mínima por domínio

Frontend:
- `npm run lint`
- teste específico quando existir
- revisar i18n e `safeUrl(url, fallback)`

SEO/SSR:
- `npm run lint`
- validar que há exatamente um `title`, uma `meta description` e um canonical por página prerenderizada
- não emitir schema invisível, falso ou sem conteúdo equivalente na página

PHP/WordPress:
- usar APIs WordPress/WooCommerce antes de SQL direto
- sanitizar entrada e usar prepared statements quando SQL for inevitável
- validar contrato REST e compatibilidade HPOS
- para pedidos WooCommerce, usar `wc_get_orders()` e `$order->get_items()`; SQL em tabelas internas de pedidos exige pedido humano explicito, benchmark e fixture
- para user meta, usar `get_user_meta()`, `update_user_meta()` e `delete_user_meta()`; SQL em `wp_usermeta` nao e aceitavel em PR autonomo

Workflows:
- manter mudanças mínimas
- não tocar secrets
- explicar o impacto operacional no PR

## Higiene de PR

Antes de abrir PR:
- listar PRs abertos e procurar duplicatas
- manter um domínio por PR
- escrever título honesto
- incluir validações executadas
- explicar riscos residuais

Em auditoria proativa, abrir PR apenas quando houver pelo menos uma evidência concreta:
- rota live/local com status errado, soft 404 ou canonical inválido
- query/chamada remota em loop de cardinalidade variável
- cache ausente ou cache incorreto em endpoint público
- falha de sanitização/autorização demonstrável
- métrica, profiler ou custo algorítmico claro em hot path

Se a melhor conclusão for "não vale PR", diga isso no resumo da tarefa.
