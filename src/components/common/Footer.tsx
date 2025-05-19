import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Instagram, Facebook, Youtube, Music2 } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada real para sua API
      // await api.subscribe(email);
      
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <span className="text-xl font-display font-bold tracking-wide">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </div>
            <p className="text-white/70 mb-4">
              Music producer and DJ creating immersive audio experiences for the mind, body, and soul.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/djzeneyer" 
                 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://soundcloud.com/djzeneyer" 
                 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="SoundCloud"
              >
                <Music2 size={20} />
              </a>
              <a 
                href="https://youtube.com/djzeneyer" 
                 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://facebook.com/djzeneyer" 
                 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Resto do código permanece igual */}
          {/* ... */}
        </div>
      </div>
    </footer>
  );
};