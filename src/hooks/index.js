import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

/** Prevents background scroll while a modal or drawer is open. */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingInlineEnd;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingInlineEnd = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPadding;
    };
  }, [locked]);
}

export function useOnEscape(enabled, handler) {
  useEffect(() => {
    if (!enabled || !handler) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') handler(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, handler]);
}

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function focusableWithinPanel(container) {
  if (!container) return [];

  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

/**
 * Keeps Tab focus inside an open dialog/panel and cycles at both ends. Returns
 * a ref to attach to the panel element.
 */
export function useFocusTrap(active) {
  const panelRef = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    panel.current = panelRef.current;
  });

  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const items = focusableWithinPanel(panel.current);
      if (items.length === 0) {
        event.preventDefault();
        panel.current?.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !panel.current?.contains(current))) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);

  return panelRef;
}

/**
 * Server-time offset for countdowns, so a skewed device clock cannot make an
 * auction appear to end early or late.
 *
 * `serverAt` is the timestamp from the API response and `receivedAt` is the
 * moment the client got that response (stamped in apiClient). Their difference
 * is the pure part of the correction, so no clock is read during render.
 */
export function useServerTimeOffset(serverAt, receivedAt) {
  return useMemo(() => {
    const serverMs = toMs(serverAt);
    if (serverMs === null) return 0;

    const clientMs = toMs(receivedAt) ?? serverMs;
    return serverMs - clientMs;
  }, [serverAt, receivedAt]);
}

function toMs(value) {
  if (value === null || value === undefined) return null;

  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/** Runs a callback on an interval without storing the ticking value in state. */
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return undefined;

    const id = window.setInterval(() => savedCallback.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}
