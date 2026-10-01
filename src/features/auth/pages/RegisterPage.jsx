import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Seo } from '../../../components/Seo.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { AuthCard } from '../components/AuthCard.jsx';
import { PasswordInput } from '../components/PasswordInput.jsx';
import { safeReturnTo } from '../lib/returnTo.js';
import { applyFieldErrors, messageFor } from '../lib/formErrors.js';
import { paths } from '../../../lib/paths.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,14}$/;

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerAccount } = useAuth();
  const [submitError, setSubmitError] = useState(null);

  const returnTo = useMemo(
    () => safeReturnTo(searchParams.get('returnTo'), paths.home),
    [searchParams],
  );

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', phone: '', password: '', password_confirmation: '' },
  });

  const mutation = useMutation({
    mutationFn: registerAccount,
    onSuccess: () => navigate(returnTo, { replace: true }),
    onError: (error) => {
      setSubmitError(messageFor(error, t, 'auth:register.error'));
      applyFieldErrors(error, setError, {
        name: 'name',
        email: 'email',
        phone: 'phone',
        password: 'password',
        password_confirmation: 'password_confirmation',
      });
    },
  });

  const onSubmit = (values) => {
    setSubmitError(null);
    mutation.mutate(values);
  };

  return (
    <>
      <Seo title={t('auth:register.title')} />

      <AuthCard
        title={t('auth:register.title')}
        subtitle={t('auth:register.subtitle')}
        actions={
          <p>
            {t('auth:register.haveAccount')}{' '}
            <Link to={paths.login} className="font-medium text-primary-500 hover:text-primary-700">
              {t('nav:login')}
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label={t('auth:fields.name')}
            autoComplete="name"
            placeholder={t('auth:fields.name')}
            error={errors.name?.message}
            disabled={isSubmitting}
            {...register('name', {
              required: t('validation:required'),
              minLength: { value: 2, message: t('validation:minLength', { count: 2 }) },
            })}
          />

          <Input
            label={t('auth:fields.email')}
            type="email"
            dir="ltr"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            disabled={isSubmitting}
            {...register('email', {
              required: t('validation:required'),
              pattern: { value: EMAIL_PATTERN, message: t('validation:email') },
            })}
          />

          <Input
            label={t('auth:fields.phone')}
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+20 100 000 0000"
            error={errors.phone?.message}
            disabled={isSubmitting}
            {...register('phone', {
              required: t('validation:required'),
              validate: (value) => PHONE_PATTERN.test(value.trim()) || t('validation:phone'),
            })}
          />

          <PasswordInput
            label={t('auth:fields.password')}
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register('password', {
              required: t('validation:required'),
              minLength: { value: 8, message: t('validation:passwordMin') },
            })}
          />

          <PasswordInput
            label={t('auth:fields.confirmPassword')}
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password_confirmation?.message}
            disabled={isSubmitting}
            {...register('password_confirmation', {
              required: t('validation:required'),
              validate: (value) => value === getValues('password') || t('validation:passwordMatch'),
            })}
          />

          {submitError && (
            <div role="alert" className="rounded-xl bg-error-100 px-4 py-3 text-sm text-error-500">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isSubmitting || mutation.isPending}
          >
            {t('auth:register.submit')}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
