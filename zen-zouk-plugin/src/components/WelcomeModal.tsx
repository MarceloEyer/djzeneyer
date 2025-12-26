import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="card max-w-lg w-full relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                  <Sparkles size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold font-display text-gradient mb-2">
                  Bem-vindo ao Zen Zouk
                </h2>
                <p className="text-white/70">
                  Sua jornada de 105 dias para dominar conexão social e dança
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Desafios Diários</h3>
                    <p className="text-sm text-white/60">
                      Micro-missões baseadas em psicologia e neurociência para desenvolver habilidades sociais
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">5 Níveis Progressivos</h3>
                    <p className="text-sm text-white/60">
                      De presença básica até intimidade artística, cada nível tem 21 dias de prática
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Reflexão e Crescimento</h3>
                    <p className="text-sm text-white/60">
                      Registre suas experiências e acompanhe sua evolução ao longo do tempo
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn btn-primary w-full"
              >
                Começar Jornada
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
