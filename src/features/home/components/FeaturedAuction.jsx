import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { Container } from '../../../components/Container.jsx';
import { Skeleton, SkeletonText } from '../../../components/ui/Skeleton.jsx';
import { Countdown } from '../../../components/ui/Countdown.jsx';
import { apiClient } from '../../../lib/apiClient.js';
import { paths } from '../../../lib/paths.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { cn } from '../../../utils/cn.js';
import { AuctionStatusBadge } from '../../auctions/components/AuctionStatusBadge.jsx';
import { useFeaturedAuction } from '../hooks/useFeaturedAuction.js';
import curencyLogo from '../../../assets/Riyal-Icon.png';
import cardCover from '../../../assets/specialCard.png';

function Stat({ label, children }) {
  return (
    <div className="flex flex-col gap-1 text-start">
      <span className="text-xs text-base-dark/60">{label}</span>
      <span className="font-display text-lg font-semibold text-primary-500">{children}</span>
    </div>
  );
}

export function FeaturedAuction() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const query = useFeaturedAuction();
  const { serverAt, receivedAt } = apiClient.getServerClock();

  const auction = query.data;
  const isLive = auction?.status === 'live';
  const isUpcoming = auction?.status === 'upcoming';
  const countdownTarget = isLive ? auction.endsAt : isUpcoming ? auction.startsAt : null;

  if (auction === null) return null;

  return (
    <section className="py-16 text-white sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          {query.isPending ? (
            <Skeleton className="aspect-[4/3] rounded-2xl" />
          ) : auction.image ? (
            <div className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={auction.image}
                alt={auction.name}
                decoding="async"
                loading="lazy"
                className="h-full w-full object-cover scale-85"
              />
              <img
                src={cardCover}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full z-[-1] object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
              />
              <AuctionStatusBadge status={auction.status} className="absolute end-3 top-3" />
            </div>
          ) : (
            <div
              className={cn(
                'relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-hue-100',
              )}
            >
              <FaGem aria-hidden="true" className="size-24 text-white/40" />
              <AuctionStatusBadge status={auction.status} className="absolute end-3 top-3" />
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <article className="w-full max-w-xl bg-bg-main p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-widest text-primary-500">
              {t('home:auction.title')}
            </p>

            <h2 className="mt-2 font-display text-3xl font-bold text-base-dark sm:text-4xl">
              {query.isPending ? <SkeletonText lines={1} className="max-w-sm" /> : auction.name}
            </h2>

            {!query.isPending && (
              <>
                <div className="mt-6 grid grid-cols-3 gap-4 border-y border-base-dark/20 py-5">
                  <Stat label={t('home:auction.startingPrice')}>
                    <span className="flex items-baseline gap-1">
                      {formatCurrency(auction.startingPrice, { language })}
                      <img src={curencyLogo} alt="" className="size-3.5" />
                    </span>
                  </Stat>
                  <Stat label={t('home:auction.currentBid')}>
                    <span className="flex items-baseline gap-1">
                      {formatCurrency(auction.currentPrice, { language })}
                      <img src={curencyLogo} alt="" className="size-3.5" />
                    </span>
                  </Stat>
                  <Stat label={t('auctions:bidsLabel')}>
                    <span dir="auto">{auction.bidsCount}</span>
                  </Stat>
                </div>

                {countdownTarget ? (
                  <div className="flex items-center justify-between gap-4 border-b border-base-dark/20 py-5">
                    <span className="text-sm text-base-dark/60">
                      {isLive ? t('home:auction.endsIn') : t('auctions:startsIn')}
                    </span>
                    <Countdown
                      target={countdownTarget}
                      serverTimestamp={serverAt}
                      receivedAt={receivedAt}
                      compact
                      className="text-primary-500"
                    />
                  </div>
                ) : (
                  <p className="border-b border-base-dark/20 py-5 text-sm font-medium text-hue-500">
                    {t('auctions:ended')}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button to={paths.auctionDetails(auction.id)} variant="emerald" size="fluid">
                    {t('home:auction.bidNow')}
                    <ChevronRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  </Button>
                  <Button to={paths.auctions} variant="burgundy" size="fluid">
                    {t('home:auction.details')}
                  </Button>
                </div>
              </>
            )}
          </article>
        </div>
      </Container>
    </section>
  );
}
