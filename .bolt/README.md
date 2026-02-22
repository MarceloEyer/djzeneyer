# Configuração do bolt.new

Este projeto está configurado para sincronização automática com o GitHub.

## Status Atual

✅ **Repositório GitHub:** `MarceloEyer/djzeneyer`
✅ **Branch Ativo:** `main`
✅ **Auto-Sync:** Habilitado
✅ **Sync on Save:** Habilitado

## Como Funciona

Quando você salva um arquivo no bolt.new:

1. ✅ O arquivo é automaticamente adicionado ao Git
2. ✅ Um commit é criado com as alterações
3. ✅ O commit é enviado para o GitHub (branch `main`)
4. ✅ O GitHub Actions detecta o push
5. ✅ Deploy automático é executado (~5-10 minutos)
6. ✅ Site atualizado em https://djzeneyer.com

## Verificação de Sincronização

No bolt.new, você deve ver:

- 🟢 "Synced to GitHub" (círculo verde)
- 📍 Branch ativo: `djzeneyer/main`
- ⚡ Sincronização automática ativa

## Arquivos de Configuração

- `.bolt/config.json` - Configuração do bolt.new
- `.github/workflows/deploy.yml` - GitHub Actions para deploy automático
- `.git/` - Repositório Git local

## Troubleshooting

### Sincronização não está funcionando?

1. Verifique se o bolt.new mostra "Synced to GitHub"
2. Clique no ícone do GitHub no bolt.new para reconectar
3. Verifique se o branch está configurado como `main`
4. Teste fazendo uma alteração simples em um arquivo

### Deploy não está acontecendo?

1. Acesse: https://github.com/MarceloEyer/djzeneyer/actions
2. Verifique se o workflow "🚀 Production Deploy" está rodando
3. Clique no workflow para ver logs em tempo real
4. Se houver erro, verifique as credenciais e secrets no GitHub

## Links Úteis

- 🌐 **Site:** https://djzeneyer.com
- 📦 **Repositório:** https://github.com/MarceloEyer/djzeneyer
- 🚀 **Actions:** https://github.com/MarceloEyer/djzeneyer/actions
- 📊 **Branches:** https://github.com/MarceloEyer/djzeneyer/branches

## Configuração Manual (se necessário)

Se a sincronização automática parar de funcionar:

```bash
# Verificar configuração
git remote -v
git branch

# Reconectar ao GitHub (se necessário)
git remote add origin https://github.com/MarceloEyer/djzeneyer.git
git branch -M main
git push -u origin main
```

---

**Última atualização:** 2026-01-29
**Configurado por:** AI Assistant (Claude)
