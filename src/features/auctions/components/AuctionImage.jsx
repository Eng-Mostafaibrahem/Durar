import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { cn } from '../../../utils/cn.js';
import { Badge } from '../../../components/ui/Badge.jsx';
import cardCover from '../../../assets/card-bg/card-3bg.webp';

export function AuctionImage({ auction, image = auction?.image, showBadge = true, className }) {
  const { t } = useTranslation();

  return (
    <div className={cn('relative isolate overflow-hidden rounded-xl', className)}>
      <img
        src={cardCover}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-[-1] size-full object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
      />

      {image ? (
        <img
          src={image}
          alt={auction?.name ?? ''}
          loading="lazy"
          className="h-full w-full object-cover scale-75"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-hue-100">
          <FaGem aria-hidden="true" className="size-16 text-white/60" />
        </div>
      )}
      {showBadge && (
        <Badge variant="gold" size="sm" className="absolute start-2 top-2 !rounded-[6px]">
          {t('auctions:badge.auction')}
        </Badge>
      )}
    </div>
  );
}