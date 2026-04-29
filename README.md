# DJ Zen Eyer

Projeto oficial de DJ Zen Eyer, nome publico de Marcelo Eyer Fernandes.
Arquitetura: WordPress headless + React SPA.

## Stack atual

| Camada | Versao atual |
|---|---|
| Frontend | React 19.2.5, TypeScript 6.0.3, Vite 8.0.9, Tailwind 4.2.1, React Query 5.99.2, React Router 7.14.1, i18next 26.0.6 |
| Build | ESLint 10.2.1, Prettier 3.8.2, Puppeteer 24.42.0 |
| Backend | WordPress 6.9+, PHP 8.3+, WooCommerce 10.5+ com HPOS ativo, GamiPress |
| Infra | Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions |

## O que existe no repo

- `src/` - frontend React
- `inc/` - tema e integracao WordPress
- `plugins/` - plugins customizados
- `scripts/` - build, prerender e utilitarios
- `docs/` - documentacao tecnica e operacional

## Documentos principais

- [AI_CONTEXT_INDEX.md](AI_CONTEXT_INDEX.md)
- [AGENTS.md](AGENTS.md)
- [CLAUDE.md](CLAUDE.md)
- [GEMINI.md](GEMINI.md)
- [docs/AI_LEARNINGS.md](docs/AI_LEARNINGS.md)
- [docs/AI_GOVERNANCE.md](docs/AI_GOVERNANCE.md)

## Comandos basicos

```bash
npm install
npm run lint
npm run build
```

## Observacao

Se houver conflito entre qualquer documentacao e o codigo real, o codigo real vale primeiro.
