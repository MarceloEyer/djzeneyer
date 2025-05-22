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

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/music" className="text-white/70 hover:text-primary transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/70 hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/tribe" className="text-white/70 hover:text-primary transition-colors">
                  Zen Tribe
                </Link>
              </li>
              <li>
                <a href="mailto:contact@djzeneyer.com" className="text-white/70 hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/70 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-white/70 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/licenses" className="text-white/70 hover:text-primary transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4">Join the Tribe</h3>
            <p className="text-white/70 mb-4">
              Subscribe to get exclusive updates, new releases, and VIP event access.
            </p>
            
            {isSubscribed ? (
              <div className="bg-success/20 border border-success/30 rounded-md p-3">
                <span>Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                {error && (
                  <div className="text-error text-sm">{error}</div>
                )}
                <div>
                  <label htmlFor="email-subscription" className="sr-only">Email address</label>
                  <input 
                    id="email-subscription"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email" 
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full btn btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {currentYear} DJ Zen Eyer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;