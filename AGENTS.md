# Project: Gemstone & Meteorite E-commerce Website (Storefront)

You are building the **customer-facing website** for a premium brand that sells rare stones, meteorites, gemstones and jewelry made from them.
The site is **Arabic-first (RTL)**. The admin dashboard is a **separate project** (see `AGENTS-dashboard.md`) and must NOT live in this repo.

Read this whole file before writing code. Build in the phases listed at the end, and stop after each phase for review.

---

## 1. Tech stack (strict)

- React JS with **JSX only** (no TypeScript)
- Vite
- Tailwind CSS **v4** (CSS-first config with `@theme` in `src/index.css`, no `tailwind.config.js`)
- TanStack Query (`@tanstack/react-query`) for all server state
- React Hook Form for all forms
- React Icons (`react-icons`)
- **Native `fetch`** wrapped in a custom API client with **interceptors** (no axios)
- React Router for routing
- **i18n:** `i18next` + `react-i18next` + `i18next-browser-languagedetector`. The site ships **two locales**: `ar` (Arabic, RTL — **default** destination for first-time visitors) and `en` (English, LTR). UI strings live in `src/locales/{ar,en}/<namespace>.json` (one namespace per feature + `common` for shared keys). Product/category/content data comes from the backend localized via the `Accept-Language` header (see §7). `<html lang dir>` and currency/date formatting switch on the language.
- No Redux. Client state = React Context (auth, cart drawer) + TanStack Query cache.

---

## 2. Design system

Source: Figma / Behance "Colors" page + two landing page designs (provided as images). Verify exact hex values against Figma before finalizing. Values below are read from the screenshot and are approximate.

### Color tokens (define in `@theme`)

| Token                   | Hex (approx.)                               | Usage                                                |
| ----------------------- | ------------------------------------------- | ---------------------------------------------------- |
| `--color-primary-500`   | `#7C0A20` (deep maroon)                     | Primary buttons, links, accents, footer/CTA sections |
| `--color-secondary-500` | `#0D5C3E` (emerald green)                   | Secondary buttons, badges, highlights                |
| `--color-hue-500`       | `#6B7A65` (muted sage)                      | Hue / muted accents                                  |
| `--color-border-500`    | `#8B4A3A` (terracotta brown)                | Borders, dividers, accents                           |
| `--color-black`         | `#333333`                                   | Text / base dark                                     |
| `--color-white`         | `#FFFFFF`                                   | Text on dark / base light                            |
| `--color-bg-main`       | `#FFFFFF`                                   | Main screen background                               |
| `--color-bg-secondary`  | warm cream (see landing, approx. `#F7F3E8`) | Secondary sections, hero background                  |

Gradient from the Colors page: deep teal-blue to near-black (top `#044B4A`-ish to bottom `#002045`-ish). Use for dark hero overlays / dark sections.

Semantic colors (success / info / warning / error) are empty in the Figma. Use Tailwind defaults tuned to the palette and centralize them as tokens.

### Typography

