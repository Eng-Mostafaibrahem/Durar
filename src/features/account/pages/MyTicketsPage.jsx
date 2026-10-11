import { useTranslation } from 'react-i18next';
import { HiOutlineTicket } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { paths } from '../../../lib/paths.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate, formatDateTime } from '../../../utils/formatDate.js';
import { useMyTickets } from '../../tickets/hooks/useTickets.js';

function ticketName(ticket, t) {
  const itemNames = Array.isArray(ticket.items)
    ? ticket.items
        .map((item) => item.ticket_name ?? item.ticket?.name ?? item.name)
        .filter((name) => typeof name === 'string' && name.trim())
    : [];
  const name =
    ticket.ticket?.name ??
    ticket.ticket_name ??
    ticket.ticket_type?.name ??
    ticket.name ??
    ticket.title ??
    [...new Set(itemNames)].join('، ');

  return typeof name === 'string' && name.trim() ? name : t('tickets:ticket.regularType');
}

function ticketQuantity(ticket) {
  const quantity = Number(ticket.quantity ?? ticket.ticket_quantity);
  if (Number.isFinite(quantity) && quantity > 0) return quantity;

  return Array.isArray(ticket.items)
    ? ticket.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
    : 1;
}

export default function MyTicketsPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyTickets({});
  const tickets = (data?.pages ?? []).flatMap((page) => page.items ?? []);

  return (
    <>
      <Seo title={t('account:tickets')} description={t('account:ticketsList.emptyHint')} noIndex />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-base-dark">{t('account:tickets')}</h1>
          <p className="mt-1 text-sm text-hue-500">{t('account:ticketsList.description')}</p>
        </div>

        {isPending ? (
          <div className="flex flex-col gap-4" aria-hidden="true">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={HiOutlineTicket}
            title={t('account:ticketsList.error')}
            action={
              <Button variant="outline" onClick={() => refetch()}>
                {t('common:actions.retry')}
              </Button>
            }
          />
        ) : tickets.length === 0 ? (
          <EmptyState
            icon={HiOutlineTicket}
            title={t('account:ticketsList.empty')}
            description={t('account:ticketsList.emptyHint')}
            action={<Button to={paths.tickets}>{t('tickets:form.submit')}</Button>}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket, index) => {
              const reference =
                ticket.order_number ??
                ticket.booking_number ??
                ticket.booking_id ??
                ticket.reference ??
                ticket.id;
              const firstItem = Array.isArray(ticket.items) ? ticket.items[0] : null;
              const date =
                ticket.event_datetime ??
                ticket.event_at ??
                ticket.visit_date ??
                firstItem?.event_datetime ??
                firstItem?.ticket?.event_datetime;
              const createdAt = ticket.created_at ?? ticket.booked_at;
              const total = ticket.total ?? ticket.total_price ?? ticket.amount;

              return (
                <article
                  key={ticket.id ?? ticket.booking_id ?? reference ?? index}
                  className="flex flex-col gap-4 rounded-2xl border border-border-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-500/10 text-secondary-700">
                      <HiOutlineTicket aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-base-dark" dir="auto">
                        {ticketName(ticket, t)}
                      </h2>
                      {reference != null && (
                        <p className="mt-1 text-xs text-hue-500" dir="ltr">
                          {t('account:ticketsList.reference')}: {reference}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-hue-500">
                        {t('account:ticketsList.quantity', { count: ticketQuantity(ticket) })}
                      </p>
                      {(date || createdAt) && (
                        <p className="mt-1 text-sm text-hue-500">
                          {t(
                            date ? 'account:ticketsList.visitDate' : 'account:ticketsList.bookedAt',
                          )}
                          {': '}
                          {date
                            ? formatDateTime(date, { language })
                            : formatDate(createdAt, { language })}
                        </p>
                      )}
                    </div>
                  </div>

                  {total != null && (
                    <p className="shrink-0 font-sans font-bold text-primary-700">
                      {formatCurrency(total, { language })}
                    </p>
                  )}
                </article>
              );
            })}

            {hasNextPage && (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
              >
                {t('account:ticketsList.loadMore')}
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
