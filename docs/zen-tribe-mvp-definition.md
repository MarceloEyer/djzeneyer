# Zen Tribe MVP Definition

## Objective

Define a minimal Zen Tribe launch promise that starts with belonging, not a complicated benefits system.

The current strategy is to avoid overpromising until the operating model is clear. This document narrows the MVP so future UI/copy changes have a stable product decision behind them.

## Core principle

Zen Tribe should feel like a low-friction community doorway for Brazilian Zouk lovers, not a SaaS dashboard.

Gamification can support the product, but it should not be the first thing users need to understand.

## MVP promise

> Join the Zen Tribe to stay close to the music, the events and the people who love Brazilian Zouk cremosidade.

## MVP audience

Primary:

- Brazilian Zouk dancers who already follow Zen Eyer.
- People who attend reZENha, festivals, marathons and socials.
- Fans who want music, event reminders and community connection.

Secondary:

- Organizers and friends who want to follow future tour dates.
- Supporters who may later buy products, donate or join paid tiers.

## MVP tiers

### Free entry

Purpose: reduce friction and grow the community base.

Possible benefits:

- Receive event reminders.
- Receive selected music/set updates.
- Join community roll calls before events.
- Get a simple digital member identity.
- Participate in small missions/prompts.

### Supporter tier

Purpose: let fans support the work without requiring complex fulfillment.

Possible benefits:

- Early access to selected sets/remixes when operationally ready.
- Supporter badge/profile mark.
- Occasional behind-the-scenes notes.
- Priority notifications for limited event/ticket drops.

### Future premium tier

Do not launch until operations are ready.

Possible benefits later:

- Points redeemable in Shop.
- Event perks.
- Exclusive calls/listening sessions.
- Physical member card.
- Special digital products.

## Rituals before features

Prioritize recurring rituals because they create belonging:

- Weekly or event-based roll call: "Who is going?"
- Post-event memory prompt: "What was your most cremoso moment?"
- Monthly playlist/set note.
- Member introductions before big events.
- Travel/lodging coordination threads when useful.
- Small missions like sharing a favorite track or inviting a friend.

## Copy direction

Use:

- warm, human language;
- belonging;
- music and connection;
- low commitment;
- simple next step.

Avoid:

- too much XP jargon on the first screen;
- long lists of benefits that are not operationally ready;
- paid-tier pressure before free entry is clear;
- promising private content, calls or perks before there is a delivery process.

## Page structure recommendation

1. Emotional opening: what Zen Tribe is.
2. Free entry CTA.
3. What members receive now.
4. Community rituals.
5. Supporter option, framed as support.
6. Gamification/points as a secondary layer.
7. Link to account/dashboard only after signup.

## Implementation checklist

When changing Zen Tribe page copy or UX:

- Keep free entry visible.
- Keep paid/support options secondary.
- Do not add benefit claims without operational owner.
- Use i18n for visible copy.
- Track signup and supporter clicks once analytics foundation is merged.
- Keep private/account pages `noindex`.
- Preserve GamiPress/data-fetching rules from project guidelines.

## Suggested future PRs

- `feat(tribe): simplify landing copy around free entry`
- `feat(tribe): add event roll-call prompt module`
- `feat(tribe): track signup and supporter CTA clicks`
- `feat(tribe): add supporter tier copy without overpromising perks`
