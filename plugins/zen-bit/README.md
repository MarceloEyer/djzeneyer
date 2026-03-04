# Zen BIT v2 — Bandsintown Events Plugin

Proxy WordPress para a API Bandsintown com cache SWR, canonical paths SEO, JSON-LD MusicEvent e painel de health.

## Endpoints

### Lista de eventos (payload enxuto)

```
GET /wp-json/zen-bit/v1/events
```

**Parâmetros:**

| Parâmetro | Tipo | Default | Notas |
|---|---|---|---|
| `mode` | string | `upcoming` | `upcoming`, `past`, `all` |
| `days` | int | 365 | Range dinâmico em dias (1–730). Ignorado se `date` for passado. |
| `date` | string | — | `YYYY-MM-DD,YYYY-MM-DD` — sobrescreve `days` |
| `limit` | int | 50 | Máximo 200 |
| `lang` | string | `en` | Passthrough para o React |
| `upcoming_only` | bool | — | **DEPRECATED** → mapeado para `mode=upcoming` ou `mode=all` |

**Payload de retorno (enxuto — sem description/image/offers):**
```json
{
  "success": true,
  "count": 3,
  "mode": "upcoming",
  "lang": "pt",
  "events": [
    {
      "id": "abc123",
      "title": "DJ Zen Eyer at Club X",
      "starts_at": "2025-06-20T22:00:00+01:00",
      "timezone": "Europe/Lisbon",
      "location": { "venue": "Club X", "city": "Lisboa", "region": "Lisboa", "country": "Portugal" },
      "canonical_path": "/events/2025-06-20-dj-zen-eyer-at-club-x-abc123",
      "canonical_url": "https://djzeneyer.com/events/2025-06-20-dj-zen-eyer-at-club-x-abc123"
    }
  ]
}
```

**Headers de observabilidade:**
- `X-Zen-Cache: hit | miss | stale`
- `X-Zen-Fetch-MS: 342` (apenas quando houve fetch externo)

---

### Detalhe do evento (payload completo)

```
GET /wp-json/zen-bit/v1/events/{id}
```

Retorna todos os campos: `description`, `image`, `offers`, `lineup`, `source_url`, `canonical_path`.
O campo `raw` é incluído apenas quando `zen_bit_include_raw_debug` estiver habilitado no admin.

---

### Schema JSON-LD por evento

```
GET /wp-json/zen-bit/v1/events/{id}/schema
```

Retorna `@context + @graph` com um único `MusicEvent`. Use na tag `<script type="application/ld+json">` da página de detalhe. Inclui `url` (canonical interno) e `sameAs` (Bandsintown).

---

### Schema JSON-LD — lista

```
GET /wp-json/zen-bit/v1/events-schema
```

Aceita os mesmos parâmetros do endpoint de lista. Retorna `@graph` com `MusicGroup` (performer) + `MusicEvent` por evento.

---

### Admin — forçar refresh

```
POST /wp-json/zen-bit/v1/fetch-now
Authorization: Bearer {jwt_admin}
```

Limpa o cache, busca eventos frescos e atualiza o health.

### Admin — limpar cache

```
POST /wp-json/zen-bit/v1/clear-cache
Authorization: Bearer {jwt_admin}
```

---

## Exemplos de uso

```
# Homepage: próximos 3 eventos
GET /wp-json/zen-bit/v1/events?mode=upcoming&days=365&limit=3

# Página /events: até 1 ano à frente (agrupamento por mês feito no React)
GET /wp-json/zen-bit/v1/events?mode=upcoming&days=365

# Página /events — schema para SEO
GET /wp-json/zen-bit/v1/events-schema?mode=upcoming&days=365

# Página de detalhe
GET /wp-json/zen-bit/v1/events/{id}

# Schema para página de detalhe
GET /wp-json/zen-bit/v1/events/{id}/schema

# Eventos passados (últimos 6 meses)
GET /wp-json/zen-bit/v1/events?mode=past&days=180
```

---

## Canonical Path

Gerado deterministicamente por `Zen_BIT_Normalizer::build_canonical_path()`:

```
/events/{yyyy-mm-dd}-{slug}-{id}
```

- `{yyyy-mm-dd}` → data UTC do evento
- `{slug}` → título transliterado, URL-safe, máximo 55 chars
- `{id}` → ID Bandsintown (garante unicidade)
- **Fallback** (sem data ou título): `/events/{id}`

---

## Cache — TTLs configuráveis

| Contexto | Option | Default |
|---|---|---|
| Upcoming | `zen_bit_ttl_upcoming` | 6h (21600s) |
| Detail | `zen_bit_ttl_detail` | 24h (86400s) |
| Past | `zen_bit_ttl_past` | 7d (604800s) |

**SWR (Stale-While-Revalidate):** se o cache expirou, responde com dados antigos enquanto revalida em background. Anti-stampede via lock de transient (30s).

---

## Changelog

### v2.0.0
- `mode=upcoming|past|all` + `days=N` + `date=start,end`
- `upcoming_only` deprecated (backward compat mantida)
- Payload enxuto na lista (sem description/image/offers)
- Novo endpoint detalhe completo com `source_url` e canonical
- Novo endpoint `/events/{id}/schema`
- SWR com headers `X-Zen-Cache` e `X-Zen-Fetch-MS`
- Anti-stampede lock 30s
- TTLs por contexto (6h/24h/7d)
- Admin health: último fetch, ms, erros, contagem, bytes
- Botão "Fetch Now"
- `artist_name` como alternativa ao `artist_id`

### v1.1.2
- Fix: `$limit` não declarado em `get_events_rest()`

### v1.1.0
- Throttle configurável
- Fallback persistente em `wp_options`
