import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { DollarSign, CreditCard, Banknote, Heart, Music, Globe, Building2, CheckCircle2 } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';

const SupportArtistPage = () => {
  const { t, i18n } = useTranslation();

  const paymentMethods = [
    {
      id: 'inter',
      title: t('support.inter.title'),
      description: t('support.inter.description'),
      icon: Building2,
      priority: 1,
      isPreferred: true,
      color: 'from-orange-500 to-orange-600',
      accounts: [
        // International Channels
        ...(['usd', 'eur', 'gbp'] as const).map((currency) => {
          const acc = ARTIST.payment.interGlobal[currency];
          return {
            country: t(`support.inter.${currency}`),
            details: currency === 'usd' ? [
              { label: t('support.accountName'), value: acc.accountName },
              { label: t('support.bank'), value: (acc as Record<string, unknown>).bankName as string },
              { label: t('support.accountNumber'), value: (acc as Record<string, unknown>).accountNumber as string },
              { label: t('support.achRouting'), value: (acc as Record<string, unknown>).achRouting as string },
              { label: t('support.wireRouting'), value: (acc as Record<string, unknown>).wireRouting as string },
              { label: t('support.bankAddress'), value: (acc as Record<string, unknown>).bankAddress as string },
            ] : [
              { label: t('support.accountName'), value: acc.accountName },
              { label: t('support.beneficiaryBank'), value: acc.beneficiaryBank },
              { label: t('support.swiftCode'), value: acc.swiftCode },
              { label: t('support.intermediary'), value: acc.intermediaryBank.name },
              { label: t('support.swiftInter'), value: acc.intermediaryBank.swift },
              { label: t('support.iban'), value: acc.iban },
            ],
          };
        }),
        // Local Brazil
        {
          country: t('support.inter.brazil'),
          details: [
            { label: t('support.accountName'), value: ARTIST.payment.interGlobal.brazil.accountName },
            { label: t('support.cpf'), value: ARTIST.payment.interGlobal.brazil.cpf },
            { label: t('support.bank'), value: ARTIST.payment.interGlobal.brazil.bank },
            { label: t('support.branch'), value: ARTIST.payment.interGlobal.brazil.branch },
            { label: t('support.account'), value: ARTIST.payment.interGlobal.brazil.account },
            { label: t('support.pixKey'), value: ARTIST.payment.interGlobal.brazil.pixKey },
          ],
        },
      ],
    },
    {
      id: 'wise',
      title: t('support.wise.title'),
      description: t('support.wise.description'),
      icon: Globe,
      priority: 2,
      color: 'from-green-500 to-green-600',
      link: ARTIST.payment.wise.url,
      email: ARTIST.payment.wise.email,
      accounts: [
        {
          country: t('support.wise.eur'),
          details: [
            { label: t('support.accountName'), value: ARTIST.payment.wise.eur.accountName },
            { label: t('support.iban'), value: ARTIST.payment.wise.eur.iban },
            { label: t('support.swiftCode'), value: ARTIST.payment.wise.eur.swiftCode },
            { label: t('support.bank'), value: ARTIST.payment.wise.eur.bankName },
            { label: t('support.bankAddress'), value: ARTIST.payment.wise.eur.bankAddress },
          ],
        },
      ],
    },
    {
      id: 'paypal',
      title: t('support.paypal.title'),
      description: t('support.paypal.description'),
      icon: CreditCard,
      priority: 3,
      color: 'from-blue-500 to-blue-600',
      link: ARTIST.payment.paypal.donateUrl,
      email: ARTIST.payment.paypal.email,
      phone: ARTIST.payment.paypal.phone,
    },
  ];

  const supportReasons = [
    {
      icon: Music,
      title: t('support.reasons.music.title'),
      description: t('support.reasons.music.description'),
    },
    {
      icon: Heart,
      title: t('support.reasons.community.title'),
      description: t('support.reasons.community.description'),
    },
    {
      icon: Globe,
      title: t('support.reasons.worldwide.title'),
      description: t('support.reasons.worldwide.description'),
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <HeadlessSEO
        title={t('support.seo.title')}
        description={t('support.seo.description')}
        keywords={t('support.seo.keywords')}
        ogImage="/images/zen-eyer-og-image.svg"
      />

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black font-display mb-6 text-white drop-shadow-2xl">
            {t('support.header.title')}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {t('support.header.description')}
          </p>
          <div className="mt-4 text-primary font-bold">
            {t('payme.subtitle')}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-center">
            {t('support.reasons.title')}
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
            {t('support.payment.title')}
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
                              {t('support.preferred')}
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
                  {(method.id === 'inter' || method.id === 'wise') && method.accounts && (
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
                            {(account as Record<string, unknown>).bankAddress && (
                              <div className="bg-surface/30 rounded-lg p-4 md:col-span-2">
                                <div className="text-sm text-white/50 mb-1">{t('support.bankAddress')}</div>
                                <div className="font-mono text-white font-bold">{(account as Record<string, unknown>).bankAddress as string}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(method.id === 'wise' || method.id === 'paypal') && (
                    <div className="space-y-4">
                      {method.email && (
                        <div className="bg-surface/30 rounded-lg p-4">
                          <div className="text-sm text-white/50 mb-1">{t('support.email')}</div>
                          <div className="font-mono text-white font-bold">{method.email}</div>
                        </div>
                      )}

                      {(method as Record<string, unknown>).phone && (
                        <div className="bg-surface/30 rounded-lg p-4">
                          <div className="text-sm text-white/50 mb-1">{t('support.phone')}</div>
                          <div className="font-mono text-white font-bold">{(method as Record<string, unknown>).phone as string}</div>
                        </div>
                      )}

                      {method.link && (
                        <a href={method.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-center">
                          <DollarSign size={20} />
                          {t('support.sendPayment')} {method.title}
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
          <h3 className="text-2xl font-bold mb-4">{t('support.business.title')}</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            {t('support.business.description')}
          </p>
          <a href="mailto:contato@djzeneyer.com?subject=Event Booking Inquiry" className="btn btn-primary inline-flex items-center gap-2">
            <CheckCircle2 size={20} />
            {t('support.business.contact')}
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 text-center">
          <p className="text-xl text-white/70 italic">
            {t('support.thankYou')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportArtistPage;
