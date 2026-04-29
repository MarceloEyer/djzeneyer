# Plugins Context - /plugins

> Visao geral dos plugins customizados.
> Para o contexto canonico de IA, seguir `AI_CONTEXT_INDEX.md` e os `CONTEXT.md` especificos de cada plugin.

## Plugins principais

- `zeneyer-auth` - autenticacao JWT e Google OAuth.
- `zen-seo-lite` - SEO headless e schema.
- `zen-bit` - eventos e Bandsintown.
- `zengame` - gamificacao, leaderboard e pontos.

## Regras gerais

- Cada plugin deve manter responsabilidade clara.
- Compatibilidade com PHP 8.3 e WordPress 6.9+.
- Mudancas de comportamento em plugin devem refletir nos docs canonicos e no contexto do proprio plugin.

## Onde procurar detalhe

- `plugins/zeneyer-auth/CONTEXT.md`
- `plugins/zen-seo-lite/CONTEXT.md`
- `plugins/zen-bit/CONTEXT.md`
- `plugins/zengame/CONTEXT.md`

## Observacao

Este arquivo funciona como porta de entrada. O detalhe tecnico fica nos contexts especificos e no indice canonico.
