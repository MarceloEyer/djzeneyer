import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { 
  DollarSign, 
  CreditCard, 
  Heart, 
  Globe, 
  Building2, 
  ChevronDown,
  QrCode,
  Sparkles
} from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CurrencyAccordion = memo(({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) => (
  <div className="bg-surface/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/10 hover:border-primary/30 transition-all duration-300 mb-4">
    <button
      onClick={onToggle}
      className="w-full min-h-[5rem] flex items-center justify-between p-6 text-left hover:bg-surface/50 transition-colors group"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-text group-hover:text-primary transition-colors font-display uppercase tracking-tighter">
          {title}
        </h3>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="text-primary/70" size={24} />
      </motion.div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-6 pt-0 space-y-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));
CurrencyAccordion.displayName = 'CurrencyAccordion';

const DetailCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-surface/50 p-4 rounded-xl border border-border/5 group hover:border-primary/30 transition-all shadow-lg">
    <div className="text-xs text-text/55 uppercase tracking-widest mb-1 group-hover:text-primary/70 transition-colors font-bold">{label}</div>
    <div className="font-mono text-text font-bold break-all select-all selection:bg-primary/30">{value}</div>
  </div>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

const SupportArtistPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const [openCurrency, setOpenCurrency] = useState<string | null>(null);

  const supportActions = [
    {
      emoji: '🎵',
      title: t('support.actions.streaming.title'),
      description: t('support.actions.streaming.description'),
      to: getLocalizedRoute('music', currentLang),
      cta: t('support.actions.streaming.cta'),
    },
    {
      emoji: '☕',
      title: t('support.actions.pix.title'),
      description: t('support.actions.pix.description'),
    },
    {
      emoji: '🎟️',
      title: t('support.actions.organizer.title'),
      description: t('support.actions.organizer.description'),
      to: getLocalizedRoute('booking', currentLang),
      cta: t('support.actions.organizer.cta'),
    },
    {
      emoji: '👍',
      title: t('support.actions.engagement.title'),
      description: t('support.actions.engagement.description'),
    },
  ];

  const handleToggle = (currency: string) => {
    setOpenCurrency(openCurrency === currency ? null : currency);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-background">
      <HeadlessSEO
        title={t('support.seo.title')}
        description={t('support.seo.description')}
        keywords={t('support.seo.keywords')}
        url={`https://djzeneyer.com/${getLocalizedRoute('support', currentLang).replace(/^\//, '')}`}
        image="/images/og/zen-eyer-support-og.jpg"
        imageAlt={t('og.image_alt.support')}
      />

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 text-sm font-bold tracking-widest uppercase">
            <Heart size={16} /> {t('common.footer_support_artist')}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-display mb-6 sm:mb-8 text-text tracking-tighter uppercase leading-[0.9]">
            <Trans i18nKey="support.header.title" components={{ 1: <span className="text-primary" /> }} />
          </h1>
          <div className="text-base sm:text-xl text-text/70 max-w-2xl mx-auto leading-relaxed space-y-4">
            <p>{t('support.header.description_p1')}</p>
            <p>{t('support.header.description_p2')}</p>
            <p>{t('support.header.description_p3')}</p>
          </div>
        </motion.div>

        <section className="mx-auto mb-16 max-w-4xl rounded-2xl border border-border/10 bg-surface/40 p-5 sm:p-8">
          <div className="space-y-5">
            {supportActions.map((action) => (
              <div key={action.title} className="flex gap-4 rounded-xl border border-border/5 bg-background/15 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl" aria-hidden="true">
                  {action.emoji}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-black uppercase tracking-tight text-text sm:text-lg">
                    {action.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-text/70 sm:text-base">
                    {action.description}
                  </p>
                  {action.to && (
                    <Link to={action.to} className="mt-3 inline-flex min-h-[44px] items-center text-sm font-bold text-primary transition-colors hover:text-text">
                      {action.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Currency Accordions */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-black font-display mb-8 text-center uppercase tracking-widest text-text/80">
            {t('support.payment.by_currency')}
          </h2>

          <div className="max-w-4xl mx-auto">
            {/* EUR / EURO */}
            <CurrencyAccordion
              title={t('support.payment.eur_title')}
              icon={Globe}
              isOpen={openCurrency === 'EUR'}
              onToggle={() => handleToggle('EUR')}
            >
              <div className="space-y-6">
                <div className="p-6 bg-success/5 rounded-2xl border border-success/20">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-success uppercase text-sm tracking-widest">
                    <Globe size={18} /> {t('support.payment.wise_eur_title')}
                  </h4>
                  <p className="mb-4 text-sm leading-relaxed text-text/65">
                    {t('support.payment.eur_note')}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.wise.eur.accountName} />
                    <DetailCard label={t('support.iban')} value={ARTIST.payment.wise.eur.iban} />
                    <DetailCard label={t('support.swiftCode')} value={ARTIST.payment.wise.eur.swiftCode} />
                    <DetailCard label={t('support.bank')} value={ARTIST.payment.wise.eur.bankName} />
                    <DetailCard label={t('support.bankAddress')} value={ARTIST.payment.wise.eur.bankAddress} />
                  </div>
                </div>
              </div>
            </CurrencyAccordion>

            {/* BRL / REAL */}
            <CurrencyAccordion
              title={t('support.payment.brl_title')}
              icon={QrCode}
              isOpen={openCurrency === 'BRL'}
              onToggle={() => handleToggle('BRL')}
            >
              <div className="space-y-6">
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 shadow-inner">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-primary uppercase text-sm tracking-widest">
                    <Building2 size={18} /> {t('support.inter.brazil')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.interGlobal.brazil.accountName} />
                    <DetailCard label={t('support.pixKey')} value={ARTIST.payment.interGlobal.brazil.pixKey} />
                    <DetailCard label={t('support.bank')} value={ARTIST.payment.interGlobal.brazil.bank} />
                    <DetailCard label={t('support.cpf')} value={ARTIST.payment.interGlobal.brazil.cpf} />
                    <DetailCard label={t('support.branch')} value={ARTIST.payment.interGlobal.brazil.branch} />
                    <DetailCard label={t('support.account')} value={ARTIST.payment.interGlobal.brazil.account} />
                  </div>
                </div>
              </div>
            </CurrencyAccordion>

            {/* USD / DOLLAR */}
            <CurrencyAccordion
              title={t('support.payment.usd_title')}
              icon={DollarSign}
              isOpen={openCurrency === 'USD'}
              onToggle={() => handleToggle('USD')}
            >
              <div className="space-y-6">
                <div className="p-6 bg-text/5 rounded-2xl border border-border/10">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-text uppercase text-sm tracking-widest">
                    <Building2 size={18} /> {t('support.inter.usd')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.interGlobal.usd.accountName} />
                    <DetailCard label={t('support.bank')} value={ARTIST.payment.interGlobal.usd.bankName} />
                    <DetailCard label={t('support.accountNumber')} value={ARTIST.payment.interGlobal.usd.accountNumber} />
                    <DetailCard label={t('support.achRouting')} value={ARTIST.payment.interGlobal.usd.achRouting} />
                    <DetailCard label={t('support.wireRouting')} value={ARTIST.payment.interGlobal.usd.wireRouting} />
                    <DetailCard label={t('support.swiftCode')} value={ARTIST.payment.interGlobal.usd.swiftCode} />
                    <DetailCard label={t('support.bankAddress')} value={ARTIST.payment.interGlobal.usd.bankAddress} />
                  </div>
                </div>
              </div>
            </CurrencyAccordion>

            {/* GLOBAL / WISE + PAYPAL */}
            <CurrencyAccordion
              title={t('support.payment.global_title')}
              icon={Globe}
              isOpen={openCurrency === 'GLOBAL'}
              onToggle={() => handleToggle('GLOBAL')}
            >
              <div className="space-y-6">
                <div className="p-6 bg-success/5 rounded-2xl border border-success/20">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-success uppercase text-sm tracking-widest">
                    <Globe size={18} /> {t('support.payment.wise_aud_payid_title')}
                  </h4>
                  <p className="mb-4 text-sm leading-relaxed text-text/65">
                    {t('support.payment.global_note')}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.wise.aud.accountName} />
                    <DetailCard label={t('support.payIdPhone')} value={ARTIST.payment.wise.aud.payIdPhone} />
                    <DetailCard label={t('support.bsbCode')} value={ARTIST.payment.wise.aud.bsbCode} />
                    <DetailCard label={t('support.accountNumber')} value={ARTIST.payment.wise.aud.accountNumber} />
                    <DetailCard label={t('support.swiftCode')} value={ARTIST.payment.wise.aud.swiftCode} />
                    <DetailCard label={t('support.bankAddress')} value={ARTIST.payment.wise.aud.bankAddress} />
                  </div>
                  <a
                    href={ARTIST.payment.wise.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-success/50 hover:bg-success/10 w-full justify-center py-4 text-lg text-success font-bold"
                  >
                    {t('support.sendPaymentProvider', { provider: t('support.payment.wise_title') })}
                  </a>
                </div>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-primary uppercase text-sm tracking-widest">
                    <CreditCard size={18} /> {t('support.payment.paypal_title')}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <a
                      href={ARTIST.payment.paypal.me}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary justify-center py-4 text-lg font-bold"
                    >
                      {t('support.payment.paypal_me_title')}
                    </a>
                    <a
                      href={ARTIST.payment.paypal.donateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline justify-center py-4 text-lg font-bold"
                    >
                      {t('support.sendPaymentProvider', { provider: t('support.payment.paypal_title') })}
                    </a>
                  </div>
                </div>
              </div>
            </CurrencyAccordion>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-20 text-center">
          <Sparkles className="mx-auto mb-4 text-primary" size={24} />
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-text/70 sm:text-2xl">
            {t('support.thankYou')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Bolt: Wrapped with React.memo to prevent unnecessary React reconciliation loops when parent layout components trigger render cycles.
export default React.memo(SupportArtistPage);
