# Estratégia de Schema para Vídeos (VideoObject)

Para otimização avançada de SEO (AEO - Answer Engine Optimization) e para dominar o Painel de Conhecimento do Google (Knowledge Panel), os dados estruturados de vídeo (`VideoObject`) devem ser utilizados de forma estratégica.

## O Risco do Schema Falso ou Invisível
A regra primária do Google para Structured Data é: **O schema deve representar de forma fidedigna o conteúdo visual que o usuário consome na página.**
- Inserir schemas de vídeo ocultos ou "placeholders" pode resultar em **Manual Action** (penalidade severa onde o site é removido dos rich snippets ou dos resultados de busca).
- Nunca injete um `VideoObject` sem que o vídeo correspondente esteja diretamente embutido (iframe/player) e plenamente visível no HTML.

## A Estratégia de Dois Níveis para o DJ Zen Eyer

A escolha de qual vídeo representar com schema depende do objetivo específico da página: Prova Social ou Consolidação de Entidade.

### 1. Nível 1: Prova Social & Autoridade no Nicho (MediaPage)
Vídeos virais ou de canais parceiros que documentam sua autoridade.
- **Candidato Atual:** `TcdCdpTzz-M` (ex: 337k views, canal de nicho, cita "Dj Zen Eyer Remix").
- **Objetivo:** Mostrar ao Google e aos usuários que o seu trabalho tem vasta tração e é validado por terceiros.
- **Como usar:** Este vídeo deve estar visível na página `MediaPage` em uma seção como "Featured Zouk Remixes" e seu `VideoObject` correspondente deve estar configurado no SEO da página apontando os devidos créditos e a `embedUrl`.

### 2. Nível 2: Consolidação da Entidade e Canal Oficial (Home / Video Principal)
Para dominar de vez o Knowledge Panel como a entidade "DJ Zen Eyer", você precisa de um vídeo canônico no seu próprio canal.
- **Candidato Futuro:** Um vídeo oficial e de altíssima qualidade postado no seu canal do YouTube (`@djzeneyer`).
- **Título SEO Ideal:** `Mercy - Shawn Mendes | Brazilian Zouk Remix by DJ Zen Eyer`
- **Por que é superior?** O Google cruza as entidades. Um vídeo com `VideoObject` na sua página oficial, servido através do seu canal do YouTube oficial, com o título exato contendo seu nome de artista, sela a conexão semântica perfeita. O Google ganha confiança extrema de que *você é você*.
- **Como usar:** Quando este vídeo existir, ele substituirá (ou se juntará) ao vídeo atual, devendo ser incorporado na Home ou na página de Biografia, com um schema `VideoObject` robusto (contendo `duration`, `uploadDate`, `contentUrl`, etc).

## Conclusão de Ação Humana
- **Para Agora:** Mantenha o vídeo de terceiros (`TcdCdpTzz-M`) na MediaPage com o schema atrelado, certificando-se de que ele esteja visível e reproduzível na tela do usuário.
- **Para o Futuro:** Grave, suba e incorpore um vídeo "Assinatura" no seu próprio canal para ancorar definitivamente a sua entidade no Knowledge Graph do Google.
