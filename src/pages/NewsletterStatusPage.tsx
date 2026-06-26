import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, HeartHandshake, MailCheck, MailQuestion, Settings2, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute } from '../config/routes';
import { ARTIST } from '../data/artistData';

type NewsletterPageMode = 'confirmation' | 'preferences';
type NewsletterLang = 'en' | 'pt';

interface NewsletterStatusPageProps {
  mode?: NewsletterPageMode;
}

const getCurrentLangFromPath = (pathname: string): NewsletterLang => (
  pathname === '/pt' || pathname.startsWith('/pt/') ? 'pt' : 'en'
);

const NewsletterStatusPage: React.FC<NewsletterStatusPageProps> = ({ mode = 'confirmation' }) => {
  const location = useLocation();
  const lang = getCurrentLangFromPath(location.pathname);
  const { t } = useTranslation('newsletter');

  const canonicalUrl = useMemo(() => {
    return `${ARTIST.site.baseUrl}${getLocalizedRoute(`newsletter-${mode}`, lang)}`;
  }, [lang, mode]);

  const homePath = getLocalizedRoute('home', lang);
  const secondaryPath = mode === 'confirmation'
    ? getLocalizedRoute('newsletter-preferences', lang)
    : getLocalizedRoute('privacy', lang);
  const Icon = mode === 'confirmation' ? MailCheck : Settings2;

  return (
    <>
      <HeadlessSEO
        title={t(`${mode}.seoTitle`)}
        description={t(`${mode}.seoDescription`)}
        url={canonicalUrl}
        noindex
      />

      <main className="min-h-screen bg-background text-text pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/10 bg-gradient-to-br from-primary/20 via-surface/80 to-background p-6 md:p-12 shadow-2xl motion-safe:animate-fade-up">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-text/5 blur-3xl" aria-hidden="true" />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  <Sparkles size={16} />
                  {t(`${mode}.eyebrow`)}
                </div>

                <h1 className="font-display text-4xl font-black leading-tight md:text-6xl">
                  {t(`${mode}.title`)}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/75 md:text-xl">
                  {t(`${mode}.lead`)}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to={homePath} className="btn btn-primary rounded-full px-7 py-3 text-center font-bold transition-transform hover:scale-105">
                    {t(`${mode}.primary`)}
                  </Link>
                  <Link to={secondaryPath} className="btn btn-outline rounded-full border border-border/30 px-7 py-3 text-center font-bold transition-transform hover:scale-105 hover:bg-text/10">
                    {t(`${mode}.secondary`)}
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/10 bg-background/20 p-6 backdrop-blur-sm">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <Icon size={34} />
                </div>
                <ol className="space-y-4">
                  {(t(`${mode}.steps`, { returnObjects: true }) as string[]).map((step, index) => (
                    <li key={step} className="flex gap-3 text-text/80">
                      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr] motion-safe:animate-fade-up"
            style={{ animationDelay: '120ms' }}
          >
            <div className="card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <MailQuestion size={22} />
                </div>
                <h2 className="font-display text-2xl font-bold">{t('embedPlaceholder')}</h2>
              </div>
              <div className="rounded-2xl border border-dashed border-border/20 bg-text/[0.03] p-6 text-text/70">
                <p className="leading-relaxed">{t('embedHelper')}</p>
              </div>
            </div>

            <aside className="card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="font-display text-2xl font-bold">{t('trustTitle')}</h2>
              </div>
              <p className="leading-relaxed text-text/70">{t('trustCopy')}</p>
              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-relaxed text-text/75">
                <div className="mb-2 flex items-center gap-2 font-bold text-primary">
                  <HeartHandshake size={18} />
                  Zen Eyer
                </div>
                {t(`${mode}.note`)}
              </div>
            </aside>
          </section>

          {mode === 'preferences' && (
            <div
              className="mt-6 flex items-center gap-3 rounded-2xl border border-border/10 bg-surface/50 p-5 text-text/70 motion-safe:animate-fade-up"
              style={{ animationDelay: '180ms' }}
            >
              <CheckCircle2 className="flex-shrink-0 text-primary" size={24} />
              <p className="leading-relaxed">
                {t('preferences.recommended_standard')}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default React.memo(NewsletterStatusPage);
