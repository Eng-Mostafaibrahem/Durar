import { cn } from '../../utils/cn.js';

export const NAV_ITEMS = [
  { to: '/', labelKey: 'nav:home', end: true },
  { to: '/store', labelKey: 'nav:jewelry' },
  { to: '/museum', labelKey: 'nav:museum' },
  // { to: '/store', labelKey: 'nav:stones', shopLink: true },
  // { to: '/store', labelKey: 'nav:collections', shopLink: true },
  { to: '/auctions', labelKey: 'nav:auctions' },
  { to: '/offers', labelKey: 'nav:offers' },
  { to: '/about', labelKey: 'nav:about' },
  { to: '/contact', labelKey: 'nav:contact' },
];

export function navLinkClass({ isActive, mobile = false }) {
  return cn(
    'text-base font-medium transition-colors',
    mobile
      ? 'block rounded-xl px-4 py-3'
      : 'whitespace-nowrap rounded-full px-2 py-2 2xl:px-3 2xl:text-lg',
    isActive ? 'bg-primary-100 text-primary-700' : 'text-base-dark hover:bg-hue-100',
  );
}
