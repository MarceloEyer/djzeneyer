import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, CreditCard, Landmark, Globe, Zap, Heart, Briefcase } from 'lucide-react';
import { paymentMethods } from '../data/paymentMethods';

const PayMePage: React.FC = () => {
    const { t } = useTranslation();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [activeAccordion, setActiveAccordion] = useState<string | null>('pix');

    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(fieldId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const IconMap: Record<string, React.ReactNode> = {
        pix: <Zap className="w-6 h-6 text-primary" />,
        bank: <Landmark className="w-6 h-6 text-primary" />,
        paypal: <Heart className="w-6 h-6 text-accent" />,
        wire: <Globe className="w-6 h-6 text-secondary" />,
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display mb-4 text-gradient">
                        {t('payme.title')}
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        {t('payme.subtitle')}
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="w-full">
                            <div
                                className={`card p-0 transition-all duration-300 border border-white/5 ${activeAccordion === method.id ? 'bg-surface/90 border-primary/30' : 'hover:bg-surface/50'}`}
                            >
                                <button
                                    onClick={() => setActiveAccordion(activeAccordion === method.id ? null : method.id)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            {IconMap[method.type] || <CreditCard />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display">{t(method.titleKey)}</h3>
                                            <p className="text-sm text-white/50">{t(method.descriptionKey)}</p>
                                        </div>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: activeAccordion === method.id ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Copy className={`w-5 h-5 transition-colors ${activeAccordion === method.id ? 'text-primary' : 'text-white/20'}`} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {activeAccordion === method.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 border-t border-white/5 grid gap-4">
                                                {method.details.map((detail, idx) => {
                                                    const fieldId = `${method.id}-${idx}`;
                                                    return (
                                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-white/5 rounded-lg group/field">
                                                            <span className="text-xs uppercase tracking-wider text-white/40 font-bold">
                                                                {t(detail.labelKey)}
                                                            </span>
                                                            <div className="flex items-center gap-3">
                                                                <code className="text-primary-light font-mono selection:bg-primary/30">
                                                                    {detail.value}
                                                                </code>
                                                                {detail.copyable && (
                                                                    <button
                                                                        onClick={() => handleCopy(detail.value, fieldId)}
                                                                        className="p-2 hover:bg-white/10 rounded-md transition-colors relative"
                                                                        title={t('common.copy')}
                                                                    >
                                                                        {copiedId === fieldId ? (
                                                                            <Check className="w-4 h-4 text-success" />
                                                                        ) : (
                                                                            <Copy className="w-4 h-4 text-white/40 group-hover/field:text-white" />
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid md:grid-cols-2 gap-8">
                    <div className="card p-8 bg-primary/5 border-primary/20">
                        <Heart className="w-8 h-8 text-primary mb-4" />
                        <h3 className="text-xl font-display mb-2">{t('payme.sections.donors.title')}</h3>
                        <p className="text-white/60">{t('payme.sections.donors.desc')}</p>
                    </div>
                    <div className="card p-8 bg-secondary/5 border-secondary/20">
                        <Briefcase className="w-8 h-8 text-secondary mb-4" />
                        <h3 className="text-xl font-display mb-2">{t('payme.sections.contractors.title')}</h3>
                        <p className="text-white/60">{t('payme.sections.contractors.desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PayMePage);
