📦 O QUE VAI SER DEPLOYADO:
✅ SEMPRE (obrigatórios):

dist/ → Build do React (JS, CSS, assets)
functions.php → Arquivo principal do tema
style.css → Metadata do tema WordPress

⚠️ SE EXISTIR (opcionais):

inc/ → PHP helpers (se você tiver)
plugins/ → Plugins customizados (se você tiver)
public/ → Assets públicos (robots.txt, favicon, etc)
screenshot.png, header.php, footer.php, index.php


📊 ESTRUTURA FINAL NO SERVIDOR:
public_html/
├── wp-config.php          ← preservado
├── .htaccess              ← preservado
│
└── wp-content/
    └── themes/
        └── zentheme/
            ├── dist/           ✅ React build (JS, CSS, assets)
            │   ├── assets/
            │   │   ├── js/
            │   │   └── css/
            │   └── index.html
            │
            ├── functions.php   ✅
            ├── style.css       ✅
            ├── screenshot.png  ✅ (se existir)
            ├── header.php      ✅ (se existir)
            └── footer.php      ✅ (se existir)

💡 SE QUISER ADICIONAR /inc OU /plugins NO FUTURO:
Só criar as pastas no repositório que o deploy vai detectar automaticamente!
bash# Criar pasta inc/:
mkdir inc
echo "<?php // helpers" > inc/helpers.php

# Criar pasta plugins/:
mkdir -p plugins/meu-plugin
echo "<?php // plugin" > plugins/meu-plugin/meu-plugin.php

# Commit:
git add inc plugins
git commit -m "feat: adicionar inc e plugins"
git push
O deploy vai detectar e enviar automaticamente! ✅
