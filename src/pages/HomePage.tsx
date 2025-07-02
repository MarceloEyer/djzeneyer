// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
// ... outros imports

interface PageContent {
  title: { rendered: string };
  content: { rendered: string };
}

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Pede a página com o slug 'home' no idioma selecionado
        const response = await fetch(`${window.wpData.restUrl}wp/v2/pages?slug=home&lang=${language}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setPageContent(data[0]);
        } else {
          // Fallback se a tradução não for encontrada
          const fallbackResponse = await fetch(`${window.wpData.restUrl}wp/v2/pages?slug=home`);
          const fallbackData = await fallbackResponse.json();
          setPageContent(fallbackData[0]);
        }
      } catch (error) {
        console.error("Falha ao buscar conteúdo da página:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [language]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" size={48} /></div>;
  }

  // Agora, em vez de texto fixo, você renderiza o conteúdo da API
  return (
    <>
      {/* Exemplo de como usar o conteúdo */}
      <section className="container mx-auto py-24">
        {pageContent && (
          <>
            <h1 className="text-4xl font-bold">{pageContent.title.rendered}</h1>
            <div className="prose lg:prose-xl mt-8" dangerouslySetInnerHTML={{ __html: pageContent.content.rendered }} />
          </>
        )}
      </section>
      
      {/* ... O resto da sua HomePage pode vir aqui ... */}
    </>
  );
};

export default HomePage;