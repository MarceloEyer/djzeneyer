# Session Handoff - 2026-05-16

Este handoff registra as decisoes e proximos passos para continuar sem depender de memoria da conversa.

## PRs resolvidos nesta rodada

- #507 AEO Lead Answers: mergeado.
- #509 Sitemap/API normalization: mergeado.
- #510 Site Pages Strategy: mergeado.
- #505 Zouk Encyclopedia: mergeado.
- #511 Encyclopedia i18n namespace: mergeado.
- #512 Heavy i18n namespaces: mergeado.
- #513 Music release schema metadata: mergeado.
- #514 Session handoff and next steps: mergeado.
- #515 HeadlessSEO DEFAULT_SPEAKABLE cleanup: mergeado, reaproveitando a parte boa de #504 em branch limpa.
- #494 Zen BIT canonical event slugs: mergeado depois de rebase em `main`, ready for review e checks/bots verdes.
- #506 AI Authority Context: fechado como superseded. Ideia boa reaproveitada de forma mais limpa em #505, #510, #511 e #513.
- #504 DEFAULT_SPEAKABLE original: fechado como superseded por #515.

## PRs ainda abertos

- Nenhum PR aberto apos esta rodada.

## Decisoes consolidadas

- Pagina principal esta boa; evitar mudancas desnecessarias.
- Publicamente, `News` deve ser chamado de `Releases`.
- Releases sao posts do WordPress traduzidos por Polylang. Conteudo editorial de releases nao vai para arquivos de traducao do frontend.
- Categorias de releases devem ser criadas no WordPress. Minimo inicial: Music Releases e Event Releases.
- `zen-seo-lite` deve enriquecer releases com metadados/schema. Nao criar plugin separado agora.
- Music release metadata deve cobrir Spotify, Apple Music, YouTube, SoundCloud, MusicBrainz, ISRC opcional, release date, primary artist, contributors e release type.
- Zouk Encyclopedia comeca estatica, pequena, em pagina unica, com tom "Zen Eyer explica" mas neutralidade enciclopedica.
- Autoridade da Encyclopedia deve ser geral da pagina/site, nao autopromocao em cada verbete.
- FAQ fica mais pessoal sobre Zen Eyer; verbetes amplos de zouk pertencem a Encyclopedia.
- Artistic Philosophy sai do Discover More e deve ser absorvida entre About/FAQ. Rota antiga pode cair no About.
- Zen Tribe deve preservar layout, badges, cards, cores e grafico. Mudancas futuras devem ser principalmente de copy.
- Zen Tribe deve enfatizar comunidade e pertencimento, nao apenas beneficios. Free entry primeiro; tier simbolico barato pode existir como apoio; pontos/beneficios ficam para tiers maiores.

## Protecoes de arquitetura/contexto ja adicionadas

- `.context/SITE_PAGES_STRATEGY.md`: funcao de cada pagina, Releases, Encyclopedia, Zen Tribe, plugins e proximos passos.
- `.context/I18N_CONTENT_ARCHITECTURE.md`: regras de tamanho de namespaces, o que sai de `translation.json`, e fonte de verdade de Releases no WordPress/Polylang.
- `.agents/skills/wp-plugin-development/SKILL.md`: instrucao especifica para releases em WordPress/Polylang e evolucao preferencial do `zen-seo-lite`.
- `LEARNINGS.md`: anti-erro sobre Releases e release schema.
- `AI_CONTEXT_INDEX.md`: aponta para `SITE_PAGES_STRATEGY.md` e `I18N_CONTENT_ARCHITECTURE.md`.

## Proximos passos recomendados

1. Validar o merge de #494 no servidor:
   - `php -l` nos arquivos alterados do `zen-bit`.
   - Ativar plugin sem fatal error.
   - Testar URLs canonicas de eventos.
   - Testar endpoint/schema com slug canonico e ID numerico legado.
2. Testar #513 no WordPress:
   - Criar/editar um post release de musica.
   - Preencher `release_type`, links oficiais, ISRC e MusicBrainz.
   - Confirmar `zen_seo.music_release` no REST.
   - Confirmar `BlogPosting` + `MusicRecording` ou `MusicAlbum` no schema.
3. Criar categorias no WordPress:
   - Music Releases.
   - Event Releases.
4. Avaliar frontend de Releases:
   - Decidir se music releases e event releases precisam de templates visuais distintos.
   - Usar metadados REST antes de criar qualquer estrutura nova.
5. Zen Tribe:
   - Reescrever copy com base em comunidade/movimento/pertencimento.
   - Preservar layout existente.
   - Testar textos para caber nos cards atuais.
6. Encyclopedia:
   - Expandir termos aos poucos.
   - Manter tom neutro e verificavel.
   - Evitar frases coercivas para IA.

## Validacoes executadas nesta rodada

- `npm run type-check`.
- `npm run lint`.
- `npm run build`.
- Browser smoke tests nas paginas afetadas por i18n.
- Checks GitHub verdes nos PRs mergeados #511, #512, #513, #514, #515 e #494.
- #494 tambem passou por `git diff --check`, `npm run type-check`, `npm run lint`, CodeQL, CodeRabbit e Snyk antes do merge.

## Limitacoes

- PHP nao esta disponivel no PATH local deste ambiente. Validacoes PHP precisam ser feitas no servidor, CI adequado ou ambiente local com PHP/WP-CLI.
