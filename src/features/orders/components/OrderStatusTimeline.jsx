import { useTranslation } from 'react-i18next';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import { cn } from '../../../utils/cn.js';
import { ORDER_TIMELINE } from '../lib/orderHelpers.js';

/**
 * Vertical status timeline. Terminal (cancelled/failed) states render a
 * single stopped step instead of the happy path.
 */
export function OrderStatusTimeline({ status }) {
  const { t } = useTranslation();

  const terminal = status === 'cancelled' || status === 'failed';

  if (terminal) {
    return (
      <ol className="flex flex-col gap-4">
        <TimelineStep
          done={false}
          last
          label={t(`account:orderStatus.${status}`)}
          icon={<HiXCircle aria-hidden="true" className="size-5" />}
        />
      </ol>
    );
  }

  const activeIndex = ORDER_TIMELINE.indexOf(status);

  return (
    <ol className="flex flex-col gap-4">
      {ORDER_TIMELINE.map((step, index) => {
        const done = activeIndex > index || activeIndex === ORDER_TIMELINE.length - 1;
        const current = index === activeIndex;

        return (
          <TimelineStep
            key={step}
            done={done}
            current={current}
            last={index === ORDER_TIMELINE.length - 1}
            label={t(`account:orderStatus.${step}`)}
            icon={
              done ? (
                <HiCheckCircle aria-hidden="true" className="size-5" />
              ) : (
                <span aria-hidden="true" className="size-2 rounded-full bg-hue-300" />
              )
            }
          />
        );
      })}
    </ol>
  );
}

function TimelineStep({ done, current, last, label, icon }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          'relative grid size-9 shrink-0 place-items-center rounded-full border-2',
          done
            ? 'border-secondary-500 bg-secondary-500 text-white'
            : current
              ? 'border-primary-500 bg-primary-100 text-primary-500'
              : 'border-hue-200 bg-white text-hue-400',
        )}
      >
        {icon}
        {!last && (
          <span
            aria-hidden="true"
            className={cn(
              'absolute start-1/2 top-full h-6 w-0.5 -translate-x-1/2',
              done ? 'bg-secondary-500' : 'bg-hue-200',
            )}
          />
        )}
      </span>
      <span className={cn('pt-1.5 text-sm', done ? 'font-medium text-base-dark' : 'text-hue-500')}>
        {label}
      </span>
    </li>
  );
}
