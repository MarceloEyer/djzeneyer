# Deploy

## Visao geral

- Workflow principal: `D:\DJ\Scripts\djzeneyer\.github\workflows\deploy.yml`
- Trigger automatico: push para `main`
- Trigger manual: `workflow_dispatch`
- Alvo de producao: `https://djzeneyer.com`
- Infra de deploy: SSH, `rsync`, `scp`, purge de cache e health check por sitemap

## Fluxo atual

1. `build`
   - instala dependencias
   - gera sitemaps
   - executa `npm run build`
   - executa `scripts/prerender.js`
   - empacota artifacts de `dist`, arquivos do tema, plugins, sitemaps e GamiPress
2. `deploy`
   - baixa os artifacts necessarios
   - faz backup remoto basico de `dist/`
   - envia o novo frontend para `dist-next/`
   - ativa o novo `dist/` por troca atomica, sem apagar o bundle ativo antes
   - publica tema, plugins, assets publicos e sitemaps
   - valida a presenca dos sitemaps na raiz do servidor
   - faz purge de cache
3. `health-check`
   - consulta `${SITE_URL}/sitemap.xml`
   - aceita `200`
   - aceita `403` quando o site responde, mas a automacao e bloqueada por firewall/bot protection

## Sobre `skip_build`

### Problema corrigido

O modo manual com `skip_build=true` estava quebrado.

Antes da correcao, o workflow:

- pulava o job de build
- nao baixava artifacts do run atual
- e ainda assim tentava publicar `dist/`, arquivos do tema e sitemaps

Resultado: o deploy falhava com erro de arquivo ausente no runner, por exemplo `dist/ not found` ou `rsync change_dir .../dist failed`.

### Comportamento atual

Quando `skip_build=true`:

- o workflow procura o ultimo run bem-sucedido de `deploy.yml` no branch `main`
- extrai `run_id` e `commit_hash` desse run
- baixa os artifacts diretamente desse run anterior
- valida localmente que os arquivos minimos existem antes de abrir sessoes de deploy

Isso torna o reuso de artifacts explicito e funcional.

## Artefatos opcionais

Plugins e payloads de GamiPress sao tratados como opcionais no job de deploy.

Motivo:

- nem todo run produz artifacts dessas pastas
- um deploy de frontend/tema nao deve falhar so porque nao houve artifact opcional

Por isso os downloads desses artifacts usam `continue-on-error: true`.

## Decisoes operacionais

- O deploy continua apontando para a VPS Hostinger via SSH na porta `65002`.
- O frontend nao deve mais ser apagado antes do upload. A troca de `dist-next/` para `dist/` precisa ser atomica para evitar tela branca durante o rollout.
- Os sitemaps sao publicados na raiz publica do site.
- O health check usa `sitemap.xml` porque ele cobre disponibilidade basica e integridade SEO com baixo custo.
- `403` no health check nao e tratado como falha automatica, porque Cloudflare/WAF pode bloquear CI mesmo com o site online.

## Riscos conhecidos

- Instabilidade intermitente de SSH/SCP com o host remoto pode causar falhas como `ssh: handshake failed: EOF`.
- Esse tipo de erro e de infraestrutura/conexao e nao da logica de artifact reuse.
- O arquivo de workflow ainda contem historico antigo com comentarios em encoding ruim; funcionalmente nao quebra, mas convem limpar depois.

## Checklist rapido para teste manual

1. garantir que o branch remoto contem a versao mais recente do workflow
2. disparar `workflow_dispatch`
3. testar `skip_build=false` quando quiser validar pipeline completa
4. testar `skip_build=true` quando quiser validar reuso de artifacts
5. confirmar:
   - download de artifacts
   - validacao de inputs
   - publicacao de `dist/`
   - deploy dos sitemaps
   - `health-check` final

## Arquivos relacionados

- `D:\DJ\Scripts\djzeneyer\.github\workflows\deploy.yml`
- `D:\DJ\Scripts\djzeneyer\.github\workflows\deploy.old`
- `D:\DJ\Scripts\djzeneyer\scripts\prerender.js`
