#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# 🧪 SCRIPTS DE TESTE E VALIDAÇÃO - DJ ZEN EYER
# ═══════════════════════════════════════════════════════════════════════════════
# Use estes scripts para testar seu robots.txt e configurações de IA
# Salve como: test-seo-ai.sh
# Uso: chmod +x test-seo-ai.sh && ./test-seo-ai.sh
# ═══════════════════════════════════════════════════════════════════════════════

SITE_URL="https://djzeneyer.com"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

calc_lt() {
    python - "$1" "$2" <<'PY2'
import sys
a=float(sys.argv[1])
b=float(sys.argv[2])
print('1' if a < b else '0')
PY2
}

calc_ms() {
    python - "$1" <<'PY3'
import sys
print(int(float(sys.argv[1]) * 1000))
PY3
}

calc_pct() {
    python - "$1" "$2" <<'PY4'
import sys
num=int(sys.argv[1]); den=int(sys.argv[2])
print(0 if den == 0 else int((num * 100) / den))
PY4
}

echo "════════════════════════════════════════════════════════════════"
echo "🧪 TESTE DE SEO E IA - DJ ZEN EYER"
echo "Site: $SITE_URL"
echo "Data: $(date)"
echo "════════════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 1. TESTE DE ROBOTS.TXT
# ═══════════════════════════════════════════════════════════════════════════════

echo "📄 Testando robots.txt..."
ROBOTS_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/robots.txt")

if [ "$ROBOTS_HTTP" = "200" ]; then
    echo -e "${GREEN}✅ robots.txt acessível (HTTP $ROBOTS_HTTP)${NC}"
    
    # Baixar e validar conteúdo
    ROBOTS_CONTENT=$(curl -s "$SITE_URL/robots.txt")
    
    # Verificar diretivas essenciais
    if echo "$ROBOTS_CONTENT" | grep -q "User-agent:"; then
        echo -e "${GREEN}  ✅ Contém User-agent${NC}"
    else
        echo -e "${RED}  ❌ Sem User-agent${NC}"
    fi
    
    if echo "$ROBOTS_CONTENT" | grep -q "Sitemap:"; then
        echo -e "${GREEN}  ✅ Contém Sitemap${NC}"
        SITEMAP_URL=$(echo "$ROBOTS_CONTENT" | grep "Sitemap:" | head -1 | awk '{print $2}')
        echo "     URL: $SITEMAP_URL"
    else
        echo -e "${YELLOW}  ⚠️  Sem declaração de Sitemap${NC}"
    fi
    
    # Verificar diretivas NÃO-OFICIAIS (devem estar ausentes)
    if echo "$ROBOTS_CONTENT" | grep -q "AI-Training-Data:\|Request-rate:\|Model-Instruction:"; then
        echo -e "${RED}  ❌ ERRO: Contém diretivas não-oficiais!${NC}"
        echo "     Remova: AI-Training-Data, Request-rate, Model-Instruction"
    else
        echo -e "${GREEN}  ✅ Sem diretivas não-oficiais${NC}"
    fi
    
    # Verificar bots de IA
    if echo "$ROBOTS_CONTENT" | grep -q "GPTBot\|ClaudeBot\|Claude-Web"; then
        echo -e "${GREEN}  ✅ Configurado para bots de IA${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Sem configuração específica para IAs${NC}"
    fi
else
    echo -e "${RED}❌ robots.txt inacessível (HTTP $ROBOTS_HTTP)${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 2. TESTE DE AI-PLUGIN.JSON
# ═══════════════════════════════════════════════════════════════════════════════

echo "🤖 Testando .well-known/ai-plugin.json..."
AI_PLUGIN_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/.well-known/ai-plugin.json")

