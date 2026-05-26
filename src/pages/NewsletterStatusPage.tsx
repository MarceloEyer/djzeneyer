import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, HeartHandshake, MailCheck, MailQuestion, Settings2, ShieldCheck, Sparkles } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST } from '../data/artistData';

type NewsletterPageMode = 'confirmation' | 'preferences';

interface NewsletterStatusPageProps {
  mode?: NewsletterPageMode;
}

const FADE_IN_UP_INITIAL = { opacity: 0, y: 20 };
const FADE_IN_UP_ANIMATE = { opacity: 1, y: 0 };

const copy = {
  en: {
    confirmation: {
      eyebrow: 'Zen Tribe Newsletter',
      title: 'Almost there. Please confirm your email.',
      lead: 'One last step keeps the list clean and protects you from unwanted email. Open the message we sent and tap the confirmation button.',
      primary: 'Back to Zen Eyer',
      secondary: 'Manage email preferences',
      seoTitle: 'Confirm Your Zen Eyer Newsletter Subscription',
      seoDescription: 'Confirm your Zen Eyer newsletter subscription and choose what kind of updates you want to receive.',
      steps: [
        'Check your inbox for the confirmation email from Zen Eyer.',
        'Tap the confirmation link once.',
        'After confirmation, you will receive only selected Zen Eyer updates.'
      ],
      note: 'Did not ask to subscribe? You can ignore the email safely. No newsletter will be sent unless the subscription is confirmed.'
    },
    preferences: {
      eyebrow: 'Email preferences',
      title: 'Choose what you want to receive.',
      lead: 'This page is where subscribers can update their email status, change lists, or unsubscribe without friction.',
      primary: 'Back to Zen Eyer',
      secondary: 'Privacy policy',
      seoTitle: 'Manage Zen Eyer Newsletter Preferences',
      seoDescription: 'Manage your Zen Eyer newsletter subscription, email preferences, and unsubscribe options.',
      steps: [
        'Use the form below to keep receiving Zen Eyer updates or unsubscribe.',
        'Changes should be simple, explicit, and reversible when possible.',
        'You can resubscribe later from the website if you change your mind.'
      ],
      note: 'A clean preference center reduces spam complaints, improves deliverability, and keeps the audience relationship respectful.'
    },
    embedPlaceholder: 'MailPoet form area',
    embedHelper: 'In WordPress, place the MailPoet confirmation or manage-subscription block/shortcode here. The React page gives the public route, branding, copy, and SEO shell.',
    trustTitle: 'No spam. No noise.',
    trustCopy: 'Updates are for music releases, Zouk events, useful content, and important Zen Eyer news. You stay in control.'
  },
  pt: {
    confirmation: {
      eyebrow: 'Newsletter Zen Tribe',
      title: 'Quase lá. Confirme seu e-mail.',
      lead: 'Esse último passo mantém a lista limpa e protege você de e-mails indesejados. Abra a mensagem que enviamos e toque no botão de confirmação.',
      primary: 'Voltar para o site',
      secondary: 'Gerenciar preferências',
      seoTitle: 'Confirme sua inscrição na newsletter Zen Eyer',
      seoDescription: 'Confirme sua inscrição na newsletter Zen Eyer e escolha quais atualizações deseja receber.',
      steps: [
        'Procure na sua caixa de entrada o e-mail de confirmação enviado por Zen Eyer.',
        'Clique uma única vez no link de confirmação.',
        'Depois disso, você receberá apenas atualizações selecionadas do Zen Eyer.'
      ],
      note: 'Não pediu para se inscrever? Pode ignorar o e-mail com segurança. A newsletter não será enviada se a inscrição não for confirmada.'
    },
    preferences: {
      eyebrow: 'Preferências de e-mail',
      title: 'Escolha o que você quer receber.',
      lead: 'Esta é a página para assinantes atualizarem o status do e-mail, mudarem listas ou cancelarem a inscrição sem fricção.',
      primary: 'Voltar para o site',
      secondary: 'Política de privacidade',
      seoTitle: 'Gerencie suas preferências da newsletter Zen Eyer',
      seoDescription: 'Gerencie sua inscrição na newsletter Zen Eyer, preferências de e-mail e opções de cancelamento.',
      steps: [
        'Use o formulário abaixo para continuar recebendo novidades do Zen Eyer ou cancelar a inscrição.',
        'As mudanças devem ser simples, explícitas e reversíveis quando possível.',
        'Você pode se inscrever novamente pelo site se mudar de ideia.'
      ],
      note: 'Um centro de preferências claro reduz reclamações de spam, melhora a entregabilidade e mantém a relação com o público respeitosa.'
    },
    embedPlaceholder: 'Área do formulário MailPoet',
    embedHelper: 'No WordPress, coloque aqui o bloco ou shortcode do MailPoet de confirmação ou gerenciamento de assinatura. A página React entrega a rota pública, branding, texto e SEO.',
    trustTitle: 'Sem spam. Sem ruído.',
    trustCopy: 'Os envios são para lançamentos, eventos de Zouk, conteúdos úteis e novidades importantes do Zen Eyer. Você mantém o controle.'
  }
} as const;

