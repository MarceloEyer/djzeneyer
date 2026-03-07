# 👨‍💻 Guia do Desenvolvedor

Referência rápida para desenvolvedores que trabalham no projeto DJ Zen Eyer.

---

## 🏗️ Arquitetura

```
                    ┌─────────────────┐
                    │   Navegador     │
                    │  (React SPA)    │
                    └───────┬─────────┘
                            │ REST API
                    ┌───────▼─────────┐
                    │   WordPress     │
                    │  (Headless)     │
                    └─────────────────┘
```

**Fluxo:** React SPA busca dados via REST API do WordPress. WordPress **nunca** renderiza HTML para o frontend.

---

## 📂 Onde Fica Cada Coisa

| Precisa | Vá para |
|---------|---------|
| Adicionar página | `src/pages/` + registrar em `src/components/AppRoutes.tsx` |
| Adicionar hook de dados | `src/hooks/useQueries.ts` |
| Adicionar tradução | `src/locales/en/translation.json` + `src/locales/pt/translation.json` |
| Adicionar endpoint REST | `inc/api.php` |
| Adicionar plugin | `plugins/` |
| Configurar deploy | `.github/workflows/deploy.yml` |

---

## 🔧 Convenções

### React / TypeScript
- Todas as páginas usam `React.lazy()` + `Suspense`
- Data fetching **só** via `useQueries.ts` (React Query)
- Strings visíveis **sempre** com `t('chave')` (i18next)
- Tipagem TypeScript estrita

### PHP / WordPress
- Namespaces obrigatórios para plugins
- `$wpdb->prepare()` para toda query SQL
- Sanitização: `sanitize_text_field()`, `esc_html()`, `esc_url()`

### Git
- Prefixos semânticos: `fix:`, `feat:`, `refactor:`, `docs:`, `chore:`
- Branch principal: `main` (deploy automático)

---

## 🚀 Deploy

Deploy é 100% automático viaGitHub Actions:

```bash
git add .
git commit -m "fix: corrigir X"
git push origin main
```

**Pipeline automático:**
1. Build (TypeScript + Vite)
2. Prerender (SSG com Puppeteer)
3. Rsync para VPS via SSH
4. Purge de cache (LiteSpeed + OPcache)
5. Health check

**Duração:** ~2-3 minutos

---

## 🧩 Adicionando uma Nova Página

1. Crie o componente em `src/pages/NovaPagina.tsx`
2. Registre a rota em `src/components/AppRoutes.tsx`:
   ```tsx
   const NovaPagina = lazy(() => import('../pages/NovaPagina'));
   ```
3. Adicione tradução do slug em `src/config/routes.ts`
4. Adicione strings i18n em ambos os idiomas
5. Adicione `<HeadlessSEO />` para SEO
6. Teste: `npm run dev`
7. Deploy: `git push origin main`

---

## 🧪 Testes

```bash
npm run build    # Verifica se compila sem erros
npm run lint     # ESLint 9 (NÃO atualizar para 10)
```

> **ESLint:** Manter na v9. Plugins React não suportam v10 (ver [Análise ESLint](ESLINT_ANALYSIS.md)).

---

**Atualizado:** Fevereiro 2026

---

## Performance Budget (Novo)

Este projeto agora possui verificacao automatica de regressao de bundle.

Comandos locais:

```bash
npm run perf:baseline
npm run perf:budget
```

O que cada comando faz:
- `perf:baseline`: gera `.agents/perf-baseline.json` com tamanhos de bundles (raw/gzip/brotli).
- `perf:budget`: falha o processo se os limites de performance forem ultrapassados.

Limites padrao atuais:
- `maxInitialJsGzip`: 181 KB
- `maxLargestChunkGzip`: 120 KB
- `maxEntryJsGzip`: 130 KB
- `maxI18nChunkGzip`: 55 KB

Esses checks tambem rodam no CI (workflow de deploy), para evitar regressao silenciosa.
