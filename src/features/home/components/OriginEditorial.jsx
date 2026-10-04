import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn.js';
import galleryImage from '../../../assets/museum.webp';

export function OriginEditorial() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const CONTENT = {
    eyebrow: {
      ar: 'Rare from Earth, Extraordinary from Space',
      en: 'Rare from Earth, Extraordinary from Space',
    },
    title: {
      ar: 'نادر من الأرض، استثنائي من الفضاء',
      en: 'Rare from Earth, Extraordinary from Space',
    },
    description: {
      ar: 'في درر، نختفي بما تصنعه الأرض وما يصلنا من الفضاء، ونحوّل ندرة الأحجار إلى قطع تحمل قيمة تتجاوز جمالها.',
      en: 'At Durar, we celebrate what the Earth creates and what reaches us from space, turning the rarity of stones into pieces whose value goes beyond their beauty.',
    },
  };

  return (
    <section
      className={cn(
        'container-page  py-16 sm:py-20 grid overflow-hidden bg-bg-main md:min-h-[clamp(20rem,36vw,30rem)] md:grid-cols-2',
      )}
    >
      {/* الصورة: العمود الاول (end)، بتملا لحد الحافة */}

       <div className="relative order-first h-64 sm:h-80 md:order-none md:h-auto">
        <img
          src={galleryImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      {/* النص: العمود الثاني (start) */}
      <div className="flex items-center px-6 py-12 sm:px-10 md:px-[8%] md:py-0">
        <div className="w-full max-w-xl text-start">
          <p className="text-sm font-medium text-base-dark/60 sm:text-base">
            {CONTENT.eyebrow[lang]}
          </p>

          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-base-dark/80 sm:text-4xl lg:text-5xl">
            {CONTENT.title[lang]}
          </h2>

          <p className="mt-6 text-sm leading-7 text-base-dark/70 sm:text-base">
            {CONTENT.description[lang]}
          </p>
        </div>
      </div>

     
    </section>
  );
}
