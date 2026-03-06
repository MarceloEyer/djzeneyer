# SETUP.md - Guia de Instalacao

## Pre-requisitos
- Node.js 20+
- PHP 8.1+
- WordPress 6.0+
- MariaDB/MySQL compativel com WordPress/WooCommerce

## Plugins essenciais
- WooCommerce
- GamiPress
- Polylang
- LiteSpeed Cache

## Plugins customizados deste repo
- `plugins/zeneyer-auth`
- `plugins/zen-seo-lite`
- `plugins/zen-bit`
- `plugins/zengame`

## Tema headless
- Arquivos principais: `functions.php`, `index.php`, `header.php`, `footer.php`, `inc/`
- WordPress atua como API para o frontend React

## Frontend
```bash
npm install
npm run lint
npm run build
```

## Deploy
- Push para `main` aciona pipeline GitHub Actions
- Pipeline: build -> prerender -> rsync -> purge cache

## Regras de seguranca
- Nao commitar `.env`/secrets
- Confirmar configuracao de chaves no ambiente (GitHub secrets / wp-config)
