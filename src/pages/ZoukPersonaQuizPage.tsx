import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, ChevronRight, Music, Heart, Zap, Sparkles, Coffee } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

// ============================================================================
// DATA & LOGIC
// ============================================================================

type PersonaType = 'lambadeiro' | 'cremoso' | 'tecnico' | 'fritador' | 'rolezeiro';

interface PersonaResult {
  id: PersonaType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  shareText: string;
}

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    points: Partial<Record<PersonaType, number>>;
  }[];
}

const PERSONAS: Record<PersonaType, PersonaResult> = {
  lambadeiro: {
    id: 'lambadeiro',
    title: 'The Lambadeiro 🌪️',
    subtitle: 'Speed, Whips & Hair Flips',
    description: "You don't just dance, you spin. The faster the beat, the happier you are. Your neck movements are legendary, and you treat every song like it's 180 BPM. You honor the roots of Zouk.",
    color: 'from-yellow-500 to-orange-600',
    icon: <Zap size={40} />,
    shareText: "I'm the Lambadeiro! 🌪️ Fast beats and hair flips. Which Zouk persona are you?",
  },
  cremoso: {
    id: 'cremoso',
    title: 'The Creamy One 🍦',
    subtitle: 'Smooth, Slow & Connected',
    description: "You are the definition of 'Gostosinho'. You prefer slow jams, R&B, and close embrace. For you, Zouk is about connection and flow. If there's space between you and your partner, you're doing it wrong.",
    color: 'from-pink-500 to-purple-600',
    icon: <Heart size={40} />,
    shareText: "I'm The Creamy One! 🍦 Smooth and connected. Which Zouk persona are you?",
  },
  tecnico: {
    id: 'tecnico',
    title: 'The Technician 📐',
    subtitle: 'Precision, Angles & Drills',
    description: "You know the difference between a cambre and a torsion. You probably judge people's frame silently. Your dance is clean, precise, and visually perfect, likely because you've taken 500 privates.",
    color: 'from-blue-500 to-cyan-600',
    icon: <Sparkles size={40} />,
    shareText: "I'm The Technician! 📐 Perfect frame and precision. Which Zouk persona are you?",
  },
  fritador: {
    id: 'fritador',
    title: 'The Headbanger 🤘',
    subtitle: 'Beats, Trance & Energy',
    description: "Give you a dark room and a heavy beat, and you're in heaven. You love Neozouk, complex rhythms, and energetic movements. You're probably sweating by the second song.",
    color: 'from-red-600 to-purple-900',
    icon: <Music size={40} />,
    shareText: "I'm The Headbanger! 🤘 Dark rooms and heavy beats. Which Zouk persona are you?",
  },
  rolezeiro: {
    id: 'rolezeiro',
    title: 'The Socializer 🥂',
    subtitle: 'Talks more than dances',
    description: "You're at the party for the vibes. You dance 3 songs and spend 2 hours talking by the bar. You know everyone's name and all the gossip. The party doesn't start until you arrive.",
    color: 'from-green-500 to-teal-600',
    icon: <Coffee size={40} />,
    shareText: "I'm The Socializer! 🥂 Here for the gossip and vibes. Which Zouk persona are you?",
  },
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "The DJ drops a super slow R&B remix. What do you do?",
    options: [
      { text: "Close my eyes and embrace the 'cremosidade'.", points: { cremoso: 3, rolezeiro: 1 } },
      { text: "Use it to practice my slow-motion head movements.", points: { tecnico: 2, fritador: 1 } },
      { text: "Go to the bar to get a drink.", points: { rolezeiro: 3, lambadeiro: 1 } },
      { text: "Try to dance double-time anyway.", points: { lambadeiro: 3 } },
    ]
  },
  {
    id: 2,
    text: "What is your favorite accessory for a dance party?",
    options: [
      { text: "A towel and extra t-shirts.", points: { fritador: 3, lambadeiro: 2 } },
      { text: "Comfortable shoes for spinning.", points: { lambadeiro: 3, tecnico: 1 } },
      { text: "A breath mint and nice perfume.", points: { cremoso: 3, rolezeiro: 1 } },
      { text: "My phone to record demos.", points: { tecnico: 2, rolezeiro: 2 } },
    ]
  },
  {
    id: 3,
    text: "Someone asks you for a dance. What are you thinking?",
    options: [
      { text: "Do they know how to lead/follow a tilter?", points: { tecnico: 3 } },
      { text: "I hope they like fast spins!", points: { lambadeiro: 3 } },
      { text: "Let's see if we have connection.", points: { cremoso: 3 } },
      { text: "Sure, but I need to finish this conversation first.", points: { rolezeiro: 3 } },
    ]
  },
  {
    id: 4,
    text: "What is your Zouk pet peeve?",
    options: [
      { text: "People who don't protect the head.", points: { tecnico: 3, cremoso: 1 } },
      { text: "Music that is too slow.", points: { lambadeiro: 3 } },
      { text: "Music that has no beat/energy.", points: { fritador: 3 } },
      { text: "When the party ends too early.", points: { rolezeiro: 2, lambadeiro: 1 } },
    ]
  },
  {
    id: 5,
    text: "Ideally, how does a dance end?",
    options: [
      { text: "With a perfect dip and clean exit.", points: { tecnico: 3 } },
      { text: "With a long, lingering hug.", points: { cremoso: 3 } },
      { text: "Sweating and out of breath.", points: { lambadeiro: 2, fritador: 3 } },
      { text: "With a high-five and a 'let's get water'.", points: { rolezeiro: 3 } },
    ]
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

const ZoukPersonaQuizPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const quizUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('quiz', currentLang)}`;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<PersonaType, number>>({
    lambadeiro: 0,
    cremoso: 0,
    tecnico: 0,
    fritador: 0,
    rolezeiro: 0,
  });
  const [result, setResult] = useState<PersonaResult | null>(null);

  const handleAnswer = (points: Partial<Record<PersonaType, number>>) => {
    const newScores = { ...scores };
    (Object.keys(points) as PersonaType[]).forEach(key => {
      newScores[key] = (newScores[key] || 0) + (points[key] || 0);
    });
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: Record<PersonaType, number>) => {
    let maxScore = -1;
    let winner: PersonaType = 'cremoso'; // default

    (Object.keys(finalScores) as PersonaType[]).forEach(key => {
      if (finalScores[key] > maxScore) {
        maxScore = finalScores[key];
        winner = key;
      }
    });

    setResult(PERSONAS[winner]);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ lambadeiro: 0, cremoso: 0, tecnico: 0, fritador: 0, rolezeiro: 0 });
    setResult(null);
  };

  const shareResult = async () => {
    if (!result) return;
    const shareText = t(`quiz.personas.${result.id}.shareText`);
    const text = `${shareText} ${t('quiz.ui.take_quiz_at')} ${quizUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('quiz.ui.meta_title', { stageName: ARTIST.identity.stageName }),
          text: text,
          url: quizUrl
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(t('quiz.ui.copied'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('quiz.ui.meta_title', { stageName: ARTIST.identity.stageName })}</title>
        <meta name="description" content={t('quiz.ui.meta_desc')} />
      </Helmet>

      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black z-0" />
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl">

          <AnimatePresence mode="wait">
            {!result ? (
              // QUESTION VIEW
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10"
              >
                <div className="flex justify-between items-center mb-6 text-sm text-gray-400 font-mono">
                  <span>{t('quiz.ui.question_count', { current: currentQuestion + 1, total: QUESTIONS.length })}</span>
                  <span>{t('quiz.ui.complete', { percent: Math.round(((currentQuestion) / QUESTIONS.length) * 100) })}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 h-2 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    className="bg-primary h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion) / QUESTIONS.length) * 100}%` }}
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                  {t(`quiz.questions.q${QUESTIONS[currentQuestion].id}.text`)}
                </h2>

                <div className="space-y-4">
                  {QUESTIONS[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.points)}
                      className="w-full p-4 text-left bg-gray-700/50 hover:bg-gray-600 rounded-xl border border-white/5 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-lg">{t(`quiz.questions.q${QUESTIONS[currentQuestion].id}.options.o${index + 1}`)}</span>
                      <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // RESULT VIEW
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br ${result.color} p-1 rounded-2xl shadow-2xl`}
              >
                <div className="bg-gray-900 rounded-xl p-8 md:p-12 text-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr ${result.color} flex items-center justify-center text-white`}
                  >
                    {result.icon}
                  </motion.div>

                  <h3 className="text-white/60 uppercase tracking-widest text-sm font-bold mb-2">{t('quiz.ui.you_are')}</h3>
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {t(`quiz.personas.${result.id}.title`)}
                  </h1>
                  <p className="text-xl text-primary font-medium mb-6">{t(`quiz.personas.${result.id}.subtitle`)}</p>

                  <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg mx-auto border-t border-b border-white/10 py-6">
                    {t(`quiz.personas.${result.id}.description`)}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={shareResult}
                      className="btn bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all"
                    >
                      <Share2 size={20} />
                      {t('quiz.ui.share_result')}
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="btn border border-white/30 hover:bg-white/10 text-white flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all"
                    >
                      <RefreshCw size={20} />
                      {t('quiz.ui.take_again')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default ZoukPersonaQuizPage;
