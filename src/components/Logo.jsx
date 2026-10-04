import { cn } from '../utils/cn.js';
import logo from '../assets/logo 3.webp';

/**
 * Brand logo — renders the exported SVG asset. Used by the shared loader,
 * auth layout and any header that needs the official mark.
 */
export function Logo({ className }) {
  return <img src={logo} alt="" aria-hidden="true" className={cn('h-9 w-auto object-contain', className)} />;
}