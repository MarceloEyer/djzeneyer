# Backend Logic Context - /inc

> **Responsibility:** WordPress filters, actions, and REST API extensions.

## Rules
1. **Namespacing:** Sempre usar namespaces ou prefixos para evitar conflitos.
2. **Brain Responsibility:** Este diretório é o "Cérebro" da estrutura do tema. Toda lógica de menus e setups do WP fica aqui.
3. **GamiPress Redirect:** **NUNCA** coloque lógica de gamificação ou GamiPress aqui. Se a tarefa envolver conquistas, pontos ou rankings, use o plugin `plugins/zengame`.
4. **Security:** Prepared statements para DB e sanitização rigorosa de inputs/outputs.
5. **Performance:** Priorizar o uso de `set_transient()` para dados que não mudam frequentemente (ex: 24h).
6. **REST API:** Endpoints devem ser limpos e retornar apenas os campos necessários (`_fields`).

## Key Files
- `api.php`: Registro de rotas REST customizadas.
- `gamipress-bridge.php`: Integração com sistema de conquistas e pontos.

---
*Backend simples e robusto. Evite queries pesadas no banco.*
