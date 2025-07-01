// src/pages/PressKitPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Phone, FileText, ImageIcon, Headphones, Award, Globe, Bot } from 'lucide-react';

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

const PressKitPage: React.FC = () => {
    // Array com os itens do Media Kit
    const mediaKitItems = [
        { icon: <ImageIcon size={32} />, title: "Fotos Oficiais", path: "/caminho/para/fotos.zip" },
        { icon: <Bot size={32} />, title: "Logos Oficiais", path: "/caminho/para/logos.zip" },
        { icon: <FileText size={32} />, title: "Press Kit (PDF)", path: "/caminho/para/presskit.pdf" }
    ];

    // Configurações do link do WhatsApp
    const whatsappNumber = '5531999999999'; // SUBSTITUA AQUI pelo seu número
    const whatsappMessage = "Olá, Zen Eyer! Tenho interesse em uma contratação para um evento de Zouk.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
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
                    {/* Biografia Profissional */}
                    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                        <h2 className="text-3xl font-bold mb-8 text-center">Minha Jornada no Zouk</h2>
                        <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-12 bg-surface/20 p-8 rounded-2xl border border-white/10">
                            <img 
                                src="/caminho/para/sua/foto-profissional.jpg" // SUBSTITUA AQUI
                                alt="DJ Zen Eyer" 
                                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-xl border-4 border-primary mx-auto md:mx-0 flex-shrink-0"
                            />
                            <p className="text-lg leading-relaxed text-white/90">
                                {/* TEXTO ATUALIZADO COM SUAS INFORMAÇÕES */}
                                Referência global na cena do Zouk, DJ Zen Eyer é um produtor e artista visionário cuja paixão é criar conexões profundas na pista de dança. Com uma carreira consolidada nos principais eventos do Brasil, sua sonoridade única já viajou o mundo, com passagens por palcos na Alemanha, Austrália, Suíça, Holanda, República Checa e Estados Unidos. Vencedor de prêmios como o "Zouk DJ Championship" e "Melhor Remix de Zouk", ele se prepara para sua próxima turnê europeia, começando pela Polônia.
                            </p>
                        </div>
                    </motion.section>

                    {/* Destaques e Conquistas */}
                    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                        <h2 className="text-3xl font-bold mb-8 text-center">Destaques</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <HighlightCard icon={<Award size={40} />} title="Campeão Internacional" subtitle="Zouk DJ Championship" />
                            <HighlightCard icon={<Globe size={40} />} title="7+ Países" subtitle="Turnês Internacionais Realizadas" />
                            <HighlightCard icon={<Headphones size={40} />} title="Prêmio de Melhor Remix" subtitle="Reconhecimento da Cena Zouk" />
                        </div>
                    </motion.section>

                    {/* Media Kit para Download */}
                    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                        <h2 className="text-3xl font-bold mb-8 text-center">Media Kit para Contratantes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mediaKitItems.map((item, index) => (
                                <a key={index} href={item.path} download target="_blank" rel="noopener noreferrer" className="bg-surface/30 p-8 rounded-lg text-center backdrop-blur-sm border border-white/10 transition-all hover:bg-primary/20 hover:border-primary">
                                    <div className="text-primary mx-auto mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-xl text-white">{item.title}</h3>
                                </a>
                            ))}
                        </div>
                    </motion.section>
                    
                    {/* Contato Final */}
                    <motion.section className="text-center border-t border-primary/20 pt-12 mt-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }}>
                        <h2 className="text-3xl font-bold font-display mb-4">Vamos Levar o Zouk ao seu Evento</h2>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                            <Phone size={20} />
                            Falar no WhatsApp para Contratação
                        </a>
                    </motion.section>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default PressKitPage;