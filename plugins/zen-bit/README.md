# Zen BIT — Bandsintown Events Bridge (v2 API)

Proxy WordPress para a API Bandsintown com cache SWR, canonical paths SEO, JSON-LD MusicEvent e painel de health.

## Endpoints (Namespace: `/wp-json/zen-bit/v2/`)

### Lista de eventos (payload enxuto)

```
GET /wp-json/zen-bit/v2/events
```

**Parâmetros:**

| Parâmetro | Tipo | Default | Notas |
|---|---|---|---|
| `mode` | string | `upcoming` | `upcoming`, `past`, `all` |
| `days` | int | 365 | Range dinâmico em dias (1–730). Ignorado se `date` for passado. |
| `date` | string | — | `YYYY-MM-DD,YYYY-MM-DD` — sobrescreve `days` |
| `limit` | int | 50 | Máximo 200 |
| `lang` | string | `en` | Passthrough para o React |

**Payload de retorno (ZenBitEventListItem):**
```json
{
  "success": true,
  "count": 3,
  "mode": "upcoming",
  "lang": "pt",
  "events": [
    {
      "event_id": "123456",
      "title": "DJ Zen Eyer at Club X",
      "starts_at": "2025-06-20T22:00:00+01:00",
      "timezone": "Europe/Lisbon",
      "location": { "venue": "Club X", "city": "Lisboa", "region": "Lisboa", "country": "Portugal" },
      "canonical_path": "/events/2025-06-20-dj-zen-eyer-at-club-x-123456",
      "canonical_url": "https://djzeneyer.com/events/2025-06-20-dj-zen-eyer-at-club-x-123456"
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
GET /wp-json/zen-bit/v2/events/{event_id}
```

O `{event_id}` deve ser um ID numérico da Bandsintown.
Retorna todos os campos: `description`, `image`, `offers`, `lineup`, `source_url`, `canonical_path`, `artists`, `tickets`.
O campo `raw` é incluído apenas quando "Include Raw Debug" estiver habilitado no admin.

---

### Schema JSON-LD por evento

```
GET /wp-json/zen-bit/v2/events/{event_id}/schema
```

Retorna `@context + @graph` com um único `MusicEvent`. Use na tag `<script type="application/ld+json">` da página de detalhe. Inclui `url` (canonical interno) e `sameAs` (Bandsintown).

---

### Schema JSON-LD — lista

```
GET /wp-json/zen-bit/v2/events/schema
```

Aceita os mesmos parâmetros do endpoint de lista (`mode`, `days`, etc). Retorna `@graph` com `MusicGroup` (performer) + `MusicEvent` por evento.

---

### Admin — API de Controle

```
# Forçar Refresh
POST /wp-json/zen-bit/v2/admin/fetch-now
Authorization: Bearer {jwt_admin}

# Limpar Cache
POST /wp-json/zen-bit/v2/admin/clear-cache
Authorization: Bearer {jwt_admin}

# Status de Health (JSON)
GET /wp-json/zen-bit/v2/admin/health
Authorization: Bearer {jwt_admin}
```

---

## Exemplos de uso

```
# Homepage: próximos 3 eventos
GET /wp-json/zen-bit/v2/events?mode=upcoming&days=365&limit=3

# Página /events: até 1 ano à frente
GET /wp-json/zen-bit/v2/events?mode=upcoming&days=365

# Página /events — schema para SEO
GET /wp-json/zen-bit/v2/events/schema?mode=upcoming&days=365

# Página de detalhe
GET /wp-json/zen-bit/v2/events/123456

# Schema para página de detalhe
GET /wp-json/zen-bit/v2/events/123456/schema

# Eventos passados (últimos 6 meses)
GET /wp-json/zen-bit/v2/events?mode=past&days=180
```

---

## Canonical Path

Gerado deterministicamente por `Zen_BIT_Normalizer::build_canonical_path()`:

```
/events/{yyyy-mm-dd}-{slug}-{event_id}
```

- `{yyyy-mm-dd}` → data UTC do evento
- `{slug}` → título transliterado, URL-safe, máximo 55 chars
- `{event_id}` → ID numérico Bandsintown
- **Fallback**: `/events/{event_id}`

---

## Cache — TTLs configuráveis (Admin)

| Contexto | Default |
|---|---|
| Próximos (Upcoming) | 6h (21600s) |
| Detalhe (Detail) | 24h (86400s) |
| Passados (Past) | 7d (604800s) |

**SWR (Stale-While-Revalidate):** se o cache expirou, responde com dados antigos enquanto revalida em background. Anti-stampede via lock de transient (30s).

---

## Changelog

### v3.0.0 (API v2)
- Namespace oficial alterado para `/wp-json/zen-bit/v2/`
- Parâmetros normalizados: `mode`, `days`, `date`, `limit`.
- Removido suporte a `upcoming_only` legada (BREAKING).
- Respostas enxutas (`ZenBitEventListItem`) na lista para performance.
- Respostas ricas (`ZenBitEventDetail`) no detalhe.
- `event_id` como identificador principal (string numérica).
- Endpoints de admin centralizados em `/admin/`.
- Integrado com painel de health no WordPress.

### v2.0.0
- Primeira implementação da lógica de mode/days.
- SWR introduzido.

### v1.x.x
- Versão inicial legado.
