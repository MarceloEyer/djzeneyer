// src/pages/PressKitPage.tsx
// ============================================================================
// PRESS KIT PAGE - VERSÃO FINAL SSOT
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { Download, ExternalLink, Mail } from 'lucide-react';

const PressKitPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isPortuguese = i18n.language?.startsWith('pt');
  const currentUrl = `${ARTIST.site.baseUrl}/work-with-me`;

  return (
    <>
      <HeadlessSEO 
        title={`Press Kit & Booking - ${ARTIST.identity.stageName}`}
        description={`Official Press Kit for promoters and media. Bio, photos, tech rider and contact info for ${ARTIST.identity.stageName}.`}
        url={currentUrl}
        hrefLang={getHrefLangUrls('/work-with-me', ARTIST.site.baseUrl)}
        // CORREÇÃO: Usa o Schema importado, sem erro de sintaxe
        schema={ARTIST_SCHEMA_BASE} 
      />

      <div className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4 text-white">Press Kit & Booking</h1>
            <p className="text-xl text-white/60">
              {isPortuguese ? 'Material oficial para contratantes e imprensa' : 'Official material for bookers and press'}
            </p>
          </div>

          {/* Bio Resumida */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {isPortuguese ? 'Biografia Curta' : 'Short Bio'}
            </h2>
            <div className="p-6 bg-surface/30 rounded-xl border border-white/10 text-white/80">
              <p>
                {ARTIST.identity.stageName} {isPortuguese ? 'é' : 'is'} {ARTIST.titles.primary}, 
                {isPortuguese 
                  ? ' reconhecido internacionalmente por sua musicalidade "cremosa" e sets que priorizam a conexão.' 
                  : ' internationally recognized for his "creamy" musicality and sets that prioritize connection.'} 
                {isPortuguese 
                  ? ` Com apresentações em ${ARTIST.stats.countriesPlayed} países e mais de ${ARTIST.stats.streamsTotal} streams, ele é uma das maiores autoridades da cena atual.`
                  : ` With performances in ${ARTIST.stats.countriesPlayed} countries and over ${ARTIST.stats.streamsTotal} streams, he is one of the leading authorities in the current scene.`}
              </p>
            </div>
          </section>

          {/* Downloads */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {isPortuguese ? 'Downloads Oficiais' : 'Official Downloads'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/downloads/zen-eyer-press-kit-2025.pdf" className="btn btn-outline flex items-center justify-between p-4 h-auto" download>
                <span className="flex items-center gap-3">
                  <Download size={20} /> Full Press Kit (PDF)
                </span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">5MB</span>
              </a>
              <a href="/downloads/zen-eyer-photos-hi-res.zip" className="btn btn-outline flex items-center justify-between p-4 h-auto" download>
                <span className="flex items-center gap-3">
                  <Download size={20} /> Fotos Hi-Res (ZIP)
                </span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">25MB</span>
              </a>
              <a href="/downloads/zen-eyer-tech-rider.pdf" className="btn btn-outline flex items-center justify-between p-4 h-auto" download>
                <span className="flex items-center gap-3">
                  <Download size={20} /> Tech Rider (PDF)
                </span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">1MB</span>
              </a>
            </div>
          </section>

          {/* Links Sociais Dinâmicos */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {isPortuguese ? 'Links Oficiais' : 'Official Links'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(ARTIST.social).map(([key, data]) => (
                <a 
                  key={key} 
                  href={data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors p-2 capitalize"
                >
                  <ExternalLink size={16} /> {key}
                </a>
              ))}
            </div>
          </section>

          {/* Contato */}
          <section className="text-center p-10 bg-primary/10 rounded-2xl border border-primary/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isPortuguese ? 'Interessado em contratar?' : 'Interested in booking?'}
            </h2>
            <p className="text-white/70 mb-8">
              {isPortuguese 
                ? 'Agenda aberta para 2026. Consulte disponibilidade para 2025.' 
                : '2026 Agenda Open. Check availability for 2025.'}
            </p>
            <a href={`mailto:${ARTIST.contact.email}`} className="btn btn-primary btn-lg inline-flex items-center gap-3">
              <Mail size={24} /> {ARTIST.contact.email}
            </a>
          </section>

        </div>
      </div>
    </>
  );
};

export default PressKitPage;