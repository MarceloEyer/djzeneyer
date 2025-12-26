import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

const NewsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // URL da API (ajuste se necessário)
  const API_URL = 'https://djzeneyer.com/wp-json/wp/v2/posts?_embed';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => console.error('Erro ao buscar posts:', err));
  }, []);

  return (
    <>
      <HeadlessSEO
        title="News & Articles - DJ Zen Eyer"
        description="Últimas novidades, artigos e atualizações do mundo do Zouk Brasileiro."
        url="https://djzeneyer.com/news"
      />

      <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-12 text-center">
          Latest <span className="text-primary">News</span>
        </h1>

        {loading ? (
          <div className="text-center text-white/50">Carregando artigos...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all group"
              >
                {/* Imagem Destacada (se houver) */}
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post._embedded['wp:featuredmedia'][0].source_url} 
                      alt={post.title.rendered}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.date).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2" 
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  
                  <div className="text-white/70 text-sm mb-4 line-clamp-3"
                       dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                  
                  {/* Link para o Post Individual (precisa criar PostPage depois) */}
                  <a href={`/news/${post.slug}`} className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    LER MAIS <ArrowRight size={14} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewsPage;