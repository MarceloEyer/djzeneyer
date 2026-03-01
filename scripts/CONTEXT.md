# Scripts Context - /scripts

> **Criticality:** Build & Deployment Pipeline.

## Rules
1. **Prerender Guard:** O arquivo `prerender.js` é executado no CI/CD. Qualquer erro de sintaxe JSX ou falha em rotas críticas bloqueia o deploy.
2. **SSOT Alignment:** Se adicionar uma nova rota em `src/config/routes.ts`, ela DEVE ser refletida (ou gerada) para que o `prerender.js` a capture.
3. **SEO AI:** O script `test-seo-ai.sh` valida se o grafo de conhecimento está correto para LLMs.

## Deployment Flow
- O GitHub Actions roda `scripts/prerender.js` para evitar a "tela branca" (SPA vazio) no primeiro carregamento.
- Certifique-se de que os mocks em `prerender.js` cobrem os novos endpoints da API.

---
*Errar aqui derruba o site em produção. Teste localmente antes de push.*
