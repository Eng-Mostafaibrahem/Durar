import { useTranslation } from 'react-i18next';
import { HiChatBubbleLeftRight, HiGlobeAlt, HiMapPin, HiShieldCheck, HiSparkles } from 'react-icons/hi2';
import { Seo } from '../../components/Seo.jsx';
import { Container } from '../../components/Container.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { paths } from '../../lib/paths.js';

const VALUES = [
  { key: 'heritage', icon: HiGlobeAlt },
  { key: 'authenticity', icon: HiShieldCheck },
  { key: 'rarity', icon: HiSparkles },
];

const SPECS = [
  { labelKey: 'pages:about.specs.founded', valueKey: 'pages:about.specs.foundedValue' },
  { labelKey: 'pages:about.specs.origin', valueKey: 'pages:about.specs.originValue' },
  { labelKey: 'pages:about.specs.certificates', valueKey: 'pages:about.specs.certificatesValue' },
  { labelKey: 'pages:about.specs.showroom', valueKey: 'pages:about.specs.showroomValue' },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const stats = t('pages:about.stats.list', { returnObjects: true });

  return (
    <>
      <Seo title={t('pages:about.title')} description={t('pages:about.hero')} />

      <header className="bg-gradient-to-b from-[#044B4A] to-[#002045] text-white">
        <Container className="py-16 lg:py-20">
          <p className="text-sm font-medium tracking-wide text-white/60">{t('common:appName')}</p>
          <h1 className="mt-2 font-display text-4xl font-bold lg:text-5xl">
            {t('pages:about.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 lg:text-base">
            {t('pages:about.hero')}
          </p>
        </Container>
      </header>

      <Container className="py-12 lg:py-16">
        <section className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-base-dark lg:text-3xl">
              {t('pages:about.storyTitle')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-base-dark/80">{t('pages:about.storyBody1')}</p>
            <p className="mt-3 text-sm leading-7 text-base-dark/80">{t('pages:about.storyBody2')}</p>
          </div>

          <dl className="rounded-2xl border border-border-100 bg-bg-secondary p-6">
            {SPECS.map(({ labelKey, valueKey }) => (
              <div
                key={labelKey}
                className="flex flex-col gap-1 border-b border-border-100 py-4 first:pt-0 last:border-0 last:pb-0"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-hue-500">
                  {t(labelKey)}
                </dt>
                <dd className="text-base font-bold text-base-dark">{t(valueKey)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-base-dark lg:text-3xl">
            {t('pages:about.valuesTitle')}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {VALUES.map(({ key, icon: Icon }) => (
              <article
                key={key}
                className="rounded-2xl border border-border-100 bg-white p-6 transition-[transform,box-shadow] duration-300 ease-(--ease-luxury) hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10"
              >
                <span className="grid size-12 place-items-center rounded-full bg-secondary-100 text-secondary-500">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-base-dark">
                  {t(`pages:about.values.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-7 text-hue-500">
                  {t(`pages:about.values.${key}.body`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl bg-gradient-to-b from-[#044B4A] to-[#002045] px-6 py-10 text-white lg:px-10">
          <h2 className="text-center font-display text-2xl font-bold lg:text-3xl">
            {t('pages:about.stats.title')}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {Array.isArray(stats) &&
              stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
          </div>
        </section>

        <section className="mt-16 grid items-center gap-8 rounded-2xl border border-border-100 bg-bg-secondary p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-base-dark">
              {t('pages:about.visitTitle')}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-hue-500">
              {t('pages:about.visitBody')}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-base-dark">
              <HiMapPin aria-hidden="true" className="size-5 text-primary-500" />
              {t('pages:about.visitAddress')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button to={paths.shop} size="lg">
              {t('pages:about.ctaShop')}
            </Button>
            <Button to={paths.contact} variant="outline" size="lg">
              <HiChatBubbleLeftRight aria-hidden="true" className="size-5" />
              {t('pages:about.ctaContact')}
            </Button>
          </div>
        </section>
      </Container>
    </>
  );
}