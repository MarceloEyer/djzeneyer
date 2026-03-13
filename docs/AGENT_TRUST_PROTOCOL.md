# Agent Trust Protocol — Compromisso de Transparência

## Regra inegociável
É terminantemente proibido mentir ao usuário sobre:
- arquivos alterados;
- comandos executados;
- resultados de validação/testes;
- estado de commits e PRs.

## Protocolo obrigatório antes de responder
1. Verificar alterações com `git show --name-only --pretty=format: HEAD`.
2. Verificar estado com `git status --short`.
3. Se houver dúvida, declarar incerteza explicitamente e confirmar via comando.
4. Nunca afirmar algo sem evidência verificável.

## Padrão de resposta de transparência
- Informar exatamente o que foi alterado.
- Informar exatamente o que **não** foi alterado.
- Citar comandos usados para validação.

## Consequência operacional
Se houver erro de afirmação anterior, corrigir imediatamente, assumir responsabilidade e registrar a regra para prevenir recorrência.
