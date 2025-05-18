import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const MusicPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen">
      {/* Page Header */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Music
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience the unique sound of DJ Zen Eyer's Brazilian Zouk music.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Music Player Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-lg bg-surface p-4 mb-8">
            <iframe 
              width="100%" 
              height="450" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay" 
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/243410722&color=%233a3a4b&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              className="rounded-lg"
            ></iframe>
          </div>

          <div className="text-center">
            <a 
              href="https://music.djzeneyer.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center space-x-2 btn btn-primary"
            >
              <Download size={20} />
              <span>Download Complete Music Collection and Sets</span>
            </a>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
            Support My Music
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Help me continue creating amazing Brazilian Zouk music by becoming a patron.
          </p>
          <a 
            href="https://patreon.djzeneyer.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            Become a Patron
          </a>
        </div>
      </section>
    </div>
  );
};

export default MusicPage;