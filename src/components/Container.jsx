import { cn } from '../utils/cn.js';

export function Container({ className, as: Component = 'div', ...props }) {
  return <Component className={cn('container-page', className)} {...props} />;
}
