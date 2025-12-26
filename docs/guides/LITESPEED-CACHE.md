# ⚡ LiteSpeed Cache - Configuração Otimizada para DJ Zen Eyer

**Versão:** 6.5+  
**Ambiente:** Hostinger com LiteSpeed  
**Arquitetura:** Headless WordPress + React SPA

---

## 🎯 Objetivo

Configurar LiteSpeed Cache para máxima performance sem quebrar a aplicação headless.

---

## ⚙️ Configurações Recomendadas

### **1. Cache Tab**

#### **Cache Control**
```
✅ Enable Cache: ON
✅ Cache Logged-in Users: OFF (importante para headless)
✅ Cache REST API: ON
✅ Cache Mobile: ON
✅ Cache Object: OFF (Hostinger não suporta Redis/Memcached)
✅ Cache Browser: ON
```

#### **TTL (Time To Live)**
```
Public Cache TTL: 604800 (7 dias)
Private Cache TTL: 1800 (30 minutos)
Front Page TTL: 604800 (7 dias)
Feed TTL: 0 (desabilitado)
REST TTL: 3600 (1 hora)
```

#### **Purge Rules**
```
✅ Purge All On Upgrade: ON
✅ Auto Purge Rules For Publish/Update:
   - All pages
   - Front page
   - Post/Page
   - Author
   - Year/Month/Date
```

---

### **2. CDN Tab**

#### **Cloudflare Integration**
```
✅ Use Cloudflare API: ON
Cloudflare API: [Seu token da Cloudflare]
Cloudflare Email: [Seu email]
Cloudflare Domain: djzeneyer.com
```

#### **CDN Mapping**
```
Original URL: https://djzeneyer.com
CDN URL: https://djzeneyer.com (Cloudflare proxy)
```

---

### **3. Image Optimization**

```
❌ Auto Pull Images: OFF (React já otimiza)
❌ WebP Replacement: OFF (Vite já gera WebP)
❌ Lazy Load Images: OFF (React lazy load)
```

**Motivo:** React/Vite já fazem otimização de imagens. Deixar LiteSpeed fazer isso pode causar conflitos.

---

### **4. Page Optimization**

#### **CSS Settings**
```
✅ CSS Minify: ON
✅ CSS Combine: OFF (pode quebrar Tailwind)
✅ Load CSS Asynchronously: OFF (React controla)
✅ Generate Critical CSS: OFF (React SSR não usado)
```

#### **JS Settings**
```
✅ JS Minify: OFF (Vite já minifica)
✅ JS Combine: OFF (pode quebrar módulos ES6)
✅ Load JS Deferred: OFF (React controla)
```

#### **HTML Settings**
```
✅ HTML Minify: ON
✅ DNS Prefetch: ON
   - https://fonts.googleapis.com
   - https://fonts.gstatic.com
```

---

### **5. Database Optimization**

```
✅ Database Optimizer: ON
✅ Revisions: Keep 5
✅ Auto Drafts: Clean
✅ Trashed Posts: Clean after 7 days
✅ Spam Comments: Clean
✅ Optimize Tables: Weekly
```

---

### **6. Object Cache**

```
❌ Object Cache: OFF
```

**Motivo:** Hostinger não oferece Redis/Memcached no plano atual. Quando disponível, ativar.

---

### **7. Browser Cache**

```
✅ Browser Cache: ON
Browser Cache TTL: 31557600 (1 ano)
```

---

### **8. Advanced Settings**

#### **Excludes**
```
Do Not Cache URIs:
/wp-admin/
/wp-json/zeneyer-auth/
/cart/
/checkout/
/my-account/

Do Not Cache Query Strings:
s (search)
utm_*
fbclid
gclid

Do Not Cache Categories:
(deixar vazio)

Do Not Cache Tags:
(deixar vazio)

Do Not Cache Cookies:
wordpress_logged_in_*
woocommerce_*
```

#### **Cache Control**
```
✅ Cache REST API: ON
✅ Cache Login Page: OFF
✅ Cache favicon.ico: ON
✅ Cache PHP Resources: OFF
```

---

## 🚫 O Que NÃO Fazer

### ❌ **Não Ativar:**
1. **CSS/JS Combine** - Quebra módulos ES6 do React
2. **Lazy Load** - React já faz isso
3. **WebP Conversion** - Vite já converte
4. **Critical CSS** - Não funciona com SPA
5. **Object Cache** - Hostinger não suporta ainda

