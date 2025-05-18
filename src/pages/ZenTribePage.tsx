import React, { lazy, Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Users, TrendingUp, Shield, Gift, Clock, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

// Componente memoizado para cards de benefícios
const BenefitCard = memo(({ icon, title, description, color }) => (
  <motion.div 
    className="card p-6 glow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
    }}
  >
    <div className={`w-12 h-12 rounded-full bg-${color}/20 flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">
      {description}
    </p>
  </motion.div>
));

// Componente memoizado para cards de membership
const MembershipCard = memo(({ tier, user }) => (
  <motion.div 
    className={`card overflow-hidden relative transition-all duration-300 hover:shadow-lg ${
      tier.popular ? 'border-2 border-secondary' : ''
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: tier.popular ? 0 : 0.1 }}
  >
    {tier.popular && (
      <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-sm font-medium">
        Most Popular
      </div>
    )}
    <div className={`p-6 bg-${tier.color}/10`}>
      <div className={`w-12 h-12 rounded-full bg-${tier.color}/20 flex items-center justify-center mb-4 text-${tier.color}`}>
        {tier.icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 font-display">{tier.name}</h3>
      <div className="mb-6">
        <span className="text-3xl font-bold">{tier.price}</span>
      </div>
    </div>
    <div className="p-6">
      <ul className="space-y-3 mb-6">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <div className={`text-${tier.color} mr-2 mt-1`} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-white/80">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        className={`w-full btn ${tier.popular ? 'btn-secondary' : 'btn-outline'} transition-all duration-300 hover:scale-[1.02]`}
        aria-label={`Join ${tier.name} membership`}
      >
        {user?.isLoggedIn ? 'Upgrade Now' : 'Join Now'}
      </button>
    </div>
  </motion.div>
));

const ZenTribePage = () => {
  const { user } = useUser();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // Tribe membership tiers
  const membershipTiers = [
    {
      name: 'Zen Novice',
      price: 'Free',
      features: [
        'Access to public music releases',
        'Create and share playlists',
        'Join community discussions',
        'Basic profile and badges',
      ],
      color: 'primary',
      icon: <Users size={24} aria-hidden="true" />,
      popular: false,
    },
    {
      name: 'Zen Voyager',
      price: '$9.99/month',
      features: [
        'All Zen Novice features',
        'Exclusive weekly music drops',
        'Early access to event tickets',
        'Advanced achievement system',
        'Discounts on merchandise',
      ],
      color: 'secondary',
      icon: <Star size={24} aria-hidden="true" />,
      popular: true,
    },
    {
      name: 'Zen Master',
      price: '$19.99/month',
      features: [
        'All Zen Voyager features',
        'VIP access to all live events',
        'Monthly exclusive live streams',
        'Personalized playlists from DJ Zen Eyer',
        'Zen Master digital badge collection',
        'Meet & greet opportunities',
      ],
      color: 'accent',
      icon: <Shield size={24} aria-hidden="true" />,
      popular: false,
    },
  ];

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      {/* Page Header */}
      <div className="bg-surface py-12 md:py-16" id="tribe-intro">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
              Join the <span className="text-primary">Zen Tribe</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Be part of a global community of music lovers who share your passion for Brazilian Zouk dance and DJ Zen Eyer's unique sound.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button 
                className="btn btn-primary transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection('membership-tiers')}
                aria-label="View membership options"
              >
                View Memberships
              </button>
              <button 
                className="btn btn-outline transition-all duration-300 hover:scale-105"
                onClick={() => scrollToSection('tribe-benefits')}
                aria-label="Learn more about tribe benefits"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tribe Benefits */}
      <section className="py-16 bg-background" id="tribe-benefits">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-12 text-center font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Join the Zen Tribe?
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <BenefitCard 
              icon={<Award className="text-primary" size={24} aria-hidden="true" />}
              title="Exclusive Content"
              description="Get access to unreleased tracks, special mixes, and behind-the-scenes content only available to tribe members."
              color="primary"
            />

            <BenefitCard 
              icon={<Star className="text-secondary" size={24} aria-hidden="true" />}
              title="VIP Event Access"
              description="Receive early access to event tickets, exclusive meet-and-greet opportunities, and VIP areas at shows."
              color="secondary"
            />

            <BenefitCard 
              icon={<TrendingUp className="text-accent" size={24} aria-hidden="true" />}
              title="Level Up & Earn"
              description="Progress through our rank system, earn badges, and unlock achievements for engaging with content and attending events."
              color="accent"
            />

            <BenefitCard 
              icon={<Users className="text-success" size={24} aria-hidden="true" />}
              title="Community Connection"
              description="Connect with like-minded music enthusiasts, share your experiences, and be part of a global tribe."
              color="success"
            />
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 bg-surface" id="membership-tiers">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Choose Your Tribe Membership</h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Select the membership tier that fits your journey with DJ Zen Eyer's music
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {membershipTiers.map((tier, index) => (
              <MembershipCard key={index} tier={tier} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Achievement System */}
      <section className="py-16 bg-background" id="achievement-system">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Level Up Your Experience</h2>
              <p className="text-lg text-white/70 mb-8">
                Earn achievements, unlock exclusive rewards, and track your progress as you engage with DJ Zen Eyer's music and events.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="text-primary mr-3 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold mb-1">Track Your Journey</h3>
                    <p className="text-white/70">Monitor your listening time and event attendance.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Gift className="text-secondary mr-3 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold mb-1">Unlock Rewards</h3>
                    <p className="text-white/70">Earn exclusive content and special perks as you level up.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Zap className="text-accent mr-3 mt-1" size={20} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold mb-1">Complete Challenges</h3>
                    <p className="text-white/70">Participate in special events and community challenges.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Achievement visualization component would go here */}
              <div className="bg-surface rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-6">Your Progress</h3>
                {/* Progress visualization would go here */}
                <p className="text-white/70">Achievement system visualization coming soon!</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZenTribePage;