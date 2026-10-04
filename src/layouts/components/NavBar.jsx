import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiBars3, HiMagnifyingGlass, HiHeart, HiShoppingBag, HiUserCircle } from 'react-icons/hi2';
import { Container } from '../../components/Container.jsx';
import { LanguageSwitcher } from '../../components/LanguageSwitcher.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { paths } from '../../lib/paths.js';
import { useOnEscape } from '../../hooks/index.js';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { useCart } from '../../features/cart/hooks/useCart.js';
import { useCartDrawer } from '../../features/cart/hooks/useCartDrawer.js';
import { normalizeCart } from '../../features/cart/lib/cartHelpers.js';
import { useFavorites } from '../../features/favorites/hooks/useFavorites.js';
import { NAV_ITEMS, navLinkClass } from '../lib/navItem.js';
import { CountBadge } from './CountBadge.jsx';
import { IconButton } from './IconButton.jsx';
import { MobileMenu } from './MobileMenu.jsx';
import logo from '../../assets/logo2.svg';

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { openCart } = useCartDrawer();
  const { count: favoritesCount } = useFavorites();
  const cartCount = normalizeCart(useCart().data).count;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useOnEscape(isMenuOpen, () => setIsMenuOpen(false));

  // لو الشاشة كبرت والمنيو مفتوحة، نقفله عشان الـ scroll lock ما يفضلش شغال
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e) => e.matches && setIsMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const returnTo = `${location.pathname}${location.search}${location.hash}`;
  const accountTarget = isAuthenticated
    ? paths.account
    : `${paths.login}?returnTo=${encodeURIComponent(returnTo)}`;
  const accountLabel = isAuthenticated ? t('nav:account') : t('nav:login');

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-100 bg-white/85 backdrop-blur-md">
        <Container className="flex h-header items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t('common:a11y.openMenu')}
            aria-expanded={isMenuOpen}
            className="grid size-10 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100 xl:hidden"
          >
            <HiBars3 aria-hidden="true" className="size-6" />
          </button>

          <Link to={paths.home} className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="" className="size-8 object-contain sm:size-9" />
            <span className="font-display text-lg font-bold text-primary-500 sm:text-xl">
              {t('common:appName')}
            </span>
          </Link>

          <nav aria-label={t('nav:home')} className="hidden flex-1 items-center justify-center xl:flex">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.labelKey}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => navLinkClass({ isActive })}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-0.5 sm:gap-1 xl:ms-0">
            <IconButton label={t('nav:searchPlaceholder')}>
              <HiMagnifyingGlass aria-hidden="true" className="size-5" />
            </IconButton>

            <Link
              to={paths.favorites}
              aria-label={t('nav:favorites')}
              className="relative hidden size-10 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100 sm:grid"
            >
              <HiHeart aria-hidden="true" className="size-5" />
              <CountBadge count={favoritesCount} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={t('nav:cart')}
              className="relative grid size-10 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100"
            >
              <HiShoppingBag aria-hidden="true" className="size-5" />
              <CountBadge count={cartCount} />
            </button>

            {/* أيقونة الحساب: تابلت ولابتوب صغير. الزرار الكامل من xl */}
            <Link
              to={accountTarget}
              aria-label={accountLabel}
              className="hidden size-10 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100 sm:grid xl:hidden"
            >
              <HiUserCircle aria-hidden="true" className="size-6" />
            </Link>

            <LanguageSwitcher compact className="ms-1 hidden sm:inline-flex" />

            <Button to={accountTarget} size="sm" className="ms-1 hidden xl:inline-flex">
              {accountLabel}
            </Button>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        accountTarget={accountTarget}
        accountLabel={accountLabel}
        favoritesCount={favoritesCount}
      />
    </>
  );
}