if [ "$AI_PLUGIN_HTTP" = "200" ]; then
    echo -e "${GREEN}✅ ai-plugin.json acessível (HTTP $AI_PLUGIN_HTTP)${NC}"
    
    # Baixar e validar JSON
    AI_PLUGIN_CONTENT=$(curl -s "$SITE_URL/.well-known/ai-plugin.json")
    
    # Verificar se é JSON válido
    if echo "$AI_PLUGIN_CONTENT" | jq . > /dev/null 2>&1; then
        echo -e "${GREEN}  ✅ JSON válido${NC}"
        
        # Extrair campos importantes
        NAME=$(echo "$AI_PLUGIN_CONTENT" | jq -r '.name_for_human // empty')
        DESC=$(echo "$AI_PLUGIN_CONTENT" | jq -r '.description_for_model // empty')
        
        if [ -n "$NAME" ]; then
            echo "     Nome: $NAME"
        fi
        if [ -n "$DESC" ]; then
            echo "     Descrição: ${DESC:0:80}..."
        fi
    else
        echo -e "${RED}  ❌ JSON inválido${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  ai-plugin.json não encontrado (HTTP $AI_PLUGIN_HTTP)${NC}"
    echo "   Considere criar: $SITE_URL/.well-known/ai-plugin.json"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 3. TESTE DE SITEMAPS
# ═══════════════════════════════════════════════════════════════════════════════

echo "🗺️  Testando sitemaps..."

SITEMAPS=(
    "sitemap.xml"
    "sitemap_index.xml"
    "sitemap-pages.xml"
    "sitemap-posts.xml"
    "sitemap-products.xml"
)

for sitemap in "${SITEMAPS[@]}"; do
    SITEMAP_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$sitemap")
    
    if [ "$SITEMAP_HTTP" = "200" ]; then
        echo -e "${GREEN}  ✅ $sitemap (HTTP $SITEMAP_HTTP)${NC}"
        
        # Contar URLs
        URL_COUNT=$(curl -s "$SITE_URL/$sitemap" | grep -o "<loc>" | wc -l)
        echo "     URLs: $URL_COUNT"
    else
        echo -e "${YELLOW}  ℹ️  $sitemap não encontrado (HTTP $SITEMAP_HTTP)${NC}"
    fi
done

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 4. TESTE DE META TAGS
# ═══════════════════════════════════════════════════════════════════════════════

echo "🏷️  Testando meta tags..."
HTML=$(curl -s "$SITE_URL/")

# Verificar meta robots
if echo "$HTML" | grep -q '<meta name="robots"'; then
    echo -e "${GREEN}  ✅ Meta robots presente${NC}"
    META_ROBOTS=$(echo "$HTML" | grep '<meta name="robots"' | head -1)
    echo "     $META_ROBOTS"
else
    echo -e "${YELLOW}  ⚠️  Meta robots ausente${NC}"
fi

# Verificar OpenGraph
if echo "$HTML" | grep -q '<meta property="og:'; then
    echo -e "${GREEN}  ✅ OpenGraph tags presentes${NC}"
else
    echo -e "${YELLOW}  ⚠️  OpenGraph tags ausentes${NC}"
fi

# Verificar JSON-LD
if echo "$HTML" | grep -q 'application/ld+json'; then
    echo -e "${GREEN}  ✅ JSON-LD structured data presente${NC}"
    JSON_LD_COUNT=$(echo "$HTML" | grep -o 'application/ld+json' | wc -l)
    echo "     Schemas: $JSON_LD_COUNT"
else
    echo -e "${YELLOW}  ⚠️  JSON-LD structured data ausente${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 5. TESTE DE CRAWLING COMO BOTS
# ═══════════════════════════════════════════════════════════════════════════════

echo "🤖 Testando acesso de bots..."

BOTS=(
    "Googlebot:Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    "GPTBot:Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)"
    "ClaudeBot:Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://www.anthropic.com)"
)

for bot in "${BOTS[@]}"; do
    BOT_NAME="${bot%%:*}"
    USER_AGENT="${bot#*:}"
    
    BOT_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -A "$USER_AGENT" "$SITE_URL/")
    
    if [ "$BOT_HTTP" = "200" ]; then
        echo -e "${GREEN}  ✅ $BOT_NAME pode acessar (HTTP $BOT_HTTP)${NC}"
    else
        echo -e "${RED}  ❌ $BOT_NAME bloqueado (HTTP $BOT_HTTP)${NC}"
    fi
