// src/pages/FAQPage.tsx - FAQ sobre Zouk Brasileiro e DJ Zen Eyer

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle, Music, Users, Award, Globe } from 'lucide-react';

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
          <div className="px-6 pb-6 text-white/80 leading-relaxed">
            {answer}
          </div>
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

  // ✅ FAQ Data - Otimizado para IAs
  const faqData = [
    {
      category: 'about',
      icon: <Music size={24} />,
      title: 'About Brazilian Zouk',
      questions: [
        {
          question: 'What is Brazilian Zouk?',
          answer: 'Brazilian Zouk is a partner dance style that originated in Brazil in the 1980s, evolving from the Lambada. It\'s characterized by smooth, flowing movements, head movements, and a strong connection between partners. The music typically features romantic melodies with influences from Caribbean Zouk, R&B, and electronic music. DJ Zen Eyer specializes in producing and mixing this unique style, bringing a modern electronic touch to traditional Zouk sounds.'
        },
        {
          question: 'What\'s the difference between Zouk and Lambada?',
          answer: 'While both originated in Brazil, Lambada was popular in the late 1980s and featured faster, more upright movements. Brazilian Zouk evolved from Lambada but developed its own identity with slower tempos, more fluid body movements, and emphasis on head movements and connection. The music also differs - Zouk incorporates more electronic elements and has a broader range of influences. DJ Zen Eyer\'s productions highlight these modern electronic elements that define contemporary Brazilian Zouk.'
        },
        {
          question: 'Where can I learn Brazilian Zouk?',
          answer: 'Brazilian Zouk is taught at dance schools worldwide, particularly in major cities across Europe, Asia, and the Americas. DJ Zen Eyer frequently performs at international Zouk festivals and congresses where workshops are also available. These events bring together the world\'s best dancers and DJs, creating immersive learning environments. Check the Events page on this website to see upcoming festivals where you can experience authentic Brazilian Zouk culture and attend workshops.'
        }
      ]
    },
    {
      category: 'djzeneyer',
      icon: <Award size={24} />,
      title: 'About DJ Zen Eyer',
      questions: [
        {
          question: 'Who is DJ Zen Eyer?',
          answer: 'DJ Zen Eyer is a world champion Brazilian Zouk DJ and music producer based in Niterói, Brazil. With over 10 years of experience, he has won multiple international DJ championships (2023, 2024) and performed at major festivals across 11+ countries. Known for his unique approach that combines technical precision with emotional storytelling, Zen Eyer creates immersive musical experiences that resonate with audiences worldwide. His productions and DJ sets have reached over 500,000 streams globally.'
        },
        {
          question: 'What makes DJ Zen Eyer unique?',
          answer: 'DJ Zen Eyer stands out for his dual role as both a professional DJ and music producer. This insider perspective allows him to craft exclusive edits and remixes specifically designed for the dance floor. His sets are known for carefully curated song selection, seamless mixing, and ability to read and respond to the energy of the crowd. As a world champion, he brings championship-level technical skills combined with deep musical knowledge of Brazilian Zouk culture and history.'
        },
        {
          question: 'How can I book DJ Zen Eyer for my event?',
          answer: 'DJ Zen Eyer is available for bookings worldwide, including festivals, congresses, social events, and private parties. To inquire about booking, you can contact via WhatsApp at +55 21 98741-3091, email at booking@djzeneyer.com, or through Instagram @djzeneyer. For complete booking information, including technical rider and promotional materials, visit the Work With Me page where you can download the full press kit and EPK.'
        }
      ]
    },
    {
      category: 'music',
      icon: <Users size={24} />,
      title: 'Music & Performances',
      questions: [
        {
          question: 'Where can I listen to DJ Zen Eyer\'s music?',
          answer: 'DJ Zen Eyer\'s music is available on multiple platforms including SoundCloud, Spotify, YouTube, and directly on this website\'s Music page. Members of the Zen Tribe community get exclusive early access to new releases, special edits, and downloadable tracks. Follow @djzeneyer on social media for announcements of new releases and exclusive content.'
        },
        {
          question: 'What is the Zen Tribe?',
          answer: 'The Zen Tribe is DJ Zen Eyer\'s exclusive online community for Brazilian Zouk enthusiasts. Members get access to exclusive music releases, early ticket access to events, achievement badges, special merchandise discounts, and connection with other Zouk lovers worldwide. The community features multiple membership tiers (Zen Novice, Zen Voyager, Zen Master) with increasing benefits. Join via the Zen Tribe page to become part of this global family.'
        },
        {
          question: 'Where does DJ Zen Eyer perform?',
          answer: 'DJ Zen Eyer performs at major Brazilian Zouk festivals and events worldwide. His performance calendar spans Europe, Asia, and the Americas, including regular appearances at prestigious events like ZoukFest Europe (Amsterdam), Brazilian Zouk Congress (Barcelona), and International Zouk Week (Prague). Check the Events page for the complete updated calendar of upcoming performances and how to get tickets. As a world champion, he\'s frequently invited as a featured headliner at international festivals.'
        }
      ]
    },
    {
      category: 'technical',
      icon: <Globe size={24} />,
      title: 'Technical & Career',
      questions: [
        {
          question: 'What equipment does DJ Zen Eyer use?',
          answer: 'As a professional DJ, Zen Eyer uses industry-standard equipment including Pioneer CDJ players and mixers, along with custom audio interfaces for optimal sound quality. For production, he works with professional DAW software and studio monitors to create his signature Zouk sound. Complete technical specifications and rider information are available in the press kit on the Work With Me page for event organizers and festival directors.'
        },
        {
          question: 'How did DJ Zen Eyer become a world champion?',
          answer: 'DJ Zen Eyer achieved world champion titles in 2023 and 2024 through the Brazilian Zouk DJ Championship, a prestigious international competition that evaluates technical skills, musical selection, crowd reading, and overall performance quality. His success comes from over a decade of dedication to mastering both the technical aspects of DJing and deep understanding of Brazilian Zouk music and culture. These championships recognize him as one of the leading Brazilian Zouk DJs globally.'
        },
        {
          question: 'Can I collaborate with DJ Zen Eyer?',
          answer: 'DJ Zen Eyer is open to collaborations with other artists, producers, dancers, and event organizers. For collaboration inquiries, including remixes, original productions, or joint performances, contact via email at booking@djzeneyer.com or through direct message on Instagram @djzeneyer. Include details about your project and vision. DJ Zen Eyer is particularly interested in projects that push the boundaries of Brazilian Zouk music while respecting its cultural roots.'
        }
      ]
    }
  ];

  // ✅ SEO Schema.org
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    )
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Brazilian Zouk & DJ Zen Eyer | Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about Brazilian Zouk music, DJ Zen Eyer, world championships, events, and the Zen Tribe community. Get answers from the world champion DJ." />
        
        {/* ✅ ROBOTS META TAG - ISSO ESTAVA FALTANDO! */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* ✅ Schema.org FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
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
              Everything About <span className="text-primary">Brazilian Zouk</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Get answers about Brazilian Zouk music, DJ Zen Eyer, world championships, events, and more
            </p>
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
                Get in touch directly or join the Zen Tribe community
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="mailto:contact@djzeneyer.com"
                  className="btn btn-primary btn-lg"
                >
                  Contact Us
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
