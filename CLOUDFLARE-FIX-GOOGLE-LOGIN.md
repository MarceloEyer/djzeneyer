# Fix Google Login 403 Error - Cloudflare Blocking

## Problema
Cloudflare está bloqueando requisições POST para `/wp-json/zeneyer-auth/v1/auth/google` com erro 403.

## Solução: Criar Regra no Cloudflare

### Passo 1: Acessar Cloudflare Dashboard
1. Vá para https://dash.cloudflare.com
2. Selecione o site: **djzeneyer.com**

### Passo 2: Criar Page Rule ou WAF Rule

#### Opção A: Page Rule (Mais Simples)
1. Vá em **Rules** → **Page Rules**
2. Clique em **Create Page Rule**
3. Configure:
   - **URL:** `djzeneyer.com/wp-json/zeneyer-auth/*`
   - **Setting:** Security Level → **Essentially Off**
   - **Setting:** Browser Integrity Check → **Off**
4. Clique em **Save and Deploy**

#### Opção B: WAF Custom Rule (Recomendado)
1. Vá em **Security** → **WAF** → **Custom rules**
2. Clique em **Create rule**
3. Configure:
   - **Rule name:** Allow ZenEyer Auth API
   - **Field:** URI Path
   - **Operator:** contains
   - **Value:** `/wp-json/zeneyer-auth/`
   - **Action:** Skip → All remaining custom rules
4. Clique em **Deploy**

### Passo 3: Limpar Cache
1. Vá em **Caching** → **Configuration**
2. Clique em **Purge Everything**
3. Confirme

### Passo 4: Testar
1. Aguarde 30 segundos
2. Acesse https://djzeneyer.com
3. Tente fazer login com Google
4. Deve funcionar sem erro 403

## Alternativa: Desabilitar Bot Fight Mode

Se as regras acima não funcionarem:

1. Vá em **Security** → **Bots**
2. Desabilite **Bot Fight Mode** (se estiver ativo)
3. Ou adicione exceção para `/wp-json/*`

## Verificar se Funcionou

Abra o console do navegador e tente fazer login. Você deve ver:

```
[UserContext] 🔵 Iniciando Google Login
[UserContext] 📍 Endpoint: https://djzeneyer.com/wp-json/zeneyer-auth/v1/auth/google
[UserContext] 📊 Response status: 200  ← DEVE SER 200, NÃO 403
[UserContext] ✅ Google Login bem-sucedido
```

## Notas Importantes

- **Não desabilite o Cloudflare completamente** - apenas crie exceção para a API
- **Mantenha SSL/TLS ativo**
- **Mantenha outras proteções ativas**
- A regra só afeta `/wp-json/zeneyer-auth/*`, o resto do site continua protegido

## Se Ainda Não Funcionar

Verifique:
1. Plugin ZenEyer Auth está ativo no WordPress
2. Rewrite rules foram atualizadas (wp-admin → Settings → Permalinks → Save)
3. .htaccess não está bloqueando REST API
4. Cloudflare está em modo "Full" ou "Full (strict)" SSL/TLS
