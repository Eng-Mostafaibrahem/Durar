const STORAGE_KEY = 'durar:lastAddress';

export function loadAddress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveAddress(address) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
  } catch {
    // privacy mode / storage full — ignore
  }
}
