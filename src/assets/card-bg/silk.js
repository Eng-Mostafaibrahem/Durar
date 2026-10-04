/**
 * Silk backgrounds for product cards. Drop the exported Figma files into
 * `src/assets/silk/` — the glob resolves them by filename, and any variant
 * without a file falls back to the emerald gradient in index.css.
 */
const modules = import.meta.glob('./*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });

const BY_NAME = {
  specialCard: 'cardCover.webp',
  card2: 'card-2bg.webp',
  card3: 'card-3bg.webp',

};
const registry = new Map();

for (const [path, url] of Object.entries(modules)) {
  const name = path.split('/').pop();
  registry.set(name, url);
}

export const SILK_VARIANTS = Object.keys(BY_NAME);

export function getSilkBackground(variant) {
  const name = BY_NAME[variant];
  return name ? (registry.get(name) ?? null) : null;
}

export function silkBackgroundStyle(variant) {
  const url = getSilkBackground(variant);


  return url
    ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : null;
}
