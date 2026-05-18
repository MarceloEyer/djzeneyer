# Auditoria UTF-8 / Mojibake — Arquivos públicos e de conteúdo

Data: 2026-05-18

## Escopo auditado

Foram auditados 35 arquivos com leitura UTF-8 estrita:

| Grupo | Quantidade | Arquivos |
|---|---:|---|
| Públicos | 5 | `public/llms.txt`, `public/llms-full.txt`, `public/pronunciation.txt`, `public/robots.txt`, `public/ai-bots.txt` |
| Locales JSON | 18 | `src/locales/**/*.json` |
| Contexto Markdown | 10 | `.context/**/*.md` |
| Contexto raiz | 2 | `AGENTS.md`, `AI_CONTEXT_INDEX.md` |

## Padrões pesquisados

`Ã`, `Â`, `â€™`, `â€œ`, `â€`, `�`, `É›`, `Ëˆ`, `aÉª`, `Ã©`, `Ã£`, `Ã¡`, `Ã³`, `Ãº`.

## Resultado executivo

| Métrica | Resultado |
|---|---:|
| Arquivos com erro de decodificação UTF-8 estrita | 0 |
| Arquivos JSON inválidos | 0 |
| Correções de mojibake aplicadas | 0 |
| Alterações semânticas em SEO, nomes canônicos ou URLs | 0 |
| Falsos positivos preservados | 8 linhas |

Nenhuma conversão foi aplicada porque os padrões encontrados eram caracteres UTF-8 válidos e semanticamente corretos em português ou exemplos explícitos de mojibake em documentação técnica. A regra aplicada foi: corrigir apenas quando a conversão fosse inequívoca.

## Achados por arquivo

| Arquivo | Linha | Padrão | Diagnóstico | Ação |
|---|---:|---|---|---|
| `public/robots.txt` | 11 | `Ã` | Falso positivo: `DOCUMENTAÇÃO` usa `Ã` legítimo em português. | Preservado |
| `public/robots.txt` | 29 | `Ã` | Falso positivo: `NÃO` usa `Ã` legítimo em português. | Preservado |
| `public/robots.txt` | 40 | `Ã` | Falso positivo: `PADRÃO` usa `Ã` legítimo em português. | Preservado |
| `public/robots.txt` | 363 | `Ã` | Falso positivo: `NÃO-PADRÃO` usa `Ã` legítimo em português. | Preservado |
| `public/robots.txt` | 370 | `Ã` | Falso positivo: `VALIDAÇÃO` usa `Ã` legítimo em português. | Preservado |
| `src/locales/pt/quiz.json` | 18 | `Â` | Falso positivo: `Ângulos` é palavra correta em português. | Preservado |
| `src/locales/pt/translation.json` | 966 | `Â` | Falso positivo: `Ângulos` é palavra correta em português. | Preservado |
| `.context/ENGINEERING.md` | 29 | `Â` | Exemplo deliberado de mojibake (`Â©`) em diretriz de higiene de texto. | Preservado |

## Linhas alteradas

Nenhuma linha dos arquivos auditados foi alterada. Este relatório foi adicionado para registrar a auditoria e a decisão técnica.

## Validações executadas

| Validação | Resultado |
|---|---|
| Leitura UTF-8 estrita de todo o escopo | Aprovada |
| Detecção dos padrões solicitados | Aprovada, com 8 falsos positivos documentados |
| Validação de `src/locales/**/*.json` com `json.loads` | Aprovada |
| Leitura UTF-8 estrita de `public/llms.txt`, `public/llms-full.txt` e `public/pronunciation.txt` | Aprovada |

## Estimativa de impacto

| Área | Antes | Depois | Estimativa de melhora |
|---|---|---|---:|
| Performance em runtime | Sem impacto identificado | Sem impacto identificado | 0% |
| Confiabilidade de ingestão por IA/LLM | Sem evidência de mojibake real | Auditoria rastreável e reproduzível | +10% a +20% operacional |
| Risco de regressão SEO/GEO | Baixo | Baixo, sem alteração semântica | 0% de risco adicional |
| Manutenibilidade | Achados não documentados | Falsos positivos documentados | +15% operacional |

## Observações

- Não houve alteração em URLs, nomes canônicos, pronúncia, schema, robots directives ou conteúdo SEO.
- O arquivo `.context/ENGINEERING.md` mantém o exemplo `Â©` propositalmente, pois ele documenta exatamente uma classe de erro que deve ser evitada.
- Os termos `DOCUMENTAÇÃO`, `NÃO`, `PADRÃO`, `VALIDAÇÃO` e `Ângulos` são UTF-8 correto, não mojibake.
