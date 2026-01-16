# FACA.md - Tarefas Pendentes para o Site 100%

Este documento lista todas as tarefas necessárias para o site djzeneyer.com funcionar 100%.

---

## ✅ CONCLUÍDO

### 1. ~~Exportar hook `useMusicPlayer`~~
✅ Corrigido - hook agora é exportado corretamente.

### 2. ~~Link de contato na AboutPage~~
✅ Corrigido - agora abre WhatsApp com mensagem personalizada.

### 3. ~~API de Salvar Perfil~~
✅ Implementado - endpoint `zeneyer-auth/v1/profile` criado no WordPress.
- GET: busca dados do perfil
- POST: salva dados do perfil
- Campos: `real_name`, `preferred_name`, `facebook_url`, `instagram_url`, `dance_role`, `gender`

### 4. ~~Páginas WordPress/Polylang~~
✅ Criadas 40 páginas vinculadas pelo Polylang.

### 6. ~~Menu WordPress~~
✅ Funcionando perfeitamente.

---

## 🟠 IMPORTANTE - Verificar Slugs

### 5. Verificar slugs das páginas WordPress vs rotas React

**Suas páginas WordPress (40 total):**

| Página PT | Página EN | Slug PT esperado | Slug EN esperado |
|-----------|-----------|------------------|------------------|
| Início | International Brazilian Zouk DJ... | `/` | `/` |
| Sobre | About | `/sobre` | `/about` |
| Eventos | Events | `/eventos` | `/events` |
| Música | Music | `/musica` | `/music` |
| Notícias | News | `/noticias` | `/news` |
| Tribo Zen | Zen Tribe | `/tribo-zen` | `/zen-tribe` |
| Trabalhe Comigo | Work With Me | `/contrate` | `/work-with-me` |
| Loja | Shop | `/loja` | `/shop` |
| FAQ | FAQ | `/faq` | `/faq` |
| Política de Privacidade | Privacy Policy | `/politica-de-privacidade` | `/privacy-policy` |
| Termos | Terms | `/termos` | `/terms` |
| Código de Conduta | Code of Conduct | `/conduta` | `/conduct` |
| Na Mídia | Media | `/midia` | `/media` |
| Minha Conta | My Account | `/minha-conta` | `/my-account` |
| Carrinho | Cart | `/carrinho` | `/cart` |
| Finalizar de Compra | Checkout | `/finalizar-compra` | `/checkout` |

**Páginas extras que você criou (não estão no React):**
- Apoie o Artista / Support the Artist
- Compra de Ingressos / Tickets Checkout
- Encomenda Completa / Tickets Order
- Política de Reembolso e Devoluções / Return Policy

**Ação necessária:**
Se você mudou algum slug para SEO, precisa atualizar o arquivo `src/data/routeMap.json` e `src/config/routes.ts` para corresponder.

**Exemplo:** Se você mudou `/about` para `/about-zen-eyer`, precisa atualizar:
```json
// src/data/routeMap.json
"about": {
  "en": "/about-zen-eyer",  // ← novo slug
  "pt": "/sobre"
}
```

**Páginas que podem ser deletadas (não usadas pelo React):**
- Apoie o Artista / Support the Artist (a menos que queira criar rota)
- Compra de Ingressos / Tickets Checkout (WooCommerce usa checkout padrão)
- Encomenda Completa / Tickets Order (WooCommerce usa order padrão)
- Política de Reembolso / Return Policy (pode manter para SEO)

---

## 🟡 MELHORIAS - Funcionalidades

### 7. Imagens Placeholder → Imagens Reais
**Arquivos criados como placeholder (SVG):**

| Arquivo | Formato Final | Tamanho Recomendado |
|---------|---------------|---------------------|
| `/public/images/hero-background.svg` | `.webp` | 1920x1080px |
| `/public/images/hero-background-mobile.svg` | `.webp` | 768x1024px |
| `/public/images/press-photo-1.svg` até `6.svg` | `.jpg` | 800x800px (quadrado) |
| `/public/images/events/mentoria-dj.svg` | `.jpg` | 800x600px |
| `/public/images/events/zouk-experience.svg` | `.jpg` | 800x600px |
| `/public/images/zen-eyer-og-image.svg` | `.jpg` | 1200x630px (OG padrão) |

