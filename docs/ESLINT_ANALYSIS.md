# Análise Técnica: ESLint 9 vs ESLint 10

## Contexto
O projeto **DJ Zen Eyer** optou por manter a versão **9.39.2** do ESLint, apesar da disponibilidade da v10. Esta decisão foi tomada para garantir a integridade das validações de código React.

## O Problema de Compatibilidade
Atualmente (Q1 2026), dois plugins fundamentais para o desenvolvimento React não oferecem suporte estável ao ESLint 10:

1.  **eslint-plugin-react-hooks (v5.2.0)**: Responsável por validar as regras de hooks (`useEffect`, `useState`). Sem ele, erros de dependências de hooks passam desapercebidos.
2.  **eslint-plugin-react (v7.37.5)**: Valida sintaxe JSX, acessibilidade e boas práticas de componentes.

## Avaliação de Vulnerabilidades
Embora scanners de segurança apontem vulnerabilidades (ajv ReDoS e esbuild XSS) no ESLint 9:
- São vulnerabilidades que afetam apenas o ambiente de **desenvolvimento/build**.
- O risco real é baixíssimo, pois exigiria arquivos de configuração malformados ou ataques locais ao dev server.
- **Nenhum destes riscos atinge o código que vai para produção.**

## Decisão Técnica
- **Manter ESLint 9.39.2** até que o ecossistema React (plugins acima) atualize para suporte oficial ao ESLint 10 e ao novo formato `FlatConfig`.
- **Revisão agendada**: Q2/Q3 2026.
