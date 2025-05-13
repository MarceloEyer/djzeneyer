import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Users, TrendingUp, Shield, Gift, Clock, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const ZenTribePage: React.FC = () => {
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
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
      icon: <Users size={24} />,
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
      icon: <Star size={24} />,
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
      icon: <Shield size={24} />,
      popular: false,
    },
  ];

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
              Join the <span className="text-primary">Zen Tribe</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Be part of a global community of music lovers who share your passion for Brazilian Zouk dance and DJ Zen Eyer's unique sound.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tribe Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Join the Zen Tribe?
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Award className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Content</h3>
              <p className="text-white/70">
                Get access to unreleased tracks, special mixes, and behind-the-scenes content only available to tribe members.
              </p>
            </motion.div>

            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Star className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">VIP Event Access</h3>
              <p className="text-white/70">
                Receive early access to event tickets, exclusive meet-and-greet opportunities, and VIP areas at shows.
              </p>
            </motion.div>

            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Level Up & Earn</h3>
              <p className="text-white/70">
                Progress through our rank system, earn badges, and unlock achievements for engaging with content and attending events.
              </p>
            </motion.div>

            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <Users className="text-success" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Connection</h3>
              <p className="text-white/70">
                Connect with like-minded music enthusiasts, share your experiences, and be part of a global tribe.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-display">Choose Your Tribe Membership</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Select the membership tier that fits your journey with DJ Zen Eyer's music
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier, index) => (
              <motion.div 
                key={index}
                className={`card overflow-hidden relative ${
                  tier.popular ? 'border-2 border-secondary' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                        <div className={`text-${tier.color} mr-2 mt-1`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full btn ${tier.popular ? 'btn-secondary' : 'btn-outline'}`}
                  >
                    {user?.isLoggedIn ? 'Upgrade Now' : 'Join Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement System */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 font-display">
                Level Up Your Music Journey
              </h2>
              <p className="text-xl text-white/70 mb-6">
                The Zen Tribe features a comprehensive achievement system that rewards you for engaging with music, attending events, and being an active community member.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <TrendingUp className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Experience Points (XP)</h3>
                    <p className="text-white/70">
                      Earn XP for every action you take, from listening to tracks to attending events.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Award className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Digital Badges</h3>
                    <p className="text-white/70">
                      Unlock collectible badges for special achievements and milestones in your journey.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Gift className="text-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Rewards & Perks</h3>
                    <p className="text-white/70">
                      Earn real benefits like merchandise discounts, exclusive content, and VIP upgrades.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Clock className="text-success" size={20} />
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
              <div className="card p-6 glow">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Zap className="text-primary mr-2" />
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
                      className={`p-3 rounded-lg text-center ${
                        badge.unlocked 
                          ? 'bg-white/10 ring-2 ring-primary/50' 
                          : 'bg-white/5 grayscale opacity-60'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="text-sm font-medium mb-1">{badge.name}</h4>
                      <p className="text-xs text-white/60 line-clamp-2">{badge.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-surface rounded-lg">
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
                    <div className="h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: '87.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-display">
              Meet the Zen Tribe
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Connect with a global community of Brazilian Zouk dancers enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-video relative">
                <img 
                  src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Community event" 
                  className="w-full h-full object-cover"
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
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="aspect-video relative">
                <img 
                  src="https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Community event" 
                  className="w-full h-full object-cover"
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
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-video relative">
                <img 
                  src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Community event" 
                  className="w-full h-full object-cover"
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

          <div className="mt-12 text-center">
            <button className="btn btn-outline">
              View All Community Events
            </button>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6 font-display">
              Ready to Join the Tribe?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Start your journey with DJ Zen Eyer and join a global community of music enthusiasts. Level up, earn rewards, and enjoy exclusive content.
            </p>
            <button className="btn btn-primary px-8 py-4 text-lg">
              Become a Tribe Member
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ZenTribePage;