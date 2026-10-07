import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineTicket } from 'react-icons/hi2';
import { Button } from '../../../components/ui/Button.jsx';
import { paths } from '../../../lib/paths.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { cn } from '../../../utils/cn.js';
import { useTickets } from '../../tickets/hooks/useTickets.js';
import { normalizeTicket } from '../../tickets/lib/ticket.js';
import bannerImage from '../../../assets/museum3.webp';

export function MuseumTicketBanner({ className }) {
  const { t, i18n } = useTranslation('museum');
  const language = i18n.resolvedLanguage || 'ar';
  const tickets = useTickets();

  const startingPrice = useMemo(() => {
    const items = (tickets.data?.items ?? []).map((record) => normalizeTicket(record, language));
    const prices = items.map((ticket) => ticket.finalPrice).filter((price) => price > 0);
    return prices.length ? Math.min(...prices) : 0;
  }, [tickets.data, language]);

  return (
    <section className={cn('bg-bg-main px-4 pb-16 sm:px-6 sm:pb-20', className)}>
      <div className="relative isolate mx-auto flex min-h-[clamp(15rem,32vw,22rem)] max-w-screen-2xl items-center justify-center overflow-hidden rounded-3xl">
        <img
          src={bannerImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#5c0b1c]/85" />

        <div className="flex max-w-2xl flex-col items-center px-6 py-14 text-center text-white">
          <span className="grid size-12 place-items-center rounded-full bg-white/10">
            <HiOutlineTicket aria-hidden="true" className="size-6" />
          </span>

          <p className="mt-4 text-sm font-semibold tracking-wide text-white/70">
            {t('banner.eyebrow')}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            {t('banner.title')}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
            {t('banner.description')}
          </p>

          {startingPrice > 0 && (
            <p className="mt-4 text-sm font-medium text-white/80">
              {t('banner.from', { price: formatCurrency(startingPrice, { language }) })}
            </p>
          )}

          <Button
            to={paths.ticket}
            variant="burgundy"
            size="lg"
            className="mt-6 bg-primary-500 hover:bg-primary-600"
          >
            {t('banner.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}