**IMPORTANTE:** Após substituir as imagens, NÃO precisa mudar extensão no código se usar o mesmo nome. Exemplo: se você criar `hero-background.webp`, o código já aponta para `.webp`.

### 8. Newsletter Integration com MailPoet
**Arquivo:** `src/pages/MyAccountPage.tsx`
**Problema:** Toggle de newsletter não salva.

**Solução com MailPoet:**
1. No WordPress, criar lista "Zen Tribe Newsletter" no MailPoet
2. Adicionar endpoint no plugin `zeneyer-auth`:
```php
// Em class-rest-routes.php, adicionar:
register_rest_route(self::NAMESPACE, '/newsletter', [
    'methods' => 'POST',
    'callback' => [__CLASS__, 'toggle_newsletter'],
    'permission_callback' => [__CLASS__, 'check_auth'],
]);

public static function toggle_newsletter($request) {
    $user_id = self::get_user_id_from_token($request);
    $enabled = $request->get_param('enabled');
    
    if ($enabled) {
        // Adicionar à lista MailPoet
        $subscriber = \MailPoet\Models\Subscriber::findOne($user_id);
        // ... lógica de adicionar à lista
    } else {
        // Remover da lista
    }
}
```

### 9. Verificação de Email após Registro
**Status:** Não implementado.
**Prioridade:** Média

**Solução:**
1. Após registro, gerar token de verificação
2. Enviar email com link de verificação
3. Criar endpoint para verificar token
4. Marcar usuário como verificado

---

## 🔵 PLUGINS WORDPRESS - Verificar

### 10. Plugins Necessários
Verificar se estão ativos:

| Plugin | Status | Função |
|--------|--------|--------|
| Zen SEO Lite Pro | ⬜ Verificar | SEO, Schema.org |
| Zen-RA | ⬜ Verificar | Gamificação |
| ZenEyer Auth | ⬜ Verificar | Autenticação JWT |
| Polylang | ✅ Ativo | Multilíngue |
| WooCommerce | ⬜ Verificar | Loja |
| GamiPress | ⬜ Verificar | Pontos/conquistas |
| MailPoet | ⬜ Verificar | Newsletter |

### 11. Testar Endpoints REST
```bash
# Testar cada endpoint:
curl https://djzeneyer.com/wp-json/zeneyer-auth/v1/settings
curl https://djzeneyer.com/wp-json/zeneyer-auth/v1/profile  # (com token)
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en
curl https://djzeneyer.com/wp-json/djzeneyer/v1/products?lang=en
curl https://djzeneyer.com/wp-json/zen-ra/v1/activity
curl https://djzeneyer.com/wp-json/wp/v2/posts?_embed
curl https://djzeneyer.com/wp-json/wp/v2/remixes?_embed
```

---

## 🟣 TRADUÇÕES - i18n

### 12. ~~Traduções dos campos de perfil~~
✅ Concluído - traduções adicionadas em ambos arquivos:
- `src/locales/en/translation.json`
- `src/locales/pt/translation.json`

Chaves adicionadas: `profile.title`, `profile.real_name`, `profile.preferred_name`, `profile.dance_role`, `profile.leader`, `profile.follower`, `profile.gender`, `profile.male`, `profile.female`, `profile.non_binary`, `profile.save`, etc.

---

## 📋 CHECKLIST DE DEPLOY

- [x] Páginas WordPress criadas e vinculadas no Polylang
- [x] Menu funcionando
- [x] API de perfil implementada
- [ ] Verificar slugs correspondem às rotas React
- [ ] Imagens placeholder substituídas por reais
- [ ] Newsletter integrada com MailPoet
- [ ] Testar login/registro (email e Google)
- [ ] Testar troca de idioma EN↔PT
- [ ] Shop carrega produtos
- [ ] Dashboard mostra dados GamiPress
- [ ] News carrega posts
- [ ] Music carrega tracks
- [ ] SEO meta tags corretas
- [ ] hreflang tags presentes
- [ ] Sitemap acessível

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Rebuild do frontend
npm run build

# Verificar TypeScript
npx tsc --noEmit

# Gerar sitemap
npm run gen:sitemap

# No WordPress - Flush rewrite rules
wp rewrite flush

# Verificar plugins ativos
wp plugin list --status=active

# Deploy para produção (após build)
# Copiar pasta dist/ para o servidor
```

---

**Última atualização:** Janeiro 2026
**Responsável:** DJ Zen Eyer Team