done

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 6. TESTE DE PERFORMANCE
# ═══════════════════════════════════════════════════════════════════════════════

echo "⚡ Testando performance..."

# Tempo de resposta
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' "$SITE_URL/")
RESPONSE_TIME_MS=$(calc_ms "$RESPONSE_TIME")

if [ "$(calc_lt "$RESPONSE_TIME" "2.0")" = "1" ]; then
    echo -e "${GREEN}  ✅ Tempo de resposta: ${RESPONSE_TIME}s${NC}"
elif [ "$(calc_lt "$RESPONSE_TIME" "4.0")" = "1" ]; then
    echo -e "${YELLOW}  ⚠️  Tempo de resposta: ${RESPONSE_TIME}s (considere otimizar)${NC}"
else
    echo -e "${RED}  ❌ Tempo de resposta: ${RESPONSE_TIME}s (muito lento!)${NC}"
fi

# HTTPS
if curl -s "$SITE_URL/" | grep -q "https"; then
    echo -e "${GREEN}  ✅ HTTPS funcionando${NC}"
else
    echo -e "${YELLOW}  ⚠️  Verifique configuração HTTPS${NC}"
fi

# Compressão
COMPRESSION=$(curl -s -I -H "Accept-Encoding: gzip" "$SITE_URL/" | grep -i "content-encoding")
if echo "$COMPRESSION" | grep -q "gzip"; then
    echo -e "${GREEN}  ✅ Compressão gzip ativa${NC}"
else
    echo -e "${YELLOW}  ⚠️  Compressão gzip desativada${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 7. TESTE DE WORDPRESS REST API
# ═══════════════════════════════════════════════════════════════════════════════

echo "🔌 Testando WordPress REST API..."

REST_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/wp-json/")
if [ "$REST_HTTP" = "200" ]; then
    echo -e "${GREEN}  ✅ REST API acessível (HTTP $REST_HTTP)${NC}"
    
    # Testar endpoint customizado
    CUSTOM_API_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/wp-json/djzeneyer/v1/ai-context")
    if [ "$CUSTOM_API_HTTP" = "200" ]; then
        echo -e "${GREEN}  ✅ Endpoint /djzeneyer/v1/ai-context funcionando${NC}"
    else
        echo -e "${YELLOW}  ℹ️  Endpoint /djzeneyer/v1/ai-context não encontrado (HTTP $CUSTOM_API_HTTP)${NC}"
    fi
else
    echo -e "${RED}  ❌ REST API inacessível (HTTP $REST_HTTP)${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# 8. RESUMO FINAL
# ═══════════════════════════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════════════"
echo "📊 RESUMO DO TESTE"
echo "════════════════════════════════════════════════════════════════"

TOTAL_CHECKS=0
PASSED_CHECKS=0

# Contadores (ajuste conforme os testes acima)
if [ "$ROBOTS_HTTP" = "200" ]; then ((PASSED_CHECKS++)); fi
((TOTAL_CHECKS++))

if [ "$AI_PLUGIN_HTTP" = "200" ]; then ((PASSED_CHECKS++)); fi
((TOTAL_CHECKS++))

PASS_RATE=$(calc_pct "$PASSED_CHECKS" "$TOTAL_CHECKS")

echo ""
echo "Verificações: $PASSED_CHECKS/$TOTAL_CHECKS passaram ($PASS_RATE%)"
echo ""

if [ $PASS_RATE -ge 80 ]; then
    echo -e "${GREEN}🎉 Excelente! Seu site está bem otimizado para SEO e IAs${NC}"
elif [ $PASS_RATE -ge 50 ]; then
    echo -e "${YELLOW}⚠️  Bom, mas há melhorias a fazer${NC}"
else
    echo -e "${RED}❌ Atenção! Várias otimizações necessárias${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Para mais informações, consulte:"
echo "  - Google Search Console: https://search.google.com/search-console"
echo "  - Schema Validator: https://validator.schema.org/"
echo "  - PageSpeed: https://pagespeed.web.dev/"
echo "════════════════════════════════════════════════════════════════"