### ❌ **Não Cachear:**
1. `/wp-json/zeneyer-auth/*` - Autenticação deve ser dinâmica
2. `/cart/` - Carrinho é dinâmico
3. `/checkout/` - Checkout é dinâmico
4. `/my-account/` - Conta do usuário é dinâmica

---

## ✅ Verificação Pós-Configuração

### **1. Testar Cache**

```bash
# Verificar headers de cache
curl -I https://djzeneyer.com

# Deve retornar:
X-LiteSpeed-Cache: hit
Cache-Control: public, max-age=604800
```

### **2. Testar REST API**

```bash
# API deve funcionar normalmente
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en

# Deve retornar JSON válido
```

### **3. Testar Autenticação**

```bash
# Login deve funcionar
# Testar no navegador: https://djzeneyer.com
# Fazer login e verificar se mantém sessão
```

---

## 🔄 Purge de Cache

### **Manual**
```
WordPress Admin → LiteSpeed Cache → Purge All
```

### **Automático (já configurado)**
- Ao publicar/atualizar post
- Ao atualizar produto WooCommerce
- Ao atualizar menu
- Ao atualizar tema

### **Via API (para CI/CD)**
```bash
# Adicionar ao deploy.yml se necessário
curl -X PURGE https://djzeneyer.com/
```

---

## 📊 Performance Esperada

### **Antes do LiteSpeed Cache**
- TTFB: ~800ms
- LCP: ~2.5s
- FCP: ~1.8s

### **Depois do LiteSpeed Cache**
- TTFB: ~100ms (-87%)
- LCP: ~1.2s (-52%)
- FCP: ~0.8s (-55%)

---

## 🐛 Troubleshooting

### **Problema: Site não carrega após ativar cache**
```
Solução:
1. WordPress Admin → LiteSpeed Cache → Purge All
2. Desativar "CSS Combine" e "JS Combine"
3. Limpar cache do navegador (Ctrl+Shift+Delete)
```

### **Problema: Login não funciona**
```
Solução:
1. Verificar se /wp-json/zeneyer-auth/ está em "Do Not Cache URIs"
2. Verificar se wordpress_logged_in_* está em "Do Not Cache Cookies"
3. Purge All
```

### **Problema: Carrinho não atualiza**
```
Solução:
1. Adicionar /cart/ e /checkout/ em "Do Not Cache URIs"
2. Adicionar woocommerce_* em "Do Not Cache Cookies"
3. Purge All
```

### **Problema: React não carrega**
```
Solução:
1. Desativar "JS Minify" e "JS Combine"
2. Desativar "CSS Combine"
3. Purge All
4. Verificar console do navegador para erros
```

---

## 🔧 Configuração Avançada (Opcional)

### **ESI (Edge Side Includes)**
```
❌ Enable ESI: OFF
```
**Motivo:** Não necessário para SPA. Aumenta complexidade.

### **Vary Group**
```
❌ Enable Vary Group: OFF
```
**Motivo:** Não temos versões mobile/desktop diferentes.

### **Crawler**
```
✅ Crawler: ON
Crawl Interval: 604800 (7 dias)
Crawl Threads: 3
```
**Motivo:** Pre-aquece cache para melhor performance.

---

## 📝 Checklist de Configuração

- [ ] Cache ativado
- [ ] TTL configurado (7 dias)
- [ ] REST API cache ativado (1 hora)
- [ ] Cloudflare integrado
- [ ] Excludes configurados (/wp-json/zeneyer-auth/, /cart/, etc)
- [ ] CSS/JS Combine desativados
- [ ] Image Optimization desativada
- [ ] Database Optimizer ativado
- [ ] Browser Cache ativado (1 ano)
- [ ] Purge rules configuradas
- [ ] Testado login
- [ ] Testado carrinho
- [ ] Testado REST API
- [ ] Performance verificada (PageSpeed Insights)

---

## 🚀 Próximos Passos

1. **Ativar Object Cache** quando Hostinger disponibilizar Redis
2. **Configurar Crawler** para pre-aquecer cache
3. **Monitorar logs** em LiteSpeed Cache → Toolbox → Debug Log

---

## 📞 Suporte

**Problemas com LiteSpeed Cache?**
- Documentação oficial: https://docs.litespeedtech.com/lscache/
- Suporte Hostinger: https://www.hostinger.com.br/contato
- GitHub Issues: https://github.com/litespeedtech/lscache_wp

---

**Última atualização:** 2025-11-27  
**Testado em:** Hostinger Business Plan + LiteSpeed 6.5
