#!/bin/bash
# Pre-deploy check script for DJ Zen Eyer

echo "🚀 Iniciando verificações pré-deploy..."

# 1. Verificar erros de sintaxe JSX/TSX
echo "🔍 Verificando lint..."
if ! npm run lint; then
    echo "❌ Erro no lint detectado. Abortando."
    exit 1
fi

# 2. Verificar tipos TypeScript
echo "🔍 Verificando tipos TypeScript..."
if ! npm run type-check; then
    echo "❌ Erro de tipos detectado. Abortando."
    exit 1
fi

# 3. Verificar se robots.txt e sitemap.xml existem em public/
if [ ! -f "public/robots.txt" ]; then
    echo "⚠️ robots.txt não encontrado em public/"
fi
if [ ! -f "public/sitemap.xml" ]; then
    echo "⚠️ sitemap.xml não encontrado em public/"
fi

# 4. Verificar se todas as rotas de prerender estão configuradas
if [ ! -f "src/config/routes-slugs.json" ]; then
    echo "❌ src/config/routes-slugs.json não encontrado. Abortando."
    exit 1
fi

echo "✅ Verificações concluídas com sucesso!"
exit 0
