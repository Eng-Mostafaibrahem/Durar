import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import museumImage from '../../../assets/ticket.webp';
import { TICKET_W, TICKET_H, TICKET_COLORS, formatDate } from '../lib/ticketVisual.js';

function VerticalText({ x, top, size, weight = 400, color, children }) {
  const height = Math.round(size * 1.4);

  return (
    <div
      className="absolute whitespace-nowrap font-sans [transform-origin:0_0] [transform:rotate(-90deg)_translateX(-100%)]"
      style={{
        left: x - height / 2,
        top,
        height,
        lineHeight: `${height}px`,
        fontSize: size,
        fontWeight: weight,
        color,
      }}
    >
      {children}
    </div>
  );
}

/**
 * ticket = { number, date, typeName, price }
 * variant = "green" | "burgundy"
 */
export default function MuseumTicket({
  ticket,
  variant = 'green',
  image = museumImage,
  location,
  customerName,
}) {
  const { t, i18n } = useTranslation('tickets');
  const language = i18n.resolvedLanguage || 'ar';
  const isAr = language.startsWith('ar');
  const k = isAr ? 1 : 0.68;
  const color = TICKET_COLORS[variant] ?? TICKET_COLORS.green;
  const cream = TICKET_COLORS.cream;
  const dateText = formatDate(ticket.date, isAr) ?? t('ticket.noDate');
  const typeName = ticket.typeName || t('ticket.regularType');
  const priceText = `${formatCurrency(ticket.price, { language })} ${t('ticket.currency')}`;

  const details = [
    { Icon: FaMapMarkerAlt, label: null, text: location ?? t('ticket.location') },
    { Icon: FaCalendarAlt, label: t('ticket.dateLabel'), text: dateText },
    { Icon: FaClock, label: t('ticket.hoursLabel'), text: t('ticket.hours') },
  ];

  return (
    <div
      className="ticket relative h-[360px] w-[1000px] overflow-hidden bg-[color:var(--ticket-cream)] [direction:ltr] font-['Tajawal',sans-serif]"
      style={{
        '--ticket-color': color,
        '--ticket-cream': cream,
        '--ticket-image': `url(${image})`,
      }}
    >
      <div
        className="absolute left-[47.5px] top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-display font-bold text-[color:var(--ticket-color)]"
        style={{ fontSize: 30 * (isAr ? 1 : 0.7) }}
      >
        {typeName}
      </div>

      <div className="absolute left-[95px] top-0 h-full w-[628px] overflow-hidden rounded-s-[40px] bg-[#ffff] bg-[image:var(--ticket-image)] bg-contain bg-center bg-no-repeat ">
        <div className="absolute inset-0 bg-[color:var(--ticket-color)] [clip-path:polygon(0_0,410px_0,245px_100%,0_100%)]" />

        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="absolute right-[278px] top-[18px] whitespace-nowrap text-right font-display leading-[45px] text-[color:var(--ticket-cream)]"
        >
          <div className="font-medium" style={{ fontSize: 23 * k }}>
            {t('ticket.entry')}
          </div>
          <div className="font-bold" style={{ fontSize: 23 * k }}>
            {t('ticket.museum')}
          </div>
        </div>

        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="absolute right-[357px] top-[140px] flex flex-col items-start whitespace-nowrap font-display text-md text-[color:var(--ticket-cream)]"
        >
          {details.map(({ Icon, label, text }, i) => (
            <div key={i} className="flex h-[35px] items-center gap-3">
              <Icon size={17} className="shrink-0" />
              <span>
                {label && <span className="opacity-90">{label} </span>}
                <span className="font-bold">{text}</span>
              </span>
            </div>
          ))}
        </div>

        {customerName && (
          <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="absolute bottom-5 left-5 z-10 max-w-[245px] truncate font-display text-sm font-bold text-[color:var(--ticket-cream)]"
            title={customerName}
          >
            <span className="me-1 font-normal">{t('ticket.customerName')}</span>
            {customerName}
          </div>
        )}
      </div>

      <VerticalText x={767} top={29} size={20 * k} weight={500} color={color}>
        {t('ticket.entry')}
      </VerticalText>
      <VerticalText x={807} top={29} size={20 * k} weight={700} color={color}>
        {t('ticket.museum')}
      </VerticalText>
      <VerticalText x={852} top={29} size={20 * k} weight={500} color={color}>
        {`${t('ticket.price')} ${priceText}`}
      </VerticalText>

      <div className="absolute left-[900px] top-10 right-10 -translate-x-1/2 -translate-y-1/2 rotate-90 leading-none w-" >
        <Barcode
          value={ticket.number}
          width={1.8}
          height={60}
          margin={0}
          displayValue={false}
          background="transparent"
          lineColor="#161616"
        />
      </div>

      {/* <div className="absolute left-[900px] top-[260px] leading-none">
        <QRCodeSVG value={ticket.number} size={60} bgColor="transparent" fgColor="#161616" />
      </div> */}
    </div>
  );
}

export function ScaledTicket(props) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / TICKET_W)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="ticket-scaler w-full"
      style={{ direction: 'ltr', height: TICKET_H * scale }}
    >
      <div
        className="ticket-scaler-inner"
        style={{ width: TICKET_W, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <MuseumTicket {...props} />
      </div>
    </div>
  );
}
