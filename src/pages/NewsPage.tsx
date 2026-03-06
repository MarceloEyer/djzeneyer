import React from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Calendar, Clock, ArrowRight, TrendingUp, Hash, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { generatePath } from 'react-router-dom';
import { useNewsQuery, useNewsBySlug, WPPost } from '../hooks/useQueries';
import { stripHtml } from '../utils/text';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { ARTIST } from '../data/artistData';

// ============================================================================
// HELPERS
// ============================================================================
const formatDate = (dateString: string, lang: string = 'pt-BR') => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(lang, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    console.error('[NewsPage] Error formatting date:', e, dateString);
    return dateString;
  }
};

// ============================================================================

// ============================================================================
// COMPONENT
// ============================================================================
const NewsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { i18n, t } = useTranslation();
  const normalizedLanguage = normalizeLanguage(i18n.language);

  // Queries centralizadas
  const { data: postsData, isLoading: loadingList } = useNewsQuery(normalizedLanguage, { enabled: !slug });
  const { data: singlePost, isLoading: loadingDetail } = useNewsBySlug(slug, normalizedLanguage);

  const posts = postsData || [];
  const loading = slug ? loadingDetail : loadingList;

  // Helper para rotas localizadas usando SSOT
  const getRouteForKey = (key: string): string => {
    return getLocalizedRoute(key, normalizedLanguage);
  };

  // --- RENDERIZAÇÃO DE POST ÚNICO ---
  if (!loading && slug && singlePost) {
    const origin = typeof window !== 'undefined' ? window.location.origin : ARTIST.site.baseUrl;
    const postImage = safeUrl(
      singlePost.featured_image_src_full ||
      singlePost.featured_image_src ||
      singlePost._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      '/images/zen-eyer-og-image.png'
    );
    const postUrl = `${origin}${generatePath(getLocalizedRoute('news-detail', normalizedLanguage), { slug: singlePost.slug })}`;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": stripHtml(singlePost.title.rendered),
      "image": [postImage],
      "datePublished": singlePost.date,
      "dateModified": singlePost.modified || singlePost.date,
      "author": [{
        "@type": "Person",
        "name": singlePost.author_name || singlePost._embedded?.author?.[0]?.name || t('news.default_author')
      }],
      "url": postUrl
    };

    return (
      <>
        <HeadlessSEO
          title={`${stripHtml(singlePost.title.rendered)} | ${t('news.title')}`}
          description={stripHtml(singlePost.excerpt.rendered)}
          url={postUrl}
          image={postImage}
          type="article"
          schema={articleSchema}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={getRouteForKey('news')} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8 font-bold">
              <ArrowLeft size={20} /> {t('news.back_to_list')}
            </Link>

            <article>
              <header className="mb-10 text-center">
                <div className="flex items-center justify-center gap-4 text-white/50 text-sm mb-4 font-mono uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(singlePost.date, i18n.language)}</span>
                  <span>•</span>
                  <span>{t('news.by')} {singlePost.author_name || singlePost._embedded?.author?.[0]?.name || t('news.default_author')}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-display leading-tight mb-8" dangerouslySetInnerHTML={{ __html: sanitizeHtml(singlePost.title.rendered) }} />

                {postImage !== '#' && (
                  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[40vh] md:h-[60vh]">
                    <img
                      src={postImage}
                      className="w-full h-full object-cover"
                      alt={stripHtml(singlePost.title.rendered)}
                    />
                  </div>
                )}
              </header>

              <div
                className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-primary hover:prose-a:text-white transition-colors"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(singlePost.content?.rendered || "") }}
              />
            </article>
          </div>
        </div>
      </>
    );
  }

  // --- RENDERIZAÇÃO DA LISTA ---
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1);

  return (
    <>
      <HeadlessSEO
        title={t('news_page_title')}
        description={t('news_page_meta_desc')}
        url={`${window.location.origin}${getLocalizedRoute('news', normalizedLanguage)}`}
      />
      <div className="min-h-screen bg-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">

          <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase mb-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {t('news.live_feed')}
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{t('news.title')}</span>
              </h1>
            </div>
            <div className="text-right text-white/50 text-sm hidden md:block">
              <p>{t('news.curatorship')}</p>
              <p>{t('news.zouk_production')}</p>
              <p>{new Date().toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </header>

          {loading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-[500px] bg-white/5 rounded-2xl w-full" />
              <div className="grid md:grid-cols-3 gap-8">
                <div className="h-64 bg-white/5 rounded-xl" />
                <div className="h-64 bg-white/5 rounded-xl" />
                <div className="h-64 bg-white/5 rounded-xl" />
              </div>
            </div>
          ) : (
            <>
              {featuredPost && (
                <motion.article
                  className="relative group cursor-pointer mb-20"
                >
                  <Link to={generatePath(getLocalizedRoute('news-detail', normalizedLanguage), { slug: featuredPost.slug })}>
                    <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                      <img
                        src={safeUrl(featuredPost.featured_image_src_full || featuredPost.featured_image_src || featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp')}
                        alt={featuredPost.title.rendered}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

                      <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4 text-left">
                        <div className="flex items-center gap-4 text-primary font-bold mb-4">
                          <span className="bg-primary/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md border border-primary/30">
                            {t('news.featured')}
                          </span>
                          <span className="flex items-center gap-2 text-white/80 text-sm">
                            <Calendar size={14} /> {formatDate(featuredPost.date, i18n.language)}
                          </span>
                        </div>
                        <h2
                          className="text-4xl md:text-6xl font-black font-display leading-tight mb-6 group-hover:text-primary transition-colors text-white"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(featuredPost.title.rendered) }}
                        />
                        <div className="prose prose-invert max-w-2xl mb-8 hidden md:block">
                          <p
                            className="text-lg text-white/80 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripHtml(featuredPost.excerpt.rendered)) }}
                          />
                        </div>
                        <div className="inline-flex items-center gap-2 text-white font-bold text-lg hover:gap-4 transition-all">
                          {t('news.read_full')} <div className="bg-white text-black rounded-full p-1"><ArrowRight size={16} /></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )}

              <div className="mb-8 flex items-center gap-2 text-xl font-display font-bold text-white/90">
                <TrendingUp className="text-primary" />
                <span>{t('news.latest_stories')}</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col h-full bg-surface/30 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:bg-surface/50 transition-all duration-300 text-left"
                  >
                    <Link to={generatePath(getLocalizedRoute('news-detail', normalizedLanguage), { slug: post.slug })} className="block h-56 overflow-hidden relative">
                      <img
                        src={safeUrl(post.featured_image_src || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp')}
                        alt={stripHtml(post.title.rendered)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        <Clock size={12} className="inline mr-1" /> {t('news.read_time', { min: 3 })}
                      </div>
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-primary mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                        <Hash size={12} /> {t('news.label')}
                      </div>
                      <Link to={generatePath(getLocalizedRoute('news-detail', normalizedLanguage), { slug: post.slug })}>
                        <h3
                          className="text-xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2 text-white"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title.rendered) }}
                        />
                      </Link>
                      <p
                        className="text-white/60 text-sm line-clamp-3 mb-6 flex-1"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripHtml(post.excerpt.rendered)) }}
                      />
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <span className="text-xs text-white/40 font-medium">
                          {formatDate(post.date, i18n.language)}
                        </span>
                        <Link to={generatePath(getLocalizedRoute('news-detail', normalizedLanguage), { slug: post.slug })} className="text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4">
                          {t('news.read_more')}
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}

          {!loading && posts.length > 0 && (
            <div className="mt-20 text-center border-t border-white/10 pt-10">
              <p className="text-white/40 text-sm mb-4">{t('news.end_reached')}</p>
              <button className="btn btn-outline text-sm px-8 py-3 rounded-full hover:bg-white/5">
                {t('news.view_archive')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;