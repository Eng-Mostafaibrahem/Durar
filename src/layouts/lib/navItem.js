import { cn } from '../../utils/cn.js';

export const NAV_ITEMS = [
  { to: '/', labelKey: 'nav:home', end: true },
  { to: '/shop', labelKey: 'nav:jewelry' },
  // { to: '/shop', labelKey: 'nav:stones', shopLink: true },
  // { to: '/shop', labelKey: 'nav:collections', shopLink: true },
  { to: '/auctions', labelKey: 'nav:auctions' },
  { to: '/offers', labelKey: 'nav:offers' },
  { to: '/about', labelKey: 'nav:about' },
  { to: '/contact', labelKey: 'nav:contact' },
];

export function navLinkClass({ isActive, mobile = false }) {
  return cn(
    'text-sm font-medium transition-colors',
    mobile ? 'block rounded-xl px-4 py-3' : 'whitespace-nowrap rounded-full px-3 py-2',
    isActive ? 'bg-primary-100 text-primary-700' : 'text-base-dark hover:bg-hue-100',
  );
}