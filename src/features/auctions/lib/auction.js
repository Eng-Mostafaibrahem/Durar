import { localized } from '../../../lib/response.js';
import { resolveImageUrl } from '../../../utils/media.js';

const STATUS_ALIASES = {
  scheduled: 'upcoming',
  planned: 'upcoming',
  pending: 'upcoming',
  future: 'upcoming',
  active: 'live',
  live: 'live',
  in_progress: 'live',
  running: 'live',
  ended: 'ended',
  closed: 'ended',
  finished: 'ended',
  sold: 'ended',
};

function toMs(value) {
  if (value === null || value === undefined) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/**
 * The detail endpoint returns raw statuses like "scheduled" while the list
 * filter uses live|upcoming|ended. Resolve to one of the three canonical ones,
 * falling back to starts_at / ends_at when the status is unknown.
 */
export function normalizeAuctionStatus(auction) {
  const raw = auction?.status;
  const alias = raw ? STATUS_ALIASES[raw] : null;
  if (alias) return alias;

  const now = Date.now();
  const start = toMs(auction?.starts_at);
  const end = toMs(auction?.ends_at);

  if (end !== null && now >= end) return 'ended';
  if (start !== null && now < start) return 'upcoming';
  return 'live';
}

export function normalizeAuction(auction, language = 'ar') {
  if (!auction) return null;

  const text = localized(auction, ['name', 'description'], language);
  const currentPrice = Number(auction.current_price) || 0;
  const minBidIncrement = Number(auction.min_bid_increment) || 0;

  return {
    id: auction.id,
    slug: auction.slug,
    name: auction.name ?? text.name,
    description: auction.description ?? text.description,
    image: resolveImageUrl(auction.cover_image),
    gallery: (Array.isArray(auction.gallery) ? auction.gallery : [])
      .map((item) =>
        resolveImageUrl(
          typeof item === 'string' ? item : item?.url ?? item?.image ?? item?.image_url,
        ),
      )
      .filter(Boolean),
    metadata: auction.metadata ?? null,
    startingPrice: Number(auction.starting_price) || 0,
    currentPrice,
    minBidIncrement,
    minimumNextBid:
      Number(auction.minimum_next_bid) || (currentPrice && minBidIncrement ? currentPrice + minBidIncrement : 0),
    startsAt: auction.starts_at,
    endsAt: auction.ends_at,
    status: normalizeAuctionStatus(auction),
    isBiddable: Boolean(auction.is_biddable),
    bids: Array.isArray(auction.bids) ? auction.bids : [],
    bidsCount:
      Number(auction.bids_count) ||
      (Array.isArray(auction.bids) ? auction.bids.length : 0) ||
      0,
    isWinner: auction.is_winner ?? auction.is_won ?? null,
    isHighestBidder: auction.is_highest_bidder ?? null,
    reserveMet: auction.reserve_met ?? null,
  };
}

/** Masks a bidder identity for display, e.g. "أ•••". */
export function maskName(name) {
  const value = String(name ?? '').trim();
  if (!value) return '•••';
  if (value.length <= 1) return `${value}•`;
  return `${value.charAt(0)}•••`;
}

/** Normalizes an unknown bid-history entry so rendering is defensive. */
export function normalizeBid(bid) {
  const amount = Number(bid?.amount ?? bid?.price ?? bid?.bid_amount ?? 0) || 0;
  const rawName = bid?.user?.name ?? bid?.user_name ?? bid?.name;

  return {
    id: bid?.id,
    amount,
    bidder: maskName(rawName),
    createdAt: bid?.created_at ?? bid?.createdAt ?? null,
    isCurrentUser: Boolean(bid?.is_current_user ?? bid?.is_me ?? false),
    source: bid,
  };
}