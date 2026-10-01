import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn.js';
import nizak from '../../../assets/nizak1.png';
import nizak2 from '../../../assets/nizak2.png';
import nizak3 from '../../../assets/nizak3.png';
import nizak4 from '../../../assets/nizak4.png';

const ITEMS = [
  {
    id: 1,
    image: nizak,
    title: { ar: 'كيف تتكون الأحجار ؟', en: 'How are stones formed?' },
    description: {
      ar: 'حرارة وضغط وزمن يقاس بملايين السنين.',
      en: 'Heat, pressure and time measured in millions of years.',
    },
  },
  {
    id: 2,
    image: nizak2,
    title: { ar: 'من أين تأتي النيازك؟', en: 'Where do meteorites come from?' },
    description: {
      ar: 'شظايا من بدايات المجموعة الشمسية.',
      en: 'Fragments from the early days of the solar system.',
    },
  },
  {
    id: 3,
    image: nizak3,
    title: { ar: 'ما الذي يجعل القطعة نادرة؟', en: 'What makes a piece rare?' },
    description: {
      ar: 'المصدر، النقاء، والتكوين غير المتكرر.',
      en: 'Origin, purity, and a formation that never repeats.',
    },
  },
  {
    id: 4,
    image: nizak4,
    title: { ar: 'كيف نقرأ قصة الحجر؟', en: "How do we read a stone's story?" },
    description: {
      ar: 'من طبقاته ولونه وأثر رحلته.',
      en: 'From its layers, its color and the traces of its journey.',
    },
  },
];

export function BehindTheStone({ className }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  return (
    <section className={cn('bg-bg-main py-10 sm:py-14', className)}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <ul className="grid grid-cols-1 border-s border-t border-primary-500/70 md:grid-cols-2">
          {ITEMS.map((item) => (
            <li key={item.id} className="border-b border-e border-primary-500/70">
              <Link
                to={`/learn/${item.id}`}
                className="group flex items-center gap-4 p-2 transition-colors duration-300 hover:bg-primary-500/[0.04] sm:gap-5"
              >
                <img
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="aspect-square w-24 shrink-0 object-cover sm:w-32 lg:w-36"
                />

                <div className="min-w-0 flex-1 text-start">
                  <h3 className="font-display text-lg font-bold leading-snug text-base-dark/80 sm:text-xl lg:text-2xl">
                    {item.title[lang]}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-base-dark/60 sm:text-base">
                    {item.description[lang]}
                  </p>
                </div>

                <ChevronRight
                  className="size-4 shrink-0 text-primary-500 transition-transform duration-300 rtl:-scale-x-100 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
