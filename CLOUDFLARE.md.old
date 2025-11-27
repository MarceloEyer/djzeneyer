# ☁️ Cloudflare - Configuração Otimizada para DJ Zen Eyer

**Plano:** Free (ou Pro se disponível)  
**Domínio:** djzeneyer.com  
**Arquitetura:** Headless WordPress + React SPA

---

## 🎯 Objetivo

Configurar Cloudflare para CDN global, proteção DDoS, e otimização de performance.

---

## 🚀 Setup Inicial

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

**Regra 1: Cache Everything (Static Assets)**
```
URL: djzeneyer.com/wp-content/themes/zentheme/dist/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 year
```

**Regra 2: Bypass Cache (API)**
```
URL: djzeneyer.com/wp-json/*
Settings:
  - Cache Level: Bypass
```

**Regra 3: Bypass Cache (Admin)**
```
URL: djzeneyer.com/wp-admin/*
Settings:
  - Cache Level: Bypass
  - Security Level: High
```

**Regra 4: Cache Everything (Homepage)**
```
URL: djzeneyer.com/
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 2 hours
```

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

### **9. Workers (Opcional - Plano Pro)**

Se tiver plano Pro, criar Worker para:

```javascript
// Exemplo: Adicionar security headers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)
  
  // Security headers
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

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

### **3. Enable Rate Limiting (Pro)**
```
Se tiver plano Pro:
- 10 requests/minute para /wp-login.php
- 100 requests/minute para /wp-json/
```

### **4. Enable WAF (Pro)**
```
Se tiver plano Pro:
- OWASP Core Ruleset
- Cloudflare Managed Ruleset
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

## 🚀 Próximos Passos

1. **Upgrade para Pro** ($20/mês) para:
   - WAF (Web Application Firewall)
   - Rate Limiting avançado
   - Image Optimization
   - Mobile Optimization
   - 20 Page Rules (vs 3 no Free)

2. **Configurar Workers** para:
   - A/B testing
   - Personalization
   - Edge computing

3. **Ativar Argo Smart Routing** ($5/mês):
   - Reduz latência em 30%
   - Roteamento inteligente

---

## 📞 Suporte

**Problemas com Cloudflare?**
- Documentação: https://developers.cloudflare.com/
- Community: https://community.cloudflare.com/
- Status: https://www.cloudflarestatus.com/

---

**Última atualização:** 2025-11-27  
**Testado em:** Cloudflare Free Plan
