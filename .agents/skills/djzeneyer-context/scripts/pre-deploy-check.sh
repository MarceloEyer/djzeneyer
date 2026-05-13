#!/bin/bash
# Pre-deploy check script for DJ Zen Eyer

echo "🚀 Iniciando verificações pré-deploy..."

# 1. Verificar erros de sintaxe JSX/TSX
echo "🔍 Verificando lint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Erro no lint detectado. Abortando."
    exit 1
fi

# 2. Verificar tipos TypeScript
echo "🔍 Verificando tipos TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Erro de tipos detectado. Abortando."
    exit 1
fi

# 3. Verificar se robots.txt e sitemap.xml existem em public/
if [ ! -f "public/robots.txt" ]; then
    echo "⚠️ robots.txt não encontrado em public/"
fi

# 4. Verificar se todas as rotas de prerender estão configuradas
if [ ! -f "scripts/routes-config.json" ]; then
    echo "❌ scripts/routes-config.json não encontrado. Abortando."
    exit 1
fi

echo "✅ Verificações concluídas com sucesso!"
exit 0
