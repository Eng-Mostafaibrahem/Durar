import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../../utils/cn.js';
import museumImage from '../../../assets/museum2.png';
import { Container } from '../../../components/Container.jsx';

const CONTENT = {
  eyebrow: { ar: 'متحف الأحجار الكريمة والنيازك', en: 'Museum of Gems & Meteorites' },
  title: { ar: 'اكتشف درر عن قرب', en: 'Discover Durar up close' },
  description: {
    ar: 'تجربة تجمع بين الأحجار الكريمة، النيازك، وقصص التكوين التي تختصر ملايين السنين.',
    en: 'An experience that brings together gemstones, meteorites, and formation stories that span millions of years.',
  },
  info: [
    {
      label: { ar: 'الموقع', en: 'Location' },
      value: { ar: 'الرياض', en: 'Riyadh' },
    },
    {
      label: { ar: 'ساعات الزيارة', en: 'Visiting hours' },
      value: { ar: '١٠ ص : ١٠ م', en: '10 AM : 10 PM' },
    },
    {
      label: { ar: 'الحجز', en: 'Booking' },
      value: { ar: 'مسبق', en: 'In advance' },
    },
  ],
  cta: { ar: 'زيارة المتحف', en: 'Visit the museum' },
};

export function MuseumSection({ to = '/museum', className }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  return (
    <section className={cn('bg-bg-main py-8 sm:py-10', className)}>
      <Container>
      <div className="mx-auto grid max-w-screen-2xl items-center gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-[6%] lg:px-[1%]">
        {/* النص: العمود الأول (start) */}
        <div className="text-start md:py-6">
          <p className="text-sm text-base-dark/60">{CONTENT.eyebrow[lang]}</p>

          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-base-dark/80 sm:text-4xl lg:text-5xl">
            {CONTENT.title[lang]}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-base-dark/70 sm:text-base">
            {CONTENT.description[lang]}
          </p>

          {/* المعلومات */}
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-base-dark/30 pt-4">
            {CONTENT.info.map((item) => (
              <div key={item.label.en} className="flex flex-col gap-1">
                <dt className="text-xs text-base-dark/60 sm:text-sm">{item.label[lang]}</dt>
                <dd className="font-display text-lg font-bold text-primary-500 sm:text-2xl lg:text-3xl">
                  {item.value[lang]}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            to={to}
            className="mt-8 inline-flex items-center gap-2 rounded-[3px] bg-[#5c0b1c] px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#480916]"
          >
            {CONTENT.cta[lang]}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>

        {/* الصورة: العمود التاني (end) */}
        <div className="order-first md:order-none">
          <img
            src={museumImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="aspect-[1.05] w-full object-cover"
          />
        </div>
      </div>
      </Container>
    </section>
  );
}