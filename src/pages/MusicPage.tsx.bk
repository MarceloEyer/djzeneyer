// src/pages/MusicPage.tsx - DOWNLOAD HUB OTIMIZADO (HEADLESS SEO)

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import { 
    Download, Music2, Headphones, Award, TrendingUp, Zap, Clock, Heart, Users
} from 'lucide-react';

// ============================================================================
// CONSTANTES DE DOWNLOAD (SSOT)
// ============================================================================

/**
 * Hubs de Distribuição via Subdomínio (URLs flexíveis para Google Drive/Dropbox)
 */
const HUB_URL_DJS = 'https://djs.djzeneyer.com';
const HUB_URL_SETS = 'https://sets.djzeneyer.com';
const HUB_URL_MUSICAS = 'https://musicas.djzeneyer.com';


/**
 * Schema.org MusicPlaylist (Representando o catálogo completo para o Google)
 */
const MUSIC_PLAYLIST_SCHEMA = {
  // Mantido para SEO, mesmo sem cards individuais, representando o catálogo
  "@type": "MusicPlaylist",
  "name": "DJ Zen Eyer - Catálogo Oficial de Downloads de Zouk Brasileiro",
  "description": "Sets, remixes e edições estendidas de alta qualidade para DJs e dançarinos. O catálogo oficial de músicas Zouk Brasileiro de DJ Zen Eyer.",
  "creator": { "@id": "https://djzeneyer.com/#artist" },
  // Simplificado para propósitos de exemplo, mas representa todas as faixas
};


// ============================================================================
// COMPONENTE AUXILIAR (Card de Download)
// ============================================================================

const DownloadCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    url: string;
    styleClass: string;
    cta: string;
}> = memo(({ icon, title, description, url, styleClass, cta }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className={`card p-6 md:p-8 border ${styleClass} hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
        role="region"
        aria-labelledby={`download-title-${title}`}
    >
        <div className="text-center">
            <div className={`w-16 h-16 rounded-full inline-flex items-center justify-center mb-4 mx-auto ${styleClass.includes('border-primary') ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                {icon}
            </div>
            <h2 id={`download-title-${title}`} className="text-2xl font-black font-display mb-3">
                {title}
            </h2>
            <p className="text-white/70 mb-6 text-lg">{description}</p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg flex items-center justify-center gap-2 mx-auto"
                aria-label={cta}
            >
                <Download size={20} />
                {cta}
            </a>
        </div>
    </motion.div>
));
DownloadCard.displayName = 'DownloadCard';


// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const MusicPage: React.FC = () => {
    const { t } = useTranslation();
    const currentPath = '/music';
    const currentUrl = 'https://djzeneyer.com' + currentPath;

    // 💡 HREFLANG: Usa a função centralizada para evitar hardcoding
    const hrefLangUrls = getHrefLangUrls(currentPath, 'https://djzeneyer.com');

    return (
        <>
            {/* ====================================================================== */}
            {/* HEADLESS SEO (PADRÃO SSOT) */}
            {/* ====================================================================== */}
            <HeadlessSEO
                title="Download Músicas e Sets | DJ Zen Eyer - Zouk Brasileiro"
                description="Baixe faixas estendidas, sets temáticos e remixes exclusivos de DJ Zen Eyer. Qualidade profissional para DJs e fluidez garantida para dançarinos."
                url={currentUrl}
                image="https://djzeneyer.com/images/music-page-og-download.jpg"
                ogType="music.playlist"
                schema={MUSIC_PLAYLIST_SCHEMA}
                hrefLang={hrefLangUrls}
                keywords="download zouk, músicas para DJs, sets zouk, zouk brasileiro, faixas estendidas, música profissional"
            />

            {/* ====================================================================== */}
            {/* CONTEÚDO DA PÁGINA */}
            {/* ====================================================================== */}
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-block mb-4">
                            <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                                <Headphones className="inline-block mr-2" size={16} aria-hidden="true" />
                                DOWNLOAD HUB OFICIAL
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                            Sua Música. <span className="text-primary">Na Sua Mão.</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            A única coleção onde a qualidade e a fluidez são garantidas. Baixe aqui tudo que você precisa para a pista de dança ou para a cabine do DJ.
                        </p>
                    </motion.header>

                    {/* Download Hub Cards */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        
                        {/* 1. DJ EDITS (Foco em Profissionalismo e Qualidade) */}
                        <DownloadCard
                            icon={<Zap size={32} className="text-secondary" />}
                            title="FAIXAS ESTENDIDAS (DJs)"
                            description="Qualidade superior (320kbps+), beatgrids perfeitos, tonalidade analisada, e intros/outros que facilitam transições suaves e profissionais. Essencial para sonorização de festivais e clubes."
                            url={HUB_URL_DJS}
                            styleClass="border-secondary/50"
                            cta="BAIXAR EDITS PARA DJS"
                        />
                        
                        {/* 2. SETS COMPLETOS (Foco em Clima e Fluidez) */}
                        <DownloadCard
                            icon={<Heart size={32} className="text-primary" />}
                            title="SETS COMPLETOS (Temáticos)"
                            description="Sets mixados, sem intervalos ou quebra de clima. Perfeito para malhar, relaxar, ou animar sua festa sem DJ. Escolha entre sets sensuais, românticos ou nacionais."
                            url={HUB_URL_SETS}
                            styleClass="border-primary/50"
                            cta="BAIXAR SETS TEMÁTICOS"
                        />
                        
                        {/* 3. MÚSICAS INDIVIDUAIS (Foco em Exclusividade e Coreografia) */}
                        <DownloadCard
                            icon={<Music2 size={32} className="text-accent" />}
                            title="MÚSICAS INDIVIDUAIS"
                            description="Baixe remixes, edições raras e músicas próprias que você não encontra no Spotify. Perfeito para coreografias, playlists pessoais ou para ouvir sua versão favorita."
                            url={HUB_URL_MUSICAS}
                            styleClass="border-accent/50"
                            cta="BAIXAR REMIXES EXCLUSIVOS"
                        />
                        
                    </section>
                    
                    {/* Propaganda de Áudio (Conexão com Streaming) */}
                    <motion.section 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="text-center py-12 bg-surface rounded-xl shadow-inner border border-white/10"
                    >
                        <h2 className="text-3xl font-bold mb-4 font-display">
                            Prefere OUVIR Online?
                        </h2>
                        <p className="text-lg text-white/70 max-w-3xl mx-auto mb-6">
                            Para *streaming*, likes e views que ajudam na divulgação do meu trabalho, você me encontra no SoundCloud e YouTube.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="https://soundcloud.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg flex items-center gap-2">
                                <i className="fab fa-soundcloud" /> SoundCloud
                            </a>
                            <a href="https://youtube.com/@djzeneyer" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg flex items-center gap-2">
                                <i className="fab fa-youtube" /> YouTube
                            </a>
                        </div>
                    </motion.section>

                    {/* Audio Element - Mantido para compatibilidade, embora não seja usado */}
                    <audio
                        preload="metadata"
                        aria-label="Audio player"
                    />

                </div>
            </div>
        </>
    );
};

export default MusicPage;