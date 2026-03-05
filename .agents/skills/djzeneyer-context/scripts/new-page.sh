#!/bin/bash
# Blueprint para criação de nova página seguindo os padrões DJ Zen Eyer

PAGE_NAME=$1

if [ -z "$PAGE_NAME" ]; then
    echo "Uso: ./new-page.sh NomeDaPagina"
    exit 1
fi

echo "✨ Criando boilerplates para a página: $PAGE_NAME"

# 1. Criar componente da página em src/pages
cat <<EOF > "src/pages/${PAGE_NAME}.tsx"
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';

export const ${PAGE_NAME}: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="page-container">
            <HeadlessSEO 
                title={t('page.${PAGE_NAME}.title') + ' — DJ Zen Eyer'}
                description={t('page.${PAGE_NAME}.description')}
                url="/path-to-change"
            />
            <h1>{t('page.${PAGE_NAME}.title')}</h1>
        </div>
    );
};
EOF

echo "✅ src/pages/${PAGE_NAME}.tsx criado."
echo "⚠️ Lembre-se de:"
echo "1. Registrar em src/config/routes.ts"
echo "2. Registrar em src/components/AppRoutes.tsx (com lazy loading)"
echo "3. Adicionar slugs em scripts/routes-config.json"
echo "4. Adicionar traduções em src/locales/*/translation.json"
