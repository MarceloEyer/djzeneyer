# 🔀 Auditoria de Rotas — Frontend ↔ WordPress

**Data:** Fevereiro 2026

Verificação de sincronização entre rotas do frontend React e slugs do WordPress.

---

## Rotas de Navegação Principal

| Rota React (EN) | Rota React (PT) | Slug WordPress | Status |
|-----------------|-----------------|----------------|--------|
| `/` | `/pt/` | `home` | ✅ OK |
| `/about` | `/pt/sobre` | `about` / `sobre` | ✅ OK |
| `/music` | `/pt/musica` | `music` / `musica` | ✅ OK |
| `/events` | `/pt/eventos` | `events` / `eventos` | ✅ OK |
| `/news` | `/pt/noticias` | `news` / `noticias` | ✅ OK |
| `/shop` | `/pt/loja` | `shop` / `loja` | ✅ OK |
| `/contact` | `/pt/contato` | `contact` / `contato` | ✅ OK |

## Rotas Dinâmicas

| Rota React | Componente | Status |
|-----------|-----------|--------|
| `/news/:slug` | `NewsPage.tsx` | ✅ OK — Renderização por slug implementada |
| `/events/:id` | `EventsPage.tsx` | ✅ OK — Renderização por ID implementada |
| `/shop/:slug` | `ShopPage.tsx` | ✅ OK |
| `/music/:slug` | `MusicPage.tsx` | ✅ OK — Renderização por slug implementada |

## Próximos Passos

1. Validar canonical/alternate links específicos nas páginas dinâmicas (`news/:slug`, `events/:id`, `music/:slug`)
2. Adicionar testes automatizados de roteamento para evitar regressão em PT/EN
3. Monitorar erro 404 de slugs inválidos via observabilidade (frontend + WP logs)

---

**Atualizado:** Fevereiro 2026 (revisão pós-auditoria técnica)
