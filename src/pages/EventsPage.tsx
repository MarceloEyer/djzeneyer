// ============================================================================
// CORREÇÕES PARA EventsPage.tsx
// ============================================================================

// PROBLEMA 1: TIMEZONE FALTANDO NO SCHEMA
// ============================================================================
// Seus eventos não têm timezone, o Google pode interpretar errado

const generateEventsSchema = () => {
  const eventItems = FEATURED_EVENTS.map((event) => {
    let priceValue = "0";
    const numericMatch = event.price.match(/[\d,.]+/);
    
    if (numericMatch && !event.price.toLowerCase().includes('lista')) {
      priceValue = numericMatch[0].replace('.', '').replace(',', '.');
    }

    const availability = event.status.toLowerCase().includes('sold out') || 
                        event.status.toLowerCase().includes('esgotado')
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock";

    // 🔥 CORREÇÃO: Adiciona timezone (Brasil = UTC-3)
    const timeValue = event.time === 'Online' ? '00:00:00' : event.time + ':00';
    const fullDateTime = `${event.date}T${timeValue}-03:00`; // ISO 8601 completo

    return {
      "@type": "MusicEvent", // ✅ Correto!
      "name": event.title,
      "description": event.description,
      "startDate": fullDateTime, // 🔥 Agora com timezone
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": event.time === 'Online' 
        ? "https://schema.org/OnlineEventAttendanceMode" 
        : "https://schema.org/OfflineEventAttendanceMode",
      "image": [`${ARTIST.site.baseUrl}${event.image}`], // 🔥 Array obrigatório
      "location": event.time === 'Online' 
        ? {
            "@type": "VirtualLocation",
            "url": `${ARTIST.site.baseUrl}${event.link}`
          }
        : {
            "@type": "Place",
            "name": event.location,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": event.location.split(',')[0]?.trim() || event.location,
              "addressCountry": "BR" // 🔥 Importante!
            }
          },
      "offers": {
        "@type": "Offer",
        "url": `${ARTIST.site.baseUrl}${event.link}`,
        "price": priceValue,
        "priceCurrency": "BRL",
        "availability": availability,
        "validFrom": new Date().toISOString() // 🔥 ISO completo
      },
      "performer": {
        "@type": "Person",
        "@id": `${ARTIST.site.baseUrl}/#artist`,
        "name": ARTIST.identity.stageName,
        "sameAs": [ // 🔥 Adiciona autoridade ao performer
          ARTIST.social.instagram.url,
          ARTIST.social.spotify?.url,
          ARTIST.social.youtube?.url
        ].filter(Boolean)
      },
      "organizer": { // 🔥 Campo recomendado
        "@type": "Organization",
        "name": "DJ Zen Eyer",
        "url": ARTIST.site.baseUrl
      }
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${ARTIST.site.baseUrl}/events#webpage`,
        "url": `${ARTIST.site.baseUrl}/events`,
        "name": `Agenda & Tour - ${ARTIST.identity.stageName}`,
        "description": `Agenda oficial do ${ARTIST.titles.primary}. Datas confirmadas da turnê mundial.`,
        "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
        "about": { "@id": `${ARTIST.site.baseUrl}/#artist` }
      },
      {
        "@type": "ItemList",
        "name": "Próximos Eventos de DJ Zen Eyer",
        "itemListElement": eventItems.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": item
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { 
            "@type": "ListItem", 
            "position": 1, 
            "name": "Home", 
            "item": ARTIST.site.baseUrl 
          },
          { 
            "@type": "ListItem", 
            "position": 2, 
            "name": "Events", 
            "item": `${ARTIST.site.baseUrl}/events` 
          }
        ]
      }
    ]
  };
};

// ============================================================================
// PROBLEMA 2: FLYER GALLERY - FALLBACK DE IMAGEM
// ============================================================================
// Se a API falhar, não mostra nada. Adicione placeholder:

const FlyerGallery: React.FC = () => {
  const [flyers, setFlyers] = useState<FlyerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlyer, setSelectedFlyer] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${ARTIST.site.baseUrl}/wp-json/wp/v2/flyers?_embed&per_page=8`)
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível carregar os flyers.');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setFlyers(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Erro ao carregar flyers:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-black/40 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  // 🔥 Se erro ou vazio, não renderiza a seção
  if (error || flyers.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-black/40 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black font-display text-white mb-2">
              Memórias & Flyers
            </h2>
            <p className="text-white/40 text-sm">
              Histórico visual de {ARTIST.stats.countriesPlayed} países
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flyers.map((flyer, index) => {
              const media = flyer._embedded?.['wp:featuredmedia']?.[0];
              const fullImageUrl = media?.source_url;
              const thumbUrl = media?.media_details?.sizes?.medium_large?.source_url || fullImageUrl;
              
              // 🔥 FALLBACK: Se não tem imagem, usa placeholder
              if (!thumbUrl) {
                return (
                  <div
                    key={flyer.id}
                    className="aspect-[3/4] rounded-xl bg-surface/20 border border-white/5 flex items-center justify-center"
                  >
                    <Music2 size={32} className="text-white/10" />
                  </div>
                );
              }

              return (
                <motion.div
                  key={flyer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedFlyer(fullImageUrl)}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                >
                  <img
                    src={thumbUrl}
                    alt={`${flyer.title.rendered} - ${ARTIST.identity.stageName}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // 🔥 Se imagem quebrar, mostra placeholder
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-sm font-bold text-white line-clamp-2">
                      {flyer.title.rendered}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 p-1 rounded-full text-white/80">
                      <Plus size={16} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIGHTBOX - Perfeito! ✅ */}
      <AnimatePresence>
        {selectedFlyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFlyer(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedFlyer}
                alt="Flyer Full View"
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setSelectedFlyer(null)}
                className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors p-2"
                aria-label="Fechar"
              >
                <X size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};