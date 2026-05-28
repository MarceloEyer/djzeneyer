# DNS-AID Records

DNS for AI Discovery is published through DNS, not through the web deploy. This file is the canonical project record set for `djzeneyer.com`.

## Records

```dns
_index._agents.djzeneyer.com. 3600 IN SVCB 1 djzeneyer.com. (
  mandatory=alpn,port
  alpn="h2"
  port=443
  key65280="/.well-known/ai-plugin.json"
  key65281="/llms.txt"
  key65282="/wp-json/djzeneyer/v1/ai-context"
)
```

`_index._agents.djzeneyer.com` is the DNS-AID organization index entrypoint. It points to the canonical HTTPS host and advertises HTTP/2 over port 443. The `key65280` through `key65282` parameters use the RFC 9460 private-use SvcParamKey range for experimental DNS-AID descriptor locators until the draft's `well-known`, `cap`, and related keys are assigned by IANA.

Do not publish `_a2a._agents.djzeneyer.com` unless an actual Agent-to-Agent endpoint exists. Advertising `alpn="a2a"` without an A2A service would create a false discovery record.

## Publish

The Cloudflare zone must have DNSSEC active so validating resolvers return authenticated data. The zone already returns DNSKEY records, but the publication script verifies Cloudflare DNSSEC status before upserting records.

Required environment variables:

```bash
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ZONE_ID=...
```

The token needs `DNS Write` permission for the zone.

Run:

```bash
node scripts/publish-dns-aid-cloudflare.mjs
```

Use `--dry-run` to inspect the intended create/update actions, and `--skip-doh` if DNS propagation should be validated separately.

## Validate

DNS-over-HTTPS check:

```bash
curl -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=_index._agents.djzeneyer.com&type=64&do=1"
```

Expected result: an SVCB answer with `AD: true`.

Scanner check:

```bash
curl -X POST "https://isitagentready.com/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://djzeneyer.com"}'
```

Expected result: `checks.discoverability.dnsAid.status` is `pass`.
