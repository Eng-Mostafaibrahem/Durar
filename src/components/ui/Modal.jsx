import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn.js';
import {
  focusableWithinPanel,
  useFocusTrap,
  useLockBodyScroll,
  useOnEscape,
} from '../../hooks/index.js';

const WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useFocusTrap(open);
  const previouslyFocused = useRef(null);

  useLockBodyScroll(open);
  useOnEscape(open, onClose);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const focusTimer = window.setTimeout(() => {
      const items = focusableWithinPanel(panelRef.current);
      (items[0] ?? panelRef.current)?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus();
    };
  }, [open, panelRef]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-base-dark/45 backdrop-blur-[2px]"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-panel-in sm:rounded-2xl',
          WIDTHS[size],
        )}
      >
        {(title || description) && (
          <header className="flex items-start justify-between gap-4 border-b border-border-100 px-6 py-5">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 id={titleId} className="text-xl text-base-dark">
                  {title}
                </h2>
              )}
              {description && <p className="text-sm text-hue-500">{description}</p>}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('common:a11y.closeDialog')}
              className="grid size-9 shrink-0 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100 hover:text-base-dark"
            >
              <HiXMark aria-hidden="true" className="size-5" />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-border-100 bg-hue-100/40 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
