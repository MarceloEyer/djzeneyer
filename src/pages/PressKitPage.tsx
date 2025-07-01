// src/pages/PressKitPage.tsx (Versão Simplificada e Segura)
import React from 'react';
import { Download, Phone } from 'lucide-react';

const PressKitPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold font-display">Work With Me / Press Kit</h1>
        <p className="text-lg text-white/80 mt-4">Recursos para contratantes, imprensa e parceiros.</p>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary pb-2">Biografia</h2>
          <p className="text-white/80 leading-relaxed">
            {/* Adicione sua biografia aqui */}
            DJ Zen Eyer é um produtor e DJ que cria experiências sonoras imersivas para a mente, corpo e alma...
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary pb-2">Media Kit para Download</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <a href="/caminho/para/fotos.zip" download className="bg-surface/50 p-6 rounded-lg text-center hover:bg-primary/20 transition">
              <ImageIcon className="mx-auto mb-2" size={32} />
              <span className="font-semibold">Fotos de Divulgação</span>
            </a>
            <a href="/caminho/para/logos.zip" download className="bg-surface/50 p-6 rounded-lg text-center hover:bg-primary/20 transition">
              <Bot className="mx-auto mb-2" size={32} />
              <span className="font-semibold">Logos Oficiais</span>
            </a>
            <a href="/caminho/para/presskit.pdf" download className="bg-surface/50 p-6 rounded-lg text-center hover:bg-primary/20 transition">
              <FileText className="mx-auto mb-2" size={32} />
              <span className="font-semibold">Press Kit (PDF)</span>
            </a>
          </div>
        </div>
        <div className="text-center pt-8">
          <a href="mailto:contato@djzeneyer.com" className="btn btn-lg btn-primary inline-flex items-center gap-3">
            <Phone size={20} />
            Entrar em Contato
          </a>
        </div>
      </div>
    </div>
  );
};

// Adicione estes imports que podem estar faltando
import { Bot, FileText, ImageIcon } from 'lucide-react';
export default PressKitPage;