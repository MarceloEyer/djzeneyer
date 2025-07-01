// src/pages/PressKitPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Phone, FileText, ImageIcon, Headphones, Award, Globe, Bot } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Efeito de blur para o lazy load
import { useLanguage } from '../contexts/LanguageContext';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    // ... (código do StatCard sem alterações) ...
);

const KitItem: React.FC<{ icon: React.ReactNode; title: string; downloadLink: string }> = ({ icon, title, downloadLink }) => {
    const { t } = useLanguage();
    return (
        <a href={downloadLink} download target="_blank" rel="noopener noreferrer" className="...">
            <div className="text-primary mb-3">{icon}</div>
            <h3 className="font-semibold text-white">{t(title as any)}</h3>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-semibold">
                <Download size={16} />
                <span>{t('download_button' as any)}</span>
            </div>
        </a>
    );
};

const PressKitPage: React.FC = () => {
    const { t } = useLanguage();

    const mediaKitItems = [
        { icon: <ImageIcon size={32} />, title: "photos_title", path: "/caminho/para/fotos.zip" },
        { icon: <Bot size={32} />, title: "logos_title", path: "/caminho/para/logos.zip" },
        { icon: <FileText size={32} />, title: "press_kit_pdf_title", path: "/caminho/para/presskit.pdf" }
    ];

    const whatsappNumber = '5531999999999'; 
    const whatsappMessage = "Olá, Zen Eyer! Tenho interesse em uma contratação. Podemos conversar?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <Helmet>
                <title>Press Kit & Contratação | DJ Zen Eyer</title>
                <meta name="description" content="Encontre a biografia, fotos oficiais, logos e todas as informações para contratar o DJ Zen Eyer para seu evento." />
            </Helmet>

            <motion.div className="bg-gradient-to-br from-black via-gray-900 to-primary/20 min-h-screen text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="container mx-auto px-4 py-24">
                    <motion.div className="text-center mb-20" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-white">DJ Zen Eyer</h1>
                        <p className="text-xl text-primary mt-4 tracking-widest">{t('work_with_me_title' as any)}</p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto space-y-20">
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">{t('bio_title' as any)}</h2>
                            <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-12 bg-surface/20 p-8 rounded-2xl border border-white/10">
                                <LazyLoadImage
                                    src="/caminho/para/sua/foto-profissional.jpg" // SUBSTITUA AQUI
                                    alt="DJ Zen Eyer"
                                    effect="blur"
                                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-xl border-4 border-primary mx-auto md:mx-0"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/101418/6366F1?text=Zen+Eyer'; }}
                                />
                                <p className="text-lg leading-relaxed text-white/90">
                                    {/* Este texto pode vir do WordPress no futuro, mas por enquanto está aqui */}
                                    DJ Zen Eyer é um produtor e DJ de música eletrônica que transcende gêneros, criando paisagens sonoras 
                                    que conectam pessoas através de experiências musicais transformadoras...
                                </p>
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">{t('highlights_title' as any)}</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* ... (Componentes StatCard sem alterações) ... */}
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">{t('media_kit_title' as any)}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mediaKitItems.map((item, index) => (
                                    <KitItem key={index} icon={item.icon} title={item.title} downloadLink={item.path} />
                                ))}
                            </div>
                        </motion.section>

                        <motion.section className="text-center border-t border-primary/20 pt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                            <h2 className="text-3xl font-bold font-display mb-4">{t('contact_title' as any)}</h2>
                            <p className="text-white/70 mb-8 max-w-2xl mx-auto">{t('contact_subtitle' as any)}</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                                <Phone size={20} />
                                {t('contact_button' as any)}
                            </a>
                        </motion.section>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default PressKitPage;