// src/pages/PressKitPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Download, ImageIcon, FileText, BarChart2, Headphones, Phone } from 'lucide-react';

// Componente para o Card de Estatística (Infográfico)
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-surface/50 border border-white/10 rounded-xl p-4 flex items-center space-x-4">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm text-white/70">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

// Componente para o Item de Download do Kit
const KitItem: React.FC<{ title: string; description: string; downloadLink: string }> = ({ title, description, downloadLink }) => (
  <div className="bg-surface/50 border border-white/10 rounded-xl p-6 transition-all hover:border-primary/50 hover:bg-surface">
    <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
    <p className="text-white/70 mb-4 text-sm">{description}</p>
    <a href={downloadLink} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
      <Download size={16} />
      Fazer Download
    </a>
  </div>
);


const PressKitPage: React.FC = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-24 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* SEÇÃO HERO */}
      <div className="text-center mb-20">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Work With Me
        </motion.h1>
        <motion.p 
          className="text-lg text-white/80 mt-4 max-w-3xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Abaixo você encontra todas as informações e materiais necessários para divulgação, imprensa e contratação. Vamos criar uma experiência inesquecível juntos.
        </motion.p>
      </div>

      {/* SEÇÃO DE ESTATÍSTICAS / INFOGRÁFICOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
        <StatCard icon={<Headphones size={32} />} label="Ouvintes Mensais Spotify" value="1.2M+" />
        <StatCard icon={<BarChart2 size={32} />} label="Top 100 DJs BR" value="#42" />
        <StatCard icon={<Users size={32} />} label="Seguidores Instagram" value="250k+" />
        <StatCard icon={<Calendar size={32} />} label="Shows por Ano" value="100+" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* COLUNA DA ESQUERDA - BIO E CONTATO */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold font-display mb-6 border-l-4 border-primary pl-4">Biografia Oficial</h2>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              {/* SUBSTITUA PELO SEU TEXTO */}
              DJ Zen Eyer transcende a definição de um mero DJ; ele é um arquiteto de paisagens sonoras, um curador de vibrações que conectam mente, corpo e alma. Com uma carreira que atravessa os mais renomados palcos do Brasil e do mundo, Zen Eyer se estabeleceu como uma força inovadora na música eletrônica, conhecido por seus sets que são verdadeiras jornadas imersivas.
            </p>
            <p>
              Sua filosofia musical é enraizada na crença de que a música é uma ferramenta de transformação. Cada batida, cada melodia, é cuidadosamente selecionada para elevar a consciência e criar momentos de pura euforia e introspecção na pista de dança...
            </p>
          </div>
          <div className="mt-12 text-center lg:text-left">
            <a href="mailto:contato@djzeneyer.com" className="btn btn-lg btn-primary inline-flex items-center gap-3">
              <Phone size={20} />
              Entrar em Contato para Contratação
            </a>
          </div>
        </div>

        {/* COLUNA DA DIREITA - MEDIA KIT PARA DOWNLOAD */}
        <div className="bg-surface/30 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold font-display mb-6">Media Kit</h2>
          <div className="space-y-4">
            <KitItem
              title="Fotos de Divulgação"
              description="Pacote com fotos em alta resolução (verticais e horizontais) para flyers e redes sociais."
              downloadLink="/caminho/para/seu/arquivo-de-fotos.zip" // SUBSTITUA AQUI
            />
            <KitItem
              title="Logos Oficiais"
              description="Logotipo em formatos PNG e SVG (vetor) com fundo transparente para todas as aplicações."
              downloadLink="/caminho/para/seus/logos.zip" // SUBSTITUA AQUI
            />
            <KitItem
              title="Press Kit Completo (PDF)"
              description="Um documento único com biografia, informações técnicas, links e contatos."
              downloadLink="/caminho/para/seu/presskit.pdf" // SUBSTITUA AQUI
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PressKitPage;