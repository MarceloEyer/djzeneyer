# Conversion Analytics Event Map

This document maps the public conversion events that matter for djzeneyer.com.

## Goal

Measure which public actions create real business value: booking interest, event intent, music discovery, press-kit reuse, community signup and shop revenue.

The implementation should stay lightweight. The current helper in `src/lib/analytics.ts` no-ops when no analytics provider is present and sends events through `window.gtag()` or `window.dataLayer` when GA4/GTM is configured.

## Recommended GA4-compatible events

| User action | Event | Required context |
|---|---|---|
| WhatsApp booking click | `generate_lead` | `method: whatsapp`, page path |
| Email booking click | `generate_lead` | `method: email`, page path |
| Press kit PDF/MD download | `select_content` | `content_type: press_kit`, asset type |
| Official photo gallery click | `select_content` | `content_type: press_gallery` |
| Add event to Google Calendar | `select_content` | `content_type: event_calendar`, `calendar_provider: google` |
| Share event | `share` | `content_type: event`, event id/title |
| External music-platform click | `select_content` | `content_type: music_platform`, platform |
| Zen Tribe registration | `sign_up` | signup method |
| Newsletter subscription | `sign_up` | source page/list |
| Cart item added | `add_to_cart` | product id/name/value |
| Checkout completed | `purchase` | order id/value/currency |

## Implementation rules

- Keep the analytics helper dependency-free.
- Do not block user navigation if analytics fails.
- Do not send private user data, payment data, tokens, email addresses or full message bodies.
- Prefer GA4 recommended event names when they match the action.
- Use custom parameters only for low-risk public context: page, content type, item id, platform, UI variant.
- Authenticated/user-specific tracking needs a separate privacy review before implementation.

## Validation

- In local/dev without GA4, events should silently no-op.
- With GTM, verify `dataLayer` receives the event object.
- With GA4, verify events in DebugView before relying on reports.
