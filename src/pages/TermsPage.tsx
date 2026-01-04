import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Scale, Ban, CheckCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
  const lastUpdated = "January 2024";

  const sections = [
    {
      icon: CheckCircle,
      title: "1. Acceptance of Terms",
      content: `By accessing and using this website (djzeneyer.com), you accept and agree to be bound by the
      terms and provisions of this agreement. If you do not agree to these Terms of Use, please do not use
      this website. We reserve the right to modify these terms at any time, and such modifications shall be
      effective immediately upon posting on this website.`
    },
    {
      icon: Scale,
      title: "2. Use License",
      content: `Permission is granted to temporarily access the materials (information or software) on
      DJ Zen Eyer's website for personal, non-commercial transitory viewing only. This is the grant of a
      license, not a transfer of title, and under this license you may not: (a) modify or copy the materials;
      (b) use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
      (c) attempt to decompile or reverse engineer any software contained on DJ Zen Eyer's website; (d) remove
      any copyright or other proprietary notations from the materials; or (e) transfer the materials to another
      person or "mirror" the materials on any other server.`
    },
    {
      icon: AlertCircle,
      title: "3. Disclaimer",
      content: `The materials on DJ Zen Eyer's website are provided on an 'as is' basis. DJ Zen Eyer makes no
      warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
      limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
      non-infringement of intellectual property or other violation of rights. Further, DJ Zen Eyer does not
      warrant or make any representations concerning the accuracy, likely results, or reliability of the use of
      the materials on its website or otherwise relating to such materials or on any sites linked to this site.`
    },
    {
      icon: Ban,
      title: "4. Limitations",
      content: `In no event shall DJ Zen Eyer or its suppliers be liable for any damages (including, without
      limitation, damages for loss of data or profit, or due to business interruption) arising out of the use
      or inability to use the materials on DJ Zen Eyer's website, even if DJ Zen Eyer or a DJ Zen Eyer authorized
      representative has been notified orally or in writing of the possibility of such damage. Because some
      jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential
      or incidental damages, these limitations may not apply to you.`
    }
  ];

  const additionalTerms = [
    {
      title: "Intellectual Property",
      points: [
        "All content, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of DJ Zen Eyer (Marcelo Eyer Fernandes) or its content suppliers.",
        "The content is protected by Brazilian and international copyright laws.",
        "Unauthorized use of any materials may violate copyright, trademark, and other laws.",
        "You may not reproduce, distribute, display, or create derivative works without express written permission."
      ]
    },
    {
      title: "User Conduct",
      points: [
        "You agree not to use the website for any unlawful purpose or in any way that interrupts, damages, or impairs the service.",
        "You will not attempt to gain unauthorized access to any portion of the website.",
        "You will not use automated systems (bots, scrapers) without permission.",
        "You will not upload or transmit viruses or any other type of malicious code.",
        "You will respect the privacy and rights of other users."
      ]
    },
    {
      title: "Purchases and Payments",
      points: [
        "All purchases are subject to availability and confirmation of payment.",
        "Prices are subject to change without notice.",
        "We reserve the right to refuse or cancel any order.",
        "Payment processing is handled by secure third-party processors.",
        "Refund and cancellation policies are outlined at the time of purchase."
      ]
    },
    {
      title: "User Accounts",
      points: [
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to accept responsibility for all activities that occur under your account.",
        "You must provide accurate and complete information when creating an account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
        "You must notify us immediately of any unauthorized use of your account."
      ]
    },
    {
      title: "Third-Party Links",
      points: [
        "This website may contain links to third-party websites.",
        "DJ Zen Eyer has no control over and assumes no responsibility for third-party content.",
        "The presence of links does not imply endorsement.",
        "You access third-party sites at your own risk.",
        "Please review the terms and privacy policies of any third-party sites."
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Use | DJ Zen Eyer</title>
        <meta name="description" content="Terms of Use for DJ Zen Eyer official website. Read the terms and conditions governing the use of our services." />
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
              <FileText size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Terms of <span className="text-primary">Use</span>
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
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              Welcome to the official website of DJ Zen Eyer (Marcelo Eyer Fernandes, CNPJ: 44.063.765/0001-46).
              These Terms of Use govern your access to and use of our website, services, and content.
            </p>
            <p className="text-white/70 leading-relaxed">
              By accessing or using our website, you agree to comply with and be bound by these terms. If you
              do not agree to these terms, please do not use our website.
            </p>
          </motion.div>

          {/* Main Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="card p-8 mb-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <section.icon size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mt-1">{section.title}</h2>
              </div>
              <p className="text-white/70 leading-relaxed ml-16">{section.content}</p>
            </motion.div>
          ))}

          {/* Additional Terms */}
          {additionalTerms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="card p-8 mb-6"
            >
              <h2 className="text-2xl font-display font-bold mb-4">{`${index + 5}. ${term.title}`}</h2>
              <ul className="space-y-3">
                {term.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span className="text-white/70 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">10. Governing Law</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These Terms of Use shall be governed by and construed in accordance with the laws of Brazil,
              without regard to its conflict of law provisions. Any legal action or proceeding arising under
              these terms will be brought exclusively in the courts located in São Paulo, Brazil.
            </p>
            <p className="text-white/70 leading-relaxed">
              By using this website, you consent to the jurisdiction and venue of such courts in São Paulo, Brazil.
            </p>
          </motion.div>

          {/* Modifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">11. Modifications to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              DJ Zen Eyer reserves the right to revise these Terms of Use at any time without prior notice.
              By continuing to use this website after changes are posted, you agree to be bound by the revised
              terms. We encourage you to periodically review this page for the latest information on our terms.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-white/70 mb-6">
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <div className="space-y-2 text-white/80">
              <p><strong>DJ Zen Eyer</strong></p>
              <p>Marcelo Eyer Fernandes</p>
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

          {/* Acceptance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center text-white/50 text-sm mt-8"
          >
            <p>By using this website, you acknowledge that you have read and understood these Terms of Use</p>
            <p>and agree to be bound by them.</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
