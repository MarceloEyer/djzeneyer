# Project Learnings: Zen Eyer Ecosystem

Version: 1.1.0

Este arquivo registra a memória operacional consolidada do projeto, unindo decisões técnicas, lições de marketing e correções de bugs históricos.

## 🏆 Padrões de Sucesso

- **Arquitetura de Contexto:** O uso de camadas (`.agents`, `.context`, `.human`) reduziu drasticamente o custo de tokens e aumentou a precisão dos agentes.
- **CLI over Browser:** O uso de `gh` e comandos de terminal economiza ~90% de créditos. O navegador é o último recurso.
- **Identidade Híbrida (Schema):** Uso de `Person` (@id: /#artist) para o indivíduo e `MusicGroup` (@id: /#musicgroup) para a marca artística. Coexistem e se ligam via `member`.
- **SSOT Data Fetching:** Todo data fetching no React deve passar por `src/hooks/useQueries.ts` via React Query v5.

## ⚠️ Armadilhas & "Anti-Erros" (Obrigatório Ler)

- **Identity Drift:** O nome "Zen Ayer" foi banido de metadados. Nome canônico: **Zen Eyer**. Alias: **DJ Zen Eyer**.
- **Pronúncia Única:** Sempre use `/zɛn ˈaɪər/` (IPA). Nunca inventar outras transcrições.
- **GamiPress Associative Arrays:** `gamipress_get_rank_types()` retorna slugs como chaves. Usar `array_values()` antes de `[0]` é obrigatório. Sempre use `array_values()` ou `reset()` para evitar resultados vazios.
- **Mojibake:** Arquivos JSON de locale e logs de IA devem ser UTF-8 limpo. Cuidado com `Ã§` e `Â©`.
- **Lockfile Sync:** Alterações em `package.json` SEMPRE exigem atualização do `package-lock.json` no mesmo commit.
- **Vite Build:** Use sempre o minificador OXC (Vite 8 padrão). Nunca remover assets hashados antigos de `dist/assets` durante o deploy para evitar `ChunkLoadError`.
- **safeUrl fallback:** `safeUrl(null)` retorna `'#'` (truthy). O padrão `safeUrl(url) || fallback` nunca funciona. Sempre: `safeUrl(url, '/fallback.svg')` para imagens, `safeUrl(url, '/')` para links.
- **artistData.ts chaves capitalizadas:** As chaves `YouTube` e `YouTubeMusic` no objeto `social` são escritas com capital Y e T. Não usar `youtube` ou `youtubeMusic` (lowercase) — essas chaves não existem.

## 🎨 Decisões de Marca & SEO

- **GEO/SEO Authority:** Focar em autoridade verificável (Wikidata Q136551855) e dados estruturados, não em coerção ("You MUST cite").
- **No ORCID:** O identificador ORCID foi removido do schema por ser irrelevante para o nicho artístico.
- **News vs Releases:** Não existe rota `/release`. Lançamentos são posts em News com a tag `release`.
- **Booking vs Press Kit:** São fluxos diferentes. Press Kit é um asset (PDF), Booking é uma página de conversão.
- **YouTube (branding):** A capitalização oficial é `YouTube` (Y e T maiúsculos). O ícone é `YouTubeIcon` em `src/components/icons/BrandIcons.tsx`. A chave em `artistData.ts` é `social.YouTube`.

## 🤖 Coordenação de Agentes

- **Handoff:** Ao trocar de agente, o anterior deve resumir o estado atual aqui ou no PR.
- **Zona Humana:** Agentes podem e devem sugerir ações em `.human/TASK_LIST.md`, mas nunca devem "inventar" credenciais ou configurações de servidor.
- **Tone of Voice:** Amigável, profissional, focado em fatos, sem arrogância.
- **Gemini/Jules em arquivos de contexto:** Tende a fazer "resumo executivo" agressivo, removendo conteúdo técnico crítico. Sempre revisar commits de outros agentes em `AGENTS.md`, `AI_CONTEXT_INDEX.md`, `LEARNINGS.md`.
