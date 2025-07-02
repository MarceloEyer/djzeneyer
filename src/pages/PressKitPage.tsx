// src/pages/PressKitPage.tsx - Versão com Layout Refinado

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, FileText, ImageIcon, Headphones, Award, Globe, Bot } from 'lucide-react';

// ... (Componentes HighlightCard e KitItem sem alterações) ...

const PressKitPage: React.FC = () => {
    // ... (lógica de mediaKitItems e whatsappUrl sem alterações) ...

    return (
        <motion.div /* ... */ >
            <div className="container mx-auto px-4 py-24 text-white">
                {/* ... (Seção Hero sem alterações) ... */}

                {/* ... (Seção de Destaques/Infográficos sem alterações) ... */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* COLUNA DA ESQUERDA - BIO E CONTATO */}
                    <div className="lg:col-span-2 space-y-12">
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold font-display mb-6 border-l-4 border-primary pl-4">Biografia Oficial</h2>
                            <div className="space-y-4 text-white/80 leading-relaxed prose prose-invert max-w-none">
                                <p>Referência global na cena do Zouk...</p>
                                <p>Sua filosofia musical é enraizada...</p>
                            </div>
                        </motion.section>

                        <motion.section className="text-center lg:text-left" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold font-display mb-4">Vamos Criar Algo Incrível Juntos</h2>
                            <p className="text-white/70 mb-8 max-w-2xl mx-auto lg:mx-0">Pronto para levar seu evento para o próximo nível? Entre em contato e vamos conversar sobre as possibilidades.</p>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-success inline-flex items-center gap-3">
                                <Phone size={20} />
                                Falar no WhatsApp para Contratação
                            </a>
                        </motion.section>
                    </div>

                    {/* COLUNA DA DIREITA - MEDIA KIT PARA DOWNLOAD */}
                    <div className="bg-surface/30 p-6 rounded-2xl border border-white/10 lg:sticky lg:top-24">
                        <h2 className="text-2xl font-bold font-display mb-6 text-center">Media Kit</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                            {mediaKitItems.map((item, index) => (
                                <KitItem key={index} icon={item.icon} title={item.title} downloadLink={item.path} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
// ... (resto do arquivo sem alterações)