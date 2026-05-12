# 🔀 Auditoria de Rotas — Frontend ↔ WordPress

**Data:** Maio 2026

Verificação de sincronização entre rotas do frontend React e slugs do WordPress.

---

## Rotas de Navegação Principal

| Rota React (EN) | Rota React (PT) | Slug WordPress | Status |
|-----------------|-----------------|----------------|--------|
| `/` | `/pt/` | `home` | ✅ OK |
| `/about-dj-zen-eyer` | `/pt/sobre-dj-zen-eyer` | `about-dj-zen-eyer` / `sobre-dj-zen-eyer` | ✅ OK |
| `/zouk-music` | `/pt/musica-zouk` | `zouk-music` / `musica-zouk` | ✅ OK |
| `/zouk-events` | `/pt/eventos-zouk` | `zouk-events` / `eventos-zouk` | ✅ OK |
| `/zouk-dance-news` | `/pt/noticias-zouk` | `zouk-dance-news` / `noticias-zouk` | ✅ OK |
| `/shop` | `/pt/loja` | `shop` / `loja` | ✅ OK |
| `/work-with-me` | `/pt/trabalhe-comigo` | `work-with-me` / `trabalhe-comigo` | ✅ OK |

## Rotas Dinâmicas

| Rota React | Componente | Status |
|-----------|-----------|--------|
| `/zouk-dance-news/:slug` | `NewsPage.tsx` | ✅ OK — Renderização por slug implementada |
| `/zouk-events/:id` | `EventsPage.tsx` | ✅ OK — Renderização por ID implementada |
| `/shop/:slug` | `ShopPage.tsx` | ✅ OK |
| `/zouk-music#release-id` | `MusicPage.tsx` | ✅ OK — Discografia renderizada como listagem sem rota `/release` |

## Próximos Passos

1. Validar canonical/alternate links específicos nas páginas dinâmicas (`zouk-dance-news/:slug`, `zouk-events/:id`)
2. Adicionar testes automatizados de roteamento para evitar regressão em PT/EN
3. Monitorar erro 404 de slugs inválidos via observabilidade (frontend + WP logs)

---

**Atualizado:** Maio 2026 (revisão pós-auditoria técnica)
