import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Download, Image as ImageIcon } from 'lucide-react';
import { ARTIST } from '../data/artistData';

const MediaPage: React.FC = () => {
  const { t } = useTranslation();

  const pressHighlights = [
    {
      title: "2× World Champion Brazilian Zouk DJ",
      description: "Marcelo Eyer, known as DJ Zen Eyer, is a two-time World Champion in Brazilian Zouk, bringing unique energy to dance floors worldwide.",
      source: "Official Bio",
      year: "2023"
    },
    {
      title: "International Performances",
      description: "DJ Zen Eyer has performed at major festivals and events across Brazil, Europe, and the Americas, specializing in Brazilian Zouk music.",
      source: "Performance History",
      year: "2020-2024"
    }
  ];

  const mediaAssets = [
    {
      title: "High-Resolution Photos",
      description: "Professional photos for press and promotional use",
      icon: ImageIcon,
      available: false
    },
    {
      title: "Official Biography",
      description: "Complete artist bio in multiple languages",
      icon: Newspaper,
      available: true
    },
    {
      title: "Press Kit PDF",
      description: "Downloadable press kit with full information",
      icon: Download,
      available: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Media & Press Kit | DJ Zen Eyer</title>
        <meta name="description" content="Official media resources, press kit, and biography for DJ Zen Eyer - 2× World Champion Brazilian Zouk DJ." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Media & <span className="text-primary">Press Kit</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Official media resources and press information for DJ Zen Eyer
            </p>
          </motion.div>

          {/* Quick Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card mb-16 p-8"
          >
            <h2 className="text-2xl font-display font-bold mb-6">Quick Facts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">Artist Name</h3>
                <p className="text-lg font-semibold">DJ Zen Eyer</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">Legal Name</h3>
                <p className="text-lg font-semibold">Marcelo Eyer Fernandes</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">Genre</h3>
                <p className="text-lg font-semibold">Brazilian Zouk</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">Location</h3>
                <p className="text-lg font-semibold">São Paulo, Brazil</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">CNPJ</h3>
                <p className="text-lg font-semibold font-mono">44.063.765/0001-46</p>
              </div>
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-wider mb-2">ISNI</h3>
                <p className="text-lg font-semibold font-mono">0000 0005 2893 1015</p>
              </div>
            </div>
          </motion.div>

          {/* Press Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-8">Press Highlights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pressHighlights.map((item, index) => (
                <div key={index} className="card p-6 border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="text-sm text-white/50 font-mono">{item.year}</span>
                  </div>
                  <p className="text-white/70 mb-3">{item.description}</p>
                  <p className="text-sm text-primary">{item.source}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Media Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-8">Media Assets</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mediaAssets.map((asset, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    asset.available ? 'bg-primary/20' : 'bg-white/5'
                  }`}>
                    <asset.icon size={28} className={asset.available ? 'text-primary' : 'text-white/30'} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{asset.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{asset.description}</p>
                  {asset.available ? (
                    <button className="btn btn-primary btn-sm w-full">
                      <Download size={16} className="mr-2" />
                      Download
                    </button>
                  ) : (
                    <span className="text-xs text-white/40 uppercase tracking-wider">Coming Soon</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact for Press */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card p-8 text-center"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Press Inquiries</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              For press inquiries, interviews, or media requests, please contact our press office:
            </p>
            <a
              href={`mailto:${ARTIST.contact.email}`}
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <ExternalLink size={20} />
              Contact Press Office
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-white/50 mb-4">Verified Profiles</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="https://www.wikidata.org/wiki/Q136551855"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors flex items-center gap-2"
              >
                Wikidata <ExternalLink size={14} />
              </a>
              <a
                href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors flex items-center gap-2"
              >
                MusicBrainz <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MediaPage;
