# Auth.md

## Zen Eyer Agent Authentication

Zen Eyer publishes public AI discovery resources for reading, grounding, SEO, booking context, music metadata, and event context. These public resources do not require authentication.

## Public Access

The following resources are available without credentials:

- `https://djzeneyer.com/llms.txt`
- `https://djzeneyer.com/llms-full.txt`
- `https://djzeneyer.com/.well-known/api-catalog`
- `https://djzeneyer.com/.well-known/ai-plugin.json`
- `https://djzeneyer.com/.well-known/agent-skills/index.json`
- `https://djzeneyer.com/.well-known/mcp/server-card.json`
- `https://djzeneyer.com/wp-json/djzeneyer/v1/ai-context`

## Agent Registration

Agents that prefer an explicit registration flow can request an informational public-read token:

```http
POST https://djzeneyer.com/wp-json/djzeneyer/v1/agent-registration
Content-Type: application/json

{
  "type": "anonymous"
}
```

The returned token grants no private access. Public endpoints remain readable without a token.

Agents can also call the claim endpoint to confirm that no user-account claim ceremony is required for public-read access:

```http
POST https://djzeneyer.com/wp-json/djzeneyer/v1/agent-claim
Content-Type: application/json

{
  "type": "anonymous"
}
```

The response indicates `claim_required: false`. Private user APIs remain outside autonomous agent registration.

## Discovery

OAuth discovery documents:

- Protected resource: `https://djzeneyer.com/.well-known/oauth-protected-resource`
- Authorization server: `https://djzeneyer.com/.well-known/oauth-authorization-server`

Contact: `booking@djzeneyer.com`
