import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Calendar, Clock, ArrowRight, TrendingUp, Hash, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage } from '../config/routes';

// ============================================================================
// TYPES
// ============================================================================
interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
<<<<<<< HEAD
  content?: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'author'?: Array<{ name: string }>;
  };
=======
  featured_image_src?: string;
  featured_image_src_full?: string;
  author_name?: string;
>>>>>>> d52c9d9 (⚡ Bolt: Remove _embed from REST API calls)
}

// ============================================================================
// HELPERS
// ============================================================================
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// ============================================================================
// COMPONENT
// ============================================================================
const NewsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { i18n, t } = useTranslation();
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [singlePost, setSinglePost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Helper para rotas localizadas
  const getRouteForKey = (key: string): string => {
    const route = ROUTES_CONFIG.find(r => getLocalizedPaths(r, 'en')[0] === key);
    if (!route) return `/${key}`;
    const normalizedLanguage = normalizeLanguage(i18n.language);
    return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
  };

  // Busca conteúdo (lista ou post único)
  useEffect(() => {
    setLoading(true);
    const endpoint = slug
      ? `https://djzeneyer.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
      : `https://djzeneyer.com/wp-json/wp/v2/posts?_embed&per_page=10`;

    fetch(endpoint)
=======
  // Busca posts com imagens otimizadas (sem _embed)
  useEffect(() => {
    fetch('https://djzeneyer.com/wp-json/wp/v2/posts?per_page=10')
>>>>>>> d52c9d9 (⚡ Bolt: Remove _embed from REST API calls)
      .then(res => res.json())
      .then(data => {
        if (slug) {
          setSinglePost(data[0] || null);
        } else {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch news:', err);
        setLoading(false);
      });
  }, [slug]);

  // --- RENDERIZAÇÃO DE POST ÚNICO ---
  if (!loading && slug && singlePost) {
    return (
      <>
        <HeadlessSEO
          title={`${stripHtml(singlePost.title.rendered)} | Zen News`}
          description={stripHtml(singlePost.excerpt.rendered)}
          url={`https://djzeneyer.com/news/${singlePost.slug}`}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={getRouteForKey('news')} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8 font-bold">
              <ArrowLeft size={20} /> VOLTAR PARA NOTÍCIAS
            </Link>

            <article>
              <header className="mb-10 text-center">
                <div className="flex items-center justify-center gap-4 text-white/50 text-sm mb-4 font-mono uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(singlePost.date)}</span>
                  <span>•</span>
                  <span>Por {singlePost._embedded?.author?.[0]?.name || 'Zen Eyer'}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-display leading-tight mb-8" dangerouslySetInnerHTML={{ __html: singlePost.title.rendered }} />

                {singlePost._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[40vh] md:h-[60vh]">
                    <img
                      src={singlePost._embedded['wp:featuredmedia'][0].source_url}
                      className="w-full h-full object-cover"
                      alt={singlePost.title.rendered}
                    />
                  </div>
                )}
              </header>

              <div
                className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-primary hover:prose-a:text-white transition-colors"
                dangerouslySetInnerHTML={{ __html: singlePost.content?.rendered || "" }}
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
        title="Zen News | Insights & Updates"
        description="Notícias oficiais, lançamentos e artigos sobre o universo do Zouk Brasileiro por DJ Zen Eyer."
        url="https://djzeneyer.com/news"
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
                Live Feed
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-white">
                ZEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">NEWS</span>
              </h1>
            </div>
            <div className="text-right text-white/50 text-sm hidden md:block">
              <p>Curadoria de Conteúdo</p>
              <p>Zouk Brasileiro & Produção Musical</p>
              <p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative group cursor-pointer mb-20"
                >
                  <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
<<<<<<< HEAD
                    <img
                      src={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp'}
                      alt={featuredPost.title.rendered}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4">
                      <div className="flex items-center gap-4 text-primary font-bold mb-4">
                        <span className="bg-primary/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md border border-primary/30">
                          Destaque
                        </span>
                        <span className="flex items-center gap-2 text-white/80 text-sm">
                          <Calendar size={14} /> {formatDate(featuredPost.date)}
                        </span>
                      </div>
                      <h2
                        className="text-4xl md:text-6xl font-black font-display leading-tight mb-6 group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }}
                      />
                      <div className="prose prose-invert max-w-2xl mb-8 hidden md:block">
                        <p
                          className="text-lg text-white/80 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: stripHtml(featuredPost.excerpt.rendered) }}
                        />
                      </div>
                      <Link to={`${getRouteForKey('news')}/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-white font-bold text-lg hover:gap-4 transition-all">
                        LER MATÉRIA COMPLETA <div className="bg-white text-black rounded-full p-1"><ArrowRight size={16} /></div>
                      </Link>
                    </div>
=======
                     {/* Imagem de Fundo com Zoom suave no Hover */}
                     <img
                       src={featuredPost.featured_image_src_full || '/images/hero-background.webp'}
                       alt={featuredPost.title.rendered}
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                     />
                     {/* Gradiente Cinematográfico */}
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />

                     {/* Conteúdo da Manchete */}
                     <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4">
                       <div className="flex items-center gap-4 text-primary font-bold mb-4">
                         <span className="bg-primary/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md border border-primary/30">
                           Destaque
                         </span>
                         <span className="flex items-center gap-2 text-white/80 text-sm">
                           <Calendar size={14} /> {formatDate(featuredPost.date)}
                         </span>
                       </div>

                       <h2
                         className="text-4xl md:text-6xl font-black font-display leading-tight mb-6 group-hover:text-primary transition-colors"
                         dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }}
                       />

                       <div className="prose prose-invert max-w-2xl mb-8 hidden md:block">
                         <p
                           className="text-lg text-white/80 line-clamp-3"
                           dangerouslySetInnerHTML={{ __html: stripHtml(featuredPost.excerpt.rendered) }}
                         />
                       </div>

                       <Link to={`/news/${featuredPost.slug}`} className="inline-flex items-center gap-2 text-white font-bold text-lg hover:gap-4 transition-all">
                         LER MATÉRIA COMPLETA <div className="bg-white text-black rounded-full p-1"><ArrowRight size={16} /></div>
                       </Link>
                     </div>
>>>>>>> d52c9d9 (⚡ Bolt: Remove _embed from REST API calls)
                  </div>
                </motion.article>
              )}

              <div className="mb-8 flex items-center gap-2 text-xl font-display font-bold text-white/90">
                <TrendingUp className="text-primary" />
                <span>Latest Stories</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryPosts.map((post, index) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col h-full bg-surface/30 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:bg-surface/50 transition-all duration-300"
                  >
                    <Link to={`${getRouteForKey('news')}/${post.slug}`} className="block h-56 overflow-hidden relative">
                      <img 
                        src={post.featured_image_src || '/images/hero-background.webp'}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        <Clock size={12} className="inline mr-1" /> 3 min read
                      </div>
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-primary mb-3 font-bold uppercase tracking-wider flex items-center gap-2">
                        <Hash size={12} /> News
                      </div>
                      <Link to={`${getRouteForKey('news')}/${post.slug}`}>
                        <h3 
                          className="text-xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                      </Link>
                      <p 
                        className="text-white/60 text-sm line-clamp-3 mb-6 flex-1"
                        dangerouslySetInnerHTML={{ __html: stripHtml(post.excerpt.rendered) }}
                      />
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <span className="text-xs text-white/40 font-medium">
                          {formatDate(post.date)}
                        </span>
                        <Link to={`${getRouteForKey('news')}/${post.slug}`} className="text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4">
                          Read More
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
              <p className="text-white/40 text-sm mb-4">Você chegou ao fim das atualizações recentes.</p>
              <button className="btn btn-outline text-sm px-8 py-3 rounded-full hover:bg-white/5">
                Ver Arquivo Completo
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;
