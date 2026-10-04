import { useTranslation } from 'react-i18next';
import { formatDate, formatDateTime } from '../../../utils/formatDate.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import curencyLogo from '../../../assets/Riyal-Icon.webp';

export function BidHistoryTitle({ count }) {
  const { t } = useTranslation();
  return (
    <h3 className="font-display text-xl font-bold text-base-dark">
      {t('auctions:bidHistory')}
      <span className="ms-2 text-sm font-medium text-hue-500">
        {t('auctions:bidsCount', { count })}
      </span>
    </h3>
  );
}

export function BidHistory({ bids = [], isLoading = false, language = 'ar' }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <ul className="space-y-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-12 rounded-xl" />
        ))}
      </ul>
    );
  }

  if (bids.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-300 px-4 py-6 text-center text-sm text-hue-500">
        {t('auctions:noBidsYet')}
      </p>
    );
  }

  return (
    <ol className="max-h-80 space-y-2 overflow-y-auto pe-1">
      {bids.map((bid) => (
        <li
          key={bid.id ?? `${bid.createdAt}-${bid.amount}`}
          className="flex items-center justify-between gap-3 rounded-xl border border-border-100 bg-white px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-hue-100 text-xs font-bold text-hue-500"
              dir="auto"
            >
              {bid.bidder}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-base-dark" dir="auto">
                {bid.bidder}
              </p>
              <p className="text-xs text-hue-500">
                {bid.createdAt ? formatBidTime(bid.createdAt, language) : ''}
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-baseline gap-1.5 font-sans font-bold text-primary-700">
            {formatCurrency(bid.amount, { language })}
            <img src={curencyLogo} alt="" className="size-4" />
          </span>
        </li>
      ))}
    </ol>
  );
}

function formatBidTime(value, language) {
  const withinHours = Math.abs(new Date(value).getTime() - Date.now()) < 24 * 60 * 60 * 1000;
  return withinHours
    ? formatDateTime(value, { language })
    : formatDate(value, { language });
}