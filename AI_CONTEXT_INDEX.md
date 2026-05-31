# 🗺️ Zen Eyer project: AI Context Index & Hierarchy

Este é o **Mapa Mestre** de contexto do repositório. Todos os agentes de IA devem consultar este arquivo para entender a precedência das informações e onde encontrar cada tipo de conhecimento.

## 🏛️ Arquitetura de Camadas (Hierarchy)

A precedência de informação segue esta ordem (do topo para a base):

1. **Código Real** (Verdade absoluta em tempo de execução)
2. **Este arquivo (`AI_CONTEXT_INDEX.md`)** (Mapa mestre)
3. **`.agents/GUIDELINES.md`** (Leis técnicas e de comportamento)
4. **`.context/IDENTITY.md`** (Autoridade de marca e branding)
5. **`.context/*.md`** (Conhecimento técnico de domínio)
6. **`LEARNINGS.md`** (Memória operacional e anti-erros)
7. **`.human/TASK_LIST.md`** (Backlog e solicitações humanas)

---

## 📂 Diretórios de Contexto

### 1. `.context/` (Conhecimento Técnico e de Marca)

- **`IDENTITY.md`**: SSOT para Branding, Nomes, Alias e Pronúncia.
- **`PRONUNCIATION.md`**: SSOT específico para pronúncia, voz, desambiguação fonética e limites de uso de erros como `Zen Ayer`.
- **`ARCHITECTURE.md`**: Visão geral do sistema (React + WordPress Headless + SSG + AI discovery).
- **`API.md`**: Mapa curado das rotas REST mais relevantes para agentes e contribuidores.
- **`PROJECT.md`**: Metas de negócio, visão geral e fronteiras de responsabilidade do projeto.
- **`OPERATIONS.md`**: Memória operacional compartilhada entre agentes: cache/deploy, IndexNow, validação local, revisores de IA, PRs e armadilhas de ambiente.
- **`SITE_RESOURCES.md`**: Mapa de capacidades do site: páginas, recursos públicos, AI discovery, plugins, scripts, contexto e limites de exposição.
- **`IMPLEMENTATION_STATUS.md`**: Mapa operacional de recursos recentes implementados e TODOs derivados de PRs recentes. Não é SSOT permanente; deve ser revisado e podado.
- **`SITE_PAGES_STRATEGY.md`**: SSOT estratégico para função, linguagem, marketing, SEO/GEO/IA e relação entre páginas públicas.
- **`I18N_CONTENT_ARCHITECTURE.md`**: Regras para separar namespaces de tradução, manter releases no WordPress/Polylang e evoluir metadados/schema via plugin.

### 2. `.agents/` (Instruções para IAs)

- **`GUIDELINES.md`**: **OBRIGATÓRIO.** Leis técnicas inegociáveis.
- **`personas/`**: Perfis específicos para Claude, Gemini e Jules.
- **`skills/`**: Habilidades especializadas por domínio.

### 3. `.human/` (Interface Humana)

- **`TASK_LIST.md`**: Backlog de tarefas que exigem intervenção humana.
- **`MARKETING_OVERVIEW.md`**: Estratégia de SEO, Voz e Branding.
- **Auditorias e handoffs**: Arquivos datados para decisões humanas, histórico e trilhas off-repo.

### 4. Memória e Histórico

- **`LEARNINGS.md`**: Log de erros cometidos e lições para não repetir.
- **`docs/archive/`**: Documentação legada (apenas para referência histórica).

---

## 🚦 Regras de Ouro para Agentes

- **Não Invente:** Se a informação de branding não estiver em `.context/IDENTITY.md`, pergunte.
- **SafeUrl:** Sempre use fallback explícito: `safeUrl(url, '/fallback.svg')` para imagens, `safeUrl(url, '/')` para links. Nunca `safeUrl(url) || fallback`.
- **GamiPress:** Use `array_values()` antes de acessar `[0]` em arrays de tipos de pontos/ranks.
- **artistData keys:** `social.YouTube` e `social.YouTubeMusic` usam Y e T maiúsculos. Variantes lowercase não existem no objeto.
- **ESLint ignores:** `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules` e `.devcontainer` devem permanecer no array `ignores` de `eslint.config.js`.
- **Sincronia:** Atualize `LEARNINGS.md` quando resolver bug complexo, bug arquitetural ou decisão operacional que previna erro futuro.
- **i18n:** Toda string visível na UI deve usar `t('chave')`. Adicionar em EN e PT simultaneamente.
- **MusicEvent:** `eventStatus`, `endDate`, `location.address`, `description`, `image`, `offers` e `performer` são campos obrigatórios (ver `AGENTS.md`).
- **Páginas públicas:** Antes de alterar navegação, copy, SEO/GEO, schema ou propósito de página, consulte `.context/SITE_PAGES_STRATEGY.md`.
- **Recursos do site:** Antes de adicionar/remover pagina, recurso `.well-known`, script de discovery, plugin, endpoint ou asset machine-readable, consulte `.context/SITE_RESOURCES.md`.
- **Status/TODO:** Para entender recursos recentes e pendências operacionais derivadas de PRs, consulte `.context/IMPLEMENTATION_STATUS.md`, mas valide sempre contra o código real.
- **Memória operacional:** Decisões descobertas em ferramentas locais de agentes devem ser promovidas para `.context/OPERATIONS.md`, `.agents/GUIDELINES.md` ou `LEARNINGS.md`; não deixar conhecimento essencial preso ao Claude/Codex/Antigravity.
- **Política pública de IA:** Conteúdo público do site é deliberadamente disponibilizado para busca, grounding, discovery, indexação e treinamento por IA. Não alterar `Content-Signal: ai-train=yes`, `search=yes`, `ai-input=yes`, `llms.txt`, `llms-full.txt`, `.well-known/*` ou schema para restringir IA sem pedido explícito do usuário.

---

*Assinado: Orquestrador de Contexto (Zen Eyer)*
