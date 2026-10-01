import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { toastStore } from '../../lib/toastStore.js';
import { cn } from '../../utils/cn.js';

const TYPE_STYLES = {
  info: 'border-border-100 bg-white text-base-dark',
  success: 'border-success-500/30 bg-success-100 text-success-500',
  error: 'border-error-500/30 bg-error-100 text-error-500',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(toastStore.getItems);

  useEffect(() => toastStore.subscribe(setToasts), []);

  return (
    <>
      {children}

      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-0 bottom-4 z-200 flex flex-col items-center gap-2 px-4 sm:bottom-6"
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

function Toast({ toast }) {
  const { t } = useTranslation();
  const message = toast.messageKey ? t(toast.messageKey, toast.options) : toast.message;

  useEffect(() => {
    if (!toast.duration) return undefined;

    const timer = window.setTimeout(() => toastStore.dismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timer);
  }, [toast.id, toast.duration]);

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg',
        TYPE_STYLES[toast.type] || TYPE_STYLES.info,
      )}
    >
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={() => toastStore.dismiss(toast.id)}
        className="-me-1 grid size-6 shrink-0 place-items-center rounded-full opacity-60 transition-opacity hover:opacity-100"
      >
        <HiXMark aria-hidden="true" className="size-4" />
        <span className="sr-only">{t('common:actions.close')}</span>
      </button>
    </div>
  );
}
