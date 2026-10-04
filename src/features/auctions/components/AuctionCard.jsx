import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HiOutlineClock } from 'react-icons/hi2';
import { paths } from '../../../lib/paths.js';
import { apiClient } from '../../../lib/apiClient.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { Countdown } from '../../../components/ui/Countdown.jsx';
import { AuctionImage } from './AuctionImage.jsx';
import { AuctionStatusBadge } from './AuctionStatusBadge.jsx';
import curencyLogo from '../../../assets/Riyal-Icon.png';

export function AuctionCard({ auction, language = 'ar' }) {
  const { t } = useTranslation();
  const status = auction.status;
  const { serverAt, receivedAt } = apiClient.getServerClock();
  const countdownTarget = status === 'live' ? auction.endsAt : status === 'upcoming' ? auction.startsAt : null;

  return (
    <Link
      to={paths.auctionDetails(auction.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border-500/20 bg-white transition-[transform,box-shadow] duration-300 ease-(--ease-luxury) hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10"
    >
      <div className="relative aspect-[4/3]">
        <AuctionImage auction={auction} className="h-full w-full rounded-none" />
        <AuctionStatusBadge status={status} className="absolute end-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display text-lg font-bold text-base-dark">{auction.name}</h3>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-sans text-lg font-bold text-primary-700">
            {formatCurrency(auction.currentPrice, { language })}
          </span>
          <img src={curencyLogo} alt="" decoding="async" className="size-4" />
        </div>
        {status === 'live' && (
          <p className="mt-1 text-xs text-hue-500">{t('auctions:currentBid')}</p>
        )}

        {countdownTarget ? (
          <div className="mt-4 rounded-xl bg-hue-100/70 px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-xs text-hue-500">
              <HiOutlineClock aria-hidden="true" className="size-3.5" />
              {status === 'live' ? t('auctions:endsIn') : t('auctions:startsIn')}
            </p>
            <Countdown
              target={countdownTarget}
              serverTimestamp={serverAt}
              receivedAt={receivedAt}
              compact
              className="mt-1"
            />
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-hue-100/70 px-3 py-2.5 text-center text-sm font-medium text-hue-500">
            {t('auctions:ended')}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-100 pt-3 text-xs text-hue-500">
          <span>
            {t('auctions:nextBid')}: {formatCurrency(auction.minimumNextBid, { language })}
          </span>
          <span>{t('auctions:bidsCount', { count: auction.bidsCount })}</span>
        </div>
      </div>
    </Link>
  );
}