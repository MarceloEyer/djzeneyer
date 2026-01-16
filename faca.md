# FACA.md - Tarefas Pendentes para o Site 100%

Este documento lista todas as tarefas necessárias para o site djzeneyer.com funcionar 100%.

---

## 🔴 CRÍTICO - Corrigir Imediatamente

### 1. Exportar hook `useMusicPlayer`
**Arquivo:** `src/contexts/MusicPlayerContext.tsx`
**Problema:** O hook `useMusicPlayer` está definido mas não exportado.
**Solução:** Adicionar `export { useMusicPlayer };` no final do arquivo.

### 2. Página de Contato não existe
**Problema:** Link `/contact` na AboutPage leva a 404.
**Solução:** 
- Criar `src/pages/ContactPage.tsx` OU
- Alterar o link em `AboutPage.tsx` (linha 361) para `/work-with-me`

### 3. API de Salvar Perfil não implementada
**Arquivo:** `src/pages/MyAccountPage.tsx`
**Problema:** O botão "Save Profile" apenas simula salvamento (TODO na linha ~340).
**Solução WordPress:**
1. Criar endpoint REST no plugin `zeneyer-auth`:
   ```php
   register_rest_route('zeneyer-auth/v1', '/profile', [
       'methods' => 'POST',
       'callback' => 'update_user_profile',
       'permission_callback' => 'is_user_logged_in'
   ]);
   ```
2. Salvar campos: `real_name`, `preferred_name`, `facebook_url`, `instagram_url`, `dance_role`, `gender`
3. Usar `update_user_meta()` para cada campo

---

## 🟠 IMPORTANTE - WordPress/Polylang

### 4. Configurar Polylang para rotas do React
**Problema:** O frontend React tem rotas traduzidas (`/about` → `/sobre`), mas o WordPress precisa saber disso.

**Solução no WordPress:**
1. Criar páginas no WordPress para cada rota (mesmo que vazias):
   - Home (EN) / Home (PT)
   - About (EN) / Sobre (PT)
   - Events (EN) / Eventos (PT)
   - Music (EN) / Música (PT)
   - News (EN) / Notícias (PT)
   - Zen Tribe (EN) / Tribo Zen (PT)
   - Work With Me (EN) / Contrate (PT)
   - Shop (EN) / Loja (PT)
   - FAQ (EN/PT)
   - Privacy Policy (EN) / Política de Privacidade (PT)
   - Terms (EN) / Termos (PT)
   - Code of Conduct (EN) / Código de Conduta (PT)

2. No Polylang, vincular cada página EN com sua tradução PT

3. Configurar slugs das páginas para corresponder às rotas React:
   - EN: `/about`, `/events`, `/music`, etc.
   - PT: `/sobre`, `/eventos`, `/musica`, etc.

### 5. Configurar hreflang no WordPress
**Arquivo:** `plugins/zen-seo-lite/includes/class-zen-seo-helpers.php`
**Status:** Já implementado, mas verificar se Polylang está ativo.

**Verificação:**
```php
// No wp-admin, verificar se retorna traduções:
var_dump(pll_get_post_translations(get_the_ID()));
```

### 6. Menu WordPress sincronizado com React
**Problema:** O menu pode estar hardcoded no React ou vindo do WordPress.
**Verificar:** `src/hooks/useMenu.ts` - se usa API do WordPress.

**Solução:**
1. Criar menu no WordPress (Aparência > Menus)
2. Criar menu em PT e EN separados
3. Vincular menus aos idiomas no Polylang
4. Garantir que o endpoint `djzeneyer/v1/menu` retorna o menu correto por idioma

---

## 🟡 MELHORIAS - Funcionalidades

### 7. Imagens Placeholder → Imagens Reais
**Arquivos criados como placeholder (SVG):**
- `/public/images/hero-background.svg` → Substituir por `.webp` real
- `/public/images/hero-background-mobile.svg` → Substituir por `.webp` real
- `/public/images/press-photo-1.svg` até `press-photo-6.svg` → Fotos reais
- `/public/images/events/mentoria-dj.svg` → Imagem real do evento
- `/public/images/events/zouk-experience.svg` → Imagem real do evento
- `/public/images/zen-eyer-og-image.svg` → Imagem OG real (1200x630px)

**Após substituir, atualizar referências:**
- `src/pages/HomePage.tsx` - voltar para `.webp`
- `src/pages/PressKitPage.tsx` - voltar para `.jpg`
- `src/pages/EventsPage.tsx` - voltar para `.jpg`

### 8. Newsletter Integration
**Arquivo:** `src/pages/MyAccountPage.tsx`
**Problema:** Toggle de newsletter não salva em lugar nenhum.
**Solução:** Integrar com Mailchimp, ConvertKit, ou lista do WordPress.

