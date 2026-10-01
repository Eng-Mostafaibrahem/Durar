import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn.js';

const VARIANTS = {
  live: 'bg-secondary-100 text-secondary-700',
  upcoming: 'bg-primary-100 text-primary-700',
  ended: 'bg-hue-100 text-hue-500',
};

const LABEL_KEYS = {
  live: 'auctions:badge.live',
  upcoming: 'auctions:badge.upcoming',
  ended: 'auctions:badge.ended',
};

export function AuctionStatusBadge({ status, className }) {
  const { t } = useTranslation();
  const label = t(LABEL_KEYS[status] ?? 'auctions:badge.live');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        VARIANTS[status] ?? VARIANTS.live,
        className,
      )}
    >
      {status === 'live' && (
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {label}
    </span>
  );
}