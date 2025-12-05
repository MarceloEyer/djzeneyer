// src/pages/HomePage.tsx
// VERSÃO 6: HOME OTIMIZADA (SEO DE AUTORIDADE + UX DE NAVEGAÇÃO + SLOT DE EVENTOS + TEXTO REVISADO)
// Arquitetura: React/Vite + Framer Motion + Headless SEO
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PlayCircle, Calendar, Users, Music, Award, Trophy,
  Globe, Mic2, Download, Mail, ExternalLink, Sparkles
} from 'lucide-react';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { EventsList } from '../components/EventsList';
// ============================================================================
// 1. DADOS E CONSTANTES
// ============================================================================
// Features (Resgatado do Código 1 para melhor UX de navegação)
const FEATURES_DATA = [
  {
    id: 'music',
    icon: <Music size={32} aria-hidden="true" />,
    titleKey: 'home_feat_exclusive_title',
    descKey: 'home_feat_exclusive_desc'
  },
  {
    id: 'achievements',
    icon: <Award size={32} aria-hidden="true" />,
    titleKey: 'home_feat_achievements_title',
    descKey: 'home_feat_achievements_desc'
  },
  {
    id: 'community',
    icon: <Users size={32} aria-hidden="true" />,
    titleKey: 'home_feat_community_title',
    descKey: 'home_feat_community_desc'
  },
];
const FESTIVALS_HIGHLIGHT = ARTIST.festivals.slice(0, 6);
const STATS = [
  { value: '2×', label: 'World Champion', icon: Trophy },
  { value: `${ARTIST.stats.countriesPlayed}+`, label: 'Countries', icon: Globe },
  { value: `${ARTIST.stats.yearsActive}+`, label: 'Years Active', icon: Sparkles },
];
// Animações
const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const ITEM_VARIANTS: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};
// ============================================================================
// 2. SCHEMA.ORG (Motor de SEO)
// ============================================================================
const generateHomeSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${ARTIST.site.baseUrl}/#website`,
      "url": ARTIST.site.baseUrl,
      "name": "DJ Zen Eyer - Official Website",
      "description": "Official website of DJ Zen Eyer, 2× World Champion Brazilian Zouk DJ & Producer",
      "publisher": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "inLanguage": ["en", "pt-BR"],
    },
    {
      ...ARTIST_SCHEMA_BASE,
      "nationality": { "@type": "Country", "name": "Brazil" },
      "birthDate": ARTIST.identity.birthDate,
      "birthPlace": {
        "@type": "Place",
        "name": "Rio de Janeiro",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rio de Janeiro",
          "addressRegion": "RJ",
          "addressCountry": "BR"
        }
      },
      "workLocation": {
        "@type": "Place",
        "name": "São Paulo",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      },
      "award": [
        "Best Remix - Ilha do Zouk Championship 2022",
        "Best DJ Performance - Ilha do Zouk Championship 2022"
      ],
      "memberOf": {
        "@type": "Organization",
        "name": "Mensa International",
        "url": "https://www.mensa.org"
      },
      "knowsAbout": ["Brazilian Zouk", "Music Production", "DJing", "Remixing", "Kizomba"],
      "hasOccupation": [
        { "@type": "Occupation", "name": "DJ" },
        { "@type": "Occupation", "name": "Music Producer" },
        { "@type": "Occupation", "name": "Remixer" },
      ],
      "performerIn": FESTIVALS_HIGHLIGHT.map(f => ({
        "@type": "Event",
        "name": f.name,
        "location": { "@type": "Country", "name": f.country },
      })),
      "identifier": [
        { "@type": "PropertyValue", "propertyID": "MusicBrainz", "value": ARTIST.identifiers.musicbrainz },
        { "@type": "PropertyValue", "propertyID": "Wikidata", "value": ARTIST.identifiers.wikidata },
        { "@type": "PropertyValue", "propertyID": "ISNI", "value": ARTIST.identifiers.isni },
        { "@type": "PropertyValue", "propertyID": "Discogs", "value": ARTIST.identifiers.discogs },
      ],
    },
    {
      "@type": "MusicGroup",
      "@id": `${ARTIST.site.baseUrl}/#musicgroup`,
      "name": "DJ Zen Eyer",
      "alternateName": "Zen Eyer",
      "legalName": "Marcelo Eyer Fernandes",
      "taxID": "44.063.765/0001-46",
      "url": ARTIST.site.baseUrl,
      "genre": ["Brazilian Zouk", "Kizomba", "Brazilian Bass"],
      "foundingDate": "2015",
      "foundingLocation": {
        "@type": "Place",
        "name": "Rio de Janeiro",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rio de Janeiro",
          "addressRegion": "RJ",
          "addressCountry": "BR"
        }
      },
      "location": {
        "@type": "Place",
        "name": "São Paulo",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      },
      "member": {
        "@id": `${ARTIST.site.baseUrl}/#artist`
      },
      "sameAs": [
        ARTIST.social.instagram,
        ARTIST.social.spotify,
        ARTIST.social.soundcloud,
        ARTIST.social.youtube,
        ARTIST.social.facebook,
        `https://musicbrainz.org/artist/${ARTIST.identifiers.musicbrainz}`,
        `https://www.wikidata.org/wiki/${ARTIST.identifiers.wikidata}`,
      ]
    },
    {
      "@type": "WebPage",
      "@id": `${ARTIST.site.baseUrl}/#webpage`,
      "url": ARTIST.site.baseUrl,
      "name": "DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer",
      "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
      "about": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "description": "DJ Zen Eyer - Two-time world champion in Best Remix and Best DJ Performance at the Brazilian Zouk World Championships. Book now for international events.",
      "breadcrumb": { "@id": `${ARTIST.site.baseUrl}/#breadcrumb` },
      "inLanguage": "en",
    },
  ],
});
// ============================================================================
// 3. COMPONENTES AUXILIARES
// ============================================================================
const StatCard: React.FC<{ value: string; label: string; icon: any }> = ({ value, label, icon: Icon }) => (
  <motion.div
    className="text-center p-4"
    variants={ITEM_VARIANTS}
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden="true" />
    <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
    <div className="text-sm text-white/70 uppercase tracking-wider">{label}</div>
  </motion.div>
);
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; variants: any; }> = ({ icon, title, description, variants }) => (
  <motion.div className="card p-8 text-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" variants={variants}>
    <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
);
const FestivalBadge: React.FC<{ name: string; flag: string }> = ({ name, flag }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors">
    <span aria-hidden="true">{flag}</span>
    <span>{name}</span>
  </span>
);
// ============================================================================
// 4. PAGE COMPONENT
// ============================================================================
const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isPortuguese = i18n.language?.startsWith('pt');
 
  const currentPath = '/';
  const currentUrl = ARTIST.site.baseUrl;
  return (
    <>
      <HeadlessSEO
        title="DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer"
        description={`DJ Zen Eyer, two-time world champion (Best Remix & Best DJ Performance). Creator of "${ARTIST.philosophy.slogan}". Book for international events.`}
        url={currentUrl}
        image={`${currentUrl}/images/zen-eyer-og-image.jpg`}
        isHomepage={true}
        hrefLang={getHrefLangUrls(currentPath, currentUrl)}
        schema={generateHomeSchema()}
      />
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 z-0 bg-black">
          <motion.img
            src="/images/hero-background.webp"
            alt="DJ Zen Eyer performing at Brazilian Zouk event"
            className="w-full h-full object-cover object-center opacity-40"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={CONTAINER_VARIANTS}
          >
            {/* Badge de Autoridade */}
            <motion.div variants={ITEM_VARIANTS} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium">
                <Trophy size={16} />
                <span>2× World Champion - Brazilian Zouk World Championships</span>
              </span>
            </motion.div>
            <motion.h1 variants={ITEM_VARIANTS} className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-4">
              DJ Zen Eyer
            </motion.h1>
            <motion.p variants={ITEM_VARIANTS} className="text-xl md:text-2xl text-white/90 mb-2">
              {isPortuguese ? 'Bicampeão Mundial de Zouk Brasileiro' : '2× World Champion Brazilian Zouk DJ & Producer'}
            </motion.p>
            <motion.p variants={ITEM_VARIANTS} className="text-lg md:text-xl italic text-primary/90 mb-8">
              "{ARTIST.philosophy.slogan}" ™
            </motion.p>
            <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {STATS.map(stat => <StatCard key={stat.label} {...stat} />)}
            </motion.div>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap gap-4 justify-center mb-6">
              <a href={ARTIST.social.soundcloud.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg flex items-center gap-2">
                <PlayCircle size={22} />
                <span>{isPortuguese ? 'Ouvir no SoundCloud' : 'Listen on SoundCloud'}</span>
              </a>
              <Link to="/work-with-me" className="btn btn-outline btn-lg flex items-center gap-2">
                <Mail size={22} />
                <span>{isPortuguese ? 'Contrate / Press Kit' : 'Booking / Press Kit'}</span>
              </Link>
            </motion.div>
            {/* Micro-copy de navegação para Music / Events (versão encurtada como nota de rodapé) */}
            <motion.p
              variants={ITEM_VARIANTS}
              className="text-sm md:text-base text-white/60 max-w-2xl mx-auto"
            >
              {isPortuguese
                ? 'SoundCloud tem sets completos, remixes exclusivos e produções originais. Para agenda de eventos, vá para Events. Para bookings, acesse Work With Me.'
                : 'SoundCloud features full sets, exclusive remixes, and original productions. Check Events for festival schedules. Head to Work With Me for bookings.'}
            </motion.p>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>
      {/* BIO SECTION + TEXTO REVISADO (mais informal, atrativo e otimizado) */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
          >
            <motion.div variants={ITEM_VARIANTS} className="prose prose-invert prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6 text-white">Quem é DJ Zen Eyer?</h2>
              <p className="text-xl leading-relaxed mb-6">
                <strong>DJ Zen Eyer</strong> (Marcelo Eyer Fernandes) é o cara quando o assunto é Brazilian Zouk no mundo todo. Bicampeão mundial no maior campeonato internacional de DJs de Zouk—levando Melhor Remix e Melhor Performance DJ no Brazilian Zouk World Championships em 2022—e ainda o campeão atual, já que não rolou mais nada desse nível desde então. Com mais de 11 anos na cena, ele já agitou pistas em mais de 11 países, nos principais congressos e festivais de Zouk por aí.
              </p>
              <p className="text-lg leading-relaxed text-white/80 mb-6">
                Famoso pelo estilo lento, sensual e mega "cremoso", Zen foge de BPMs altos porque a conexão de verdade na dança só rola quando o corpo tem tempo pra derreter. Seu drop assinatura "Zen… Zen… Zen… Zen… Eyer… Eyer… Eyer… Eyer…" é hit em pistas globais—tipo uma marca registrada que todo mundo reconhece e curte.
              </p>
              <p className="text-lg leading-relaxed text-white/80 mb-6">
                Zen não é daqueles DJs de casamento ou evento corporativo. Ele é artista de palco puro, focado em noites autorais, festivais internacionais e congressos onde o público paga ingresso pra mergulhar numa experiência imersiva de Zouk. Cada set é uma jornada emocional, misturando grooves, silêncios e tensão pra levar a galera a um derretimento coletivo. Ah, e ele é membro da Mensa International, então além de talentoso, é daqueles caras inteligentes e descontraídos que você quer bater papo.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Na aba Music, você acha remixes oficiais, versões estendidas e produções feitas sob medida pra comunidade de dança (perfeito pra sets temáticos—seja pra se animar, curtir um momento íntimo ou até cozinhar no ritmo). Events lista os próximos festivais e congressos pelo mundo. Pra promoters atrás de um artista exclusivo de Zouk com vibe única e fã-base global, Work With Me tem tudo: booking, rider e press kit. Vamos conectar?
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* UPCOMING EVENTS PREVIEW (para integrar com Bandsintown API) */}
      <section className="py-16 bg-background border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
          >
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-3">
              {isPortuguese ? 'Próximos Shows' : 'Upcoming Shows'}
            </motion.h2>
            <motion.p variants={ITEM_VARIANTS} className="text-white/70 mb-6">
              {isPortuguese
                ? 'Uma amostra das próximas datas oficiais. A agenda completa, com todos os festivais e congressos confirmados, está disponível na página Events.'
                : 'A small preview of the next official dates. The full calendar with all confirmed festivals and congresses is available on the Events page.'}
            </motion.p>
            <motion.div variants={ITEM_VARIANTS} className="mb-8">
              <EventsList limit={3} showTitle={false} variant="compact" />
            </motion.div>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
              <Link to="/events" className="btn btn-primary btn-lg flex items-center gap-2">
                <Calendar size={20} />
                <span>{isPortuguese ? 'Ver agenda completa' : 'View full schedule'}</span>
              </Link>
              <a
                href={ARTIST.social.bandsintown?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg flex items-center gap-2"
              >
                <ExternalLink size={18} />
                <span>{isPortuguese ? 'Seguir no Bandsintown' : 'Follow on Bandsintown'}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* FEATURES GRID (Navegação) */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {FEATURES_DATA.map(feature => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={t(feature.titleKey as any)}
                description={t(feature.descKey as any)}
                variants={ITEM_VARIANTS}
              />
            ))}
          </motion.div>
        </div>
      </section>
      {/* FESTIVALS / SOCIAL PROOF */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
            className="text-center"
          >
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-2">
              {isPortuguese ? 'Tocou em Festivais Internacionais' : 'Performed at International Festivals'}
            </motion.h2>
            <motion.p variants={ITEM_VARIANTS} className="text-white/60 mb-8">
              {isPortuguese ? 'Reconhecido nos principais eventos de Zouk do mundo' : 'Recognized at major Zouk events worldwide'}
            </motion.p>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-3">
              {FESTIVALS_HIGHLIGHT.map(festival => (
                <FestivalBadge key={festival.name} name={festival.name} flag={festival.flag} />
              ))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary">
                <span>+{isPortuguese ? 'muitos outros' : 'many more'}</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* PRESS & BOOKING (Segmentação Estratégica) */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Press Kit Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-surface border-l-4 border-primary rounded-r-lg"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Download size={20} className="text-primary" />
                {isPortuguese ? 'Para Imprensa e Mídia' : 'For Press & Media'}
              </h3>
              <p className="text-white/70 mb-4">
                {isPortuguese
                  ? 'Press kit completo, fotos em alta resolução, releases e entrevistas disponíveis.'
                  : 'Complete press kit, high-resolution photos, releases, and interviews available.'}
              </p>
              <Link to="/work-with-me" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                {isPortuguese ? 'BAIXAR PRESS KIT 2025' : 'DOWNLOAD PRESS KIT 2025'} →
              </Link>
            </motion.div>
            {/* Booking Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-surface border-l-4 border-green-500 rounded-r-lg"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-green-500" />
                {isPortuguese ? 'Contratantes e Promoters' : 'Bookers & Promoters'}
              </h3>
              <p className="text-white/70 mb-4">
                {isPortuguese
                  ? 'Disponível para congressos, festivais, workshops e noites exclusivas.'
                  : 'Available for congresses, festivals, workshops, and exclusive events.'}
              </p>
              <Link to="/work-with-me" className="inline-flex items-center gap-2 text-green-500 hover:underline font-semibold">
                {isPortuguese ? 'FAZER COTAÇÃO' : 'REQUEST QUOTE'} →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* AUTHORITY LINKS */}
      <section className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-white/40 mb-4">{isPortuguese ? 'Perfis Verificados' : 'Verified Profiles'}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                MusicBrainz <ExternalLink size={12} />
              </a>
              <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Wikidata <ExternalLink size={12} />
              </a>
              <a href="https://www.discogs.com/artist/16872046" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Discogs <ExternalLink size={12} />
              </a>
              <a href={ARTIST.social.spotify.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Spotify <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* FINAL CTA - ZEN TRIBE */}
      <section className="py-24 bg-gradient-to-b from-surface to-background">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={CONTAINER_VARIANTS}
        >
          <motion.h2 variants={ITEM_VARIANTS} className="text-3xl md:text-5xl font-bold mb-4 font-display">
            {isPortuguese ? 'Junte-se à ' : 'Join the '}<span className="text-primary">Tribo Zen</span>
          </motion.h2>
          <motion.p variants={ITEM_VARIANTS} className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            {isPortuguese ? 'Aqui não tem pressa. Só derretimento prolongado.' : 'No rush here. Just prolonged melting.'}
          </motion.p>
          <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
            <Link to="/zentribe" className="btn btn-primary btn-lg">
              {isPortuguese ? 'Entrar na Tribo' : 'Join the Tribe'}
            </Link>
            <Link to="/music" className="btn btn-outline btn-lg">
              {isPortuguese ? 'Explorar Músicas' : 'Explore Music'}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};
export default HomePage;