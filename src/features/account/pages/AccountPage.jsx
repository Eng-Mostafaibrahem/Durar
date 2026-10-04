import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  HiArrowLeft,
  HiUser,
  HiPencilSquare,
  HiMapPin,
  HiHeart,
  HiShoppingBag,
  HiOutlineScale,
} from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { useUpdateProfile } from '../../auth/hooks/useUpdateProfile.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { applyFieldErrors, messageFor } from '../../auth/lib/formErrors.js';
import { useFavorites } from '../../favorites/hooks/useFavorites.js';
import { loadAddress } from '../../checkout/lib/addressStorage.js';
import { paths } from '../../../lib/paths.js';
import { resolveImageUrl } from '../../../utils/media.js';

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
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '', avatar: undefined },
  });

  useEffect(() => {
    if (!avatarPreview) return undefined;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const onSubmit = (values) => {
    setSubmitError(null);
    updateProfile.mutate(
      {
        name: values.name.trim(),
        phone: values.phone.trim(),
        avatar: values.avatar?.[0],
      },
      {
        onSuccess: () => {
          reset({ name: values.name.trim(), phone: values.phone.trim(), avatar: undefined });
          setAvatarPreview('');
          setIsEditing(false);
        },
        onError: (error) => {
          setSubmitError(messageFor(error, t, 'account:profileEdit.error'));
          applyFieldErrors(error, setError, { name: 'name', phone: 'phone', avatar: 'avatar' });
        },
      },
    );
  };

  const avatarUrl = resolveImageUrl(
    user?.avatar_url ?? user?.avatar ?? user?.profile_photo_url ?? null,
  );

  const cancelEditing = () => {
    reset({ name: user?.name ?? '', phone: user?.phone ?? '', avatar: undefined });
    updateProfile.reset();
    setAvatarPreview('');
    setSubmitError(null);
    setIsEditing(false);
  };

  const startEditing = () => {
    reset({ name: user?.name ?? '', phone: user?.phone ?? '', avatar: undefined });
    updateProfile.reset();
    setSubmitError(null);
    setAvatarPreview('');
    setIsEditing(true);
  };

  return (
    <>
      <Seo title={t('account:title')} description={t('account:profile')} noIndex />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-base-dark">{t('account:title')}</h1>
          <p className="mt-1 text-sm text-hue-500">{t('account:profileHint')}</p>
        </div>

        <section className="rounded-2xl border border-border-100 bg-white p-6 shadow-sm">
          {!isEditing ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-500/10 text-primary-500">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name || t('account:profile')}
                        className="size-full object-cover"
                      />
                    ) : (
                      <HiUser aria-hidden="true" className="size-7" />
                    )}
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
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <HiPencilSquare aria-hidden="true" className="size-4" />
                  {t('common:actions.edit')}
                </Button>
              </div>

              <div className="mt-5 space-y-2">
                <InfoRow label={t('auth:fields.name')} value={user?.name} />
                <InfoRow label={t('auth:fields.email')} value={user?.email} />
                <InfoRow label={t('auth:fields.phone')} value={user?.phone} />
              </div>

              {updateProfile.isSuccess && (
                <p
                  role="status"
                  className="mt-4 rounded-lg bg-success-100 px-4 py-3 text-sm text-success-500"
                >
                  {t('account:profileEdit.saved')}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              <div className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-500/10 text-primary-500">
                  {avatarPreview || avatarUrl ? (
                    <img
                      src={avatarPreview || avatarUrl}
                      alt={user?.name || t('account:profile')}
                      className="size-full object-cover"
                    />
                  ) : (
                    <HiUser aria-hidden="true" className="size-7" />
                  )}
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  label={t('account:profileEdit.avatar')}
                  hint={t('account:profileEdit.avatarHint')}
                  error={errors.avatar?.message}
                  disabled={isSubmitting || updateProfile.isPending}
                  className="file:me-3 file:rounded-md file:border-0 file:bg-primary-500/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-700"
                  {...register('avatar', {
                    onChange: (event) => {
                      const file = event.target.files?.[0];
                      setAvatarPreview(file ? URL.createObjectURL(file) : '');
                    },
                  })}
                />
              </div>

              <Input
                label={t('auth:fields.name')}
                autoComplete="name"
                error={errors.name?.message}
                disabled={isSubmitting || updateProfile.isPending}
                {...register('name', {
                  required: t('validation:required'),
                  minLength: { value: 2, message: t('validation:minLength', { count: 2 }) },
                })}
              />

              <Input
                label={t('auth:fields.phone')}
                type="tel"
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                disabled={isSubmitting || updateProfile.isPending}
                {...register('phone', {
                  required: t('validation:required'),
                  validate: (value) =>
                    /^\+?[0-9][0-9\s-]{7,14}$/.test(value.trim()) || t('validation:phone'),
                })}
              />

              <InfoRow label={t('auth:fields.email')} value={user?.email} />

              {submitError && (
                <p role="alert" className="rounded-lg bg-error-100 px-4 py-3 text-sm text-error-500">
                  {submitError}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="ghost" onClick={cancelEditing} disabled={updateProfile.isPending}>
                  {t('common:actions.cancel')}
                </Button>
                <Button type="submit" loading={isSubmitting || updateProfile.isPending}>
                  {t('account:profileEdit.save')}
                </Button>
              </div>
            </form>
          )}
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
