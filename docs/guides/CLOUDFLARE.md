# ☁️ Cloudflare - Configuração Otimizada para DJ Zen Eyer

**Plano:** Free ✅ (Tudo configurado para plano gratuito)  
**Domínio:** djzeneyer.com  
**Arquitetura:** Headless WordPress + React SPA

> **Nota:** Este guia é 100% compatível com o plano Free. Recursos Pro são marcados como [PRO] e são opcionais.

---

## 🎯 Objetivo

Configurar Cloudflare para CDN global, proteção DDoS, e otimização de performance.

---

## 🆓 Plano Free - O Que Você Tem

### **✅ Incluído no Free (Tudo que você precisa!)**

```
✅ CDN Global (200+ data centers)
✅ DDoS Protection (ilimitado)
✅ SSL/TLS (certificado grátis)
✅ DNS (mais rápido do mundo)
✅ Cache (ilimitado)
✅ Auto Minify (JS, CSS, HTML)
✅ Brotli Compression
✅ HTTP/2 e HTTP/3
✅ Bot Fight Mode
✅ 3 Page Rules
✅ 5 Firewall Rules
✅ Web Analytics
✅ Always Online
✅ Email Obfuscation
```

### **❌ Não Incluído no Free (Não essencial)**

```
❌ WAF (Web Application Firewall) - Use Wordfence
❌ Rate Limiting avançado - Use Wordfence
❌ Image Optimization - Vite já faz
❌ Mobile Optimization - React já faz
❌ Workers (100k requests/dia) - Não necessário
❌ Argo Smart Routing - Bom ter, mas não essencial
❌ 20 Page Rules - 3 são suficientes
❌ Load Balancing - Não necessário (1 servidor)
```

### **💡 Alternativas para Recursos Pro**

| Recurso Pro | Alternativa Free |
|-------------|------------------|
| WAF | Wordfence Security (WordPress) |
| Rate Limiting | Wordfence + LiteSpeed |
| Image Optimization | Vite build process |
| Workers | .htaccess no servidor |
| 20 Page Rules | 3 regras bem configuradas |

**Conclusão:** O plano Free é **mais que suficiente** para o seu site!

---

## ⚡ Setup Rápido (5 minutos - Plano Free)

Se você quer configurar rápido, siga apenas isso:

### **1. DNS** ✅
```
A    @      147.79.84.222    Proxy ON (nuvem laranja)
A    www    147.79.84.222    Proxy ON (nuvem laranja)
```

### **2. SSL/TLS** ✅
```
Encryption Mode: Full (strict)
Always Use HTTPS: ON
```

### **3. Speed** ✅
```
Auto Minify: JS, CSS, HTML = ON
Brotli: ON
Rocket Loader: OFF
```

### **4. Page Rules (3 regras)** ✅
```
1. djzeneyer.com/wp-content/themes/zentheme/dist/*
   → Cache Everything

2. djzeneyer.com/wp-json/*
   → Bypass Cache

3. djzeneyer.com/wp-admin/*
   → Bypass Cache + Security High
```

### **5. Firewall Rules (2 essenciais)** ✅
```
1. Block bad bots (não verified)
2. Rate limit /wp-login.php (5 requests/5min)
```

**Pronto!** Isso já dá 80% dos benefícios. O resto é otimização.

---

## 🚀 Setup Completo (Detalhado)

### **1. DNS Configuration**

```
Tipo    Nome    Conteúdo              Proxy   TTL
A       @       147.79.84.222         ✅ ON   Auto
A       www     147.79.84.222         ✅ ON   Auto
CNAME   *       djzeneyer.com         ✅ ON   Auto
```

**⚠️ Importante:** Proxy (nuvem laranja) deve estar **ON** para CDN funcionar.

---

## ⚙️ Configurações Recomendadas

### **2. SSL/TLS**

#### **Overview**
```
Encryption Mode: Full (strict)
```

**Motivo:** Hostinger tem SSL válido. "Full (strict)" garante criptografia end-to-end.

#### **Edge Certificates**
```
✅ Always Use HTTPS: ON
✅ HTTP Strict Transport Security (HSTS): ON
   - Max Age: 12 months
   - Include subdomains: ON
   - Preload: ON
✅ Minimum TLS Version: TLS 1.2
✅ Opportunistic Encryption: ON
✅ TLS 1.3: ON
✅ Automatic HTTPS Rewrites: ON
✅ Certificate Transparency Monitoring: ON
```

---

### **3. Speed → Optimization**

#### **Auto Minify**
```
✅ JavaScript: ON
✅ CSS: ON
✅ HTML: ON
```

