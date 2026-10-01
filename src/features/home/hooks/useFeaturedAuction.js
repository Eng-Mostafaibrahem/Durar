import { useQuery } from '@tanstack/react-query';
import i18n from '../../../lib/i18n.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import { fetchAuctions } from '../../auctions/api/auctions.js';
import { normalizeAuction } from '../../auctions/lib/auction.js';

function currentLanguage() {
  return i18n.resolvedLanguage || i18n.language || 'ar';
}

/**
 * Landing "featured auction" block. Prefers the first live auction, falling
 * back to the next upcoming one so the section never sits empty.
 */
export function useFeaturedAuction() {
  const language = currentLanguage();

  return useQuery({
    queryKey: queryKeys.auctions.list({ source: 'home', status: 'featured', language }),
    queryFn: async () => {
      const live = await fetchAuctions({ status: 'live' });
      if (live.items.length > 0) return normalizeAuction(live.items[0], language);

      const upcoming = await fetchAuctions({ status: 'upcoming' });
      return upcoming.items.length > 0 ? normalizeAuction(upcoming.items[0], language) : null;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}