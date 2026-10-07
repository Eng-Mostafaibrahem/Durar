export const TICKET_W = 1000;
export const TICKET_H = 360;
export const STRIP_W = 95;
export const STUB_X = 723;
export const MAIN_W = STUB_X - STRIP_W;

export const TICKET_COLORS = {
  green: '#0f5a3a',
  burgundy: '#5c0b1c',
  cream: '#ffff',
};

export function formatDate(value, isAr) {
  if (!value) return null;
  const raw = String(value);
  const datePart = /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.slice(0, 10) : raw;
  const d = new Date(`${datePart}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  if (isAr) {
    const parts = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(d);
    const get = (type) => parts.find((p) => p.type === type)?.value;
    return `${get('day')} ${get('month')} ${get('year')}`;
  }
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}