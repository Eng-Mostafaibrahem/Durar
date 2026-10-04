import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HiCheckCircle,
  HiExclamationTriangle,
  HiOutlineHome,
} from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton, SkeletonText } from '../../../components/ui/Skeleton.jsx';
import { Countdown } from '../../../components/ui/Countdown.jsx';
import { apiClient } from '../../../lib/apiClient.js';
import { paths } from '../../../lib/paths.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDateTime } from '../../../utils/formatDate.js';
import { useAuction, useAuctionBids } from '../hooks/useAuctions.js';
import { normalizeBid } from '../lib/auction.js';
import { AuctionStatusBadge } from '../components/AuctionStatusBadge.jsx';
import { BidForm } from '../components/BidForm.jsx';
import { BidHistory, BidHistoryTitle } from '../components/BidHistory.jsx';
import { WonAuctionCheckout } from '../components/WonAuctionCheckout.jsx';
import { AuctionImage } from '../components/AuctionImage.jsx';
import curencyLogo from '../../../assets/Riyal-Icon.png';

export default function AuctionDetailsPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const { id } = useParams();

  const auctionQuery = useAuction(id);
  const bidsQuery = useAuctionBids(id, {
    enabled: Boolean(auctionQuery.data),
    poll: auctionQuery.data?.status === 'live',
  });

  const [imageIndex, setImageIndex] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { serverAt, receivedAt } = apiClient.getServerClock();

  const auction = auctionQuery.data;

  const bids = useMemo(() => {
    if (bidsQuery.data) return bidsQuery.data;
    return auction ? auction.bids.map((bid) => normalizeBid(bid)) : [];
  }, [bidsQuery.data, auction]);

  const images = useMemo(() => {
    if (!auction) return [];
    return auction.gallery.length ? auction.gallery : auction.image ? [auction.image] : [];
  }, [auction]);

  const currentImage = images[Math.min(imageIndex, Math.max(images.length - 1, 0))] ?? auction?.image ?? null;

  const status = auction?.status;
  const isLive = status === 'live';
  const isEnded = status === 'ended';
  const isWon = auction?.isWinner === true;
  const isHighestBidder = auction?.isHighestBidder === true;

  const countdownTarget = isLive ? auction?.endsAt : auction?.startsAt;

  return (
    <>
      <Seo title={auction?.name ?? t('auctions:title')} description={t('auctions:subtitle')} />

      <Container className="py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-hue-500">
          <Link to={paths.home} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary-500">
            <HiOutlineHome aria-hidden="true" className="size-4" />
            {t('nav:home')}
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={paths.auctions} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary-500">
            {t('auctions:title')}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-base-dark">{auction?.name}</span>
        </nav>

        {auctionQuery.isPending ? (
          <AuctionDetailsSkeleton />
        ) : auctionQuery.isError ? (
          <EmptyState
            icon={HiExclamationTriangle}
            title={t('common:states.error')}
            description={t('common:states.noResults')}
            action={
              <Button variant="outline" onClick={() => auctionQuery.refetch()}>
                {t('common:actions.retry')}
              </Button>
            }
          />
        ) : auction ? (
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_24rem]">
            <div className="min-w-0">
              <AuctionImage
                auction={auction}
                image={currentImage}
                showBadge={false}
                className="aspect-[4/3] w-full rounded-2xl bg-hue-100"
              />

              {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      aria-label={t('common:a11y.galleryThumbnails')}
                      className={index === imageIndex ? '' : 'opacity-70 transition-opacity hover:opacity-100'}
                    >
                      <img
                        src={image}
                        alt=""
                        className="size-20 rounded-lg border border-border-100 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <AuctionStatusBadge status={status} />
                <h1 className="mt-3 font-display text-3xl font-bold text-base-dark lg:text-4xl">
                  {auction.name}
                </h1>
                {auction.description ? (
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-base-dark/80">
                    {auction.description}
                  </p>
                ) : null}

                {auction.metadata && Object.keys(auction.metadata).length > 0 && (
                  <div className="mt-8">
                    <h2 className="font-display text-xl font-bold text-base-dark">
                      {t('auctions:specs.title')}
                    </h2>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                      {Object.entries(auction.metadata).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-xl border border-border-100 bg-bg-secondary px-4 py-3"
                        >
                          <dt className="text-xs text-hue-500">
                            {t(`auctions:specs.${key}`, { defaultValue: key })}
                          </dt>
                          <dd className="mt-1 font-sans font-semibold text-base-dark" dir="auto">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-500/15 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <AuctionStatusBadge status={status} />
                  {isHighestBidder && isLive && <Badge variant="success">{t('auctions:status.highestBidder')}</Badge>}
                </div>

                {countdownTarget ? (
                  <div className="mt-4 rounded-xl bg-bg-secondary px-4 py-3">
                    <p className="text-xs text-hue-500">
                      {isLive ? t('auctions:endsIn') : t('auctions:startsIn')}
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
                  <p className="mt-4 rounded-xl bg-hue-100/70 px-4 py-3 text-center text-sm font-semibold text-hue-500">
                    {t('auctions:ended')}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-sans text-4xl font-bold text-primary-700">
                    {formatCurrency(auction.currentPrice, { language })}
                  </span>
                  <img src={curencyLogo} alt="" className="size-6" />
                  <span className="text-sm text-hue-500">{t('auctions:currentBid')}</span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border-100 py-4 text-center">
                  <div>
                    <p className="text-xs text-hue-500">{t('auctions:startingPrice')}</p>
                    <p className="mt-1 font-sans font-bold text-base-dark">
                      {formatCurrency(auction.startingPrice, { language })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-hue-500">{t('auctions:nextBid')}</p>
                    <p className="mt-1 font-sans font-bold text-base-dark">
                      {formatCurrency(auction.minimumNextBid, { language })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-hue-500">{t('auctions:bidsLabel')}</p>
                    <p className="mt-1 font-sans font-bold text-base-dark">{auction.bidsCount}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between text-xs text-hue-500">
                    <span>
                      {auction.startsAt
                        ? `${t('auctions:schedule.starts')} ${formatDateTime(auction.startsAt, { language })}`
                        : ''}
                    </span>
                    <span>
                      {auction.endsAt
                        ? `${t('auctions:schedule.ends')} ${formatDateTime(auction.endsAt, { language })}`
                        : ''}
                    </span>
                  </div>

                  {isWon && (
                    <div className="mb-4 rounded-xl border border-success-500/30 bg-success-100/60 p-4">
                      <p className="flex items-start gap-2 text-sm font-semibold text-success-500">
                        <HiCheckCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                        {t('auctions:wonNotice')}
                      </p>
                      <Button
                        variant="primary"
                        className="mt-3 w-full"
                        onClick={() => setCheckoutOpen(true)}
                      >
                        {t('auctions:completePayment')}
                      </Button>
                    </div>
                  )}

                  {isLive ? (
                    auction.isBiddable ? (
                      <BidForm auction={auction} language={language} />
                    ) : (
                      <p className="rounded-xl border border-dashed border-border-300 bg-hue-100/40 px-4 py-3 text-center text-sm text-hue-500">
                        {t('auctions:biddingPaused')}
                      </p>
                    )
                  ) : (
                    <p className="rounded-xl border border-dashed border-border-300 bg-hue-100/40 px-4 py-3 text-center text-sm text-hue-500">
                      {isEnded ? t('auctions:endedNotice') : t('auctions:notStartedYet')}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-border-500/15 bg-white p-6">
                <BidHistoryTitle count={auction.bidsCount} />
                <div className="mt-4">
                  <BidHistory bids={bids} isLoading={bidsQuery.isPending} language={language} />
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </Container>

      {auction?.isWinner && (
        <WonAuctionCheckout auction={auction} open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      )}
    </>
  );
}

function AuctionDetailsSkeleton() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_24rem]">
      <div>
        <Skeleton className="aspect-[4/3] rounded-2xl" />
        <div className="mt-8">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="mt-3 h-10 w-3/4 rounded-lg" />
          <SkeletonText lines={3} className="mt-4" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}