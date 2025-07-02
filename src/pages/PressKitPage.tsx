// src/pages/PressKitPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Award, Globe, Headphones, Phone, FileText, ImageIcon, Bot } from 'lucide-react';

// Componente para o Card de Destaque (Infográfico)
const HighlightCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="bg-surface/30 p-6 rounded-lg text-center backdrop-blur-sm border border-white/10 h-full">
        <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-white">{title}</h3>
        <p className="text-white/70">{subtitle}</p>
    </div>
);

// Componente para o Item de Download do Kit
const KitItem: React.FC<{ icon: React.ReactNode; title: string; downloadLink: string }> = ({ icon, title, downloadLink }) => (
    <a
        href={downloadLink}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="bg-surface/30 p-8 rounded-lg text-center backdrop-blur-sm border border-white/10 transition-all hover:bg-primary/20 hover:border-primary flex flex-col items-center justify-center"
    >
        <div className="text-primary mx-auto mb-4">{icon}</div>
        <h3 className="font-bold text-xl text-white">{title}</h3>
    </a>
);

const PressKitPage: React.FC = () => {
    // Array com os itens do Media Kit para facilitar a manutenção
    const mediaKitItems = [
        { icon: <ImageIcon size={32} />, title: "Fotos Oficiais", path: "/caminho/para/seu/arquivo-de-fotos.zip" },
        { icon: <Bot size={32} />, title: "Logos Oficiais", path: "/caminho/para/seus/logos.zip" },
        { icon: <FileText size={32} />, title: "Press Kit (PDF)", path: "/caminho/para/seu/presskit.pdf" }
    ];

    // Configurações do link do WhatsApp
    const whatsappNumber = '5531999999999'; // SUBSTITUA AQUI pelo seu número
    const whatsappMessage = "Olá, Zen Eyer! Tenho interesse em uma contratação para um evento de Zouk.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <Helmet>
                <title>Press Kit & Contratação | DJ Zen Eyer</title>
                <meta name="description" content="Material de imprensa, biografia, fotos oficiais, logos e informações para contratar o DJ de Zouk internacional, Zen Eyer." />
            </Helmet>

            <motion.div
                className="bg-gradient-to-br from-black via-gray-900 to-primary/20 min-h-screen text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 py-24">
                    <motion.div className="text-center mb-20" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-5xl md:text-7xl font-extrabold font-display text-white">DJ Zen Eyer</h1>
                        <p className="text-xl text-primary mt-4 tracking-widest">Brazilian Zouk Innovator | Global DJ & Producer</p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto space-y-20">
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                             <h2 className="text-3xl font-bold mb-8 text-center">Minha Jornada no Zouk</h2>
                             <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-12 bg-surface/20 p-8 rounded-2xl border border-white/10">
                                <LazyLoadImage
                                    src="/caminho/para/sua/foto-profissional.jpg" // SUBSTITUA AQUI
                                    alt="DJ Zen Eyer"
                                    effect="blur"
                                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-xl border-4 border-primary mx-auto md:mx-0 flex-shrink-0"
                                    onError={(e: any) => { e.target.src = 'https://placehold.co/300x300/101418/6366F1?text=Zen+Eyer'; }}
                                />
                                <p className="text-lg leading-relaxed text-white/90">
                                    Referência global na cena do Zouk, DJ Zen Eyer é um produtor e artista visionário cuja paixão é criar conexões profundas na pista de dança. Com uma carreira consolidada nos principais eventos do Brasil, sua sonoridade única já viajou o mundo, com passagens por palcos na Alemanha, Austrália, Suíça, Holanda, República Checa e Estados Unidos. Vencedor de prêmios como o "Zouk DJ Championship" e "Melhor Remix de Zouk", ele se prepara para sua próxima turnê europeia, começando pela Polônia.
                                </p>
                             </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">Destaques</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <HighlightCard icon={<Award size={40} />} title="Campeão Internacional" subtitle="Zouk DJ Championship" />
                                <HighlightCard icon={<Globe size={40} />} title="7+ Países" subtitle="Turnês Internacionais" />
                                <HighlightCard icon={<Headphones size={40} />} title="Melhor Remix de Zouk" subtitle="Prêmio da Indústria" />
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-8 text-center">Media Kit para Contratantes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mediaKitItems.map((item, index) => (
                                    <KitItem key={index} icon={item.icon} title={item.title} downloadLink={item.path} />
                                ))}
                            </div>
                        </motion.section>
                        
                        <motion.section className="text-center border-t border-primary/20 pt-12 mt-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold font-display mb-4">Vamos Criar Algo Incrível Juntos</h2>
                            <p className="text-white/70 mb-8 max-w-2xl mx-auto">Pronto para levar seu evento para o próximo nível? Entre em contato e vamos conversar sobre as possibilidades.</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                                <Phone size={20} />
                                Falar no WhatsApp para Contratação
                            </a>
                        </motion.section>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default PressKitPage;