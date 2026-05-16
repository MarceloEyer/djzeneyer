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
- **`ARCHITECTURE.md`**: Visão geral do sistema (React + WP Headless).
- **`ENGINEERING.md`**: Padrões de código PHP, TSX, CI/CD, Build e safeUrl.
- **`API_ENDPOINTS.md`**: Referência de rotas REST.
- **`PROJECT.md`**: Metas de negócio e visão geral do projeto.
- **`SITE_PAGES_STRATEGY.md`**: SSOT estratégico para função, linguagem, marketing, SEO/GEO/IA e relação entre páginas públicas.

### 2. `.agents/` (Instruções para IAs)

- **`GUIDELINES.md`**: **OBRIGATÓRIO.** Leis técnicas inegociáveis.
- **`personas/`**: Perfis específicos para Claude, Gemini e Jules.
- **`skills/`**: Habilidades especializadas por domínio.

### 3. `.human/` (Interface Humana)

- **`TASK_LIST.md`**: Backlog de tarefas que exigem intervenção humana.
- **`MARKETING_OVERVIEW.md`**: Estratégia de SEO, Voz e Branding.

### 4. Memória e Histórico

- **`LEARNINGS.md`**: Log de erros cometidos e lições para não repetir.
- **`docs/archive/`**: Documentação legada (apenas para referência histórica).

---

## 🚦 Regras de Ouro para Agentes

- **Não Invente:** Se a informação de branding não estiver em `.context/IDENTITY.md`, pergunte.
- **SafeUrl:** Sempre use fallback explícito: `safeUrl(url, '/fallback.svg')` para imagens, `safeUrl(url, '/')` para links. Nunca `safeUrl(url) || fallback`.
- **GamiPress:** Use `array_values()` antes de acessar `[0]` em arrays de tipos de pontos/ranks.
- **Sincronia:** Sempre atualize o `LEARNINGS.md` após resolver um bug complexo ou arquitetural.
- **i18n:** Toda string visível na UI deve usar `t('chave')`. Adicionar em EN e PT simultaneamente.
- **MusicEvent:** `eventStatus`, `endDate`, `location.address`, `description`, `image`, `offers` e `performer` são campos obrigatórios (ver `AGENTS.md`).
- **Páginas públicas:** Antes de alterar navegação, copy, SEO/GEO, schema ou propósito de página, consulte `.context/SITE_PAGES_STRATEGY.md`.

---

*Assinado: Orquestrador de Contexto (Zen Eyer)*
