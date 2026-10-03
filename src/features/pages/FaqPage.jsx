import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Seo } from '../../components/Seo.jsx';
import { Container } from '../../components/Container.jsx';
import { PageHero } from '../../components/PageHero.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { paths } from '../../lib/paths.js';
import { cn } from '../../utils/cn.js';
import { FAQ_ITEMS, FAQ_TITLE } from '../faq/faqContent.js';
import banner from '../../../assets/shop-banner.webp';

export default function FaqPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const [open, setOpen] = useState(0);

  return (
    <>
      <Seo title={t('pages:faq.title')} description={t('common:tagline')} />

      <PageHero
              image={banner}

        title={FAQ_TITLE[lang]}
        subtitle={t('pages:faq.subtitle')}
        showSearch={false}
        showTags={false}
        minHeight="min-h-[320px] md:min-h-[400px]"
        className="bg-dark-gradient"
      />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <ul className="mt-8 flex flex-col gap-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = open === index;

              return (
                <li
                  key={item.q.en}
                  className="overflow-hidden rounded-xl border border-border-100 bg-white shadow-sm"
                >
                  <h2>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-page-panel-${index}`}
                      id={`faq-page-btn-${index}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-semibold text-base-dark transition-colors hover:bg-hue-100 sm:text-base"
                    >
                      <span>{item.q[lang]}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'size-5 shrink-0 text-hue-500 transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>
                  </h2>

                  <div
                    id={`faq-page-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-page-btn-${index}`}
                    className={cn(
                      'grid transition-[grid-template-rows] duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-border-100 px-5 py-4 text-sm leading-7 text-base-dark/80 sm:text-base">
                        {item.a[lang]}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button to={paths.shop}>{t('common:actions.browse')}</Button>
            <Button to={paths.contact} variant="outline">
              {t('pages:contact.title')}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
