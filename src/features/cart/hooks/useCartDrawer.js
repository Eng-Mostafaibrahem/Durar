import { useContext } from 'react';
import { CartDrawerContext } from '../context/cartDrawerContext.js';

export function useCartDrawer() {
  const context = useContext(CartDrawerContext);

  if (!context) {
    throw new Error('useCartDrawer must be used inside <CartDrawerProvider>');
  }

  return context;
}
