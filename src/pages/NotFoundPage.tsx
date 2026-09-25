import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Home, Link as LinkIcon, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { HeadlessSEO } from '../components/HeadlessSEO';

const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  // ⚡ Bolt: Cache localized routes with useMemo to prevent O(N) string recalculations
  // of getLocalizedRoute inside the component render body on every reconciliation cycle.
  // Impact: Reduces CPU overhead and GC pressure during state updates in this component.
  const routes = useMemo(() => ({
    home: getLocalizedRoute('', currentLang),
    music: getLocalizedRoute('music', currentLang),
    events: getLocalizedRoute('events', currentLang),
    zenlink: getLocalizedRoute('zenlink', currentLang),
  }), [currentLang]);

  const quickLinks = [
    { to: routes.home, icon: Home, label: t('not_found.home'), className: 'text-primary' },
    { to: routes.music, icon: Music, label: t('not_found.music'), className: 'text-secondary' },
    { to: routes.events, icon: Calendar, label: t('not_found.events'), className: 'text-accent' },
    { to: routes.zenlink, icon: LinkIcon, label: t('not_found.links'), className: 'text-success' },
  ];

  return (
    <>
      <HeadlessSEO
        title={t('not_found.title', '404 — Page Not Found')}
        description={t('not_found.description', 'The page you are looking for does not exist.')}
        noindex
      />
      <main className="min-h-screen overflow-hidden bg-background pt-24 text-text">
        <section className="relative flex min-h-[calc(100vh-6rem)] items-center px-4 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--color-primary),0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(var(--color-secondary),0.14),transparent_30%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" aria-hidden="true" />

          <div className="container relative z-10 mx-auto">
            <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-[2rem] border border-primary/25 bg-surface/35 p-6 shadow-2xl shadow-primary/10 backdrop-blur-sm sm:max-w-[340px]">
                <div className="relative flex h-full w-full items-center justify-center rounded-[1.5rem] bg-text/[0.03]">
                  <div className="absolute inset-6 rounded-full border border-dashed border-primary/40" aria-hidden="true" />
                  <div className="absolute h-24 w-24 rounded-full border-8 border-primary/30 sm:h-32 sm:w-32" aria-hidden="true" />
                  <Music className="h-20 w-20 text-primary sm:h-24 sm:w-24" aria-hidden="true" />
                  <span className="absolute bottom-7 right-7 rounded-full border border-border/20 bg-background/90 px-3 py-1 font-mono text-sm font-bold text-text/70">
                    404
                  </span>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.32em] text-primary">
                  {t('not_found.kicker')}
                </p>
                <h1 className="mx-auto mb-5 max-w-3xl font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:mx-0">
                  {t('not_found.title')}
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-text/75 sm:text-lg lg:mx-0">
                  {t('not_found.text')}
                </p>

                <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                  <Link to={routes.home} className="btn btn-primary w-full px-7 py-3 sm:w-auto">
                    {t('not_found.cta')}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <Link to={routes.zenlink} className="btn btn-outline w-full px-7 py-3 sm:w-auto">
                    {t('not_found.links')}
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {quickLinks.map(({ to, icon: Icon, label, className }) => (
                    <Link
                      key={to}
                      to={to}
                      className="group rounded-2xl border border-border/10 bg-surface/35 p-4 text-center shadow-lg shadow-black/5 transition-colors hover:border-primary/35 hover:bg-text/[0.04]"
                    >
                      <Icon className={`mx-auto mb-2 h-6 w-6 ${className}`} aria-hidden="true" />
                      <span className="text-sm font-bold text-text/80 transition-colors group-hover:text-primary">
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default React.memo(NotFoundPage);
