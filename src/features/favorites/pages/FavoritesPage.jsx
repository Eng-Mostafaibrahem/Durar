import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiHeart } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { ProductCard } from '../../../components/ProductCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAddToCart } from '../../cart/hooks/useCart.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { paths } from '../../../lib/paths.js';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { items: favorites, removeFavorite } = useFavorites();
  const addToCart = useAddToCart();
  const [addingId, setAddingId] = useState(null);

  const handleAdd = (product) => {
    setAddingId(product.id);
    addToCart.mutate(
      { product_id: product.id, quantity: 1 },
      { onSettled: () => setAddingId(null) },
    );
  };

  const handleRemove = (product) => removeFavorite(product.id);

  return (
    <>
      <Seo title={t('favorites:title')} description={t('common:tagline')} />

      <Container className="py-10">
        <header>
          <h1 className="font-display text-3xl font-bold text-base-dark">{t('favorites:title')}</h1>
          {favorites.length > 0 && (
            <p className="mt-2 text-sm text-hue-500">
              {t('favorites:itemsCount', { count: favorites.length })}
            </p>
          )}
        </header>

        {favorites.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={HiHeart}
              title={t('favorites:empty')}
              description={t('favorites:emptyHint')}
              action={<Button to={paths.shop}>{t('common:actions.browse')}</Button>}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {favorites.map((product) => (
              <FavoriteCard
                key={product.id}
                product={{
                  ...product,
                  image: resolveImageUrl(product.image),
                  categoryId: product.category_id,
                  categoryLabel: product.category_name,
                  backgroundVariant: product.background_variant,
                }}
                adding={addingId === product.id}
                onAdd={() => handleAdd(product)}
                onRemove={() => handleRemove(product)}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

function FavoriteCard({ product, adding, onAdd, onRemove }) {
  const { t } = useTranslation();
  const unavailable = Number(product.stock ?? 0) <= 0;

  return (
    <div className="flex flex-col gap-2">
      <ProductCard product={product} unavailable={unavailable} />
      <div className="flex gap-2 px-1">
        <Button
          size="sm"
          className="flex-1"
          onClick={onAdd}
          loading={adding}
          disabled={unavailable}
        >
          {t('common:actions.addToCart')}
        </Button>
        <Button size="sm" variant="ghost" onClick={onRemove}>
          {t('favorites:remove')}
        </Button>
      </div>
    </div>
  );
}
