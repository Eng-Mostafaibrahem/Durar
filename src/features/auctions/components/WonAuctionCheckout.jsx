import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { paths } from '../../../lib/paths.js';
import { toastStore } from '../../../lib/toastStore.js';
import { messageFor, applyFieldErrors } from '../../auth/lib/formErrors.js';
import { useCheckoutWonAuction } from '../hooks/useAuctions.js';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Button } from '../../../components/ui/Button.jsx';

const PHONE_PATTERN = /^[0-9+\-() ]{7,15}$/;

export function WonAuctionCheckout({ auction, open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const checkout = useCheckoutWonAuction();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', phone: '', city: '', addressLine: '' },
  });

  const onSubmit = (values) => {
    checkout.mutate(
      {
        id: auction.id,
        shipping_address: {
          name: values.name,
          phone: values.phone,
          city: values.city,
          address_line: values.addressLine,
        },
      },
      {
        onSuccess: (response) => {
          const order = response?.order ?? response ?? null;
          const orderId = order?.id ?? response?.id;
          onClose();
          toastStore.push({ type: 'success', messageKey: 'auctions:checkoutSuccess', duration: 4000 });
          navigate(orderId ? paths.checkoutSuccess(orderId) : paths.accountOrders);
        },
        onError: (error) => {
          setError('root', { message: messageFor(error, t, 'auctions:checkoutError') });
          applyFieldErrors(error, setError, {
            name: 'name',
            phone: 'phone',
            city: 'city',
            address_line: 'addressLine',
          });
        },
      },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={t('auctions:checkoutTitle')} description={auction.name}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {errors.root?.message && (
          <p role="alert" className="rounded-lg bg-error-100 px-3 py-2 text-sm font-medium text-error-500">
            {errors.root.message}
          </p>
        )}

        <Input
          label={t('checkout:fields.name')}
          placeholder={t('checkout:fields.name')}
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', { required: t('validation:required') })}
        />
        <Input
          label={t('checkout:fields.phone')}
          placeholder={t('checkout:fields.phone')}
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          className="text-end"
          error={errors.phone?.message}
          {...register('phone', {
            required: t('validation:required'),
            pattern: { value: PHONE_PATTERN, message: t('validation:phone') },
          })}
        />
        <Input
          label={t('checkout:fields.city')}
          placeholder={t('checkout:fields.city')}
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city', { required: t('validation:required') })}
        />
        <Input
          label={t('checkout:fields.addressLine')}
          placeholder={t('checkout:fields.addressLine')}
          autoComplete="street-address"
          error={errors.addressLine?.message}
          {...register('addressLine', { required: t('validation:required') })}
        />

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common:actions.cancel')}
          </Button>
          <Button type="submit" variant="primary" loading={checkout.isPending}>
            {t('auctions:checkoutSubmit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}