# Padrões de Desenvolvimento e Fonte Única de Verdade (SSOT)

Este documento define as diretrizes para evitar duplicações e garantir que o projeto ZenGamePro mantenha uma arquitetura limpa e escalável.

## 1. Fonte Única de Verdade (Single Source of Truth - SSOT)

Para evitar que a documentação, o backend e o frontend fiquem dessincronizados, seguimos estas regras:

- **Endpoints**: O arquivo [API.md](file:///d:/DJ/Scripts/djzeneyer/docs/API.md) é a referência canônica. Se o código mudar, o markdown deve mudar.
- **Tipos de Dados**: O backend (PHP) define a estrutura de resposta. O frontend (TypeScript) deve espelhar essa estrutura rigorosamente.
- **Constantes**: Chaves de meta dados, nomes de tabelas e slugs de API devem residir em `ZenEyer\GamePro\Core\Constants`.

## 2. DRY (Don't Repeat Yourself)

- **Evite Hardcoding**: Nunca use strings mágicas para chaves de banco de dados ou endpoints fora da classe `Constants`.
- **Compartilhamento de Lógica**: Lógicas de cálculo de pontos devem estar no `Engine`, nunca duplicadas no `REST_Handler` ou no Frontend.

## 3. Alinhamento Backend-Frontend

Ao criar um novo endpoint:
1. Documente no `API.md`.
2. Implemente no `REST_Handler` usando PHPDoc para detalhar o retorno.
3. Atualize os tipos em `src/types/` no frontend.

> [!TIP]
> Em caso de divergência, o **Código do Backend** é o mestre da estrutura de dados, enquanto o **API.md** é o mestre da existência do endpoint.
