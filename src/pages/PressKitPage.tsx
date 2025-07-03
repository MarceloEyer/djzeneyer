// src/pages/PressKitPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Award, Globe, Headphones, Phone, FileText, ImageIcon, Bot } from 'lucide-react';

const HighlightCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="bg-surface/30 p-6 rounded-lg text-center backdrop-blur-sm border border-white/10 h-full">
        <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">{icon}</div>
        <h3 className="font-bold text-xl text-white">{title}</h3>
        <p className="text-white/70">{subtitle}</p>
    </div>
);

const KitItem: React.FC<{ titleKey: string; downloadLink: string; icon: React.ReactNode }> = ({ titleKey, downloadLink, icon }) => {
    const { t } = useTranslation();
    return (
        <a href={downloadLink} download target="_blank" rel="noopener noreferrer" className="bg-surface/30 p-8 rounded-lg text-center backdrop-blur-sm border border-white/10 transition-all hover:bg-primary/20 hover:border-primary flex flex-col items-center justify-center">
            <div className="text-primary mx-auto mb-4">{icon}</div>
            <h3 className="font-bold text-xl text-white">{t(titleKey)}</h3>
        </a>
    );
};

const PressKitPage: React.FC = () => {
    const { t } = useTranslation();

    const mediaKitItems = [
        { icon: <ImageIcon size={32} />, titleKey: 'presskit_photos_title', path: "/caminho/para/fotos.zip" },
        { icon: <Bot size={32} />, titleKey: 'presskit_logos_title', path: "/caminho/para/logos.zip" },
        { icon: <FileText size={32} />, titleKey: 'presskit_pdf_title', path: "/caminho/para/presskit.pdf" }
    ];

    const whatsappNumber = '5531999999999'; // SUBSTITUA
    const whatsappMessage = t('whatsapp_message');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <Helmet>
                <title>{t('presskit_seo_title')}</title>
                <meta name="description" content={t('presskit_seo_desc')} />
            </Helmet>

            <motion.div className="bg-gradient-to-br from-black via-gray-900 to-primary/20 min-h-screen text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="container mx-auto px-4 py-24">
                    <motion.div className="text-center mb-20" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-white">{t('presskit_main_title')}</h1>
                        <p className="text-xl text-primary mt-4 tracking-widest">{t('presskit_main_subtitle')}</p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto space-y-20">
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                             <h2 className="text-3xl font-bold mb-8 text-center">{t('presskit_bio_title')}</h2>
                             <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-12 bg-surface/20 p-8 rounded-2xl border border-white/10">
                                <LazyLoadImage
                                    src="/caminho/para/sua/foto-profissional.jpg" // SUBSTITUA
                                    alt="DJ Zen Eyer"
                                    effect="blur"
                                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-xl border-4 border-primary mx-auto md:mx-0 flex-shrink-0"
                                    onError={(e: any) => { e.target.src = 'https://placehold.co/320x320/101418/6366F1?text=Zen+Eyer'; }}
                                />
                                <p className="text-lg leading-relaxed text-white/80">{t('presskit_bio_text')}</p>
                             </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">{t('presskit_highlights_title')}</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <HighlightCard icon={<Award size={40} />} title={t('highlight1_title')} subtitle={t('highlight1_subtitle')} />
                                <HighlightCard icon={<Globe size={40} />} title={t('highlight2_title')} subtitle={t('highlight2_subtitle')} />
                                <HighlightCard icon={<Headphones size={40} />} title={t('highlight3_title')} subtitle={t('highlight3_subtitle')} />
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">{t('presskit_media_kit_title')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mediaKitItems.map((item, index) => (
                                    <KitItem key={index} icon={item.icon} titleKey={item.titleKey} downloadLink={item.path} />
                                ))}
                            </div>
                        </motion.section>
                        
                        <motion.section className="text-center border-t border-primary/20 pt-12 mt-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold font-display mb-4">{t('presskit_contact_title')}</h2>
                            <p className="text-white/70 mb-8 max-w-2xl mx-auto">{t('presskit_contact_subtitle')}</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                                <Phone size={20} />
                                {t('presskit_contact_button')}
                            </a>
                        </motion.section>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default PressKitPage;