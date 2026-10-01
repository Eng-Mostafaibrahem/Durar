import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { paths } from '../../../lib/paths.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Countdown } from '../../../components/ui/Countdown.jsx';

export function AuctionPanel({ product }) {
  const { t, i18n } = useTranslation();
  const auction = product.auction ?? product;

  const language = i18n.resolvedLanguage || 'ar';
  const currentPrice = Number(auction.current_price ?? auction.current_bid ?? 0);
  const minBidIncrement = Number(auction.min_bid_increment ?? 0);
  const nextBid = currentPrice + minBidIncrement;
  const auctionId = auction.id;

  const image = resolveImageUrl(product.image ?? product.main_image?.[0]);

  return (
    <article className="overflow-hidden rounded-2xl border border-border-500/20 bg-bg-secondary">
      <div className="relative aspect-[16/10] bg-silk-fallback">
        {image && (
          <img
            src={image}
            alt={product.name}
            width={640}
            height={400}
            className="h-full w-full object-cover"
          />
        )}
        <Badge variant="warning" className="absolute start-3 top-3">
          {t('auctions:tabs.live')}
        </Badge>
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-hue-500">
            {t('products:auctionItem')}
          </span>
          <h1 className="font-display text-2xl font-bold text-base-dark">{product.name}</h1>
          <p className="text-sm text-hue-500">{t('products:auctionPanel')}</p>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4">
            <dt className="text-xs text-hue-500">{t('auctions:currentBid')}</dt>
            <dd className="mt-1 text-xl font-bold text-primary-700">
              {formatCurrency(currentPrice, { language })}
            </dd>
          </div>
          <div className="rounded-xl bg-white p-4">
            <dt className="text-xs text-hue-500">{t('auctions:nextBid')}</dt>
            <dd className="mt-1 text-xl font-bold text-base-dark">
              {formatCurrency(nextBid, { language })}
            </dd>
          </div>
        </dl>

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs text-hue-500">{t('auctions:endsIn')}</p>
          <Countdown target={auction.ends_at} className="mt-2" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button to={paths.auctionDetails(auctionId)} size="lg" className="flex-1 min-w-44">
            {t('auctions:placeBid')}
          </Button>
          <Button
            to={paths.auctionDetails(auctionId)}
            variant="outline"
            size="lg"
            className="flex-1 min-w-44"
          >
            {t('products:viewAuction')}
          </Button>
        </div>
        <p className="text-xs text-hue-500">
          <Link to={paths.login} className="underline hover:text-primary-500">
            {t('auctions:loginRequired')}
          </Link>
        </p>
      </div>
    </article>
  );
}
