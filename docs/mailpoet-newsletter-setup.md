# MailPoet newsletter setup

This checklist keeps Zen Eyer newsletter confirmation, subscription management, and sender branding aligned with the public website.

## Public pages

Use these branded noindex pages as the public UX shell:

| Purpose | English URL | Portuguese URL |
| --- | --- | --- |
| Confirm subscription | `/newsletter-confirmation` | `/pt/confirmar-newsletter` |
| Manage preferences / unsubscribe | `/newsletter-preferences` | `/pt/preferencias-newsletter` |

These pages are intentionally excluded from sitemap/prerender because subscription URLs can contain personal tokens and should not be indexed.

## Recommended MailPoet settings

In WordPress admin:

1. Open **MailPoet → Settings → Basics**.
2. Confirm the site sender identity uses the artist brand:
   - From name: `Zen Eyer`
   - From address: `contato@djzeneyer.com` or the verified sender address for the domain.
   - Reply-to name: `Zen Eyer`
3. Open the **Sign-up Confirmation** section.
4. Customize the confirmation email copy so it does not use the default English text.
5. Use this subject line:
   - Portuguese: `Confirme sua inscrição na newsletter Zen Eyer`
   - English: `Confirm your Zen Eyer newsletter subscription`
6. Configure the MailPoet confirmation/subscription page to point to the matching branded page where possible.
7. Open **MailPoet → Emails** or the email editor for automated messages and remove any footer text that exposes MailPoet branding when the UI allows it.

## Confirmation email copy

Portuguese version:

```text
Olá, [subscriber:firstname | default:]

Você pediu para receber novidades do Zen Eyer.

Para confirmar sua inscrição na newsletter Zen Tribe, clique no botão abaixo:

[Confirmar inscrição]

Se você não pediu isso, pode ignorar este e-mail com segurança. Nenhum outro e-mail será enviado se a inscrição não for confirmada.

Com carinho,
Zen Eyer
```

English version:

```text
Hello [subscriber:firstname | default:],

You asked to receive updates from Zen Eyer.

To confirm your Zen Tribe newsletter subscription, click the button below:

[Confirm subscription]

If you did not request this, you can safely ignore this email. No newsletter will be sent unless the subscription is confirmed.

With care,
Zen Eyer
```

## Internal new-subscriber notification

The email currently says `Cheers, The MailPoet Plugin`. That is an internal admin notification, not the subscriber-facing email.

Recommended options:

1. Disable this notification in **MailPoet Settings** if it is not useful.
2. If the plugin UI exposes a template editor for admin notifications, replace the signature with `Zen Eyer Website`.
3. If the UI does not expose this template, avoid patching vendor plugin files. Plugin updates would overwrite it and may create maintenance/security risk.

## Acceptance checks

Before merging/deploying:

- Open `/newsletter-confirmation` and `/pt/confirmar-newsletter`.
- Open `/newsletter-preferences` and `/pt/preferencias-newsletter`.
- Confirm all four pages return HTTP 200.
- Confirm they include `noindex`.
- Send a fresh subscription test to `eyer.marcelo@gmail.com`.
- Confirm the subscriber-facing email uses `Zen Eyer`, not `MailPoet`.
- Confirm the unsubscribe/manage-preferences link is visible and easy to use.
