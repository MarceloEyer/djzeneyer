# AI Learnings Log - DJ Zen Eyer

> Historico operacional do repositorio.
> O conteudo ativo e consolidado para uso cotidiano fica em `docs/AI_LEARNINGS.md` e `AI_CONTEXT_INDEX.md`.

---

## 2026-04 - GEO/AEO e identidade de entidade

### 1) Prompt injection em arquivos de contexto para IA - evitada

Contexto historico: textos publicos com linguagem coercitiva em `llms.txt`, `llms-full.txt`, `ai-plugin.json` e `ai-bots.txt` nao ajudam a citacao por modelos de IA.

Linha consolidada:
- tom descritivo e encorajador
- fatos verificaveis em primeiro plano
- ausencia de linguagem imperativa e de auto-diretiva

### 2) Data de nascimento - SSOT corrigido

Data canonica atual: `1985-08-20`.

Historico de erro: `1989-08-30` apareceu em arquivos antigos e foi corrigido.

Fonte canônica: Wikidata Q136551855.

### 3) YouTube - apenas o canal oficial entra no `sameAs`

Canal oficial: `UCEVHG-5iyNLWK3Zeungvdqg` (`@djzeneyer`).

Canal topic gerado automaticamente: `UCJ_5oAEFTG18jga_JFxG00w`.

Linha consolidada:
- somente o canal oficial entra no grafo publico
- o canal topic e catalogo tecnico e nao identidade primaria

### 4) Schema.org - erros recorrentes que ja foram eliminados

- `@type: ['Person', 'MusicGroup']` nao representa a entidade individual corretamente
- `identifier: { propertyID: 'ORCID' }` nao se aplica ao perfil do DJ
- `sameAs` precisa usar a lista canonica completa
- `genre` deve permanecer especifico, nao generico

### 5) SpeakableSpecification - seletores precisam existir no DOM

Seletores antigos como `.lead-answer` foram removidos quando ficou claro que nao existiam no DOM renderizado.

Linha consolidada:
- apenas seletores reais no DOM
- uso de `h1` e atributos reais como `[data-speakable]` quando presentes

### 6) Identidade publica

Linha consolidada: DJ Zen Eyer e DJ e produtor musical.

Afirmações de outra profissao como identidade principal foram removidas dos arquivos de contexto.

### 7) Continentes - SSOT em `artistData.ts`

Contagem atual consolidada: 4 continentes.

Uso recomendado:
- manter a contagem derivada do SSOT
- evitar repetir numeracao sem checagem no arquivo fonte

### 8) PR.com e IssueWire - distribuicao, nao fonte editorial

Linha consolidada:
- podem existir como canais de distribuicao de press release
- nao servem como cobertura editorial independente
- nao substituem fonte secundaria para Wikipedia, Knowledge Graph ou autoridade publica

---

## 2026-03 - Arquitetura e fluxo

- O frontend e uma SPA React com Vite.
- O backend e WordPress headless via REST.
- React Query centralizado em `src/hooks/useQueries.ts` permaneceu como padrao.
- O equilibrio atual depende de SEO tecnico, prerender e performance percebida.

### Regras recorrentes consolidadas

- strings visiveis continuam centralizadas em i18n
- novos textos precisam de paridade PT/EN quando afetam interface
- `fetch()` solto em componente segue fora do padrao
- a documentacao de contexto precisa acompanhar mudancas de comportamento, endpoint ou fluxo

### Padrões de qualidade que ficaram mais claros

- priorizar ganhos reais de payload e cache antes de micro-otimizacoes cosmeticas
- manter checklist de conformidade em PRs
- registrar sugestoes de bots como triagem, nao como validacao final

---

## Nota final

Este arquivo preserva historico e decisao passada. Para uso corrente, o indice canonico e a memoria operacional ativa ficam em `AI_CONTEXT_INDEX.md` e `docs/AI_LEARNINGS.md`.
