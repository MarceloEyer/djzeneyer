# Product Decisions (2026-03-07)

Este documento registra decisoes de produto/UX para evitar regressao em futuras iteracoes.

## 1) Objetivo principal do site
- Prioridade absoluta: levar o usuario da pagina de musica para o Spotify.
- CTA secundario permitido: doacao/suporte (sem competir com o CTA principal).

## 2) Pagina de musica
- Manter visual atual (sem mudancas grandes de layout/estilo).
- Nao reintroduzir player interno.
- Plataformas com papeis claros:
  - Spotify: foco para streaming de autorais, covers e remixes autorizados.
  - SoundCloud: foco para sets e remixes nao-oficiais.
  - YouTube e Apple Music: opcoes validas de apoio (Apple como opcao secundaria).
  - Download: foco principal para DJs.

## 3) Eventos
- Filtro por estado/regiao e valido e desejado.
- Manter pagina de eventos focada em agenda futura.
- Social proof de eventos passados deve viver em area separada da agenda principal.

## 4) About e animacoes
- Reintroduzir/manter animacoes sutis nos blocos de milestones.
- Animacoes devem ser leves, discretas e sem impacto perceptivel em performance.
- Performance continua regra principal (carregamento instantaneo como prioridade).

## 5) Diretriz de performance
- Preferir micro-animacoes de baixo custo.
- Evitar efeitos visuais que aumentem bundle/CPU em rotas principais.
- Respeitar `prefers-reduced-motion` quando houver animacoes.

## 6) O que NAO atualizar no contexto canonico
- Nao ha mudanca de stack, arquitetura, namespaces ou regras de engenharia.
- Portanto, `AI_CONTEXT_INDEX.md`, `AGENTS.md` e skills nao precisam de update nesta data.