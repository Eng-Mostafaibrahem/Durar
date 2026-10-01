import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiHeart } from 'react-icons/hi2';
import { Button } from '../../components/ui/Button.jsx';
import { Drawer } from '../../components/ui/Drawer.jsx';
import { LanguageSwitcher } from '../../components/LanguageSwitcher.jsx';
import { paths } from '../../lib/paths.js';
import { NAV_ITEMS, navLinkClass } from '../lib/navItem.js';

export function MobileMenu({
  open,
  onClose,
  activeNav,
  onItemClick,
  accountTarget,
  accountLabel,
  favoritesCount,
}) {
  const { t } = useTranslation();

  return (
    <Drawer open={open} onClose={onClose} side="start" title={t('common:appName')} className="xl:hidden">
      <nav aria-label={t('nav:home')}>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.labelKey}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => {
                  onItemClick(item);
                  onClose();
                }}
                className={({ isActive }) => navLinkClass({ isActive, item, activeNav, mobile: true })}
              >
                {t(item.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 flex flex-col gap-4 border-t border-border-100 pt-6">
        {/* المفضلة مخفية من الهيدر تحت sm، فلازم تبقى هنا */}
        <Link
          to={paths.favorites}
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-dark transition-colors hover:bg-hue-100 sm:hidden"
        >
          <HiHeart aria-hidden="true" className="size-5 text-hue-500" />
          <span>{t('nav:favorites')}</span>
          {favoritesCount > 0 && (
            <span className="ms-auto rounded-full bg-primary-500 px-2 py-0.5 text-[11px] font-bold text-white">
              {favoritesCount > 99 ? '99+' : favoritesCount}
            </span>
          )}
        </Link>

        <LanguageSwitcher />
        <Button to={accountTarget} variant="secondary" onClick={onClose}>
          {accountLabel}
        </Button>
      </div>
    </Drawer>
  );
}