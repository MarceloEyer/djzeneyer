import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Heart, 
  Music, 
  Globe, 
  Building2, 
  CheckCircle2, 
  ChevronDown,
  Euro,
  PoundSterling,
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
  <div className="bg-surface/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 mb-4">
    <button
      onClick={onToggle}
      className="w-full min-h-[5rem] flex items-center justify-between p-6 text-left hover:bg-surface/50 transition-colors group"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors font-display uppercase tracking-tighter">
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
  <div className="bg-surface/50 p-4 rounded-xl border border-white/5 group hover:border-primary/30 transition-all shadow-lg">
    <div className="text-xs text-white/40 uppercase tracking-widest mb-1 group-hover:text-primary/70 transition-colors font-bold">{label}</div>
    <div className="font-mono text-white font-bold break-all select-all selection:bg-primary/30">{value}</div>
  </div>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

const SupportArtistPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const [openCurrency, setOpenCurrency] = useState<string | null>(null);

  const supportReasons = [
    { icon: Music, title: t('support.reasons.music.title'), description: t('support.reasons.music.description') },
    { icon: Heart, title: t('support.reasons.community.title'), description: t('support.reasons.community.description') },
    { icon: Globe, title: t('support.reasons.worldwide.title'), description: t('support.reasons.worldwide.description') },
  ];

  const handleToggle = (currency: string) => {
    setOpenCurrency(openCurrency === currency ? null : currency);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <HeadlessSEO
        title={t('support.seo.title')}
        description={t('support.seo.description')}
        keywords={t('support.seo.keywords')}
        url={`https://djzeneyer.com/${getLocalizedRoute('support', currentLang).replace(/^\//, '')}`}
        image="/images/zen-eyer-og-image.png"
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 text-sm font-bold tracking-widest uppercase">
            <Heart size={16} /> {t('payme.subtitle')}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-display mb-6 sm:mb-8 text-white tracking-tighter uppercase leading-[0.9]">
            <Trans i18nKey="support.header.title">
               Apoie a <span className="text-primary">Música</span>
            </Trans>
          </h1>
          <p className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t('support.header.description')}
          </p>
        </motion.div>

        {/* Currency Accordions */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-black font-display mb-8 text-center uppercase tracking-widest text-white/80">
            {t('support.payment.by_currency')}
          </h2>

          <div className="max-w-4xl mx-auto">
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
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-white uppercase text-sm tracking-widest">
                    <Building2 size={18} /> {t('support.inter.usd')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.interGlobal.usd.accountName} />
                    <DetailCard label={t('support.bank')} value={ARTIST.payment.interGlobal.usd.bankName} />
                    <DetailCard label={t('support.accountNumber')} value={ARTIST.payment.interGlobal.usd.accountNumber} />
                    <DetailCard label={t('support.achRouting')} value={ARTIST.payment.interGlobal.usd.achRouting} />
                    <DetailCard label={t('support.wireRouting')} value={ARTIST.payment.interGlobal.usd.wireRouting} />
                  </div>
                </div>
                
                <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-400 uppercase text-sm tracking-widest">
                    <CreditCard size={18} /> PayPal (Global)
                  </h4>
                  <a 
                    href={ARTIST.payment.paypal.me} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary w-full justify-center py-4 text-lg font-bold"
                  >
                    {t('support.sendPayment')} PayPal
                  </a>
                </div>
              </div>
            </CurrencyAccordion>

            {/* EUR / EURO */}
            <CurrencyAccordion
              title={t('support.payment.eur_title')}
              icon={Euro}
              isOpen={openCurrency === 'EUR'}
              onToggle={() => handleToggle('EUR')}
            >
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-white uppercase text-sm tracking-widest">
                    <Building2 size={18} /> {t('support.inter.eur')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.interGlobal.eur.accountName} />
                    <DetailCard label={t('support.iban')} value={ARTIST.payment.interGlobal.eur.iban} />
                    <DetailCard label={t('support.swiftCode')} value={ARTIST.payment.interGlobal.eur.swiftCode} />
                    <DetailCard label={t('support.beneficiaryBank')} value={ARTIST.payment.interGlobal.eur.beneficiaryBank} />
                  </div>
                </div>

                <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/20">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-green-400 uppercase text-sm tracking-widest">
                    <Globe size={18} /> Wise (TransferWise)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.wise.eur.accountName} />
                    <DetailCard label={t('support.iban')} value={ARTIST.payment.wise.eur.iban} />
                  </div>
                  <a 
                    href={ARTIST.payment.wise.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn border-green-500/50 hover:bg-green-500/10 w-full justify-center py-4 text-lg text-green-400 font-bold"
                  >
                    {t('support.sendPayment')} Wise
                  </a>
                </div>
              </div>
            </CurrencyAccordion>

            {/* GBP / POUND */}
            <CurrencyAccordion
              title={t('support.payment.gbp_title')}
              icon={PoundSterling}
              isOpen={openCurrency === 'GBP'}
              onToggle={() => handleToggle('GBP')}
            >
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="flex items-center gap-2 font-bold mb-4 text-white uppercase text-sm tracking-widest">
                    <Building2 size={18} /> {t('support.inter.gbp')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <DetailCard label={t('support.accountName')} value={ARTIST.payment.interGlobal.gbp.accountName} />
                    <DetailCard label={t('support.iban')} value={ARTIST.payment.interGlobal.gbp.iban} />
                    <DetailCard label={t('support.swiftCode')} value={ARTIST.payment.interGlobal.gbp.swiftCode} />
                    <DetailCard label={t('support.beneficiaryBank')} value={ARTIST.payment.interGlobal.gbp.beneficiaryBank} />
                  </div>
                </div>
              </div>
            </CurrencyAccordion>
          </div>
        </div>

        {/* Reasons & Business */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch pt-12 sm:pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="card p-5 sm:p-8 bg-surface/30 backdrop-blur-md"
          >
            <h3 className="text-2xl font-black font-display mb-8 uppercase tracking-widest flex items-center gap-2 text-white">
              <Sparkles size={24} className="text-primary" /> {t('support.reasons.title')}
            </h3>
            <div className="space-y-6">
              {supportReasons.map((reason, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary h-fit">
                    <reason.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 uppercase tracking-tighter">{reason.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="card p-5 sm:p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 flex flex-col justify-center text-center"
          >
            <Banknote className="mx-auto mb-6 text-primary" size={56} />
            <h3 className="text-3xl font-black font-display mb-6 uppercase tracking-tighter text-white">{t('support.business.title')}</h3>
            <p className="text-white/70 mb-8 leading-relaxed italic">
              {t('support.business.description')}
            </p>
            <a 
              href={`mailto:${ARTIST.contact.email}?subject=Booking Inquiry`} 
              className="btn btn-primary btn-lg py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <CheckCircle2 size={20} className="mr-2" />
              {t('support.business.contact')}
            </a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-20 text-center">
          <p className="text-2xl text-white/40 italic font-display lowercase tracking-tighter">
            {t('support.thankYou')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary React reconciliation loops when parent layout components (like routers) trigger render cycles.
export default React.memo(SupportArtistPage);
