/**
 * @file src/components/SEO.tsx
 * @description Componente centralizado de SEO estruturado para sites internacionais (PT/EN)
 * @author DJ Zen Eyer Team
 * @created 2025-10-29
 * @updated 2025-10-30
 *
 * 🌍 ESTRATÉGIA DE IDIOMAS (IMPORTANTE!):
 * - **Inglês é o idioma padrão** e está na raiz do site: `https://djzeneyer.com/`
 * - **Português está em subdiretório**: `https://djzeneyer.com/pt`
 * - **NÃO EXISTE `/en`** — o caminho raiz (`/`) já representa o inglês.
 * - Isso significa:
 *   - `/music` → versão em inglês
 *   - `/pt/music` → versão em português
 *   - Não há redirecionamento ou prefixo para inglês.
 *
 * ✅ BENEFÍCIOS DESTA ABORDAGEM:
 * - Melhor SEO para público global (inglês como default)
 * - Simplicidade na estrutura de URLs
 * - Compatível com crawlers de IA e motores de busca
 * - Evita duplicação de conteúdo (com hreflang bem configurado)
 *
 * 🧩 FUNCIONALIDADES:
 * - Meta tags básicas (title, description, keywords)
 * - Open Graph (Facebook, WhatsApp, LinkedIn)
 * - Twitter Cards (com @djzeneyer como criador)
 * - Schema.org WebPage (JSON-LD válido)
 * - Hreflang alternates (en, pt, pt-BR, x-default)
 * - Canonical URL automático e seguro
 * - Suporte a tipos de página: website | article | profile
 *
 * 🔒 SEGURANÇA & CONFIABILIDADE:
 * - Todas as URLs são **absolutas e sem espaços extras**
 * - Imagens OG são validadas como URLs completas
 * - Caminhos são normalizados para evitar `/pt/pt/...`
 * - Canonical URL respeita o idioma atual
 *
 * 📦 DEPENDÊNCIAS:
 * - react-helmet-async → injeção segura de meta tags
 * - react-router-dom → uso de `useLocation()` para URL atual
 * - react-i18next → detecção do idioma atual (`i18n.language`)
 */

import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Propriedades aceitas pelo componente SEO
 */
export interface SEOProps {
  /** Título da página (exibido na aba do navegador e em resultados de busca) */
  title: string;
  /** Descrição meta (ideal: 150–160 caracteres) */
  description: string;
  /**
   * URL absoluta da imagem para OG/Twitter Cards.
   * Se não fornecida, usa imagem padrão do site.
   * @default "https://djzeneyer.com/social-share.jpg"
   */
  image?: string;
  /**
   * URL canônica personalizada (útil para páginas com parâmetros de tracking).
   * Se não fornecida, gera automaticamente com base na rota atual.
   */
  canonical?: string;
  /**
   * Tipo Open Graph da página.
   * @default "website"
   */
  type?: 'website' | 'article' | 'profile';
  /**
   * Palavras-chave para SEO (separadas por vírgula).
   * Opcional, mas útil para motores de busca tradicionais.
   */
  keywords?: string;
}

/**
 * SEO Component
 * @description Renderiza todas as tags necessárias para SEO técnico, redes sociais e crawlers de IA.
 * @param {SEOProps} props - Configurações de SEO para a página atual
 * @returns {JSX.Element} Helmet com meta tags, links e scripts estruturados
 */
export default function SEO({
  title,
  description,
  image = 'https://djzeneyer.com/social-share.jpg',
  canonical: customCanonical,
  type = 'website',
  keywords
}: SEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language; // 'pt' ou 'en'

  // 🔁 Normaliza o caminho removendo prefixos de idioma (/pt ou /en)
  // Ex: /pt/music → /music | /music → /music
  const cleanPath = location.pathname.replace(/^\/(pt|en)/, '') || '/';

  // 🌐 Gera URLs alternativas respeitando a estrutura do site:
  // - Inglês: SEM prefixo → https://djzeneyer.com{cleanPath}
  // - Português: COM prefixo /pt → https://djzeneyer.com/pt{cleanPath}
  const enUrl = `https://djzeneyer.com${cleanPath}`;
  const ptUrl = `https://djzeneyer.com/pt${cleanPath === '/' ? '' : cleanPath}`;

  // 🔗 Canonical: usa custom ou gera com base no idioma atual
  // ✅ CORRIGIDO: Não remove prefixo /pt da URL canônica!
  const canonical = customCanonical || (
    currentLang === 'pt' 
      ? `https://djzeneyer.com/pt${cleanPath === '/' ? '' : cleanPath}`
      : `https://djzeneyer.com${cleanPath}`
  );

  // 🖼️ Garante que a imagem OG seja uma URL absoluta válida
  const ogImage = image.startsWith('http') ? image : `https://djzeneyer.com${image}`;

  return (
    <Helmet>
      {/* 📌 Meta Tags Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <meta
        name="language"
        content={currentLang === 'pt' ? 'Portuguese' : 'English'}
      />

      {/* 🌐 Hreflang Alternates — CRUCIAL para SEO multilíngue */}
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="pt" href={ptUrl} />
      <link rel="alternate" hrefLang="pt-BR" href={ptUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <link rel="canonical" href={canonical} />

      {/* 📘 Open Graph (Facebook, WhatsApp, LinkedIn, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta
        property="og:locale"
        content={currentLang === 'pt' ? 'pt_BR' : 'en_US'}
      />
      <meta
        property="og:locale:alternate"
        content={currentLang === 'pt' ? 'en_US' : 'pt_BR'}
      />

      {/* 🐦 Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />

      {/* 🧠 Schema.org WebPage (JSON-LD válido para Google, Bing, IA) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: description,
          url: canonical,
          inLanguage: currentLang === 'pt' ? 'pt-BR' : 'en-US',
          isPartOf: {
            '@type': 'WebSite',
            name: 'DJ Zen Eyer',
            url: 'https://djzeneyer.com'
          }
        })}
      </script>
    </Helmet>
  );
}