- Arabic display serif for headings (elegant, calligraphic feel as in the landing). Suggested: `Amiri` or `Noto Naskh Arabic` for headings.
- Clean Arabic sans for body/UI. Suggested: `IBM Plex Sans Arabic` or `Cairo`.
- Load via `@fontsource` packages, not a CDN link.
- Set `dir="rtl"` and `lang="ar"` on `<html>`. Use logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`) instead of `left/right`.

### Assets

All images and backgrounds are in Figma. The user will place exported files in `src/assets/`.

- **Product card background:** the emerald **silk fabric** images. Files provided:
  - `luxurious-dark-green-silk-fabric-texture-with-elegant-folds_1.png` (wide, bright emerald silk with soft glow)
  - `green-silk-fabric-wavy-background_1.png` (matte emerald satin)
  - `00905bf4-abf2-4d5e-97a6-3918a4ea8766_1.png` (dark green diagonal folds)
  - `43856788_2303_w018_n002_1741A_p30_1741_1.png` (wide dark green silk)
- Product cards show the product photo (transparent PNG/cut-out) centered over a silk background. Implement a `ProductCard` that takes `backgroundVariant` and falls back to a solid `secondary-500` gradient if the image is missing.
- Optimize: convert to WebP, lazy-load, set explicit width/height to avoid layout shift.

### UI rules

- Rounded cards (`rounded-xl`), thin borders in `border-500` at low opacity, generous whitespace, luxury feel.
- Every interactive element needs hover, focus-visible, disabled, and loading states.
- Fully responsive: mobile-first, breakpoints per Tailwind defaults.
- Skeleton loaders for lists, never blank screens.

---

## 3. Landing page (from the two provided designs)

Build `HomePage` with these sections, in this order, each as its own component under `src/features/home/components/`:

1. **Header / Navbar**: logo, nav links (home, jewelry, stones, collections, auctions, offers, about), search, favorites icon with count, cart icon with count, login/account button.
2. **Hero**: large cream background, headline (rare pieces crafted for you), short paragraph, two CTAs (browse / view collection), hero image of a large emerald ring.
3. **Featured picks ("مختارات درر")**: horizontal grid of 4 product cards on silk backgrounds, with "view all" link.
4. **Discover our collections**: 3x2 grid of category tiles (rings, necklaces, bracelets, tiaras/crowns, gemstones, earrings) with gold-tinted image tiles and overlay labels.
5. **Editorial block (all stones have a story)**: text with spec rows on one side and a large stone image on the other.
6. **Selected pieces** (second product row, same card component).
7. **Featured auction ("rare piece, exceptional opportunity")**: one live auction with image, title, current bid, starting price, end-time **countdown**, "bid now" and "details" buttons.
8. **Every stone has a story**: three tall image cards (Heritage, Authenticity, Rarity) with overlay text.
9. **Discover what's behind the stone**: FAQ-style/article rows with thumbnails.
10. **Editorial feature (rare from the earth, exceptional from origin)**: image + text.
11. **"Discover up close" section / showroom**: location or gallery block with a few key stats.
12. **Gallery CTA**: full-width image with overlay heading and one button.
13. **FAQ accordion**.
14. **Download the app CTA**: maroon background section with phone mockup (static for now).
15. **Footer**.

Content for all sections must come from the API where dynamic (products, categories, auction, offers, FAQ), with static fallback text in a `content.js` file. The dashboard project will manage this content later.

---

## 4. Features

### 4.1 Authentication

- Register, Login, Logout, Forgot/Reset password (if backend supports).
- **Login/Register is NOT required to browse.** It is required only when:
  - creating an order (checkout submit),
  - placing a bid on an auction,
  - (optional) syncing favorites/cart to the account.
- Use a **Login modal/page with `returnTo`**: if a guest hits checkout, redirect to `/login?returnTo=/checkout`, then return after success and keep their cart.
- Tokens: access token in memory + refresh token per backend contract (httpOnly cookie preferred; else localStorage with clear comment). Provide `AuthProvider` with `user`, `isAuthenticated`, `login`, `logout`.
- `ProtectedRoute` component for `/account/*` and `/checkout`.

### 4.2 Store (products)

- Product listing page with: category filter, price range, type (stone / meteorite / jewelry), availability, on-offer filter, sort (newest, price asc/desc, popular), search, pagination or infinite scroll (`useInfiniteQuery`).
- Filters live in the URL query string (shareable, back-button safe).
- Product details page: image gallery with zoom, title, description, specifications table (weight, dimensions, origin, type, certificate), price, offer badge + old price if discounted, stock status, quantity selector, add to cart, add to favorites, related products.
- If the product is an auction item, show the auction panel instead of the add-to-cart panel (see 4.5).

### 4.3 Favorites

- Heart toggle on every product card and details page.
- **Guests:** store in localStorage. **Logged in:** store via API, and **merge** guest favorites into the account on login.
- Favorites page listing saved products with quick add-to-cart and remove.
- Optimistic updates via TanStack Query mutations (`onMutate` / rollback on error).

### 4.4 Cart

- Cart drawer (slide-in) plus full cart page.
- Guests: localStorage cart. Logged in: server cart, merged on login.
- Line items: image, name, unit price (with offer price applied), quantity stepper, remove, line total.
- Summary: subtotal, discounts, shipping (if any), total. Coupon field only if the backend supports it.
- Validate stock and price on checkout, and show a clear message if an item changed.
- Auction items **cannot** be added to the cart. Won auctions go to a "pay for won auction" flow (see 4.5).

### 4.5 Auctions

- Auctions listing page (live, upcoming, ended tabs) and auction details page.
- Show: current highest bid, starting price, minimum next bid (increment), bids count, bid history (masked usernames), **countdown timer** to end.
- **Place bid** form (React Hook Form): validate `amount >= currentBid + minIncrement`. Requires login (redirect with `returnTo`).
- Keep data fresh with TanStack Query `refetchInterval` (e.g. 5 to 10s while the tab is visible and the auction is live). Do not use WebSockets unless the backend provides them.
- Countdown must use server time offset (compute offset from a server timestamp in the response) so client clock skew does not break it.
- States: upcoming, live, ended, won by you, lost, reserve not met.
- "My bids" page under account. Winner sees a "Complete payment" action creating an order for the won item.

### 4.6 Offers

- Some products have an active offer: fixed or percentage discount, with optional start/end dates.
- Show: offer badge (e.g. "-20%"), old price struck through, new price, optional offer countdown.
- Offers page listing all discounted products, plus an "on offer" filter in the store.
- The backend returns the final price. The frontend only displays; never compute the authoritative price on the client (only for display of the percentage).

### 4.7 Checkout and orders

- Steps: shipping address (RHF form) > payment method > review > place order.
- Login required at the moment of "place order" (see 4.1). Pre-fill from saved address if available.
- Order confirmation page and order history (`/account/orders`, `/account/orders/:id`) with status timeline.

### 4.8 Account

- Profile edit, saved addresses, orders, my bids, favorites shortcut, change password.

---

## 5. Routes

```
/                       Home
/shop                   Store listing
/shop/:slug             Product details
/collections/:slug      Category page
/auctions               Auctions listing
/auctions/:id           Auction details
/offers                 Offers listing
/favorites              Favorites
/cart                   Cart
/checkout               Checkout (protected)
/checkout/success/:id   Order confirmation
/login  /register  /forgot-password  /reset-password
/account                Profile (protected)
/account/orders         Orders (protected)
/account/orders/:id     Order details (protected)
/account/bids           My bids (protected)
/about  /contact  /faq
*                       404
```

Lazy-load every route with `React.lazy` and `Suspense`.

---

## 6. Architecture

Feature-based structure:

```
src/
  app/            router.jsx, providers.jsx (QueryClient, Auth, Router)
  assets/
  components/     shared UI: Button, Input, Modal, Drawer, Badge, Skeleton, Countdown, EmptyState, Pagination
  features/
    auth/         api/ hooks/ components/ pages/
    products/
    categories/
    favorites/
    cart/
    checkout/
    orders/
    auctions/
    offers/
    home/
    account/
  layouts/        MainLayout, AuthLayout, AccountLayout
  lib/
    apiClient.js  fetch wrapper + interceptors
    queryClient.js
    queryKeys.js
  utils/          formatCurrency, formatDate, cn
  index.css       Tailwind v4 @theme tokens
```

Rules:

- Each feature has `api/*.js` (plain functions calling `apiClient`), `hooks/*.js` (`useQuery`/`useMutation` wrappers), `components/`, `pages/`.
- Components never call `fetch` directly. Pages call hooks. Hooks call api functions.
- Centralize query keys in `queryKeys.js`, e.g. `queryKeys.products.list(filters)`, `queryKeys.auctions.detail(id)`.
- Invalidate precisely after mutations (cart, favorites, bids, orders).

---

## 7. API client with interceptors (native fetch)

Create `src/lib/apiClient.js`. Requirements:

1. `baseURL` from `import.meta.env.VITE_API_URL`.
2. **Request interceptor:** attach `Authorization: Bearer <token>` when a token exists; set `Content-Type: application/json` and `JSON.stringify` body **unless** the body is `FormData` (then let the browser set the boundary; do not set Content-Type). Add `Accept-Language: ar`.
3. **Response interceptor:**
   - Parse JSON safely (handle 204 and empty bodies).
   - On non-2xx, throw a normalized `ApiError { status, message, errors, data }`.
   - On **401**: attempt a single token refresh (shared in-flight promise so parallel requests wait on one refresh), retry the original request once, and if refresh fails, clear auth and redirect to `/login?returnTo=<current path>`.
4. Support `signal` (AbortController) so TanStack Query can cancel requests.
5. Export `apiClient.get/post/put/patch/delete`, each returning parsed data.
6. Global error handling: TanStack Query `QueryCache`/`MutationCache` `onError` shows a toast for unexpected errors; forms show field errors from `ApiError.errors`.

Skeleton:

```js
const BASE = import.meta.env.VITE_API_URL;

async function request(path, { method = 'GET', body, headers = {}, signal, _retry } = {}) {
  const isForm = body instanceof FormData;
  const token = tokenStore.getAccess();
  const res = await fetch(`${BASE}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'ar',
      ...(!isForm && body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  if (res.status === 401 && !_retry) {
    const ok = await refreshOnce();
    if (ok) return request(path, { method, body, headers, signal, _retry: true });
    handleLogout();
  }
  return parseOrThrow(res);
}
```

---

## 8. Backend contract (LIVE — confirmed from the "Durar Store API" Postman collection)

Laravel 11 REST API (Sanctum bearer token + Spatie roles + EdfaPay + FCM).
Base URL: `https://api.durar.rouqy-jewellery.com/api` (set in `.env` / `VITE_API_URL`).

Every response is `{ success: true, message, data }`; errors are `{ success: false, message, errors: null|{} }`.
The `apiClient` unwraps exactly one `data` level. Paginated lists (Laravel paginator) keep their items
under `data.data` with `current_page / last_page / per_page / total` — normalize with `normalizePage`
in `src/lib/response.js`, never leak field names into components.

Storefront routes (all public unless marked 🔒 = needs `Authorization: Bearer`):

```
POST   /auth/register                 { name, email?, phone, password, password_confirmation } → data.token
POST   /auth/login                    { email, password } → data.token
POST   /auth/logout                   🔒
GET    /auth/me                       🔒 (session restore on reload)

GET    /categories                    count: filter by category_id
GET    /categories/:id

GET    /products?category_id=&page=   paginated list
GET    /products/:id
GET    /products/:id/reviews
POST   /products/:id/reviews          🔒 { rating, comment }

GET    /banners?type=normal|offer     active banners (offers section data source)

GET    /auctions?status=live|upcoming|ended
GET    /auctions/:id                  fields: current_price, min_bid_increment, starts_at, ends_at, ...
GET    /auctions/:id/bids             min next bid = current_price + min_bid_increment
POST   /auctions/:id/bids             🔒 { amount }
POST   /auctions/:id/checkout         🔒 { shipping_address } — create order for a WON auction

GET    /cart                          works for session guest AND logged in (needs VITE_API_CREDENTIALS=include)
POST   /cart/items                    { product_id, quantity } — unit price snapshots final_price
PUT    /cart/items/:itemId            { quantity }
DELETE /cart/items/:itemId
DELETE /cart                          clear

POST   /coupons/check                 { code, category_ids: [] } — category-scoped discount

POST   /orders/checkout               🔒 { shipping_address: { name, phone, city, address_line }, coupon_code?, shipping_fee? }
GET    /orders                        🔒
GET    /orders/:id                    🔒
GET    /orders/:id/payment            🔒 EdfaPay link/redirect data
POST   /payments/edfapay/webhook      (server-side, not called by the storefront)
```

Not on the backend (disable/adapt these assumptions):

- **No `/auth/refresh`** — single Sanctum token, persisted in localStorage (`tokenStore`). 401 clears it and redirects.
- **No favorites API** — favorites are localStorage-only for web visitors.
- **No `/me/bids`, no `/offers` list, no `/content/home`, no cart merge endpoint.**
  Offers = `GET /banners?type=offer` + discounted products. Guest→account cart sync is
  hand-rolled by re-POSTing cart items after login.

Products carry `price` + `discount_percentage` and the cart snapshots `final_price` — display `price`
struck-through with a `final_price`/discount badge when discounted; the server always owns the price.

Frontend routes use **numeric ids** (`/shop/:id`, `/collections/:id`, `/auctions/:id`,
`/account/orders/:id`), matching the backend.

---

## 9. Forms (React Hook Form)

- Every form uses `useForm` with clear validation rules and Arabic error messages (centralize messages in `src/utils/validation.js`).
- Show inline errors, disable submit while pending, map server validation errors with `setError`.
- Forms: login, register, forgot/reset password, address, checkout, place bid, contact, profile.

---

## 10. Quality requirements

- Accessibility: semantic HTML, alt text, focus states, keyboard-usable drawer/modal, `aria-live` for countdown and bid updates.
- Performance: route-level code splitting, image lazy-loading, `staleTime` tuned per query (products 60s, auctions 5s, static content 10min).
- SEO basics: per-page `<title>` and meta description (use `react-helmet-async`).
- Error boundaries per route, friendly empty and error states.
- Env: `.env.example` with `VITE_API_URL`.
- ESLint + Prettier configured.

---

## 11. Build phases (stop and report after each)

1. **Foundation:** Vite + Tailwind v4 tokens + fonts + RTL + router + providers + `apiClient` + shared UI components.
2. **Landing page** with static/mock data using the final design.
3. **Store:** listing, filters, product details, `ProductCard`.
4. **Auth:** register/login, token handling, `ProtectedRoute`, `returnTo`.
5. **Favorites + Cart** (guest and logged-in, merge logic).
6. **Checkout + Orders.**
7. **Offers.**
8. **Auctions** (listing, details, bidding, countdown, my bids, pay for won item).
9. **Account area, polish, accessibility, performance pass.**

Before starting phase 1, ask me for anything missing (backend base URL, exact Figma values, logo files, fonts).
