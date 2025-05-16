import React, { lazy, Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Users, TrendingUp, Shield, Gift, Clock, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Helmet } from 'react-helmet'; // Para adicionar metadados

// Lazy loading para componentes grandes
const AchievementShowcase = lazy(() => import('../components/AchievementShowcase'));
const CommunityShowcase = lazy(() => import('../components/CommunityShowcase'));

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
      {/* SEO Metadata */}
      <Helmet>
        <title>Zen Tribe - Join DJ Zen Eyer's Global Music Community</title>
        <meta name="description" content="Join the Zen Tribe and be part of a global community of music lovers who share your passion for Brazilian Zouk dance and DJ Zen Eyer's unique sound." />
        <meta property="og:title" content="Zen Tribe - DJ Zen Eyer" />
        <meta property="og:description" content="Join our global community of music enthusiasts and get exclusive content, VIP event access, and more." />
        <meta property="og:image" content="/images/zen-tribe-og.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://djzeneyer.com/tribe" />
      </Helmet>

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
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                Level Up Your Music Journey
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-6">
                The Zen Tribe features a comprehensive achievement system that rewards you for engaging with music, attending events, and being an active community member.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start group transition-all duration-300 hover:bg-white/5 p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <TrendingUp className="text-primary" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Experience Points (XP)</h3>
                    <p className="text-white/70">
                      Earn XP for every action you take, from listening to tracks to attending events.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:bg-white/5 p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Award className="text-secondary" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Digital Badges</h3>
                    <p className="text-white/70">
                      Unlock collectible badges for special achievements and milestones in your journey.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:bg-white/5 p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Gift className="text-accent" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Rewards & Perks</h3>
                    <p className="text-white/70">
                      Earn real benefits like merchandise discounts, exclusive content, and VIP upgrades.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:bg-white/5 p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Clock className="text-success" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Daily Streaks</h3>
                    <p className="text-white/70">
                      Maintain your engagement streak for bonus XP and special streak-only rewards.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Suspense fallback={<div className="card p-6 glow flex items-center justify-center h-96">Loading achievement showcase...</div>}>
                <div className="card p-6 glow transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Zap className="text-primary mr-2" aria-hidden="true" />
                    Achievement Showcase
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { 
                        name: 'First Beat', 
                        icon: '🎧', 
                        description: 'Welcome to the Zen Tribe', 
                        unlocked: true 
                      },
                      { 
                        name: 'Early Adopter', 
                        icon: '🚀', 
                        description: 'Joined during the launch phase', 
                        unlocked: true 
                      },
                      { 
                        name: 'Music Explorer', 
                        icon: '🔍', 
                        description: 'Listened to 10 different tracks', 
                        unlocked: false 
                      },
                      { 
                        name: 'Social Butterfly', 
                        icon: '🦋', 
                        description: 'Connected with 5 tribe members', 
                        unlocked: false 
                      },
                      { 
                        name: 'Event Attendee', 
                        icon: '🎪', 
                        description: 'Attended your first live event', 
                        unlocked: false 
                      },
                      { 
                        name: 'Consistent Fan', 
                        icon: '⏱️', 
                        description: 'Maintained a 7-day streak', 
                        unlocked: false 
                      },
                    ].map((badge, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg text-center transition-all duration-300 ${
                          badge.unlocked 
                            ? 'bg-white/10 ring-2 ring-primary/50 hover:ring-primary/80' 
                            : 'bg-white/5 grayscale opacity-60 hover:opacity-70'
                        }`}
                        title={badge.unlocked ? `${badge.name}: ${badge.description}` : `Locked: ${badge.description}`}
                      >
                        <div className="text-3xl mb-2" aria-hidden="true">{badge.icon}</div>
                        <h4 className="text-sm font-medium mb-1">{badge.name}</h4>
                        <p className="text-xs text-white/60 line-clamp-2">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-surface rounded-lg transition-all duration-300 hover:bg-surface/80">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-semibold">Current Level</h4>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold mr-2">3</span>
                          <span className="text-white/70">Zen Apprentice</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">3</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress to Level 4</span>
                        <span>350/400 XP</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000" 
                          style={{ width: '87.5%' }}
                          role="progressbar" 
                          aria-valuenow="87.5" 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="py-16 bg-surface" id="community">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
              Meet the Zen Tribe
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Connect with a global community of Brazilian Zouk dancers enthusiasts
            </p>
          </div>

          <Suspense fallback={<div className="flex justify-center py-12">Loading community showcase...</div>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div 
                className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="aspect-video relative">
                  <img 
                    src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    srcSet="
                      https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400 400w,
                      https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600 600w,
                      https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800 800w
                    "
                    sizes="(max-width: 768px) 100vw, 33vw"
                    alt="Group of people at a virtual DJ meetup event" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-lg font-semibold mb-1">Monthly Virtual Meetups</h3>
                    <p className="text-white/70 text-sm">
                      Connect with Tribe members from around the world
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="aspect-video relative">
                  <img 
                    src="https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    srcSet="
                      https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=400 400w,
                      https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600 600w,
                      https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=800 800w
                    "
                    sizes="(max-width: 768px) 100vw, 33vw"
                    alt="People enjoying music at an exclusive listening party" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-lg font-semibold mb-1">Exclusive Listening Parties</h3>
                    <p className="text-white/70 text-sm">
                      Be the first to hear new releases with fellow fans
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="aspect-video relative">
                  <img 
                    src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    srcSet="
                      https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400 400w,
                      https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600 600w,
                      https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800 800w
                    "
                    sizes="(max-width: 768px) 100vw, 33vw"
                    alt="DJ performing at a showcase event" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-lg font-semibold mb-1">Tribe Member Showcases</h3>
                    <p className="text-white/70 text-sm">
                      Share your own music with the community
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Suspense>

          <div className="mt-12 text-center">
            <button 
              className="btn btn-outline transition-all duration-300 hover:scale-105 hover:shadow-lg"
              aria-label="View all community events"
            >
              View All Community Events
            </button>
          </div>
        </div>
      </section>

      {/* Mini Music Player (Fixed at bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-sm p-3 border-t border-white/10 z-50 transform translate-y-full opacity-0 transition-all duration-500 hover:translate-y-0 hover:opacity-100 group">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/album-cover-placeholder.jpg" alt="Now playing" className="w-10 h-10 rounded mr-3" />
            <div>
              <h4 className="font-medium text-sm">Zen Rhythms Vol. 3</h4>
              <p className="text-xs text-white/70">DJ Zen Eyer</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-primary transition-colors" aria-label="Previous track">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors" aria-label="Play or pause">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
            <button className="text-white/80 hover:text-primary transition-colors" aria-label="Next track">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-surface px-4 py-1 rounded-t-lg border-t border-l border-r border-white