import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, AlertTriangle, Ban, Mail } from 'lucide-react';

const CodeOfConductPage: React.FC = () => {
  const lastUpdated = "January 2024";

  const principles = [
    {
      icon: Heart,
      title: "Respect & Inclusion",
      description: "Treat everyone with respect, kindness, and empathy. We celebrate diversity and welcome people of all backgrounds, identities, and experiences.",
      examples: [
        "Use inclusive language",
        "Be respectful of different viewpoints",
        "Welcome newcomers warmly",
        "Celebrate our diverse community"
      ]
    },
    {
      icon: Users,
      title: "Community First",
      description: "We are a community built on the love of Brazilian Zouk and music. Support each other, share knowledge, and help create a positive environment.",
      examples: [
        "Support fellow dancers and artists",
        "Share knowledge and experiences",
        "Contribute positively to discussions",
        "Help maintain a welcoming atmosphere"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Consent",
      description: "Everyone deserves to feel safe and comfortable. Consent is paramount in all interactions, both online and at events.",
      examples: [
        "Always ask before physical contact",
        "Respect personal boundaries",
        "Speak up if you feel uncomfortable",
        "Report any concerning behavior"
      ]
    }
  ];

  const prohibitedBehavior = [
    {
      title: "Harassment & Discrimination",
      items: [
        "Any form of harassment based on race, ethnicity, gender, sexual orientation, disability, age, religion, or any other protected characteristic",
        "Sexual harassment, unwanted advances, or inappropriate comments",
        "Bullying, intimidation, or threatening behavior",
        "Stalking or unwanted persistent contact"
      ]
    },
    {
      title: "Disruptive Behavior",
      items: [
        "Spam, trolling, or deliberately derailing conversations",
        "Sharing false or misleading information",
        "Promoting hate groups or extremist ideologies",
        "Engaging in illegal activities or promoting illegal content"
      ]
    },
    {
      title: "Privacy Violations",
      items: [
        "Sharing someone's personal information without consent (doxxing)",
        "Recording or photographing people without permission",
        "Sharing private conversations publicly",
        "Impersonating others or creating fake accounts"
      ]
    }
  ];

  const consequences = [
    {
      level: "First Offense (Minor)",
      action: "Warning",
      description: "Verbal or written warning with explanation of the violation"
    },
    {
      level: "Repeated or Serious Offense",
      action: "Temporary Suspension",
      description: "Temporary removal from events, platform, or community spaces"
    },
    {
      level: "Severe or Persistent Violation",
      action: "Permanent Ban",
      description: "Permanent removal from all DJ Zen Eyer events and community spaces"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Code of Conduct | DJ Zen Eyer</title>
        <meta name="description" content="Community Code of Conduct for DJ Zen Eyer events and online spaces. Learn about our expectations and standards for respectful behavior." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <Heart size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Code of <span className="text-primary">Conduct</span>
            </h1>
            <p className="text-white/70">
              Last updated: <span className="text-primary font-semibold">{lastUpdated}</span>
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-8 mb-8 border-l-4 border-primary"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Our Commitment</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              DJ Zen Eyer is committed to creating a welcoming, safe, and inclusive environment for all
              members of our community. This Code of Conduct applies to all interactions within our community,
              including events, online platforms, and any spaces associated with DJ Zen Eyer.
            </p>
            <p className="text-white/70 leading-relaxed">
              By participating in our community, you agree to abide by this Code of Conduct. We expect all
              community members to help create a positive environment where everyone feels respected and valued.
            </p>
          </motion.div>

          {/* Core Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-8 text-center">Core Principles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <principle.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{principle.description}</p>
                  <div className="text-left space-y-2">
                    {principle.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Prohibited Behavior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Ban size={24} className="text-red-400" />
              </div>
              <h2 className="text-3xl font-display font-bold">Prohibited Behavior</h2>
            </div>
            <p className="text-white/70 mb-6">
              The following behaviors are strictly prohibited and will result in consequences as outlined below:
            </p>
            <div className="space-y-6">
              {prohibitedBehavior.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="card p-6 border-l-4 border-red-500/50"
                >
                  <h3 className="text-xl font-bold mb-4 text-red-400">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <span className="text-red-400 mt-1">×</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reporting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="card p-8 mb-8 bg-gradient-to-br from-primary/10 to-transparent"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold">Reporting Violations</h2>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              If you experience or witness behavior that violates this Code of Conduct, please report it
              immediately. All reports will be treated with confidentiality and seriousness.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white mb-2">How to Report:</h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>At events: Speak to event staff or organizers immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Online: Use the report function on the platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Email: <a href="mailto:conduct@djzeneyer.com" className="text-primary hover:underline">conduct@djzeneyer.com</a></span>
                  </li>
                </ul>
              </div>
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-bold text-white mb-2">What Happens After a Report:</h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    <span>We will acknowledge receipt within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    <span>We will investigate the incident thoroughly and impartially</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    <span>We will take appropriate action based on our findings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">4.</span>
                    <span>We will follow up with you about the outcome (as appropriate)</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Consequences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-display font-bold mb-6">Enforcement & Consequences</h2>
            <p className="text-white/70 mb-6">
              Violations of this Code of Conduct may result in the following consequences, depending on
              the severity and frequency of the violation:
            </p>
            <div className="space-y-4">
              {consequences.map((consequence, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="card p-6 flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{consequence.level}</h3>
                    <p className="text-primary font-semibold mb-2">{consequence.action}</p>
                    <p className="text-white/70 text-sm">{consequence.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scope */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="card p-8 mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Scope</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              This Code of Conduct applies to all spaces managed by DJ Zen Eyer, including but not limited to:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Live events and performances</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Online communities and social media groups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Official website and digital platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Workshops, classes, and educational content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Any space representing DJ Zen Eyer</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="card p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Mail size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">Questions or Concerns?</h2>
            <p className="text-white/70 mb-6">
              If you have questions about this Code of Conduct or need to report a violation:
            </p>
            <a
              href="mailto:conduct@djzeneyer.com"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <Mail size={20} />
              Contact Us
            </a>
          </motion.div>

          {/* Acknowledgment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="text-center text-white/50 text-sm mt-8 space-y-2"
          >
            <p>By participating in our community, you acknowledge that you have read and agree to follow</p>
            <p>this Code of Conduct and understand the consequences of violations.</p>
            <p className="pt-4 text-white/70">Together, we create a better community. 💙</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CodeOfConductPage;
