# Quick Installation Guide

## 🚀 5-Minute Setup

### Step 1: Install Plugin

**Option A: WordPress Admin (Recommended)**
```bash
1. Zip the zen-seo-lite folder
2. Go to WordPress Admin → Plugins → Add New → Upload
3. Upload zen-seo-lite.zip
4. Click "Activate"
```

**Option B: FTP/SFTP**
```bash
1. Upload zen-seo-lite/ to /wp-content/plugins/
2. Go to WordPress Admin → Plugins
3. Find "Zen SEO Lite Pro" and click "Activate"
```

**Option C: WP-CLI**
```bash
wp plugin activate zen-seo-lite
```

---

### Step 2: Configure Essential Settings

Go to **WordPress Admin → Zen SEO → Settings**

#### Minimum Required Fields:
1. **Full Legal Name**: Your real name
2. **Default OG Image**: Upload a 1200x630px image
3. **React Routes**: Copy and paste:
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

Click **Save Settings**.

---

### Step 3: Verify Installation

#### Test Sitemap
Visit: `https://yoursite.com/sitemap.xml`

Should see XML with your routes and posts.

#### Test Meta Tags
1. Visit any post/page
2. View source (Ctrl+U)
3. Look for `<meta name="description">`
4. Look for `<script type="application/ld+json">`

#### Test REST API
Visit: `https://yoursite.com/wp-json/zen-seo/v1/settings`

Should see JSON response.

---

### Step 4: Configure Per-Post SEO (Optional)

1. Edit any post/page
2. Scroll to **Zen SEO** meta box
3. Fill in:
   - SEO Title (optional)
   - Meta Description (recommended)
   - OG Image (optional)

---

## ✅ You're Done!

Your site now has:
- ✅ Optimized meta tags
- ✅ Schema.org structured data
- ✅ XML sitemap
- ✅ Multilingual support
- ✅ REST API for React

---

## 🔧 Advanced Configuration (Optional)

### Add Social Profiles

Go to **Zen SEO → Settings → Digital Ecosystem**

Add URLs for:
- Spotify
- Instagram
- YouTube
- SoundCloud
- etc.

### Add Authority Identifiers

Go to **Zen SEO → Settings → Musical Authority**

Add:
- ISNI Code
- MusicBrainz URL
- Wikidata URL
- Google Knowledge Graph ID

### Configure Events (for Flyers)

When editing a Flyer post:
1. Scroll to **Event Information** section
2. Fill in:
   - Event Date
   - Event Location
   - Ticket URL

---

## 🐛 Troubleshooting

### Sitemap shows 404
```bash
# Flush rewrite rules
wp rewrite flush
```

Or go to: **Settings → Permalinks → Save Changes**

### Meta tags not showing
Check for conflicts:
```bash
wp plugin list --status=active | grep -i seo
```

Deactivate other SEO plugins (Yoast, Rank Math, etc.)

### Cache not clearing
Go to: **Zen SEO → Cache → Clear All Caches**

---

## 📞 Need Help?

- 📧 Email: booking@djzeneyer.com
- 🌐 Website: https://djzeneyer.com
- 📖 Full docs: See README.md

---

**Installation time: ~5 minutes**
**Configuration time: ~10 minutes**
**Total time: ~15 minutes**
