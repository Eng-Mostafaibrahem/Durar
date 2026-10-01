import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HiArrowLeft,
  HiUser,
  HiMapPin,
  HiHeart,
  HiShoppingBag,
  HiOutlineScale,
} from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useFavorites } from '../../favorites/hooks/useFavorites.js';
import { loadAddress } from '../../checkout/lib/addressStorage.js';
import { paths } from '../../../lib/paths.js';

function ActionCard({ to, icon: Icon, title, hint, itemsCountKey, value = 0 }) {
  const { t } = useTranslation();
  return (
    <Link
      to={to}
      className="group flex items-start justify-between gap-4 rounded-2xl border border-border-100 bg-white p-5 shadow-sm transition-colors hover:border-primary-500/40"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-500/10 text-primary-500">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-base-dark">{title}</p>
          <p className="mt-0.5 text-xs text-hue-500">
            {value > 0 && itemsCountKey ? t(itemsCountKey, { count: value }) : hint}
          </p>
        </div>
      </div>

      <HiArrowLeft
        aria-hidden="true"
        className="size-5 shrink-0 text-hue-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-primary-500 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-bg-secondary px-4 py-3">
      <span className="text-sm text-hue-500">{label}</span>
      <span className="text-sm font-medium text-base-dark">{value}</span>
    </div>
  );
}

export default function AccountPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { count: favoritesCount } = useFavorites();
  const address = loadAddress();

  return (
    <>
      <Seo title={t('account:title')} description={t('account:profile')} noIndex />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-base-dark">{t('account:title')}</h1>
          <p className="mt-1 text-sm text-hue-500">{t('account:profileHint')}</p>
        </div>

        <section className="rounded-2xl border border-border-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary-500/10 text-primary-500">
              <HiUser aria-hidden="true" className="size-7" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-bold text-base-dark">
                {user?.name || t('account:profile')}
              </h2>
              {(user?.email || user?.phone) && (
                <p className="truncate text-sm text-hue-500" dir="auto">
                  {user.email || user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <InfoRow label={t('auth:fields.name')} value={user?.name} />
            <InfoRow label={t('auth:fields.email')} value={user?.email} />
            <InfoRow label={t('auth:fields.phone')} value={user?.phone} />
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <ActionCard
            to={paths.accountOrders}
            icon={HiShoppingBag}
            title={t('account:orders')}
            hint={t('account:ordersList.empty')}
          />
          <ActionCard
            to={paths.accountBids}
            icon={HiOutlineScale}
            title={t('account:bids')}
            hint={t('account:bidsEmptyHint')}
          />
          <ActionCard
            to={paths.favorites}
            icon={HiHeart}
            title={t('account:favorites')}
            hint={t('account:favoritesEmptyHint')}
            itemsCountKey="account:itemsCount"
            value={favoritesCount}
          />
          <ActionCard
            to={address ? paths.checkout : paths.shop}
            icon={HiMapPin}
            title={t('account:addresses')}
            hint={address ? t('account:addressEditHint') : t('account:addressesEmptyHint')}
          />
        </div>

        {address && (
          <section className="rounded-2xl border border-border-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-base-dark">
                {t('account:lastAddress')}
              </h3>
              <Link
                to={paths.checkout}
                className="text-xs font-semibold text-primary-500 hover:text-primary-600"
              >
                {t('common:actions.edit')}
              </Link>
            </div>

            <address className="mt-3 space-y-0.5 text-sm not-italic leading-relaxed text-base-dark/80">
              {address.name && <p className="font-medium text-base-dark">{address.name}</p>}
              {address.phone && <p dir="ltr">{address.phone}</p>}
              {address.city && <p>{address.city}</p>}
              {address.address_line && <p>{address.address_line}</p>}
            </address>
          </section>
        )}

        <section className="rounded-2xl bg-bg-secondary p-5">
          <h3 className="text-sm font-semibold text-base-dark">{t('account:changePassword')}</h3>
          <p className="mt-1 text-xs leading-relaxed text-hue-500">
            {t('account:changePasswordHint')}
          </p>
        </section>
      </div>
    </>
  );
}
