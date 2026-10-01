import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Countdown } from '../../../components/ui/Countdown.jsx';
import { paths } from '../../../lib/paths.js';
import { localized } from '../../../lib/response.js';
import { resolveImageUrl } from '../../../utils/media.js';

export function OfferBanner({ banner }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const title = localized(banner, ['title'], language).title;
  const image = resolveImageUrl(banner?.image);
  const coupon = banner?.coupon;
  const expiresAt = coupon?.expires_at;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary-700 text-white">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 px-6 py-8 sm:px-10">
        <div className="max-w-xl">
          {coupon?.code ? (
            <Badge variant="gold" size="sm">
              {coupon.code}
            </Badge>
          ) : null}
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            {title || t('offers:title')}
          </h2>
          {coupon?.code ? (
            <p className="mt-1 text-sm text-white/80">{t('offers:couponHint')}</p>
          ) : null}
        </div>

        {expiresAt ? (
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs tracking-wide text-white/70">{t('offers:endsIn')}</p>
            <Countdown target={expiresAt} compact className="mt-1 text-white" />
          </div>
        ) : null}

        <Button to={paths.shop} variant="primary" size="md">
          {t('offers:shopAll')}
        </Button>
      </div>
    </div>
  );
}