**Motivo:** Cloudflare minifica antes de servir. Não conflita com Vite.

#### **Brotli**
```
✅ Brotli: ON
```

**Motivo:** Compressão melhor que Gzip (~20% menor).

#### **Early Hints**
```
✅ Early Hints: ON
```

**Motivo:** Envia headers antes do HTML, acelera carregamento.

#### **Rocket Loader**
```
❌ Rocket Loader: OFF
```

**Motivo:** Pode quebrar React. Vite já otimiza JS.

---

### **4. Caching**

#### **Configuration**
```
Caching Level: Standard
Browser Cache TTL: Respect Existing Headers
```

#### **Cache Rules (Page Rules)**

> **⚠️ Plano Free:** Limite de **3 Page Rules**. Escolha as mais importantes!

**Regra 1: Cache Everything (Static Assets)** - PRIORIDADE ALTA
```
URL: djzeneyer.com/wp-content/themes/zentheme/dist/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

**Regra 2: Bypass Cache (API)** - PRIORIDADE ALTA
```
URL: djzeneyer.com/wp-json/*
Settings:
  - Cache Level: Bypass
```

**Regra 3: Bypass Cache (Admin)** - PRIORIDADE MÉDIA
```
URL: djzeneyer.com/wp-admin/*
Settings:
  - Cache Level: Bypass
  - Security Level: High
```

**Regra 4 [OPCIONAL - Requer upgrade para Pro]:** Cache Everything (Homepage)
```
URL: djzeneyer.com/
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 2 hours
```

**Recomendação para Free:** Use apenas as 3 primeiras regras. A homepage já será cacheada automaticamente pelo Cloudflare.

---

### **5. Security**

#### **Security Level**
```
Security Level: Medium
```

**Motivo:** "High" pode bloquear usuários legítimos.

#### **Challenge Passage**
```
Challenge Passage: 30 minutes
```

#### **Browser Integrity Check**
```
✅ Browser Integrity Check: ON
```

#### **Privacy Pass Support**
```
✅ Privacy Pass Support: ON
```

#### **Security Headers**
```
✅ Enable Security Headers: ON
```

---

### **6. Firewall Rules**

#### **Regra 1: Block Bad Bots**
```
Expression: (cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler"})
Action: Block
```

#### **Regra 2: Rate Limit Login**
```
Expression: (http.request.uri.path contains "/wp-login.php") and (rate(5m) > 5)
Action: Challenge (CAPTCHA)
```

#### **Regra 3: Block Countries (Opcional)**
```
Expression: (ip.geoip.country in {"CN" "RU" "KP"})
Action: Block
```

**Motivo:** Reduz spam e ataques. Ajuste conforme necessário.

#### **Regra 4: Allow API from Anywhere**
```
Expression: (http.request.uri.path contains "/wp-json/")
Action: Allow
```

---

### **7. Network**

#### **HTTP/2**
```
✅ HTTP/2: ON
```

#### **HTTP/3 (QUIC)**
```
✅ HTTP/3 (with QUIC): ON
```

**Motivo:** Protocolo mais rápido que HTTP/2.

#### **0-RTT Connection Resumption**
```
✅ 0-RTT: ON
```

**Motivo:** Reduz latência em conexões repetidas.

#### **IPv6 Compatibility**
```
✅ IPv6 Compatibility: ON
```

#### **WebSockets**
```
✅ WebSockets: ON
```

**Motivo:** Pode ser usado no futuro para features real-time.

---

### **8. Scrape Shield**

```
✅ Email Address Obfuscation: ON
✅ Server-side Excludes: ON
✅ Hotlink Protection: OFF (pode quebrar imagens)
```

---

### **9. Workers [PRO]**

> **Plano Free:** Workers não disponível. Use `.htaccess` no servidor para security headers (já configurado no guia WordPress).

---

## 🔄 Purge de Cache

### **Manual**
```
Cloudflare Dashboard → Caching → Purge Cache → Purge Everything
```

### **Via API (para CI/CD)**

Adicionar ao `deploy.yml`:

```yaml
- name: 🧹 Purge Cloudflare Cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'
```

**Secrets necessários:**
- `CLOUDFLARE_ZONE_ID` - ID da zona (encontrar no dashboard)
- `CLOUDFLARE_API_TOKEN` - Token com permissão "Zone.Cache Purge"

---

## 📊 Performance Esperada

### **Antes do Cloudflare**
- TTFB (Brasil): ~200ms
- TTFB (Europa): ~800ms
- TTFB (EUA): ~600ms

### **Depois do Cloudflare**
- TTFB (Brasil): ~50ms (-75%)
- TTFB (Europa): ~100ms (-87%)
- TTFB (EUA): ~80ms (-86%)

---

## 🌍 Analytics

### **Web Analytics (Free)**
```
Cloudflare Dashboard → Analytics → Web Analytics
```

Métricas disponíveis:
- Page views
- Unique visitors
- Bandwidth
- Threats blocked
- Cache hit rate

### **Cache Analytics**
```
Cloudflare Dashboard → Caching → Analytics
```

Verificar:
- Cache hit rate (ideal: >90%)
- Bandwidth saved
- Requests served from cache

---

## 🐛 Troubleshooting

### **Problema: Site não carrega (Error 522)**
```
Causa: Servidor origin não responde
Solução:
1. Verificar se Hostinger está online
2. Verificar se IP no DNS está correto (147.79.84.222)
3. Temporariamente desativar proxy (nuvem cinza)
```

### **Problema: SSL Error (Error 525)**
```
Causa: SSL no origin inválido
Solução:
1. Mudar SSL/TLS mode para "Flexible" temporariamente
2. Verificar SSL no Hostinger
3. Voltar para "Full (strict)"
```

### **Problema: API não funciona (CORS)**
```
Causa: Cloudflare bloqueando CORS
Solução:
1. Criar Page Rule para /wp-json/* com "Cache Level: Bypass"
2. Verificar se Security Level não está em "I'm Under Attack"
```

### **Problema: Login não funciona**
```
Causa: Cache ou Firewall bloqueando
Solução:
1. Criar Page Rule para /wp-admin/* com "Cache Level: Bypass"
2. Verificar Firewall Rules
3. Adicionar IP do servidor em IP Access Rules (Allow)
```

### **Problema: Imagens não carregam**
```
Causa: Hotlink Protection ativado
Solução:
1. Desativar Hotlink Protection
2. Ou adicionar domínios permitidos
```

---

## 🔒 Security Best Practices

### **1. Enable Bot Fight Mode (Free)**
```
Cloudflare Dashboard → Security → Bots → Configure
✅ Bot Fight Mode: ON
```

### **2. Enable DDoS Protection**
```
Já ativado por padrão no plano Free
```

### **3. Enable Rate Limiting [PRO]**
```
❌ Não disponível no plano Free
Alternativa: Use Wordfence no WordPress (já configurado)
```

### **4. Enable WAF [PRO]**
```
❌ Não disponível no plano Free
Alternativa: Use Wordfence no WordPress (já configurado)
```

---

## 📝 Checklist de Configuração

- [ ] DNS configurado (proxy ON)
- [ ] SSL/TLS em "Full (strict)"
- [ ] HSTS ativado
- [ ] Auto Minify ativado (JS, CSS, HTML)
- [ ] Brotli ativado
- [ ] Early Hints ativado
- [ ] Rocket Loader desativado
- [ ] Page Rules criadas (4 regras)
- [ ] Firewall Rules criadas (4 regras)
- [ ] HTTP/3 ativado
- [ ] 0-RTT ativado
- [ ] Security Level em "Medium"
- [ ] Bot Fight Mode ativado
- [ ] Cache hit rate >90%
- [ ] Performance testada (PageSpeed Insights)

---

## 🚀 Próximos Passos (Opcional)

### **Quando Considerar Upgrade para Pro ($20/mês)?**

Só vale a pena se você tiver:
- [ ] Mais de 100.000 visitantes/mês
- [ ] Ataques DDoS frequentes (além do que Free protege)
- [ ] Necessidade de WAF avançado
- [ ] Múltiplos sites (Pro cobre 1 site)

**Para o seu caso atual:** Plano Free é **perfeito**! ✅

### **Alternativas Gratuitas Melhores que Pro:**

1. **LiteSpeed Cache** (já tem no Hostinger)
   - Melhor que Image Optimization do Cloudflare Pro
   - Melhor que Mobile Optimization do Cloudflare Pro

2. **Wordfence Security** (grátis no WordPress)
   - Melhor que WAF básico do Cloudflare Pro
   - Rate limiting incluído

3. **Vite Build** (já usa)
   - Melhor que qualquer otimização do Cloudflare
   - Minificação, tree-shaking, code splitting

---

## 📞 Suporte

**Problemas com Cloudflare?**
- Documentação: https://developers.cloudflare.com/
- Community: https://community.cloudflare.com/
- Status: https://www.cloudflarestatus.com/

---

**Última atualização:** 2025-11-27  
**Testado em:** Cloudflare Free Plan
