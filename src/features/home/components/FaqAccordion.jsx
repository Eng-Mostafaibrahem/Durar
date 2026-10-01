import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn.js';
import { FAQ_ITEMS, FAQ_TITLE } from '../../faq/faqContent.js';

export function FaqSection({ className }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const [open, setOpen] = useState(0);

  return (
    <section className={cn('bg-bg-main py-12 sm:py-16', className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center font-display text-3xl font-bold text-base-dark/70 sm:text-4xl">
          {FAQ_TITLE[lang]}
        </h2>

        <ul className="mt-8 flex flex-col gap-4">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q.en}
                className="overflow-hidden rounded-md border border-primary-500 bg-[#5c0b1c] text-white"
              >
                <h3 className='text-white'>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-medium sm:text-base"
                  >
                    <span>{item.q[lang]}</span>
                    <ChevronDown
                      className={cn(
                        'size-4 shrink-0 transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                {/* grid-rows بيعمل أنيميشن للارتفاع من غير ما نعرف الارتفاع */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="mx-5 border-t border-white/20 pb-5 pt-4 text-sm leading-7 text-white/90 sm:text-base">
                      {item.a[lang]}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}