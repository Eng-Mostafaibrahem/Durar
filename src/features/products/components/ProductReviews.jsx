import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiOutlineChatBubbleLeftRight, HiStar } from 'react-icons/hi2';
import { useProductReviews } from '../hooks/useProductReviews.js';
import { submitProductReview } from '../api/products.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { queryKeys } from '../../../lib/queryKeys.js';
import { paths } from '../../../lib/paths.js';
import { toastStore } from '../../../lib/toastStore.js';
import { Button } from '../../../components/ui/Button.jsx';
import { Textarea } from '../../../components/ui/Textarea.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { cn } from '../../../utils/cn.js';

export function ProductReviews({ productId }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { data: reviews = [], isPending } = useProductReviews(productId);

  const loginHref = `${paths.login}?returnTo=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <section id="reviews" className="mt-14 scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-base-dark">
        {t('products:reviews.title')}
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-xl bg-hue-100" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              compact
              icon={HiOutlineChatBubbleLeftRight}
              title={t('products:reviews.title')}
              description={t('products:reviews.empty')}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {reviews.map((review) => (
                <li
                  key={review.id ?? review.created_at}
                  className="rounded-xl border border-border-500/15 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-base-dark">
                      {review.user_name ?? review.name ?? t('common:appName')}
                    </span>
                    <StarRating value={Number(review.rating) || 0} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-base-dark/80">{review.comment}</p>
                  {review.created_at && (
                    <time className="mt-3 block text-xs text-hue-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </time>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <ReviewForm productId={productId} />
          ) : (
            <EmptyState
              compact
              icon={HiStar}
              title={t('products:reviews.loginToReview')}
              action={
                <Button to={loginHref} variant="outline" size="sm">
                  {t('nav:login')}
                </Button>
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}

function StarRating({ value }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <HiStar
          key={star}
          aria-hidden="true"
          className={cn(
            'size-4',
            star <= value ? 'fill-warning-500 text-warning-500' : 'text-border-300',
          )}
        />
      ))}
    </span>
  );
}

function ReviewForm({ productId }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { comment: '' },
  });

  const mutation = useMutation({
    mutationFn: ({ rating: value, comment }) =>
      submitProductReview(productId, { rating: value, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.reviews(productId) });
      setRating(5);
      reset({ comment: '' });
      toastStore.push({ type: 'success', messageKey: 'products:reviews.success', duration: 3500 });
    },
  });

  const onSubmit = ({ comment }) => mutation.mutate({ rating, comment });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border-500/15 bg-white p-5"
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-base-dark">
          {t('products:reviews.rating')}
        </legend>
        <div className="flex gap-1" role="radiogroup" aria-label={t('products:reviews.rating')}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value}/5`}
              onClick={() => setRating(value)}
              className="cursor-pointer p-0.5 transition-transform hover:scale-110"
            >
              <HiStar
                aria-hidden="true"
                className={cn(
                  'size-6',
                  value <= rating ? 'fill-warning-500 text-warning-500' : 'text-border-300',
                )}
              />
            </button>
          ))}
        </div>

        <Textarea
          label={t('products:reviews.comment')}
          placeholder={t('products:reviews.comment')}
          error={errors.comment?.message}
          {...register('comment', {
            required: t('validation:required'),
            minLength: { value: 2, message: t('validation:minLength', { count: 2 }) },
          })}
        />

        <Button type="submit" loading={isSubmitting || mutation.isPending}>
          {t('products:reviews.submit')}
        </Button>
      </fieldset>
    </form>
  );
}
