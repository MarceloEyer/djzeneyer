# Deploy Context - /.github/workflows

> **Critical Path:** CI/CD Production Pipeline (`deploy.yml`)

## Rules
1. **SSN Optimization:** O deploy usa SSH (porta 65002) e Rsync. Nunca altere configurações de rede ou IP sem validar os Secrets do GitHub.
2. **Artifact Strategy:**
   - O `dist/` do React é gerado no Job 1 (Build) e enviado via Rsync no Job 2 (Deploy).
   - O `inc/`, `plugins/`, `parts/` e `templates/` são sincronizados separadamente para garantir que o tema WordPress e o frontend React estejam em harmonia.
3. **Prerender Fix:** O Job de Build SEMPRE executa `scripts/prerender.js`. Se o site estiver gerando "tela branca", o problema costuma estar no timeout do Puppeteer ou erro de JS no build.
4. **Composer Warning:** Plugins com `composer.json` são instalados no CI com `--no-security-blocking` para evitar que avisos de vulnerabilidade em dependências (como JWT) tranquem o deploy produtivo desnecessariamente (visto que o site é de baixo tráfego e baixo risco).

## Key Files
- `deploy.yml`: O motor principal. Versão atual é a v4.1 (Restaurada).
- `validate-bot-regex.yml`: Validação de segurança para bots de IA.

---
*O deploy é sagrado. Se falhar, o site fica offline. Não mude sem teste de sitemap.*
