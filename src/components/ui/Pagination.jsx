import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn.js';
import { formatNumber } from '../../utils/formatNumber.js';

export function Pagination({ page, lastPage, onPageChange, className }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';

  if (!lastPage || lastPage <= 1) return null;

  return (
    <nav
      aria-label={t('common:actions.next')}
      className={cn('flex items-center justify-center gap-2', className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('common:actions.previous')}
        className="grid size-10 place-items-center rounded-full border border-border-100 text-hue-500 transition-colors hover:border-border-300 hover:text-base-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
      </button>

      <ul className="flex items-center gap-1">
        {buildPages(page, lastPage).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className="px-1 text-hue-300">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  'grid size-10 place-items-center rounded-full text-sm tabular-nums transition-colors',
                  item === page
                    ? 'bg-primary-500 text-white'
                    : 'text-hue-500 hover:bg-hue-100 hover:text-base-dark',
                )}
              >
                {formatNumber(item, { language })}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= lastPage}
        aria-label={t('common:actions.next')}
        className="grid size-10 place-items-center rounded-full border border-border-100 text-hue-500 transition-colors hover:border-border-300 hover:text-base-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}

function buildPages(page, lastPage) {
  const pages = new Set([1, lastPage, page, page - 1, page + 1]);
  const sorted = [...pages].filter((item) => item >= 1 && item <= lastPage).sort((a, b) => a - b);
  const result = [];
  let previous = 0;

  for (const item of sorted) {
    if (previous && item - previous > 1) result.push('gap');
    result.push(item);
    previous = item;
  }

  return result;
}
