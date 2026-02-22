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
| `/news/:slug` | `NewsPage.tsx` | ⚠️ Pendente — Slug individual não renderiza conteúdo |
| `/events/:id` | `EventsPage.tsx` | ⚠️ Pendente — ID individual não renderiza conteúdo |
| `/shop/:slug` | `ShopPage.tsx` | ✅ OK |
| `/music/:slug` | `MusicPage.tsx` | ⚠️ Pendente |

## Próximos Passos

1. Implementar renderização de conteúdo individual em `NewsPage.tsx` baseado no parâmetro `:slug`
2. Implementar renderização de evento individual em `EventsPage.tsx` baseado no `:id`
3. Implementar renderização de música individual em `MusicPage.tsx` baseado no `:slug`

---

**Atualizado:** Fevereiro 2026
