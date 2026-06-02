# Web backlog — SEO, AEO, Knowledge Graph, performance e mobile

Este arquivo consolida o plano de melhorias sugeridas para o site djzeneyer.com em um único PR.

## Tarefas agrupadas neste PR

| ID | Área | Resumo |
|---|---|---|
| PR01 | SEO/AEO | Ajustar títulos, meta descriptions e H1/H2 das páginas principais (Home, Música, Eventos, Sobre, Contato). |
| PR02 | AEO/FAQ | Criar seção de FAQ e JSON-LD FAQPage com perguntas frequentes sobre o DJ Zen Eyer. |
| PR03 | Knowledge Graph | Adicionar JSON-LD Person com sameAs para perfis oficiais. |
| PR04 | Knowledge Graph | Adicionar JSON-LD Event na agenda de eventos. |
| PR05 | Knowledge Graph | Adicionar JSON-LD MusicRecording/MusicAlbum nas páginas de músicas/releases. |
| PR06 | GEO | Reforçar GEO no conteúdo e schema (Brasil, São Paulo, atuação internacional). |
| PR07 | Performance frontend | Aplicar lazy loading / code splitting em EventsPage e MusicPage. |
| PR08 | Imagens | Padronizar imagens em WebP/AVIF + lazy loading fora do viewport inicial. |
| PR09 | WordPress/Plugins | Auditar plugins ativos e documentar o conjunto mínimo recomendado para headless. |
| PR10 | APIs e cache | Enxugar payload de endpoints REST e aplicar cache seguro onde fizer sentido. |
| PR11 | UX mobile | Revisar navegação mobile, tamanhos de toque e scroll/paginação de listas longas. |
| PR12 | CI/perf | Garantir que build:full e checks de perf/SEO/i18n rodem em CI com budgets claros. |

Este PR tem caráter estrutural/operacional. Ele não muda a identidade do artista nem o posicionamento do projeto; apenas fortalece SEO, AEO, Knowledge Graph, performance e experiência mobile.
