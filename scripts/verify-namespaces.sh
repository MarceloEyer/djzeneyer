#!/bin/bash
# verify-namespaces.sh — Valida namespacing de todos os plugins DJ Zen Eyer

set -e

echo ""
echo "🔍 Verificando namespaces dos plugins..."
echo "════════════════════════════════════════════"
echo ""

ERRORS=0
WARNINGS=0
SUCCESS=0

# Lista de plugins esperados com seus namespaces
declare -A EXPECTED_NAMESPACES=(
    ["zen-bit"]="ZenBit"
    ["zeneyer-auth"]="ZenEyer\\\\Auth"
    ["zen-seo-lite"]="ZenEyer\\\\SEO"
    ["zengame"]="ZenEyer\\\\Game"
)

# Verificar cada plugin
for plugin in "${!EXPECTED_NAMESPACES[@]}"; do
    plugin_dir="plugins/${plugin}"
    expected_ns="${EXPECTED_NAMESPACES[$plugin]}"
    
    if [ ! -d "$plugin_dir" ]; then
        echo "⏭️  Plugin $plugin não encontrado (pulando)"
        continue
    fi
    
    # Procurar arquivo principal do plugin
    main_file=$(find "$plugin_dir" -maxdepth 1 -name "*.php" | head -1)
    
    if [ -z "$main_file" ]; then
        echo "⚠️  Nenhum arquivo .php encontrado em $plugin_dir"
        ((WARNINGS++))
        continue
    fi
    
    # Verificar se tem namespace
    if grep -q "^namespace" "$main_file"; then
        declared_ns=$(grep "^namespace" "$main_file" | head -1 | sed 's/namespace \(.*\);/\1/')
        
        if [[ "$declared_ns" == "$expected_ns" || "$declared_ns" =~ ^${expected_ns} ]]; then
            echo "✅ $plugin → namespace $declared_ns"
            ((SUCCESS++))
        else
            echo "❌ $plugin → encontrado '$declared_ns', esperado '$expected_ns'"
            ((ERRORS++))
        fi
    else
        echo "❌ $plugin → NENHUM namespace encontrado em $main_file"
        ((ERRORS++))
    fi
done

echo ""
echo "════════════════════════════════════════════"
echo ""
echo "📊 RESULTADO:"
echo "   ✅ Corretos: $SUCCESS"
echo "   ⚠️  Avisos: $WARNINGS"
echo "   ❌ Erros: $ERRORS"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo "❌ VALIDAÇÃO FALHOU"
    echo ""
    echo "📋 Para corrigir:"
    echo "   1. Abrir arquivo principal do plugin"
    echo "   2. Adicionar no INÍCIO do arquivo (após <?php):"
    echo "      namespace ZenEyer\\Auth\\Core; // ou namespace apropriado"
    echo "   3. Garantir que ABSPATH guard está presente:"
    echo "      defined('ABSPATH') || exit;"
    echo ""
    exit 1
else
    echo "✅ TODOS OS NAMESPACES VÁLIDOS"
    exit 0
fi
