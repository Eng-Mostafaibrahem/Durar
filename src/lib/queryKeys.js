export const queryKeys = {
  me: ['me'],
  products: {
    all: ['products'],
    list: (filters) => ['products', 'list', filters ?? {}],
    details: (id) => ['products', 'details', id],
    reviews: (id) => ['products', 'reviews', id],
    related: (id) => ['products', 'related', id],
  },
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
    details: (id) => ['categories', 'details', id],
  },
  banners: {
    all: ['banners'],
    list: (type) => ['banners', 'list', type ?? 'all'],
  },
  favorites: {
    all: ['favorites'],
    list: () => ['favorites', 'list'],
  },
  cart: {
    all: ['cart'],
    detail: () => ['cart', 'detail'],
  },
  coupons: {
    check: (code) => ['coupons', 'check', code],
  },
  orders: {
    all: ['orders'],
    list: (filters) => ['orders', 'list', filters ?? {}],
    details: (id) => ['orders', 'details', id],
    payment: (id) => ['orders', 'payment', id],
  },
  auctions: {
    all: ['auctions'],
    list: (filters) => ['auctions', 'list', filters ?? {}],
    details: (id) => ['auctions', 'details', id],
    bids: (id) => ['auctions', 'bids', id],
    myBids: (filters) => ['auctions', 'my-bids', filters ?? {}],
  },
  offers: {
    all: ['offers'],
    list: (filters) => ['offers', 'list', filters ?? {}],
  },
  content: {
    home: () => ['content', 'home'],
    faq: () => ['content', 'faq'],
  },
};
