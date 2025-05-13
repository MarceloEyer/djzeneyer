import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
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
                <a href="#contact" className="text-white/70 hover:text-primary transition-colors">
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
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                required
              />
              <button 
                type="submit" 
                className="w-full btn btn-primary"
              >
                Subscribe
              </button>
            </form>
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