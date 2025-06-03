// src/components/common/Footer.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Instagram, Youtube, Music2, MessageCircle, Send } from 'lucide-react';

// Ícone do Facebook (SVG embutido)
const FacebookIcon: React.FC<{ size?: number, className?: string }> = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const whatsappNumber = "+5521987413091";
  const whatsappMessage = "Hello DJ Zen Eyer!";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Footer] handleSubscribe: Iniciado.');
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitSuccess(null);

    if (!email) {
      console.log('[Footer] handleSubscribe: E-mail vazio.');
      setSubmitMessage('Please enter a valid email address.');
      setSubmitSuccess(false);
      setIsSubmitting(false);
      return;
    }

    console.log('[Footer] handleSubscribe: Tentando inscrever e-mail:', email);
    try {
      const payload = { email: email, subscribed_at: new Date().toISOString() };
      console.log('[Footer] handleSubscribe: Payload para Supabase:', payload);

      // Chamada de insert simplificada, sem .select() explícito
      const { error } = await supabase
        .from('subscribers')
        .insert([payload]); 

      console.log('[Footer] handleSubscribe: Resposta do Supabase - error:', error);

      if (error) {
        console.error('[Footer] Supabase subscription error object:', JSON.stringify(error, null, 2));
        if (error.code === '23505') { // Código para violação de constraint UNIQUE (e-mail já existe)
          setSubmitMessage('This email is already subscribed. Thank you!');
          setSubmitSuccess(true); 
        } else {
          // Se o erro for de RLS (como 42501), ele será capturado aqui
          setSubmitMessage(`Error: ${error.message} (Code: ${error.code})`);
          setSubmitSuccess(false);
        }
      } else {
        // Se não houve erro, consideramos a inserção bem-sucedida
        console.log('[Footer] Subscription insert attempted successfully (no client-side error).');
        setSubmitMessage('Thanks for subscribing! Keep an eye on your inbox.');
        setSubmitSuccess(true);
        setEmail(''); 
      }
    } catch (err: any) { 
      console.error('[Footer] handleSubscribe: ERRO INESPERADO no bloco try/catch:', err);
      setSubmitMessage(err.message || 'Failed to subscribe due to an unexpected error. Please try again.');
      setSubmitSuccess(false);
    } finally {
      console.log('[Footer] handleSubscribe: Bloco finally executado.');
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Logo and about */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                <Music size={20} className="text-primary" />
              </div>
              <span className="text-xl font-display font-bold tracking-wide">
                <span className="text-primary">DJ</span> Zen Eyer
              </span>
            </div>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Music producer and DJ creating immersive audio experiences for the mind, body, and soul.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={22} /></a>
              <a href="https://soundcloud.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="SoundCloud"><Music2 size={22} /></a>
              <a href="YOUR_YOUTUBE_CHANNEL_LINK_HERE" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Youtube"><Youtube size={22} /></a> {/* <<< ATUALIZE ESTE LINK DO YOUTUBE PARA O SEU CANAL */}
              <a href="https://facebook.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Facebook"><FacebookIcon size={22} /></a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="WhatsApp"><MessageCircle size={22} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div> 
            <h3 className="text-lg font-display font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-white/70 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/music" className="text-white/70 hover:text-primary transition-colors">Music</Link></li>
              <li><Link to="/events" className="text-white/70 hover:text-primary transition-colors">Events</Link></li>
              <li><Link to="/tribe" className="text-white/70 hover:text-primary transition-colors">Zen Tribe Info</Link></li>
              <li><a href="mailto:contact@djzeneyer.com" className="text-white/70 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Discover More */}
          <div> 
            <h3 className="text-lg font-display font-semibold mb-4 text-white">Discover More</h3>
            <ul className="space-y-2.5">
              <li><Link to="/my-philosophy" className="text-white/70 hover:text-primary transition-colors">Music Philosophy</Link></li>
              <li><Link to="/press-kit" className="text-white/70 hover:text-primary transition-colors">Press Kit / Booking</Link></li>
              <li><a href="https://patreon.djzeneyer.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Support the Artist</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1"> 
            <h3 className="text-lg font-display font-semibold mb-4 text-white">Join the Newsletter</h3>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              Get exclusive updates, new releases, and VIP event access directly to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label htmlFor="footer-email-subscription" className="sr-only">Email address</label>
                <input 
                  id="footer-email-subscription"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-white/40"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
              </button>
            </form>
            {submitMessage && (
              <p className={`mt-3 text-sm ${submitSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {submitMessage}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center text-white/50 text-xs md:text-sm">
          <p>© {currentYear} DJ Zen Eyer. All rights reserved. Elevating vibes, one beat at a time.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
