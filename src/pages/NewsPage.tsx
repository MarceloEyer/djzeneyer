import React, { useCallback, useMemo } from 'react';
import { useParams, Link, generatePath, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Hash,
  Search,
} from 'lucide-react';
import { useNewsQuery, useNewsBySlug, useNewsTaxonomiesQuery, type WPPost } from '../hooks/useQueries';
import { normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { ARTIST } from '../data/artistData';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { stripHtml } from '../utils/text';
import { getDateTimeFormatter } from '../utils/date';
import NotFoundPage from './NotFoundPage';

// ============================================================================
// HELPERS
// ============================================================================
const formatDate = (dateString: string, lang: string = 'pt-BR') => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return getDateTimeFormatter(lang, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    console.error('[NewsPage] Error formatting date:', e, dateString);
    return dateString;
  }
};

// ============================================================================

// ─── Framer Motion — module-level constants ───────────────────────────────────
const LIVE_FEED_INITIAL = { opacity: 0, x: -20 };
const LIVE_FEED_ANIMATE = { opacity: 1, x: 0 };
const ARTICLE_INITIAL = { opacity: 0, y: 20 };
const ARTICLE_ANIMATE = { opacity: 1, y: 0 };
const EMPTY_NEWS_ARRAY: WPPost[] = [];

