// src/pages/PressKitPage.tsx
import React from 'react';
import { Download, Phone, FileText, ImageIcon, Headphones, Award, Globe, Bot, Star, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

// Card de Destaque animado (com efeito de hover/gamificação)
const HighlightCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; flair?: React.ReactNode }> = ({ icon, title, subtitle, flair }) => (
    <motion.div 
        whileHover={{ scale: 1.08, rotate: -2 }}
        className="bg-surface/30 p-6 rounded-lg text-center backdrop-blur-sm border border-white/10 shadow-lg relative"
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className="absolute top-2 right-2">{flair}</div>
        <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-white">{title}</h3>
        <p className="text-white/70">{subtitle}</p>
    </motion.div>
);

const PressKitPage: React.FC = () => {
    // Itens do Media Kit
    const mediaKitItems = [
        {
            icon: <ImageIcon size={32} />,
            title: "Fotos Oficiais",
            description: "Pacote com fotos em alta resolução para divulgação.",
            path: "/caminho/para/seu/arquivo-de-fotos.zip"
        },
        {
            icon: <Bot size={32} />,
            title: "Logos & Identidade Visual",
            description: "Logo oficial em formatos PNG e SVG para todo tipo de material.",
            path: "/caminho/para/seus/logos.zip"
        },
        {
            icon: <FileText size={32} />,
            title: "Press Kit Completo (PDF)",
            description: "Documento único com bio, links, rider técnico e contatos.",
            path: "/caminho/para/seu/presskit.pdf"
        }
    ];

    // Dados animados: países, prêmios, experiências
    const achievements = [
        { icon: <Globe size={40} />, title: "11 🇧🇷 Países tocados", flair: <Rocket className="text-accent" size={22} />, subtitle: "Shows do Brasil ao Japão" },
        { icon: <Award size={40} />, title: "4 Prêmios", flair: <Star className="text-warning" size={22} />, subtitle: "Reconhecimento Internacional e Nacional" },
        { icon: <Headphones size={40} />, title: "500k+ Streams", flair: <Star className="text-success" size={22} />, subtitle: "Plataformas Digitais" }
    ];

    // WhatsApp
    const whatsappNumber = '5531999999999';
    const whatsappMessage = "Olá, Zen Eyer! Tenho interesse em uma contratação. Podemos conversar?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-primary/20 min-h-screen text-white">
            <div className="container mx-auto px-4 py-24">
                {/* Headline com animação */}
                <motion.div 
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold font-display text-white drop-shadow-lg">
                        Work With <span className="text-primary">DJ Zen Eyer</span>
                    </h1>
                    <motion.p 
                        className="text-xl text-primary mt-4 tracking-widest"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        Sonic Architect | Global Electronic Music Experience
                    </motion.p>
                </motion.div>

                <div className="max-w-5xl mx-auto space-y-20">
                    {/* Release + Bio Profissional */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.9 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">[translate:Minha Jornada Musical]</h2>
                        <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-12 bg-surface/20 p-8 rounded-2xl border border-white/10">
                            <img 
                                src="/caminho/para/sua/foto-profissional.jpg"
                                alt="DJ Zen Eyer" 
                                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-xl border-4 border-primary mx-auto md:mx-0"
                            />
                            <p className="text-lg leading-relaxed text-white/90">
                                [translate:DJ Zen Eyer é muito mais do que DJ: é um artista que faz do palco uma experiência inesquecível. 
                                Mais de uma década de carreira, passagens por mais de 11 países, prêmios de destaque em festivais de música eletrônica e tracks que viralizaram nas plataformas digitais.
                                Com energia contagiante, técnica refinada e abordagem inovadora, ele transforma eventos em memórias — indo do underground ao internacional, do Brasil ao Japão.]
                            </p>
                        </div>
                    </motion.section>

                    {/* Achievements/Gamificação */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Destaques & Missões Cumpridas</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {achievements.map(({icon, title, subtitle, flair}, idx) => (
                                <HighlightCard key={idx} icon={icon} title={title} subtitle={subtitle} flair={flair} />
                            ))}
                        </div>
                    </motion.section>

                    {/* Media Kit */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Material para Contratantes</h2>
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
                                    <p className="text-white/70">{item.description}</p>
                                </a>
                            ))}
                        </div>
                    </motion.section>

                    {/* Call to Action animada */}
                    <motion.section 
                        className="text-center border-t border-primary/20 pt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold font-display mb-4">Vamos criar algo épico?</h2>
                        <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                            [translate:Pronto para transformar seu evento em história? Chame no WhatsApp e descubra como a música pode elevar a sua marca, festa ou convenção. Chegue mais perto do Zen.]
                        </p>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                            <Phone size={20} />
                            [translate:Falar no WhatsApp]
                        </a>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default PressKitPage;
