# 🔄 Workflow de Sincronização bolt.new → GitHub → Produção

## Como funciona

```
bolt.new → [VOCÊ FAZ PUSH] → GitHub → [AUTO] → Servidor Produção
   ↓                            ↓                      ↓
Edita código              GitHub Actions        djzeneyer.com
                          faz build/deploy
```

## ✅ O que JÁ está configurado

1. **GitHub Actions** (`.github/workflows/deploy.yml`):
   - ✅ Detecta push no branch `main` automaticamente
   - ✅ Faz build do projeto
   - ✅ Gera sitemaps
   - ✅ Faz prerender das páginas (SSG)
   - ✅ Deploy automático via SSH no servidor
   - ✅ Limpa cache LiteSpeed

2. **Secrets configurados** (no GitHub):
   - `SSH_PRIVATE_KEY` - Chave SSH para deploy
   - `VITE_WC_CONSUMER_KEY` - WooCommerce API
   - `VITE_WC_CONSUMER_SECRET` - WooCommerce Secret
   - `VITE_GOOGLE_CLIENT_ID` - OAuth Google

## 🚀 Como sincronizar suas alterações

### Opção 1: Push Manual (Recomendado)

No seu computador local:

```bash
# Clone o repositório (primeira vez)
git clone https://github.com/MarceloEyer/djzeneyer.git
cd djzeneyer

# Configure sua identidade
git config user.name "Marcelo Eyer"
git config user.email "marcelo@djzeneyer.com"

# Faça suas alterações e commit
git add .
git commit -m "Descrição da alteração"
git push origin main

# ✅ O GitHub Actions vai fazer deploy automático em ~5-10 minutos
```

### Opção 2: Usando GitHub CLI

```bash
gh auth login
gh repo clone MarceloEyer/djzeneyer
cd djzeneyer

# Edite, commit e push
git add .
git commit -m "Sua mensagem"
git push
```

### Opção 3: Usando GitHub Desktop

1. Baixe o GitHub Desktop: https://desktop.github.com/
2. Clone o repositório: `MarceloEyer/djzeneyer`
3. Faça alterações
4. Commit → Push
5. ✅ Deploy automático acontece

## 📱 Como acompanhar o deploy

1. Acesse: https://github.com/MarceloEyer/djzeneyer/actions
2. Você verá o workflow "🚀 Production Deploy" rodando
3. Clique para ver logs em tempo real
4. Quando terminar (✅), o site estará atualizado em https://djzeneyer.com

## ⚡ Deploy sob demanda (sem código)

Se quiser fazer deploy sem alterar código:

1. Acesse: https://github.com/MarceloEyer/djzeneyer/actions
2. Clique em "🚀 Production Deploy"
3. Clique em "Run workflow"
4. Marque "Skip build" se quiser usar o último build
5. Clique em "Run workflow"

## 🔐 Configuração de Autenticação

### Para usar HTTPS com token:

```bash
# 1. Gere um token: https://github.com/settings/tokens
# 2. Configure o remote:
git remote set-url origin https://SEU_TOKEN@github.com/MarceloEyer/djzeneyer.git
git push
```

### Para usar SSH (mais seguro):

```bash
# 1. Gere chave SSH
ssh-keygen -t ed25519 -C "marcelo@djzeneyer.com"

# 2. Adicione ao GitHub: https://github.com/settings/ssh/new
# Copie o conteúdo de: ~/.ssh/id_ed25519.pub

# 3. Configure o remote:
git remote set-url origin git@github.com:MarceloEyer/djzeneyer.git
git push
```

## ⚠️ Importante

- **bolt.new NÃO faz push automático** (limitação da plataforma)
- Você precisa fazer push manual do seu computador
- Depois do push, tudo é automático via GitHub Actions
- O deploy leva ~5-10 minutos após o push

## 🐛 Troubleshooting

### Deploy falhou?
1. Verifique os logs: https://github.com/MarceloEyer/djzeneyer/actions
2. Erros comuns:
   - Secrets faltando (configure no GitHub)
   - Servidor SSH indisponível
   - Build TypeScript com erros

### Como fazer rollback?
```bash
git revert HEAD
git push
# ✅ GitHub Actions vai fazer deploy da versão anterior
```

## 📊 Status do Workflow

Você pode adicionar um badge no README.md:

```markdown
![Deploy Status](https://github.com/MarceloEyer/djzeneyer/workflows/🚀%20Production%20Deploy/badge.svg)
```