const getCurrentLangFromPath = (pathname: string): 'en' | 'pt' => (
  pathname === '/pt' || pathname.startsWith('/pt/') ? 'pt' : 'en'
);

const NewsletterStatusPage: React.FC<NewsletterStatusPageProps> = ({ mode = 'confirmation' }) => {
  const location = useLocation();
  const lang = getCurrentLangFromPath(location.pathname);
  const pageCopy = copy[lang][mode];
  const sharedCopy = copy[lang];

  const canonicalUrl = useMemo(() => {
    const key = mode === 'confirmation' ? 'newsletter-confirmation' : 'newsletter-preferences';
    return `${ARTIST.site.baseUrl}${getLocalizedRoute(key, normalizeLanguage(lang))}`;
  }, [lang, mode]);

  const homePath = lang === 'pt' ? '/pt/' : '/';
  const secondaryPath = mode === 'confirmation'
    ? getLocalizedRoute('newsletter-preferences', lang)
    : getLocalizedRoute('privacy', lang);
  const Icon = mode === 'confirmation' ? MailCheck : Settings2;

  return (
    <>
      <HeadlessSEO
        title={pageCopy.seoTitle}
        description={pageCopy.seoDescription}
        url={canonicalUrl}
        noindex
      />

      <main className="min-h-screen bg-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.section
            initial={FADE_IN_UP_INITIAL}
            animate={FADE_IN_UP_ANIMATE}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/20 via-surface/80 to-background p-6 md:p-12 shadow-2xl"
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  <Sparkles size={16} />
                  {pageCopy.eyebrow}
                </div>

                <h1 className="font-display text-4xl font-black leading-tight md:text-6xl">
                  {pageCopy.title}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
                  {pageCopy.lead}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to={homePath} className="btn btn-primary rounded-full px-7 py-3 text-center font-bold transition-transform hover:scale-105">
                    {pageCopy.primary}
                  </Link>
                  <Link to={secondaryPath} className="btn btn-outline rounded-full border border-white/30 px-7 py-3 text-center font-bold transition-transform hover:scale-105 hover:bg-white/10">
                    {pageCopy.secondary}
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <Icon size={34} />
                </div>
                <ol className="space-y-4">
                  {pageCopy.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-white/80">
                      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={FADE_IN_UP_INITIAL}
            animate={FADE_IN_UP_ANIMATE}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]"
          >
            <div className="card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <MailQuestion size={22} />
                </div>
                <h2 className="font-display text-2xl font-bold">{sharedCopy.embedPlaceholder}</h2>
              </div>
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-white/70">
                <p className="leading-relaxed">{sharedCopy.embedHelper}</p>
              </div>
            </div>

            <aside className="card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="font-display text-2xl font-bold">{sharedCopy.trustTitle}</h2>
              </div>
              <p className="leading-relaxed text-white/70">{sharedCopy.trustCopy}</p>
              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-relaxed text-white/75">
                <div className="mb-2 flex items-center gap-2 font-bold text-primary">
                  <HeartHandshake size={18} />
                  Zen Eyer
                </div>
                {pageCopy.note}
              </div>
            </aside>
          </motion.section>

          {mode === 'preferences' && (
            <motion.div
              initial={FADE_IN_UP_INITIAL}
              animate={FADE_IN_UP_ANIMATE}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/50 p-5 text-white/70"
            >
              <CheckCircle2 className="flex-shrink-0 text-primary" size={24} />
              <p className="leading-relaxed">
                {lang === 'pt'
                  ? 'Padrão recomendado: deixar a opção de cancelar inscrição sempre visível, sem exigir login e sem esconder o botão principal.'
                  : 'Recommended standard: keep the unsubscribe option visible, without requiring login and without hiding the main action.'}
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default React.memo(NewsletterStatusPage);
