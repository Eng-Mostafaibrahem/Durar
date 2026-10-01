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

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState(null);

  const returnTo = useMemo(() => safeReturnTo(searchParams.get('returnTo')), [searchParams]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(returnTo, { replace: true }),
    onError: (error) => {
      setSubmitError(messageFor(error, t, 'auth:login.error'));
      applyFieldErrors(error, setError, { email: 'email', password: 'password' });
    },
  });

  const onSubmit = (values) => {
    setSubmitError(null);
    mutation.mutate(values);
  };

  return (
    <>
      <Seo title={t('auth:login.title')} />

      <AuthCard
        title={t('auth:login.title')}
        subtitle={t('auth:login.subtitle')}
        actions={
          <>
            <p>
              {t('auth:login.noAccount')}{' '}
              <Link
                to={paths.register}
                className="font-medium text-primary-500 hover:text-primary-700"
              >
                {t('nav:register')}
              </Link>
            </p>
            <Link to={paths.home} className="text-hue-500 transition-colors hover:text-primary-500">
              {t('auth:browseAsGuest')}
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

          <PasswordInput
            label={t('auth:fields.password')}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register('password', { required: t('validation:required') })}
          />

          <div className="text-end">
            <Link
              to={paths.forgotPassword}
              className="text-sm text-primary-500 transition-colors hover:text-primary-700"
            >
              {t('auth:login.forgotPassword')}
            </Link>
          </div>

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
            {t('auth:login.submit')}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
