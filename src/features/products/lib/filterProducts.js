import { isOnOffer } from './productOffer.js';

function searchableText(product) {
  return [
    product?.name,
    product?.description,
    product?.category?.name,
    product?.category_name,
    product?.classification?.name,
  ]
    .filter(Boolean)
    .join(' ')
    .normalize('NFC')
    .toLocaleLowerCase();
}

function productPrice(product) {
  return Number(product?.final_price ?? product?.price) || 0;
}

export function filterAndSortProducts(products, filters) {
  const query = String(filters.q || filters.navQ || '')
    .trim()
    .normalize('NFC')
    .toLocaleLowerCase();
  const minimum = filters.price_min === '' ? null : Number(filters.price_min);
  const maximum = filters.price_max === '' ? null : Number(filters.price_max);

  const filtered = products.filter((product) => {
    if (query && !searchableText(product).includes(query)) return false;
    if (filters.category_id && String(product.category_id ?? product.category?.id) !== filters.category_id) {
      return false;
    }

    const type = product.type ?? product.classification?.slug ?? product.classification?.name;
    if (filters.type && String(type ?? '').toLocaleLowerCase() !== filters.type) return false;

    const price = productPrice(product);
    if (minimum !== null && price < minimum) return false;
    if (maximum !== null && price > maximum) return false;
    if (filters.availability === '1') {
      const stock = Number(product.quantity ?? product.stock);
      if (Number.isFinite(stock) && stock <= 0) return false;
    }
    if (filters.onOffer === '1' && !isOnOffer(product)) return false;

    return true;
  });

  return filtered.sort((left, right) => {
    if (filters.sort === 'priceAsc') return productPrice(left) - productPrice(right);
    if (filters.sort === 'priceDesc') return productPrice(right) - productPrice(left);
    if (filters.sort === 'popular') {
      return (Number(right.sales_count) || 0) - (Number(left.sales_count) || 0);
    }

    const leftDate = new Date(left.created_at ?? left.createdAt ?? 0).getTime();
    const rightDate = new Date(right.created_at ?? right.createdAt ?? 0).getTime();
    if (leftDate && rightDate && leftDate !== rightDate) return rightDate - leftDate;
    return (Number(right.id) || 0) - (Number(left.id) || 0);
  });
}
