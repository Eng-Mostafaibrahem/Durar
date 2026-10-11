import { useTranslation } from 'react-i18next';
import { Container } from '../../components/Container.jsx';
import { Seo } from '../../components/Seo.jsx';

export function LegalDocumentPage({ pageKey }) {
  const { t } = useTranslation();
  const sections = t(`pages:${pageKey}.sections`, { returnObjects: true });

  return (
    <>
      <Seo title={t(`pages:${pageKey}.title`)} description={t(`pages:${pageKey}.description`)} />

      <header className="bg-bg-secondary py-12 sm:py-16">
        <Container>
          <p className="text-sm font-semibold tracking-wide text-primary-500">
            {t('common:appName')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-base-dark sm:text-4xl">
            {t(`pages:${pageKey}.title`)}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-hue-500 sm:text-base">
            {t(`pages:${pageKey}.description`)}
          </p>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {Array.isArray(sections) &&
            sections.map((section, index) => (
              <section
                key={section.title}
                className="rounded-xl border border-border-100 bg-white p-5 sm:p-7"
                aria-labelledby={`${pageKey}-section-${index}`}
              >
                <h2
                  id={`${pageKey}-section-${index}`}
                  className="font-display text-xl font-bold text-base-dark sm:text-2xl"
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-8 text-base-dark/80 sm:text-base">
                  {section.body}
                </p>
              </section>
            ))}
        </div>
      </Container>
    </>
  );
}
