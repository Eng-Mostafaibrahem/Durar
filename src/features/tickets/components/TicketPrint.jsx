import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineTicket, HiPrinter } from 'react-icons/hi2';
import { Button } from '../../../components/ui/Button.jsx';
import { ScaledTicket } from './MuseumTicket.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

const MAX_PRINTED_TICKETS = 12;

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 10mm; }
  .ticket,
  .ticket * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @media print {
    body * { visibility: hidden; }
    .print-area,
    .print-area * { visibility: visible; }
    .print-area {
      position: absolute;
      inset: 0;
      margin: 0;
    }
    .no-print { display: none !important; }
    .print-area .ticket-scaler { height: auto !important; }
    .print-area .ticket-scaler-inner { transform: none !important; }
    .print-area .ticket { zoom: 0.9; }
    .ticket-print-item {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 8mm;
    }
  }
`;

function expandTickets(reservation) {
  const reference = reservation.reference || String(reservation.bookingId || 'DURAR');
  const list = [];

  for (const item of reservation.items ?? []) {
    const quantity = Math.max(Number(item.quantity) || 1, 1);
    const price =
      Number(item.unit_price) ||
      (Number.isFinite(Number(item.total)) ? Number(item.total) / quantity : 0);

    for (let i = 0; i < quantity && list.length < MAX_PRINTED_TICKETS; i++) {
      list.push({
        number: reference,
        date: reservation.eventAt,
        typeName: item.ticket_name || '',
        price,
      });
    }
  }

  if (list.length === 0) {
    list.push({
      number: reference,
      date: reservation.eventAt,
      typeName: '',
      price: Number(reservation.total) || 0,
    });
  }

  return list;
}

export function TicketPrint({ reservation, onBookAnother }) {
  const { t, i18n } = useTranslation('tickets');
  const language = i18n.resolvedLanguage || 'ar';

  const tickets = useMemo(() => expandTickets(reservation), [reservation]);

  const totalUnits = useMemo(
    () =>
      (reservation.items ?? []).reduce(
        (sum, item) => sum + Math.max(Number(item.quantity) || 1, 1),
        0,
      ),
    [reservation],
  );
  const hiddenTicketCount = Math.max(0, totalUnits - tickets.length);

  return (
    <section className="w-full max-w-5xl">
      <style>{PRINT_CSS}</style>

      <div className="no-print mb-6 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-100 text-secondary-700">
          <HiOutlineTicket aria-hidden="true" className="size-7" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-base-dark">
          {t('ticket.readyTitle')}
        </h1>
        <p className="mt-2 text-sm text-hue-500">{t('ticket.readyDescription')}</p>
        <p className="mt-1 text-sm font-semibold text-primary-700" dir="ltr">
          {reservation.reference}
        </p>
      </div>

      <div className="print-area space-y-6" aria-label={t('ticket.ariaLabel')}>
        {tickets.map((ticket, index) => (
          <div key={`${ticket.number}-${index}`} className="ticket-print-item">
            <ScaledTicket
              ticket={ticket}
              variant={index % 2 === 0 ? 'burgundy' : 'green'}
              location={t('ticket.location')}
            />
          </div>
        ))}

        {hiddenTicketCount > 0 && (
          <p className="text-center text-sm font-semibold text-hue-500">
            {t('ticket.moreItems', { count: hiddenTicketCount })}
          </p>
        )}
      </div>

      <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => window.print()} className="gap-2">
          <HiPrinter aria-hidden="true" className="size-5" />
          {t('ticket.print')}
        </Button>

        {reservation.redirectUrl && (
          <Button href={reservation.redirectUrl} variant="emerald">
            {t('ticket.payNow')}
          </Button>
        )}

        <Button variant="outline" onClick={onBookAnother}>
          {t('ticket.bookAnother')}
        </Button>
      </div>

      <p className="no-print mt-4 text-center text-xs text-hue-500">
        {t('ticket.presentAtDoor')} · {formatCurrency(reservation.total, { language })} ·{' '}
        {t('ticket.currency')}
      </p>
    </section>
  );
}