### 9. Carrinho WooCommerce
**Arquivo:** `src/contexts/CartContext.tsx`
**Status:** Estrutura básica existe.
**Verificar:**
- Endpoint `wc/store/v1/cart` está acessível
- CORS configurado para o domínio React
- Nonce sendo passado corretamente

### 10. Player de Música YouTube
**Arquivo:** `src/contexts/MusicPlayerContext.tsx`
**Status:** Implementado com `react-youtube`.
**Verificar:** Se o player aparece na UI e funciona.

---

## 🔵 PLUGINS WORDPRESS - Verificar Ativação

### 11. Plugins Necessários
Verificar se estão ativos no WordPress:

| Plugin | Caminho | Função |
|--------|---------|--------|
| Zen SEO Lite Pro | `zen-seo-lite/zen-seo-lite.php` | SEO, Schema.org, Meta tags |
| Zen-RA | `zen-ra/zen-ra.php` | Gamificação, Activity Feed |
| ZenEyer Auth | `zeneyer-auth/zeneyer-auth.php` | Autenticação JWT, Google Login |
| Zen-Bit | `zen-bit/zen-bit.php` | Funcionalidades extras |
| Polylang | (plugin externo) | Multilíngue |
| WooCommerce | (plugin externo) | Loja |
| GamiPress | (plugin externo) | Sistema de pontos/conquistas |

### 12. Endpoints REST Necessários
Verificar se respondem corretamente:

```bash
# Testar cada endpoint:
curl https://djzeneyer.com/wp-json/zeneyer-auth/v1/settings
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en
curl https://djzeneyer.com/wp-json/djzeneyer/v1/products?lang=en
curl https://djzeneyer.com/wp-json/zen-ra/v1/activity
curl https://djzeneyer.com/wp-json/wp/v2/posts?_embed
curl https://djzeneyer.com/wp-json/wp/v2/remixes?_embed
```

---

## 🟣 TRADUÇÕES - i18n

### 13. Verificar traduções completas
**Arquivos:**
- `src/locales/en/translation.json` (~600 chaves)
- `src/locales/pt/translation.json` (~605 chaves)

**Verificar:** Se todas as chaves usadas no código existem em ambos os arquivos.

### 14. Campos do perfil precisam de tradução
Adicionar em `translation.json`:
```json
{
  "profile": {
    "real_name": "Real Name / Nome Real",
    "real_name_hint": "For purchases and friend lists / Para compras e listas de amigos",
    "preferred_name": "Preferred Name / Nome Preferido",
    "preferred_name_hint": "How we'll call you / Como vamos te chamar",
    "dance_role": "Dance Role / Papel na Dança",
    "leader": "Leader / Condutor",
    "follower": "Follower / Conduzido",
    "gender": "Gender / Gênero",
    "male": "Male / Masculino",
    "female": "Female / Feminino",
    "non_binary": "Non-binary / Não-binário",
    "save_profile": "Save Profile / Salvar Perfil"
  }
}
```

---

## ⚪ OPCIONAL - Nice to Have

### 15. Página de Vídeos
**Status:** Comentado no `routes.ts` como "Adicionada rota de Videos" mas não existe.
**Solução:** Criar `src/pages/VideosPage.tsx` se necessário, ou usar YouTube embeds na MusicPage.

### 16. Recuperação de Senha
**Status:** Link existe no AuthModal mas funcionalidade não implementada.
**Solução:** Implementar endpoint `zeneyer-auth/v1/forgot-password`.

### 17. Verificação de Email
**Status:** Não implementado.
**Solução:** Enviar email de verificação após registro.

---

## 📋 CHECKLIST DE DEPLOY

Antes de considerar o site 100%:

- [ ] Todas as páginas carregam sem erro 404
- [ ] Login/Registro funcionam (email e Google)
- [ ] Troca de idioma EN↔PT funciona em todas as páginas
- [ ] Menu aparece corretamente em ambos idiomas
- [ ] Shop carrega produtos do WooCommerce
- [ ] Dashboard mostra dados reais do GamiPress
- [ ] News carrega posts do WordPress
- [ ] Music carrega tracks do CPT "remixes"
- [ ] Events carrega eventos
- [ ] Imagens de placeholder substituídas por reais
- [ ] SEO meta tags aparecem corretamente (verificar com View Source)
- [ ] Schema.org JSON-LD presente nas páginas
- [ ] hreflang tags presentes para EN e PT
- [ ] SSL funcionando (https://)
- [ ] Sitemap acessível em /sitemap.xml

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
```

---

**Última atualização:** Janeiro 2026
**Responsável:** DJ Zen Eyer Team
