import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { paths } from '../../../lib/paths.js';
import { toastStore } from '../../../lib/toastStore.js';
import { messageFor, applyFieldErrors } from '../../auth/lib/formErrors.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { usePlaceBid } from '../hooks/useAuctions.js';
import { Input } from '../../../components/ui/Input.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function BidForm({ auction, language = 'ar', disabled = false }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const placeBid = usePlaceBid();

  const minBid = auction.minimumNextBid || auction.currentPrice + auction.minBidIncrement;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { amount: minBid || '' },
  });

  const returnTo = `${paths.login}?returnTo=${encodeURIComponent(paths.auctionDetails(auction.id))}`;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border-300 bg-hue-100/40 p-4">
        <p className="flex items-start gap-2 text-sm text-base-dark/80">
          <HiOutlineInformationCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary-500" />
          {t('auctions:loginRequired')}
        </p>
        <Button to={returnTo} variant="primary" className="w-full">
          {t('auctions:loginToBid')}
        </Button>
      </div>
    );
  }

  const onSubmit = (values) => {
    placeBid.mutate(
      { id: auction.id, amount: Number(values.amount) },
      {
        onSuccess: () => toastStore.push({ type: 'success', messageKey: 'auctions:bidSuccess', duration: 3500 }),
        onError: (error) => {
          setError('amount', { message: messageFor(error, t, 'auctions:bidError') });
          applyFieldErrors(error, setError, { amount: 'amount' });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex items-end gap-3">
        <Input
          type="number"
          inputMode="numeric"
          min={minBid || undefined}
          step="1"
          label={t('auctions:bidAmount')}
          placeholder={String(minBid)}
          error={errors.amount?.message}
          className="[appearance:textfield]"
          disabled={disabled || placeBid.isPending}
          {...register('amount', {
            required: t('validation:required'),
            validate: (value) => {
              const numeric = Number(value);
              if (!Number.isFinite(numeric) || value === '') return t('validation:number');
              if (numeric < minBid) {
                return t('auctions:bidTooLow', { amount: formatCurrency(minBid, { language }) });
              }
              return true;
            },
          })}
        />
        <Button type="submit" variant="primary" size="md" loading={placeBid.isPending} disabled={disabled} className="h-12">
          {t('auctions:placeBid')}
        </Button>
      </div>
      <p className="mt-2 text-xs text-hue-500">
        {t('auctions:minBidHint', { amount: formatCurrency(minBid, { language }) })}
      </p>
    </form>
  );
}