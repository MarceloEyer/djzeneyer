#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 Quick Push - Sincronização rápida com GitHub
# ═══════════════════════════════════════════════════════════════════════════════
# Uso: ./scripts/quick-push.sh "Mensagem do commit"
# ═══════════════════════════════════════════════════════════════════════════════

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 DJ ZEN EYER - Quick Push to GitHub${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

# Verifica se está em um repositório git
if [ ! -d .git ]; then
    echo -e "${RED}❌ Não é um repositório Git. Execute 'git init' primeiro.${NC}"
    exit 1
fi

# Verifica se há mensagem de commit
COMMIT_MSG="${1:-Update: $(date +'%Y-%m-%d %H:%M:%S')}"

echo -e "${YELLOW}📝 Mensagem do commit:${NC} $COMMIT_MSG\n"

# Verifica status
echo -e "${BLUE}🔍 Verificando alterações...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Nenhuma alteração para commit.${NC}"
    exit 0
fi

# Mostra alterações
echo -e "\n${YELLOW}Arquivos alterados:${NC}"
git status --short

# Adiciona todos os arquivos
echo -e "\n${BLUE}📦 Adicionando arquivos...${NC}"
git add .

# Commit
echo -e "${BLUE}💾 Fazendo commit...${NC}"
git commit -m "$COMMIT_MSG"

# Verifica remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}❌ Remote 'origin' não configurado.${NC}"
    echo -e "${YELLOW}Configure com:${NC}"
    echo -e "  git remote add origin https://github.com/MarceloEyer/djzeneyer.git"
    echo -e "${YELLOW}ou${NC}"
    echo -e "  git remote add origin git@github.com:MarceloEyer/djzeneyer.git"
    exit 1
fi

# Push
echo -e "\n${BLUE}🚀 Enviando para GitHub...${NC}"
if git push origin main 2>&1 | tee /tmp/git-push.log; then
    echo -e "\n${GREEN}✅ Push realizado com sucesso!${NC}"
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎉 Código enviado para GitHub!${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
    echo -e "${YELLOW}📊 Acompanhe o deploy:${NC}"
    echo -e "   https://github.com/MarceloEyer/djzeneyer/actions\n"
    echo -e "${YELLOW}🌐 Site será atualizado em ~5-10 minutos:${NC}"
    echo -e "   https://djzeneyer.com\n"
else
    ERROR=$(cat /tmp/git-push.log)
    echo -e "\n${RED}❌ Erro no push!${NC}\n"

    if echo "$ERROR" | grep -q "could not read Username"; then
        echo -e "${YELLOW}💡 Solução: Configure autenticação${NC}\n"
        echo -e "Opção 1 - Token (HTTPS):"
        echo -e "  1. Gere token: https://github.com/settings/tokens"
        echo -e "  2. Execute: git remote set-url origin https://TOKEN@github.com/MarceloEyer/djzeneyer.git"
        echo -e "\nOpção 2 - SSH (Recomendado):"
        echo -e "  1. Gere chave: ssh-keygen -t ed25519 -C 'marcelo@djzeneyer.com'"
        echo -e "  2. Adicione ao GitHub: https://github.com/settings/ssh/new"
        echo -e "  3. Execute: git remote set-url origin git@github.com:MarceloEyer/djzeneyer.git"
        echo -e "\nOpção 3 - GitHub CLI:"
        echo -e "  gh auth login"
    elif echo "$ERROR" | grep -q "rejected"; then
        echo -e "${YELLOW}💡 Solução: Atualize seu repositório local${NC}\n"
        echo -e "  git pull --rebase origin main"
        echo -e "  git push origin main"
    else
        echo -e "${RED}Erro desconhecido. Verifique os logs acima.${NC}"
    fi

    exit 1
fi
