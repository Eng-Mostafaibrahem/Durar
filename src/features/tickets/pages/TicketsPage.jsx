import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { paths } from '../../../lib/paths.js';
import museumImage from '../../../assets/museum.webp';
import { useBookTickets, useTickets } from '../hooks/useTickets.js';
import { TicketBookingForm } from '../components/TicketBookingForm.jsx';
import { buildReservation, normalizeTickets } from '../lib/ticket.js';

export default function TicketsPage() {
  const { t, i18n } = useTranslation('tickets');
  const navigate = useNavigate();
  const language = i18n.resolvedLanguage || 'ar';
  const ticketsQuery = useTickets();
  const bookingMutation = useBookTickets();

  const tickets = useMemo(
    () => normalizeTickets(ticketsQuery.data?.items, language),
    [ticketsQuery.data, language],
  );

  const handleBooking = async (values) => {
    const booking = await bookingMutation.mutateAsync(values);
    const selectedIds = new Set(values.items.map((item) => item.ticket_id));

    const reservation = buildReservation({
      booking,
      form: values,
      selectedTickets: tickets.filter((ticket) => selectedIds.has(ticket.id)),
    });

    navigate(paths.ticketConfirmation, { state: { reservation } });
  };

  return (
    <>
      <Seo title={t('pageTitle')} description={t('pageDescription')} />
      <Container className="py-10 sm:py-16">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-border-100 bg-white shadow-sm md:grid-cols-2">
          <div className="relative min-h-64 md:min-h-full">
            <img
              src={museumImage}
              alt={t('heroImageAlt')}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
              <p className="flex items-center gap-2 text-sm">
                <HiOutlineMapPin aria-hidden="true" className="size-5" />
                {t('location')}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{t('title')}</h1>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/85">{t('description')}</p>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <TicketBookingForm
              tickets={tickets}
              isLoading={ticketsQuery.isLoading}
              isError={ticketsQuery.isError}
              loadError={ticketsQuery.error}
              onRetry={() => ticketsQuery.refetch()}
              onSubmit={handleBooking}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
