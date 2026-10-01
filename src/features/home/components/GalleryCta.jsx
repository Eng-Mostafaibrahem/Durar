import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../../utils/cn.js';
import bannerImage from '../../../assets/museum3.png';

const CONTENT = {
  title: { ar: 'اكتشف القصة على أرض الواقع', en: 'Discover the story in person' },
  description: {
    ar: 'من الأحجار التي صنعتها الأرض إلى النيازك التي قطعت الفضاء.',
    en: 'From stones shaped by the Earth to meteorites that crossed space.',
  },
  cta: { ar: 'خطط لزيارتك', en: 'Plan your visit' },
};

export function VisitBanner({ to = '/museum', className }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  return (
    <section className={cn('bg-bg-main px-4 py-6 sm:px-6 sm:py-8', className)}>
      <div className="relative isolate mx-auto flex min-h-[clamp(16rem,36vw,24rem)] max-w-screen-2xl items-center justify-center overflow-hidden">
        {/* الصورة */}
        <img
          src={bannerImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-20 size-full object-cover"
        />

        {/* طبقة غامقة عشان النص يبان */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />

        {/* المحتوى */}
        <div className="flex max-w-2xl flex-col items-center px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {CONTENT.title[lang]}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/90 sm:text-base lg:text-lg">
            {CONTENT.description[lang]}
          </p>

          <Link
            to={to}
            className="mt-6 inline-flex items-center gap-2 rounded-[3px] bg-[#5c0b1c] px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#480916]"
          >
            {CONTENT.cta[lang]}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
