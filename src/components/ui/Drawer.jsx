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

const SIDES = {
  start: 'inset-y-0 start-0 h-full w-full max-w-md border-e',
  end: 'inset-y-0 end-0 h-full w-full max-w-md border-s',
  bottom: 'inset-x-0 bottom-0 max-h-[88dvh] w-full rounded-t-2xl border-t',
};

export function Drawer({ open, onClose, side = 'end', title, children, footer, className }) {
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
    <div className="fixed inset-0 z-100">
      <div
        className="absolute inset-0 bg-base-dark/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col overflow-y-auto border-border-100 bg-white shadow-2xl outline-none animate-panel-in',
          SIDES[side],
          className,
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border-100 px-6 py-5">
          <h2 id={titleId} className="text-xl text-base-dark">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common:a11y.closeDialog')}
            className="grid size-9 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100 hover:text-base-dark"
          >
            <HiXMark aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="flex-1 px-6 py-5">{children}</div>

        {footer && (
          <footer className="sticky bottom-0 border-t border-border-100 bg-white px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
