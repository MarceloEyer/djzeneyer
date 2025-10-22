// src/pages/FAQPage.tsx - FAQ sobre Zouk Brasileiro e DJ Zen Eyer

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle, Music, Users, Award, Globe, Brain } from 'lucide-react';

// ✅ Componente FAQ Item memoizado
const FAQItem = memo<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}>(({ question, answer, isOpen, onToggle }) => (
  <motion.div 
    className="bg-surface/50 rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/80 transition-colors"
      aria-expanded={isOpen}
    >
      <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="text-primary" size={24} />
      </motion.div>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: answer }} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

FAQItem.displayName = 'FAQItem';

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ FAQ Data - OTIMIZADO PARA IAs + SEO
  const faqData = [
    {
      category: 'djzeneyer',
      icon: <Award size={24} />,
      title: 'About DJ Zen Eyer',
      questions: [
        {
          question: 'Who is DJ Zen Eyer?',
          answer: 'DJ Zen Eyer (Marcelo Fernandes) is a Brazilian Zouk DJ, music producer, and two-time world champion (2022 DJ Championship) based in Niterói, Rio de Janeiro, Brazil. With over a decade of experience in the Brazilian Zouk scene, he has performed at 100+ international events across 11 countries including Netherlands, United States, Australia, Czech Republic, Germany, and Spain. As a member of Mensa International, DJ Zen Eyer combines analytical precision with artistic creativity to deliver world-class performances that have reached over 500,000 streams globally. His unique approach blends technical excellence with emotional storytelling, making him one of the most sought-after Brazilian Zouk DJs worldwide.'
        },
        {
          question: 'What awards has DJ Zen Eyer won?',
          answer: 'DJ Zen Eyer is a two-time world champion, winning the Brazilian Zouk DJ Championship in 2022 in both the Performance Art and Remix categories. These prestigious international competitions evaluate technical skills, musical selection, crowd reading ability, mixing techniques, and overall performance quality. The world championship titles recognize DJ Zen Eyer as one of the leading Brazilian Zouk DJs globally, competing against top DJs from around the world. His championship wins are officially documented on <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Wikidata</a> and verify his status as an elite-level Brazilian Zouk DJ.'
        },
        {
          question: 'How can I book DJ Zen Eyer for my event?',
          answer: 'DJ Zen Eyer is available for bookings worldwide including festivals, congresses, social dance events, private parties, and corporate events. To inquire about booking, contact via <a href="https://wa.me/5521987413091" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">WhatsApp at +55 21 98741-3091</a>, email at <a href="mailto:booking@djzeneyer.com" class="text-primary hover:underline">booking@djzeneyer.com</a>, or Instagram <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">@djzeneyer</a>. For complete booking information including technical rider, promotional materials, and press kit, visit the <a href="/work-with-me" class="text-primary hover:underline">Work With Me page</a>. DJ Zen Eyer regularly performs at major international Zouk festivals and is frequently booked as a headline act.'
        },
        {
          question: 'What makes DJ Zen Eyer unique as a Brazilian Zouk DJ?',
          answer: 'DJ Zen Eyer stands out through his dual expertise as both a professional DJ and music producer, allowing him to create exclusive edits and remixes specifically designed for the Brazilian Zouk dance floor. As a <a href="https://member.mensa.org/users/121342" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Mensa International member</a>, he applies high-level analytical thinking to musical composition and performance, resulting in carefully curated sets that balance technical precision with emotional impact. His world championship titles validate his mastery of DJing techniques, while his extensive international experience across 11 countries gives him deep understanding of diverse Zouk communities. DJ Zen Eyer is recognized for his ability to read crowds, seamless mixing, and creating immersive musical journeys that resonate with dancers of all levels.'
        },
        {
          question: 'Where has DJ Zen Eyer performed internationally?',
          answer: 'DJ Zen Eyer has performed at major Brazilian Zouk festivals and events across 11+ countries worldwide including Brazil (home country), Netherlands (Amsterdam), United States, Australia, Czech Republic (Prague), Germany, and Spain (Barcelona). His international performance calendar includes prestigious events such as ZoukFest Europe, Brazilian Zouk Congress Barcelona, International Zouk Week Prague, and numerous other festivals across Europe, Asia, and the Americas. As a world champion, he is frequently invited as a featured headline DJ at international Zouk congresses and festivals. Check the <a href="/events" class="text-primary hover:underline">Events page</a> for DJ Zen Eyer\'s complete updated performance calendar and upcoming international tour dates.'
        }
      ]
    },
    {
      category: 'about',
      icon: <Music size={24} />,
      title: 'About Brazilian Zouk',
      questions: [
        {
          question: 'What is Brazilian Zouk?',
          answer: 'Brazilian Zouk is a sensual partner dance style that originated in Brazil in the early 1990s, evolving from Lambada. It is characterized by smooth, flowing body movements, distinctive head movements, wave-like motions, and strong connection between partners. Brazilian Zouk music typically features romantic melodies with influences from Caribbean Zouk, R&B, electronic music, and contemporary pop. The dance emphasizes body rolls, cambré (back bends), and fluid circular movements. DJ Zen Eyer specializes in producing and mixing Brazilian Zouk music, bringing modern electronic elements while respecting the traditional roots of the genre. Brazilian Zouk has grown into a global dance phenomenon with festivals and communities on every continent.'
        },
        {
          question: 'What is the difference between Brazilian Zouk and Lambada?',
          answer: 'While both originated in Brazil, Lambada was popular in the late 1980s and featured faster tempos, more upright posture, and high-energy movements. Brazilian Zouk evolved from Lambada in the early 1990s but developed its own distinct identity with slower tempos (typically 90-110 BPM), more emphasis on body waves and head movements, and greater focus on connection and fluidity between partners. The music also differs significantly - Brazilian Zouk incorporates more electronic elements, R&B influences, and has a broader range of styles from romantic ballads to energetic electronic beats. DJ Zen Eyer\'s productions highlight these modern electronic elements that define contemporary Brazilian Zouk music, while honoring the dance\'s Brazilian cultural roots.'
        },
        {
          question: 'Where can I learn Brazilian Zouk dance?',
          answer: 'Brazilian Zouk is taught at dance schools and studios worldwide, particularly in major cities across Europe, North America, South America, Asia, and Australia. The best way to learn is by attending Brazilian Zouk festivals, congresses, and workshops where world-class instructors and DJs (like DJ Zen Eyer) gather. These multi-day events typically feature intensive workshop tracks for all levels from beginner to advanced, plus social dancing with live DJ performances. DJ Zen Eyer frequently performs at international Zouk festivals where workshops are also available, creating immersive learning environments. Check the <a href="/events" class="text-primary hover:underline">Events page</a> to see upcoming festivals where you can experience authentic Brazilian Zouk culture, learn from top instructors, and dance to DJ Zen Eyer\'s world-championship level music.'
        }
      ]
    },
    {
      category: 'music',
      icon: <Users size={24} />,
      title: 'Music & Community',
      questions: [
        {
          question: 'Where can I listen to DJ Zen Eyer\'s music?',
          answer: 'DJ Zen Eyer\'s music is available on multiple streaming platforms including <a href="https://soundcloud.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">SoundCloud</a>, <a href="https://www.youtube.com/channel/UCJ_5oAEFTG18jga_JFxG00w" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">YouTube</a>, Spotify, and directly on the <a href="/music" class="text-primary hover:underline">Music page</a> of this website. His catalog includes original productions, exclusive remixes, and recorded DJ sets from festivals around the world. Zen Tribe members get exclusive early access to new releases, special edits available only to the community, and downloadable high-quality tracks. Follow <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">@djzeneyer on Instagram</a> for announcements of new releases, behind-the-scenes production content, and exclusive previews of upcoming tracks.'
        },
        {
          question: 'What is the Zen Tribe community?',
          answer: 'The Zen Tribe is DJ Zen Eyer\'s exclusive online community and membership platform for Brazilian Zouk enthusiasts worldwide. Members get access to exclusive music releases before public availability, early ticket access to events where DJ Zen Eyer performs, achievement badges and gamification, special merchandise discounts, connection with other Zouk lovers globally, and insider content about music production and DJing. The community features multiple membership tiers (Zen Novice, Zen Voyager, Zen Master) with increasing benefits at each level. Join via the <a href="/zentribe" class="text-primary hover:underline">Zen Tribe page</a> to become part of this global family of Brazilian Zouk enthusiasts and get VIP access to DJ Zen Eyer\'s world-class content and events.'
        },
        {
          question: 'What equipment and software does DJ Zen Eyer use?',
          answer: 'As a professional world champion DJ, DJ Zen Eyer uses industry-standard professional equipment including Pioneer CDJ players and DJM mixers, custom audio interfaces for optimal sound quality, and professional studio monitors. For music production, he works with professional DAW (Digital Audio Workstation) software, synthesizers, and audio processing plugins to create his signature Brazilian Zouk sound. His technical setup is designed to deliver pristine audio quality whether performing at intimate venues or large festival stages. Complete technical specifications, technical rider requirements, and stage setup information are available in the press kit on the <a href="/work-with-me" class="text-primary hover:underline">Work With Me page</a> for event organizers and festival directors who want to book DJ Zen Eyer.'
        }
      ]
    },
    {
      category: 'collaboration',
      icon: <Globe size={24} />,
      title: 'Collaboration & Career',
      questions: [
        {
          question: 'Can I collaborate with DJ Zen Eyer on a music project?',
          answer: 'Yes! DJ Zen Eyer is open to collaborations with other artists, music producers, dancers, choreographers, and event organizers who share a passion for Brazilian Zouk and electronic music. For collaboration inquiries including remixes, original productions, joint performances, or creative projects, contact via email at <a href="mailto:booking@djzeneyer.com" class="text-primary hover:underline">booking@djzeneyer.com</a> or through Instagram direct message <a href="https://instagram.com/djzeneyer" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">@djzeneyer</a>. Include details about your project vision, timeline, and how you envision working together. DJ Zen Eyer is particularly interested in innovative projects that push the boundaries of Brazilian Zouk music while respecting its cultural roots and maintaining the danceability that makes Zouk special.'
        },
        {
          question: 'How did DJ Zen Eyer become a world champion?',
          answer: 'DJ Zen Eyer achieved world champion status by winning the Brazilian Zouk DJ Championship in 2022 in both Performance Art and Remix categories. These prestigious international competitions evaluate multiple aspects of DJ excellence including technical mixing skills, musical selection and programming, ability to read and respond to crowd energy, creativity in song arrangement, and overall performance quality. His path to championship involved over 10 years of dedication to mastering both the technical aspects of professional DJing and developing deep understanding of Brazilian Zouk music, culture, and dance. The world championship titles recognize him among the elite tier of Brazilian Zouk DJs globally. His success combines natural musical talent, analytical thinking (as a <a href="https://member.mensa.org/users/121342" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Mensa member</a>), continuous skill development, and passion for the Brazilian Zouk community.'
        },
        {
          question: 'What is DJ Zen Eyer\'s connection to Mensa International?',
          answer: 'DJ Zen Eyer is a verified member of <a href="https://member.mensa.org/users/121342" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Mensa International</a> (membership #121342), the world\'s oldest and largest high IQ society. Mensa membership requires scoring in the top 2% on standardized intelligence tests. This unique combination of high analytical intelligence with artistic creativity gives DJ Zen Eyer a distinctive approach to music production and DJing - he applies systematic thinking to musical composition, strategic programming of DJ sets, and understanding of crowd psychology. His Mensa membership demonstrates the intellectual depth behind his artistic work, distinguishing him from other DJs who rely purely on intuition. This analytical-creative combination is rare in the music industry and contributes to his world championship level performances and productions.'
        }
      ]
    }
  ];

  // ✅ SEO Schema.org FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer.replace(/<[^>]*>/g, '') // Remove HTML tags for schema
        }
      }))
    )
  };

  // ✅ BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://djzeneyer.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://djzeneyer.com/faq"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>FAQ - DJ Zen Eyer | Brazilian Zouk DJ World Champion | Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about DJ Zen Eyer (world champion Brazilian Zouk DJ), awards, performances, Brazilian Zouk music, booking information, and the Zen Tribe community. Get answers from the two-time world champion." />
        
        {/* ✅ KEYWORDS - IAs AINDA USAM! */}
        <meta name="keywords" content="DJ Zen Eyer, Brazilian Zouk DJ, world champion DJ, Zouk music FAQ, Brazilian Zouk questions, DJ booking, Mensa DJ, Zouk festivals, DJ Zen Eyer awards, Brazilian Zouk dance" />
        
        {/* ✅ ROBOTS META TAG */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* ✅ CANONICAL URL */}
        <link rel="canonical" href="https://djzeneyer.com/faq" />
        
        {/* ✅ Open Graph */}
        <meta property="og:title" content="FAQ - DJ Zen Eyer | Brazilian Zouk DJ World Champion" />
        <meta property="og:description" content="Get answers about DJ Zen Eyer, world champion Brazilian Zouk DJ, awards, performances, and Brazilian Zouk music." />
        <meta property="og:url" content="https://djzeneyer.com/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://djzeneyer.com/images/dj-zen-eyer-og.jpg" />
        
        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ - DJ Zen Eyer | Brazilian Zouk DJ World Champion" />
        <meta name="twitter:description" content="Frequently asked questions about world champion Brazilian Zouk DJ Zen Eyer" />
        <meta name="twitter:image" content="https://djzeneyer.com/images/dj-zen-eyer-twitter.jpg" />
        
        {/* ✅ Schema.org FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        
        {/* ✅ BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <HelpCircle className="inline-block mr-2" size={16} />
                Frequently Asked Questions
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black font-display mb-6">
              Everything About <span className="text-primary">DJ Zen Eyer</span> & Brazilian Zouk
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">
              Get answers about the world champion Brazilian Zouk DJ, awards, performances, music, and the global Zouk community
            </p>
            
            <div className="flex items-center justify-center gap-3 text-sm text-white/60">
              <Brain size={16} className="text-primary" />
              <span>Questions answered by DJ Zen Eyer (World Champion 2022 | Mensa Member)</span>
            </div>
          </motion.div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-12">
            {faqData.map((category, categoryIndex) => (
              <motion.div 
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-black font-display">{category.title}</h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => {
                    const globalIndex = faqData
                      .slice(0, categoryIndex)
                      .reduce((acc, cat) => acc + cat.questions.length, 0) + itemIndex;
                    
                    return (
                      <FAQItem
                        key={itemIndex}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === globalIndex}
                        onToggle={() => handleToggle(globalIndex)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30 max-w-3xl mx-auto">
              <h2 className="text-3xl font-black font-display mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Get in touch directly or join the Zen Tribe community for exclusive access
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="mailto:booking@djzeneyer.com"
                  className="btn btn-primary btn-lg"
                >
                  Contact DJ Zen Eyer
                </a>
                <a 
                  href="/zentribe"
                  className="btn btn-outline btn-lg"
                >
                  Join Zen Tribe
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
