import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = "January 2024";

  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number)",
        "Usage data and analytics (pages visited, time spent, interactions)",
        "Device information (browser type, operating system, IP address)",
        "Cookies and tracking technologies for enhanced user experience",
        "Payment information (processed securely through third-party processors)"
      ]
    },
    {
      icon: Eye,
      title: "2. How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To notify you about changes to our services",
        "To provide customer support and respond to inquiries",
        "To send promotional emails and newsletters (with your consent)",
        "To analyze usage patterns and improve our website and services",
        "To detect, prevent, and address technical issues and security threats"
      ]
    },
    {
      icon: Lock,
      title: "3. Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "SSL/TLS encryption for all data transmission",
        "Regular security audits and vulnerability assessments",
        "Restricted access to personal information on a need-to-know basis",
        "However, no method of transmission over the Internet is 100% secure"
      ]
    },
    {
      icon: Shield,
      title: "4. Data Sharing and Disclosure",
      content: [
        "We do not sell your personal information to third parties",
        "We may share data with trusted service providers who assist in operations",
        "We may disclose information when required by law or to protect our rights",
        "Analytics partners may receive aggregated, anonymized data",
        "Payment processors handle transaction data according to their own policies"
      ]
    },
    {
      icon: Mail,
      title: "5. Your Rights",
      content: [
        "Access: Request a copy of your personal data",
        "Correction: Request correction of inaccurate or incomplete data",
        "Deletion: Request deletion of your personal data (subject to legal obligations)",
        "Opt-out: Unsubscribe from marketing communications at any time",
        "Data portability: Request transfer of your data to another service"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | DJ Zen Eyer</title>
        <meta name="description" content="Privacy Policy for DJ Zen Eyer official website. Learn how we collect, use, and protect your personal information." />
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
            <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/20 mb-6">
              <Shield size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Privacy <span className="text-primary">Policy</span>
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
            className="card p-8 mb-8"
          >
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              DJ Zen Eyer (Marcelo Eyer Fernandes, CNPJ: 44.063.765/0001-46) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website.
            </p>
            <p className="text-white/70 leading-relaxed">
              By using our website, you consent to the data practices described in this policy. If you do
              not agree with the terms of this Privacy Policy, please do not access the website.
            </p>
          </motion.div>

          {/* Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card p-8 mb-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 size-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <section.icon size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mt-1">{section.title}</h2>
              </div>
              <ul className="space-y-3 ml-16">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-white/70 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our website and hold
              certain information. Cookies are files with a small amount of data that may include an
              anonymous unique identifier.
            </p>
            <p className="text-white/70 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </motion.div>

          {/* Third-Party Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">7. Third-Party Services</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may employ third-party companies and individuals to facilitate our services, provide services
              on our behalf, or assist us in analyzing how our service is used. These third parties may have
              access to your personal information to perform tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </p>
            <div className="space-y-2">
              <p className="text-white/80"><strong>Analytics:</strong> Google Analytics</p>
              <p className="text-white/80"><strong>Payment Processing:</strong> Stripe, PayPal</p>
              <p className="text-white/80"><strong>Email Services:</strong> MailPoet</p>
            </div>
          </motion.div>

          {/* LGPD Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="card p-8 mb-6 border-l-4 border-primary"
          >
            <h2 className="text-2xl font-display font-bold mb-4">8. LGPD Compliance (Brazilian Law)</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We comply with the Brazilian General Data Protection Law (LGPD - Lei Geral de Proteção de Dados).
              As a Brazilian entity, we are committed to:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>Processing data lawfully, fairly, and transparently</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>Collecting data only for specified, explicit, and legitimate purposes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>Keeping data accurate and up to date</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>Retaining data only as long as necessary</span>
              </li>
            </ul>
          </motion.div>

          {/* Changes to Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the "Last updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent"
          >
            <h2 className="text-2xl font-display font-bold mb-4">10. Contact Us</h2>
            <p className="text-white/70 mb-6">
              If you have any questions about this Privacy Policy or wish to exercise your rights,
              please contact us at:
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>Marcelo Eyer Fernandes</strong></p>
              <p>CNPJ: 44.063.765/0001-46</p>
              <p>São Paulo, SP - Brazil</p>
              <a
                href="mailto:contact@djzeneyer.com"
                className="text-primary hover:underline inline-block mt-2"
              >
                contact@djzeneyer.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
