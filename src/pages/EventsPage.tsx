import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Gift, Clock } from 'lucide-react';

const EventsPage: React.FC = () => {
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
              Events & Schedule
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join DJ Zen Eyer at upcoming Brazilian Zouk events and experience the magic of music and dance.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Calendar Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-lg bg-surface p-4">
            <div className="relative pb-[75%] md:pb-[56.25%] h-0">
              <iframe 
                src="https://calendar.google.com/calendar/embed?src=eyer.marcelo%40gmail.com&ctz=America%2FSao_Paulo" 
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                style={{ border: 0 }}
                frameBorder="0" 
                scrolling="no"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement System */}
      <section className="py-16 bg-surface">
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
                    <TrendingUp className="text-primary" size={20} />
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
                    <Award className="text-secondary" size={20} />
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
                    <Gift className="text-accent" size={20} />
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;