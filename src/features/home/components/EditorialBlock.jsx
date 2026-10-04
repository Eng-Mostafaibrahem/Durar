import { useTranslation } from 'react-i18next';
import { HiArrowRight } from 'react-icons/hi2';
import { Button } from '../../../components/ui/Button.jsx';
import { Container } from '../../../components/Container.jsx';
import { paths } from '../../../lib/paths.js';
import { contentText, editorialSpecs } from '../assets/content.js';
import cardCover from '../../../assets/specialCard.png';
import cardImage from '../../../assets/stone.png';

export function EditorialBlock() {
  const { t } = useTranslation();

  return (
    <section className="bg-bg-secondary py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-primary-500">
            {t('home:editorial.title')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-base-dark sm:text-4xl">
            {t('home:editorial.title')}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-hue-500">{t('home:editorial.body')}</p>

          <dl className="mt-8 divide-y divide-border-100 border-y border-border-100">
            {editorialSpecs.map((spec) => (
              <div key={spec.key} className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm font-medium text-hue-500">
                  {t(`home:editorial.${spec.key}`)}
                </dt>
                <dd className="font-sans text-base font-bold text-base-dark">
                  {contentText(spec.value)}
                </dd>
              </div>
            ))}
          </dl>

          <Button to={paths.about} variant="outline" size="md" className="mt-8">
            {t('home:editorial.cta')}
            <HiArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>

        <div className="relative isolate overflow-hidden bg-dark-gradient shadow-xl ring-1 ring-border-500/20">
          <img
            src={cardCover}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
          />
          <div className="grid aspect-[4/3] place-items-center sm:aspect-[5/4]">
            <img
              src={cardImage}
              alt=""
              aria-hidden="true"
              decoding="async"
              loading="lazy"
              className="absolute  object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
