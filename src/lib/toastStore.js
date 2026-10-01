let nextId = 1;
let items = [];
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener(items);
}

/**
 * Framework-free toast store so non-React code (the QueryCache/MutationCache
 * error handlers) can raise a toast without importing a component.
 */
export const toastStore = {
  getItems() {
    return items;
  },
  push(toast) {
    const item = { id: nextId++, type: 'info', duration: 5000, ...toast };
    items = [...items, item];
    emit();
    return item.id;
  },
  dismiss(id) {
    items = items.filter((item) => item.id !== id);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
