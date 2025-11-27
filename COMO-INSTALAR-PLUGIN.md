# 🚀 Como Instalar o Zen SEO Lite Pro v8.0.0

## Opção 1: Upload via WordPress Admin (Mais Fácil)

### Passo 1: Criar o arquivo ZIP

```bash
# No seu computador, navegue até a pasta do projeto
cd /workspaces/djzeneyer

# Crie o arquivo ZIP
zip -r zen-seo-lite.zip zen-seo-lite/
```

### Passo 2: Upload no WordPress

1. Acesse **WordPress Admin**
2. Vá em **Plugins → Adicionar Novo**
3. Clique em **Enviar Plugin**
4. Clique em **Escolher Arquivo**
5. Selecione `zen-seo-lite.zip`
6. Clique em **Instalar Agora**
7. Clique em **Ativar Plugin**

✅ **Pronto!** Plugin instalado e ativado.

---

## Opção 2: Upload via FTP/SFTP

### Passo 1: Conectar ao servidor

Use FileZilla, Cyberduck ou qualquer cliente FTP/SFTP.

### Passo 2: Upload da pasta

1. Navegue até `/wp-content/plugins/`
2. Faça upload da pasta `zen-seo-lite` completa
3. Aguarde o upload terminar

### Passo 3: Ativar no WordPress

1. Acesse **WordPress Admin**
2. Vá em **Plugins**
3. Encontre **Zen SEO Lite Pro**
4. Clique em **Ativar**

✅ **Pronto!** Plugin instalado e ativado.

---

## Opção 3: Via SSH (Para Desenvolvedores)

```bash
# 1. Conectar ao servidor
ssh usuario@seu-servidor.com

# 2. Navegar até plugins
cd /var/www/html/wp-content/plugins/

# 3. Fazer upload (escolha um método)

# Método A: Git clone (se tiver repositório)
git clone https://github.com/seu-usuario/zen-seo-lite.git

# Método B: SCP (do seu computador)
# No seu computador local:
scp -r zen-seo-lite/ usuario@servidor:/var/www/html/wp-content/plugins/

# Método C: WP-CLI
wp plugin install zen-seo-lite.zip --activate
```

✅ **Pronto!** Plugin instalado e ativado.

---

## Configuração Inicial (5 minutos)

### 1. Acessar Configurações

WordPress Admin → **Zen SEO** → **Settings**

### 2. Preencher Campos Essenciais

#### Identidade & Negócios
- **Nome Completo**: Marcelo Eyer Fernandes
- **Email de Booking**: booking@djzeneyer.com
- **CNPJ**: 44.063.765/0001-46

#### Imagem Padrão
- Upload uma imagem 1200x630px
- Ou cole a URL: `https://djzeneyer.com/wp-content/uploads/og-image.jpg`

#### React Routes
Cole isso:
```
/, /pt/
/about, /pt/sobre
/events, /pt/eventos
/music, /pt/musica
/tribe, /pt/tribo
/shop, /pt/loja
/dashboard, /pt/painel
/my-account, /pt/minha-conta
/faq, /pt/faq
```

### 3. Salvar

Clique em **Salvar Configurações**

✅ **Configuração básica completa!**

---

## Verificação (2 minutos)

### Teste 1: Sitemap

Visite: `https://djzeneyer.com/sitemap.xml`

**Esperado**: XML válido com suas rotas e posts

**Se der 404**:
1. Vá em **Configurações → Links Permanentes**
2. Clique em **Salvar Alterações**
3. Tente novamente

### Teste 2: Meta Tags

1. Visite qualquer página do site
2. Clique com botão direito → **Ver Código-Fonte**
3. Procure por:
   - `<title>` (deve ter seu título)
   - `<meta name="description">` (deve ter descrição)
   - `<meta property="og:image">` (deve ter imagem)
   - `<script type="application/ld+json">` (deve ter Schema.org)

**Esperado**: Todas as tags presentes

### Teste 3: REST API

Visite: `https://djzeneyer.com/wp-json/zen-seo/v1/settings`

**Esperado**: JSON com suas configurações

---

## Configuração Avançada (Opcional)

### Adicionar Perfis Sociais

WordPress Admin → **Zen SEO** → **Settings** → **Ecossistema Digital**

Adicione URLs de:
- Spotify
- Instagram
- YouTube
- SoundCloud
- Beatport
- etc.

### Adicionar Identificadores de Autoridade

WordPress Admin → **Zen SEO** → **Settings** → **Autoridade Musical**

Adicione:
- **ISNI**: 0000 0005 2893 1015
- **MusicBrainz**: https://musicbrainz.org/artist/...
- **Wikidata**: https://www.wikidata.org/wiki/...
- **Google KG**: /g/11...

### Configurar SEO por Post

Ao editar qualquer post/página:

1. Role até **Zen SEO** meta box
2. Preencha:
   - **SEO Title** (opcional)
   - **Meta Description** (recomendado)
   - **OG Image** (opcional)
3. Veja o preview em tempo real
4. Salve o post

---

## Integração com React

### No seu código React

```javascript
// Fetch post com dados SEO
const response = await fetch('/wp-json/wp/v2/posts/123');
const post = await response.json();

// Usar no React Helmet
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>{post.zen_seo.title || post.title.rendered}</title>
  <meta name="description" content={post.zen_seo.desc} />
  <meta property="og:image" content={post.zen_seo.image} />
  <script type="application/ld+json">
    {JSON.stringify(post.zen_schema)}
  </script>
</Helmet>
```

---

## Troubleshooting

### Problema: Sitemap dá 404

**Solução**:
```bash
# Via WP-CLI
wp rewrite flush

# Ou via WordPress Admin
Configurações → Links Permanentes → Salvar
```

### Problema: Meta tags não aparecem

**Solução**:
1. Desative outros plugins de SEO (Yoast, Rank Math)
2. Limpe o cache:
   ```bash
   wp transient delete --all
   ```
3. Limpe cache do Cloudflare/LiteSpeed

### Problema: Erro ao ativar

**Solução**:
1. Verifique versão do PHP: `php -v` (precisa ser 7.4+)
2. Verifique versão do WordPress (precisa ser 5.8+)
3. Verifique logs: `wp-content/debug.log`

---

## Suporte

**Precisa de ajuda?**

1. 📖 Leia o **README.md** completo
2. 📖 Consulte **UPGRADE-GUIDE.md**
3. 📧 Email: booking@djzeneyer.com
4. 🌐 Site: https://djzeneyer.com

---

## Checklist de Instalação

- [ ] Plugin instalado
- [ ] Plugin ativado
- [ ] Configurações básicas preenchidas
- [ ] Imagem padrão configurada
- [ ] React routes configuradas
- [ ] Sitemap testado (200 OK)
- [ ] Meta tags testadas
- [ ] REST API testada
- [ ] Perfis sociais adicionados (opcional)
- [ ] Identificadores de autoridade adicionados (opcional)
- [ ] SEO configurado em posts importantes
- [ ] Integração React testada
- [ ] Cache limpo
- [ ] Tudo funcionando ✅

---

**Tempo total de instalação**: 15-20 minutos

**Pronto para produção!** 🚀
