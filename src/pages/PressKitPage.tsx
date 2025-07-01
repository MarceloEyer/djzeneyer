// src/pages/PressKitPage.tsx
import React from 'react';
import { Download, Phone, FileText, ImageIcon, Headphones, Award, Globe, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

// Componente para o Card de Destaque
const HighlightCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="bg-surface/30 p-6 rounded-lg text-center backdrop-blur-sm border border-white/10">
        <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-white">{title}</h3>
        <p className="text-white/70">{subtitle}</p>
    </div>
);

const PressKitPage: React.FC = () => {
    // Array com os itens do Media Kit para facilitar a manutenção
    const mediaKitItems = [
        {
            icon: <ImageIcon size={32} />,
            title: "Fotos Oficiais",
            description: "Pacote com fotos em alta resolução para divulgação.",
            path: "/caminho/para/seu/arquivo-de-fotos.zip" // SUBSTITUA AQUI
        },
        {
            icon: <Bot size={32} />,
            title: "Logos & Identidade Visual",
            description: "Logo oficial em formatos PNG e SVG para todo tipo de material.",
            path: "/caminho/para/seus/logos.zip" // SUBSTITUA AQUI
        },
        {
            icon: <FileText size={32} />,
            title: "Press Kit Completo (PDF)",
            description: "Documento único com bio, links, rider técnico e contatos.",
            path: "/caminho/para/seu/presskit.pdf" // SUBSTITUA AQUI
        }
    ];

    // Configurações do link do WhatsApp
    const whatsappNumber = '5531999999999'; // SUBSTITUA AQUI pelo seu número
    const whatsappMessage = "Olá, Zen Eyer! Tenho interesse em uma contratação. Podemos conversar?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-primary/20 min-h-screen text-white">
            <div className="container mx-auto px-4 py-24">
                <motion.div 
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold font-display text-white">DJ Zen Eyer</h1>
                    <p className="text-xl text-primary mt-4 tracking-widest">Sonic Architect | Global Electronic Music Experience</p>
                </motion.div>

                <div className="max-w-5xl mx-auto space-y-20">
                    {/* Biografia Profissional */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Minha Jornada Musical</h2>
                        <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-12 bg-surface/20 p-8 rounded-2xl border border-white/10">
                            <img 
                                src="/caminho/para/sua/foto-profissional.jpg" // SUBSTITUA AQUI
                                alt="DJ Zen Eyer" 
                                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-xl border-4 border-primary mx-auto md:mx-0"
                            />
                            <p className="text-lg leading-relaxed text-white/90">
                                DJ Zen Eyer é um produtor e DJ de música eletrônica que transcende gêneros, criando paisagens sonoras 
                                que conectam pessoas através de experiências musicais transformadoras. Com performances em festivais 
                                internacionais e tracks que misturam elementos de techno, ambient e world music, Zen Eyer convida 
                                o público a uma jornada sensorial única.
                            </p>
                        </div>
                    </motion.section>

                    {/* Destaques e Conquistas */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Destaques</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <HighlightCard icon={<Award size={40} />} title="Top 10 DJs Emergentes" subtitle="Electronic Wave Magazine" />
                            <HighlightCard icon={<Globe size={40} />} title="Turnês Internacionais" subtitle="Europa & América Latina" />
                            <HighlightCard icon={<Headphones size={40} />} title="500k+ Streams" subtitle="Plataformas Digitais" />
                        </div>
                    </motion.section>

                    {/* Media Kit para Download */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Media Kit para Contratantes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {mediaKitItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.path}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-surface/30 p-8 rounded-lg text-center backdrop-blur-sm border border-white/10 transition-all hover:bg-primary/20 hover:border-primary"
                                >
                                    <div className="text-primary mx-auto mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-xl text-white">{item.title}</h3>
                                </a>
                            ))}
                        </div>
                    </motion.section>

                    {/* Contato Final */}
                    <motion.section 
                        className="text-center border-t border-primary/20 pt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold font-display mb-4">Vamos Criar Algo Incrível Juntos</h2>
                        <p className="text-white/70 mb-8 max-w-2xl mx-auto">Pronto para levar seu evento para o próximo nível? Entre em contato e vamos conversar sobre as possibilidades.</p>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                            <Phone size={20} />
                            Falar no WhatsApp
                        </a>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default PressKitPage;