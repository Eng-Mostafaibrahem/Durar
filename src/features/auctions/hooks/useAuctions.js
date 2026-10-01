import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import i18n from '../../../lib/i18n.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import { checkoutWonAuction, fetchAuction, fetchAuctionBids, fetchAuctions, placeBid } from '../api/auctions.js';
import { normalizeAuction, normalizeBid } from '../lib/auction.js';

/** Auction time-to-live in the cache — kept fresh while the tab is visible. */
const AUCTION_STALE_MS = 5 * 1000;
const LIVE_REFRESH_MS = 5 * 1000;
const LIST_REFRESH_MS = 10 * 1000;

function currentLanguage() {
  return i18n.resolvedLanguage || i18n.language || 'ar';
}

/** Paginated auction list for a status tab (live | upcoming | ended). */
export function useAuctions(status) {
  return useInfiniteQuery({
    queryKey: queryKeys.auctions.list({ status }),
    queryFn: ({ pageParam = 1 }) => fetchAuctions({ status, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.lastPage ? lastPage.meta.page + 1 : undefined,
    staleTime: AUCTION_STALE_MS,
    refetchInterval: status === 'live' ? LIST_REFRESH_MS : false,
  });
}

/** Auction details, normalized, polling every 5s while the auction is live. */
export function useAuction(id) {
  const language = currentLanguage();
  const baseKey = queryKeys.auctions.details(id);

  return useQuery({
    queryKey: [...baseKey, language],
    queryFn: () => fetchAuction(id),
    select: (data) => normalizeAuction(data, language),
    staleTime: AUCTION_STALE_MS,
    refetchInterval: (query) =>
      query.state.data?.status === 'live' ? LIVE_REFRESH_MS : false,
    refetchIntervalInBackground: false,
  });
}

/** Bid history for an auction, polling every 5s while enabled AND the auction is live. */
export function useAuctionBids(id, { enabled = true, poll = false } = {}) {
  const language = currentLanguage();
  const baseKey = queryKeys.auctions.bids(id);

  return useQuery({
    queryKey: [...baseKey, language],
    queryFn: async () => {
      const bids = await fetchAuctionBids(id);
      return (Array.isArray(bids) ? bids : []).map((bid) => normalizeBid(bid));
    },
    enabled,
    select: (bids) => [...bids].sort((a, b) => b.amount - a.amount),
    staleTime: AUCTION_STALE_MS,
    refetchInterval: poll ? LIST_REFRESH_MS : false,
  });
}

/** Places a bid and invalidates the auction + its list so cards update. */
export function usePlaceBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }) => placeBid(id, { amount }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.details(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.bids(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.all });
    },
  });
}

/** Completes payment for a won auction by creating an order. */
export function useCheckoutWonAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, shipping_address }) => checkoutWonAuction(id, { shipping_address }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auctions.details(id) });
    },
  });
}