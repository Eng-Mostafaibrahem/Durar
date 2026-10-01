import { useTranslation } from 'react-i18next';
import { HiLanguage } from 'react-icons/hi2';
import { languages } from '../locales/index.js';
import { cn } from '../utils/cn.js';

export function LanguageSwitcher({ className, compact = false }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage || 'ar';

  return (
    <div
      role="group"
      aria-label={t('common:a11y.switchLanguage')}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border-100 bg-white p-0.5',
        className,
      )}
    >
      {!compact && (
        <HiLanguage
          aria-hidden="true"
          className="mx-1 size-4 shrink-0 text-hue-500 rtl:rotate-180"
        />
      )}

      {languages.map((language) => {
        const isActive = language.code === current;

        return (
          <button
            key={language.code}
            type="button"
            lang={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              isActive
                ? 'bg-primary-500 text-white'
                : 'text-hue-500 hover:bg-hue-100 hover:text-base-dark',
            )}
          >
            {compact ? language.shortLabel : language.label}
          </button>
        );
      })}
    </div>
  );
}
