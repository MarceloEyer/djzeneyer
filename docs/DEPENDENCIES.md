# Gestão de Dependências

## Dependabot

O Dependabot roda semanalmente e abre PRs agrupados para três ecossistemas:

| Ecossistema | Diretório | Limite de PRs |
|---|---|---|
| npm | `/` | 5 |
| Composer | `/plugins/zeneyer-auth` | 2 |
| GitHub Actions | `/` | 3 |

## Labels e triagem

Cada PR de dependência deve receber um label antes do merge:

| Label | Quando usar |
|---|---|
| `deps-patch` | Bump de patch (0.0.X) — merge sem revisão profunda se CI verde |
| `deps-minor` | Bump de minor (0.X.0) — verificar changelog, testar build |
| `deps-major` | Bump de major (X.0.0) — revisão obrigatória, checar breaking changes |
| `security` | PRs gerados por alerta de segurança — prioridade máxima |

## Fluxo de merge

1. CI (quality-gate) deve passar.
2. Aplicar label correto.
3. Para `deps-minor` e `deps-major`: ler o changelog da lib e checar se algo afeta `src/`, `scripts/` ou os plugins.
4. Merge squash com mensagem `chore(deps): bump <pacote> to <versão>`.

## Segurança em plugins Composer

Mudanças nas regras de bypass/segurança do plugin `zeneyer-auth` devem ser documentadas no `SECURITY.md` antes do merge, mesmo que venham de uma atualização de dependência automatizada.
