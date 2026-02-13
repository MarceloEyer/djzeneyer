import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { DollarSign, CreditCard, Banknote, Heart, Music, Globe, Building2, CheckCircle2 } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';

const SupportArtistPage = () => {
  const { t, i18n } = useTranslation();

  const paymentMethods = [
    {
      id: 'inter',
      title: t('support.inter.title', 'Inter Global Account (Preferred)'),
      description: t('support.inter.description', 'US and Brazil bank accounts for international and local payments'),
      icon: Building2,
      priority: 1,
      color: 'from-orange-500 to-orange-600',
      accounts: [
        {
          country: t('support.inter.usa', 'United States'),
          details: [
            { label: t('support.accountName', 'Account Name'), value: 'Marcelo Eyer Fernandes' },
            { label: t('support.routingNumber', 'Routing Number'), value: '084106768' },
            { label: t('support.accountNumber', 'Account Number'), value: '9100169982' },
            { label: t('support.accountType', 'Account Type'), value: 'Checking' },
            { label: t('support.swiftCode', 'SWIFT/BIC'), value: 'CINTUS33XXX' },
          ],
        },
        {
          country: t('support.inter.brazil', 'Brazil'),
          details: [
            { label: t('support.accountName', 'Account Name'), value: 'Marcelo Eyer Fernandes' },
            { label: t('support.bank', 'Bank'), value: 'Banco Inter (077)' },
            { label: t('support.branch', 'Branch'), value: '0001' },
            { label: t('support.account', 'Account'), value: '94635616-7' },
            { label: t('support.pixKey', 'PIX Key'), value: 'contato@djzeneyer.com' },
          ],
        },
      ],
    },
    {
      id: 'wise',
      title: t('support.wise.title', 'Wise (TransferWise)'),
      description: t('support.wise.description', 'Low-fee international transfers to multiple currencies'),
      icon: Globe,
      priority: 2,
      color: 'from-green-500 to-green-600',
      link: 'https://wise.com',
      email: 'contato@djzeneyer.com',
    },
    {
      id: 'paypal',
      title: t('support.paypal.title', 'PayPal'),
      description: t('support.paypal.description', 'Quick and easy payments worldwide'),
      icon: CreditCard,
      priority: 3,
      color: 'from-blue-500 to-blue-600',
      link: 'https://paypal.me/djzeneyer',
      email: 'contato@djzeneyer.com',
    },
  ];

  const supportReasons = [
    {
      icon: Music,
      title: t('support.reasons.music.title', 'Support New Music'),
      description: t('support.reasons.music.description', 'Help produce and release new Brazilian Zouk tracks'),
    },
    {
      icon: Heart,
      title: t('support.reasons.community.title', 'Community Growth'),
      description: t('support.reasons.community.description', 'Support workshops, events, and educational content'),
    },
    {
      icon: Globe,
      title: t('support.reasons.worldwide.title', 'Worldwide Presence'),
      description: t('support.reasons.worldwide.description', 'Enable international tours and collaborations'),
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <HeadlessSEO
        title={t('support.seo.title', 'Support DJ Zen Eyer | Payment Information')}
        description={t('support.seo.description', 'Support DJ Zen Eyer through donations or hire for events. Multiple payment methods available worldwide including Inter Global, Wise, and PayPal.')}
        keywords={t('support.seo.keywords', 'support artist, hire dj, payment methods, international payments, brazilian zouk dj')}
        ogImage="/images/zen-eyer-og-image.svg"
      />

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black font-display mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {t('support.header.title', 'Support the Music')}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {t('support.header.description', 'Your support helps create new music, educational content, and build the Brazilian Zouk community worldwide. Whether you\'re hiring for an event or making a donation, every contribution makes a difference.')}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-center">
            {t('support.reasons.title', 'Why Your Support Matters')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportReasons.map((reason, index) => (
              <motion.div key={reason.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="card p-6 text-center hover:border-primary/50 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                <p className="text-white/70">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-center">
            {t('support.payment.title', 'Payment Methods')}
          </h2>

          <div className="space-y-6">
            {paymentMethods.map((method, index) => (
              <motion.div key={method.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="card overflow-hidden">
                <div className={`bg-gradient-to-r ${method.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <method.icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          {method.title}
                          {method.priority === 1 && (
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              {t('support.preferred', 'Preferred')}
                            </span>
                          )}
                        </h3>
                        <p className="text-white/90 text-sm">{method.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full">
                      <span className="text-2xl font-bold text-white">{method.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {method.id === 'inter' && method.accounts && (
                    <div className="space-y-6">
                      {method.accounts.map((account, accountIndex) => (
                        <div key={accountIndex} className={accountIndex > 0 ? 'pt-6 border-t border-white/10' : ''}>
                          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Globe size={20} className="text-primary" />
                            {account.country}
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {account.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="bg-surface/30 rounded-lg p-4">
                                <div className="text-sm text-white/50 mb-1">{detail.label}</div>
                                <div className="font-mono text-white font-bold">{detail.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(method.id === 'wise' || method.id === 'paypal') && (
                    <div className="space-y-4">
                      {method.email && (
                        <div className="bg-surface/30 rounded-lg p-4">
                          <div className="text-sm text-white/50 mb-1">{t('support.email', 'Email')}</div>
                          <div className="font-mono text-white font-bold">{method.email}</div>
                        </div>
                      )}
                      {method.link && (
                        <a href={method.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                          <DollarSign size={20} />
                          {t('support.sendPayment', 'Send Payment via')} {method.title}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-16 card p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <Banknote className="mx-auto mb-4 text-primary" size={48} />
          <h3 className="text-2xl font-bold mb-4">{t('support.business.title', 'Event Bookings & Business Inquiries')}</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            {t('support.business.description', 'For event bookings, workshop requests, or business collaborations, please send payment details to the email below. Include event details, location, and date for faster processing.')}
          </p>
          <a href="mailto:contato@djzeneyer.com?subject=Event Booking Inquiry" className="btn btn-primary inline-flex items-center gap-2">
            <CheckCircle2 size={20} />
            {t('support.business.contact', 'Contact for Bookings')}
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 text-center">
          <p className="text-xl text-white/70 italic">
            {t('support.thankYou', '✨ Your support keeps the music alive. Thank you! ✨')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportArtistPage;
