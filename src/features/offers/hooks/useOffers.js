import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys.js';
import { isOnOffer } from '../../products/lib/productOffer.js';
import { fetchOfferBanners, fetchOfferProducts } from '../api/offers.js';

export function useOfferBanners() {
  return useQuery({
    queryKey: queryKeys.banners.list('offer'),
    queryFn: fetchOfferBanners,
    staleTime: 10 * 60 * 1000,
  });
}

export function useOffersProducts() {
  return useQuery({
    queryKey: queryKeys.offers.list({ discounted: true }),
    queryFn: fetchOfferProducts,
    select: (data) => ({ ...data, items: data.items.filter(isOnOffer) }),
    staleTime: 60 * 1000,
  });
}