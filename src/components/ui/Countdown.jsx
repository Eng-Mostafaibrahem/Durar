import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useServerTimeOffset, useInterval } from '../../hooks/index.js';
import { cn } from '../../utils/cn.js';

const TICK_MS = 1000;

/**
 * Countdown driven by server time. Pass the `serverTimestamp` from the auction
 * response plus the `receivedAt` recorded by apiClient, so a wrong device
 * clock cannot shift the end time.
 */
export function Countdown({
  target,
  serverTimestamp,
  receivedAt,
  onEnd,
  className,
  compact = false,
}) {
  const { t } = useTranslation();
  const offset = useServerTimeOffset(serverTimestamp, receivedAt);
  const [now, setNow] = useState(() => initialNow(serverTimestamp, receivedAt));

  const endMs = useMemo(() => toMs(target), [target]);
  const remaining = Math.max(0, endMs - (now + offset));
  const isRunning = remaining > 0;

  useInterval(() => setNow(Date.now()), isRunning ? TICK_MS : null);

  useEffect(() => {
    if (!isRunning) onEnd?.();
  }, [isRunning, onEnd]);

  const parts = useMemo(() => splitRemaining(remaining, t), [remaining, t]);
  const announcement = parts.map((part) => `${part.value} ${part.label}`).join(' ');

  return (
    <div className={cn('flex items-center gap-3', className)} role="timer" aria-live="off">
      {/* The ticking digits are hidden from assistive tech; this region
          announces the remaining time instead of changing every second. */}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {isRunning ? `${t('auctions:endsIn')} ${announcement}` : t('auctions:ended')}
      </span>

      <div aria-hidden="true" className="flex items-center gap-3 font-sans tabular-nums">
        {parts.map((part) => (
          <span key={part.key} className="flex items-baseline gap-1">
            <span className={cn('font-bold', compact ? 'text-lg' : 'text-2xl')}>{part.value}</span>
            <span className="text-xs text-hue-500">{part.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function initialNow(serverTimestamp, receivedAt) {
  return toMs(receivedAt) ?? toMs(serverTimestamp) ?? 0;
}

function toMs(value) {
  if (value === null || value === undefined) return null;

  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function splitRemaining(remaining, t) {
  if (remaining <= 0) return [];

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { key: 'days', value: days },
    { key: 'hours', value: hours },
    { key: 'minutes', value: minutes },
    { key: 'seconds', value: seconds },
  ]
    .filter((unit) => unit.value > 0 || unit.key === 'minutes' || unit.key === 'seconds')
    .map((unit) => ({ ...unit, label: t(`auctions:time.${unit.key}`) }));
}