// ============================================================================
// COMPONENT
// ============================================================================
const NewsPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug;
  const [searchParams, setSearchParams] = useSearchParams();
  const { i18n, t } = useTranslation();
  const normalizedLanguage = normalizeLanguage(i18n.language);

  // Queries centralizadas
  // ⚡ Bolt: Cache localized routes with useMemo to prevent O(N) recalculations of getLocalizedRoute inside the secondaryPosts.map()
  const { newsRoute, newsDetailRoute } = useMemo(() => ({
    newsRoute: getLocalizedRoute('news', normalizedLanguage),
    newsDetailRoute: getLocalizedRoute('news-detail', normalizedLanguage)
  }), [normalizedLanguage]);

  const selectedFilterSlugs = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    search: searchParams.get('search') || undefined,
  }), [searchParams]);
  const hasActiveFilter = Boolean(selectedFilterSlugs.category || selectedFilterSlugs.tag || selectedFilterSlugs.search);

  const { data: taxonomiesData } = useNewsTaxonomiesQuery(normalizedLanguage);
  const selectedFilters = useMemo(() => {
    const selectedCategory = taxonomiesData?.categories.find(term => term.slug === selectedFilterSlugs.category);
    const selectedTag = taxonomiesData?.tags.find(term => term.slug === selectedFilterSlugs.tag);

    return {
      category: selectedCategory ? String(selectedCategory.id) : undefined,
      tag: selectedTag ? String(selectedTag.id) : undefined,
      search: selectedFilterSlugs.search,
    };
  }, [selectedFilterSlugs.category, selectedFilterSlugs.search, selectedFilterSlugs.tag, taxonomiesData]);
  const waitsForTaxonomyLookup = Boolean(
    (selectedFilterSlugs.category || selectedFilterSlugs.tag) && !taxonomiesData
  );
  const { data: postsData, isLoading: loadingList } = useNewsQuery(normalizedLanguage, {
    enabled: !slug && !waitsForTaxonomyLookup,
    filters: selectedFilters,
  });
  const { data: singlePost, isLoading: loadingDetail } = useNewsBySlug(slug, normalizedLanguage);

  const posts = postsData || EMPTY_NEWS_ARRAY;
  const loading = slug ? loadingDetail : loadingList;

  // Helper para rotas localizadas usando SSOT
  const getRouteForKey = (key: string): string => {
    return getLocalizedRoute(key, normalizedLanguage);
  };

  const handleFilterChange = useCallback((kind?: 'category' | 'tag', termSlug?: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    nextParams.delete('tag');
    if (kind && termSlug) {
      nextParams.set(kind, termSlug);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const handleSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = String(formData.get('news-search') || '').trim();
    const nextParams = new URLSearchParams(searchParams);
    if (searchValue) {
      nextParams.set('search', searchValue);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  // --- RENDERIZAÇÃO DE POST ÚNICO ---
  if (!loading && slug && !singlePost) {
    return <NotFoundPage />;
  }

  if (!loading && slug && singlePost) {
    const postImage = safeUrl(
      singlePost.featured_image_src_full ||
      singlePost.featured_image_src ||
      singlePost._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      '/images/zen-eyer-og-image.png'
    );
    const postUrl = `${ARTIST.site.baseUrl}${generatePath(newsDetailRoute, { slug: singlePost.slug })}`;
    const authorName = singlePost.author_name || singlePost._embedded?.author?.[0]?.name || t('news.default_author');
    const isCanonicalAuthor = [
      t('news.default_author'),
      ARTIST.identity.stageName,
      ARTIST.identity.fullName,
      'Zen Eyer',
      'Equipe Zen Eyer',
    ].includes(authorName);
    const authorSchema = isCanonicalAuthor
      ? {
          "@type": "Person",
          "name": authorName,
          "url": ARTIST.site.baseUrl,
          "@id": `${ARTIST.site.baseUrl}/#artist`
        }
      : {
          "@type": "Person",
          "name": authorName
        };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": stripHtml(singlePost?.title?.rendered ?? ''),
      "image": [postImage],
      "datePublished": singlePost.date,
      "dateModified": singlePost.modified || singlePost.date,
      "author": [authorSchema],
      "url": postUrl
    };

    return (
      <>
        <HeadlessSEO
          title={`${stripHtml(singlePost?.title?.rendered || '')} | ${t('news.title')}`}
          description={stripHtml(singlePost?.excerpt?.rendered || '')}
          url={postUrl}
          image={postImage}
          type="article"
          schema={articleSchema}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Breadcrumb
              items={[
                { label: t('footer_news'), path: getRouteForKey('news') },
                { label: stripHtml(singlePost?.title?.rendered || '') },
              ]}
              className="mb-8"
            />
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
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-display leading-tight mb-6 sm:mb-8" dangerouslySetInnerHTML={{ __html: sanitizeHtml(singlePost?.title?.rendered ?? '') }} />

                {postImage !== '#' && (
                  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[40vh] md:h-[60vh]">
                    <img
                      src={postImage}
                      className="w-full h-full object-cover"
                      alt={stripHtml(singlePost?.title?.rendered || '')}
                      loading="eager"
                      width="1200"
                      height="675"
                    />
                  </div>
                )}
              </header>

              <div
                className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-primary hover:prose-a:text-white transition-colors"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(singlePost?.content?.rendered || '') }}
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
        url={`${window.location.origin}${newsRoute}`}
      />
      <div className="min-h-screen bg-background text-white pt-24 pb-20 relative overflow-hidden">
        {/* Background Decorations - Premium Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
          <div className="absolute top-[40%] right-[-5%] w-[35%] h-[35%] bg-blue-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb items={[{ label: t('footer_news') }]} className="mb-8" />

          <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <motion.div
                initial={LIVE_FEED_INITIAL}
                animate={LIVE_FEED_ANIMATE}
                className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase mb-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {t('news.live_feed')}
              </motion.div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-display tracking-tight text-white leading-none">
                <Trans i18nKey="news.title">
                  Latest <span className="text-primary">Stories</span>
                </Trans>
              </h1>
            </div>
            <div className="text-right text-white/50 text-sm hidden md:block">
              <p>{t('news.curatorship')}</p>
              <p>{t('news.zouk_production')}</p>
              <p>{getDateTimeFormatter(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
            </div>
          </header>

          {!slug && taxonomiesData && (
            <section className="mb-10 space-y-5" aria-label={t('news.filters_label')}>
              <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} aria-hidden="true" />
                <input
                  type="search"
                  name="news-search"
                  defaultValue={selectedFilterSlugs.search || ''}
                  placeholder={t('news.search_placeholder')}
                  className="min-h-[44px] w-full rounded-full border border-white/10 bg-white/5 py-2 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary"
                  aria-label={t('news.search_label')}
                />
              </form>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleFilterChange()}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    !hasActiveFilter
                      ? 'border-primary bg-primary text-background'
                      : 'border-white/10 bg-white/5 text-white/70 hover:border-primary hover:text-white'
                  }`}
                >
                  {t('news.filters_all')}
                </button>
                {taxonomiesData.categories.map(term => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => handleFilterChange('category', term.slug)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      selectedFilterSlugs.category === term.slug
                        ? 'border-primary bg-primary text-background'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-primary hover:text-white'
                    }`}
                  >
                    {term.name}
                  </button>
                ))}
              </div>
              {taxonomiesData.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/35">
                    {t('news.tags')}
                  </span>
                  {taxonomiesData.tags.map(term => (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => handleFilterChange('tag', term.slug)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        selectedFilterSlugs.tag === term.slug
                          ? 'border-primary bg-primary/90 text-background'
                          : 'border-white/10 bg-white/5 text-white/55 hover:border-primary hover:text-white'
                      }`}
                    >
                      #{term.name}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

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
                  <Link to={generatePath(newsDetailRoute, { slug: featuredPost.slug })}>
                    <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                      <img
                        src={safeUrl(featuredPost.featured_image_src_full || featuredPost.featured_image_src || featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp')}
                        alt={stripHtml(featuredPost?.title?.rendered || '')}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        loading="eager"
                        width="1200"
                        height="675"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

                      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-16 w-full md:w-3/4 text-left">
                        <div className="flex items-center gap-4 text-primary font-bold mb-4">
                          <span className="bg-primary/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md border border-primary/30">
                            {t('news.featured')}
                          </span>
                          <span className="flex items-center gap-2 text-white/80 text-sm">
                            <Calendar size={14} /> {formatDate(featuredPost.date, i18n.language)}
                          </span>
                        </div>
                        <h2
                        className="text-2xl sm:text-4xl md:text-6xl font-black font-display leading-tight mb-4 sm:mb-6 group-hover:text-primary transition-colors text-white"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(featuredPost?.title?.rendered || '') }}
                      />
                      <div className="prose prose-invert max-w-2xl mb-8 hidden md:block">
                        <p
                          className="text-lg text-white/80 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripHtml(featuredPost?.excerpt?.rendered || '')) }}
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

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-center mb-10 sm:mb-16 text-white uppercase tracking-tight">
                <Trans i18nKey="news.latest_stories_title">
                  Trending <span className="text-primary">News</span>
                </Trans>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {secondaryPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={ARTICLE_INITIAL}
                    whileInView={ARTICLE_ANIMATE}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col h-full bg-surface/30 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:bg-surface/50 transition-all duration-300 text-left"
                  >
                    <Link to={generatePath(newsDetailRoute, { slug: post.slug })} className="block h-56 overflow-hidden relative">
                      <img
                        src={safeUrl(post.featured_image_src || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp')}
                        alt={stripHtml(post?.title?.rendered || '')}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        width="800"
                        height="600"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        <Clock size={12} className="inline mr-1" /> {t('news.read_time', { min: 3 })}
                      </div>
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-primary mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                        <Hash size={12} /> {t('news.label')}
                      </div>
                      <Link to={generatePath(newsDetailRoute, { slug: post.slug })}>
                        <h3
                          className="text-xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2 text-white"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.title?.rendered || '') }}
                        />
                      </Link>
                      <p
                        className="text-white/60 text-sm line-clamp-3 mb-6 flex-1"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripHtml(post?.excerpt?.rendered || '')) }}
                      />
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <span className="text-xs text-white/40 font-medium">
                          {formatDate(post.date, i18n.language)}
                        </span>
                        <Link to={generatePath(newsDetailRoute, { slug: post.slug })} className="text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4">
                          {t('news.read_more')}
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              {!featuredPost && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
                  {t('news.no_posts_for_filter')}
                </div>
              )}
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

export default React.memo(NewsPage);
