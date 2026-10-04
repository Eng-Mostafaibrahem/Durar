import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { paths } from '../../../lib/paths';
import heroImage from '../../../assets/hero/card 2.webp';

export function Hero() {
  const { t, i18n } = useTranslation(['home', 'common']);

  // يخلي الـ rtl:/ltr: variants تشتغل على كل الصفحة
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return (
    <section className="relative isolate overflow-hidden bg-bg-main md:h-[clamp(22rem,46vw,46rem)]">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-start px-5 pb-12 pt-12 sm:px-8 md:h-full md:flex-row md:items-center md:px-[5%] md:pb-0 md:pt-0">
        {/* النص */}
        <div className="flex w-full max-w-[80%] flex-col text-start md:max-w-[52%] md:-translate-y-[6%]">
          <p className="text-xs font-medium text-[#d3cfb7] sm:text-sm md:text-[clamp(0.625rem,1.1vw,0.875rem)]">
            {t('home:hero.eyebrow')}
          </p>

          <h1 className="mt-3 font-display text-[clamp(2rem,8vw,3.25rem)] font-bold leading-[1.5] text-[#d3cfb7] md:mt-[2%] md:text-[clamp(2rem,5.6vw,4.75rem)]">
            {t('home:hero.title')}
            <br />
            {t('home:hero.title2')}
          </h1>

          <p className="mt-4 max-w-[11rem] text-balance text-base leading-relaxed text-primary-700 sm:max-w-sm md:mt-[2%] md:max-w-[100%] md:text-[clamp(0.75rem,1.5vw,1.25rem)]">
            {t('home:hero.subtitle')}
          </p>

          <div className="mt-6 flex flex-wrap justify-start gap-3 md:mt-[4%] md:gap-[2%]">
            <Button to={paths.shop} variant="emerald" size="fluid">
              {t('home:hero.primaryCta')}
              <ChevronRight className="size-[1em] rtl:-scale-x-100" aria-hidden="true" />
            </Button>

            <Button to={paths.about} variant="burgundy" size="fluid">
              {t('home:hero.secondaryCta')}
              <ChevronRight className="size-[1em] rtl:-scale-x-100" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/*
        موبايل: الصورة بتغطي السكشن كله (cover) ورا النص.
        من md وطالع: نفس السلوك القديم (absolute، ارتفاع 114%، من غير قص).
      */}
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        className="
          pointer-events-none absolute inset-0 -z-10 h-full w-full select-none
          object-cover object-center ltr:-scale-x-100
          md:inset-auto md:top-0 md:h-[114%] md:w-auto md:max-w-none md:object-contain
        "
      />

      {/* overlay اختياري لو النص مش واضح على الموبايل
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/20 md:hidden"
      /> */}
    </section>
  );
}
