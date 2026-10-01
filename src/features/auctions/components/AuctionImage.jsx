import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { cn } from '../../../utils/cn.js';
import { Badge } from '../../../components/ui/Badge.jsx';
import cardCover from '../../../assets/card-3bg.jpg';

export function AuctionImage({ auction, className }) {
  const { t } = useTranslation();

  return (
    <div className={cn('relative isolate overflow-hidden rounded-xl', className)}>
      <img
            src={cardCover}
            alt=""
            aria-hidden="true"
            className="absolute z-[-1] inset-0 size-full object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
          />
      {auction.image ? (
        <img
          src={auction.image}
          alt={auction.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-hue-100">
          <FaGem aria-hidden="true" className="size-16 text-white/60" />
        </div>
      )}
      <Badge variant="gold" size="sm" className="absolute start-2 top-2 !rounded-[6px]">
        {t('auctions:badge.auction')}
      </Badge>
    </div>
  );
}