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
  "type": "user_claimed",
  "audience": "https://djzeneyer.com",
  "scope": ["public:read"]
}
```

The returned token grants no private access. It only confirms that the agent discovered the public-read registration flow. Public endpoints remain readable without a token.

## Protected User APIs

Authenticated user-account APIs, orders, profile data, and newsletter preferences use the site's existing WordPress/JWT authentication. Autonomous agent registration is not allowed to create or access private user accounts.

## Discovery

OAuth-style discovery documents:

- Protected resource metadata: `https://djzeneyer.com/.well-known/oauth-protected-resource`
- Authorization server metadata: `https://djzeneyer.com/.well-known/oauth-authorization-server`

Contact: `booking@djzeneyer.com`
