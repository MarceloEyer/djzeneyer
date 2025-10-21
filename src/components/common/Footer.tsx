// src/components/common/Footer.tsx - VERSÃO CORRIGIDA

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Music, Instagram, Youtube, Music2, MessageCircle, Send } from 'lucide-react';

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

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
  const { t } = useTranslation();
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
      setSubmitMessage(t('auth.errors.invalidEmail'));
      setSubmitSuccess(false);
      setIsSubmitting(false);
      return;
    }

    console.log('[Footer] handleSubscribe: Tentando inscrever e-mail:', email);
    try {
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      console.log('[Footer] handleSubscribe: Resposta do WP API:', data, 'status:', response.status);

      if (response.ok) {
        setSubmitMessage(data.message || t('footer_subscribe_success'));
        setSubmitSuccess(true);
        setEmail('');
      } else {
        const errorMessage = data.message || t('footer_subscribe_error');
        setSubmitMessage(errorMessage);
        setSubmitSuccess(false);
        console.error('[Footer] WP API subscription error:', data);
      }
    } catch (err: any) {
      console.error('[Footer] handleSubscribe: ERRO INESPERADO no bloco try/catch:', err);
      setSubmitMessage(err.message || t('footer_subscribe_error'));
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
          
          {/* Logo and About */}
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
              {t('footer_bio')}
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={22} />
              </a>
              <a href="https://soundcloud.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="SoundCloud">
                <Music2 size={22} />
              </a>
              <a href="https://youtube.com/@djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Youtube">
                <Youtube size={22} />
              </a>
              <a href="https://facebook.com/djzeneyer" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="Facebook">
                <FacebookIcon size={22} />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-white">{t('footer_quick_links')}</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-white/70 hover:text-primary transition-colors">{t('footer_home')}</Link></li>
              <li><Link to="/music" className="text-white/70 hover:text-primary transition-colors">{t('footer_music')}</Link></li>
              <li><Link to="/events" className="text-white/70 hover:text-primary transition-colors">{t('footer_events')}</Link></li>
              <li><Link to="/zentribe" className="text-white/70 hover:text-primary transition-colors">{t('footer_zen_tribe_info')}</Link></li>
              <li><a href="mailto:contact@djzeneyer.com" className="text-white/70 hover:text-primary transition-colors">{t('footer_contact_text')}</a></li>
            </ul>
          </div>

          {/* Discover More */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-white">{t('footer_discover_more')}</h3>
            <ul className="space-y-2.5">
              <li><Link to="/my-philosophy" className="text-white/70 hover:text-primary transition-colors">{t('footer_music_philosophy')}</Link></li>
              <li><Link to="/work-with-me" className="text-white/70 hover:text-primary transition-colors">{t('footer_press_kit_booking')}</Link></li>
              <li><Link to="/faq" className="text-white/70 hover:text-primary transition-colors">FAQ</Link></li>
              <li><a href="https://patreon.djzeneyer.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">{t('footer_support_artist')}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-display font-semibold mb-4 text-white">{t('footer_join_newsletter')}</h3>
            <p className="text-white/70 mb-4 text-sm leading-relaxed">
              {t('footer_newsletter_desc')}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label htmlFor="footer-email-subscription" className="sr-only">{t('footer_email_placeholder')}</label>
                <input
                  id="footer-email-subscription"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer_email_placeholder')}
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
                <span>{isSubmitting ? t('loading') : t('footer_subscribe')}</span>
              </button>
            </form>
            {submitMessage && (
              <p className={`mt-3 text-sm ${submitSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {submitMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-white/50 text-xs md:text-sm">
          <p>© {currentYear} DJ Zen Eyer. {t('footer_rights')} {t('footer_tagline')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
