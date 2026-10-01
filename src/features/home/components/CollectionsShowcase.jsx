import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../../../components/Container.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { localized } from '../../../lib/response.js';
import { resolveImageUrl } from '../../../utils/media.js';
import { paths } from '../../../lib/paths.js';
import { cn } from '../../../utils/cn.js';
import { useCategories } from '../../categories/hooks/useCategories.js';
import { SectionHeader } from './SectionHeader.jsx';
import cardCover from '../../../assets/category-card.png';

const TILES = [
  { key: 'rings', id: 1, tone: 'from-secondary-500 to-secondary-700' },
  { key: 'necklaces', id: 2, tone: 'from-border-500 to-primary-700' },
  { key: 'bracelets', id: 3, tone: 'from-primary-500 to-primary-700' },
  { key: 'tiaras', id: 4, tone: 'from-secondary-700 to-deep-navy' },
  { key: 'gemstones', id: 5, tone: 'from-deep-teal to-secondary-700' },
  { key: 'earrings', id: 6, tone: 'from-deep-navy to-primary-600' },
];

export function CollectionsShowcase() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const query = useCategories();

  const categories = (query.data?.items ?? []).slice(0, 6);

  return (
    <section id="collections" className="bg-bg-main py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={t('home:collections.subtitle')}
          title={t('home:collections.title')}
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {query.isPending
            ? [0, 1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="aspect-[4/3]" />
              ))
            : query.isError
              ? TILES.map((tile) => (
                  <Link
                    key={tile.key}
                    to={paths.collection(tile.id)}
                    className="group relative isolate block aspect-[4/3] overflow-hidden shadow-md shadow-base-dark/10 transition-[transform,box-shadow] duration-300 ease-(--ease-luxury) hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/15"
                  >
                    <div className={cn('absolute inset-0 bg-gradient-to-br', tile.tone)} />
                    <img
                      src={cardCover}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 pt-12 sm:p-5">
                      <span className="font-display text-lg font-bold text-white sm:text-xl">
                        {t(`home:collections.items.${tile.key}`)}
                      </span>
                    </div>
                  </Link>
                ))
              : categories.map((category, index) => {
                  const tile = TILES[index % TILES.length];
                  const name = localized(category, ['name'], language).name;
                  const image = resolveImageUrl(category.image ?? category.cover_image);

                  return (
                    <Link
                      key={category.id}
                      to={paths.collection(category.id)}
                      className="group relative isolate block aspect-[4/3] overflow-hidden shadow-md shadow-base-dark/10 transition-[transform,box-shadow] duration-300 ease-(--ease-luxury) hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/15"
                    >
                      <div className={cn('absolute inset-0 bg-gradient-to-br', tile.tone)} />
                      <img
                        src={cardCover}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
                      />
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          loading="lazy"
                          className="absolute inset-0 m-auto grid h-3/4 w-3/4 place-items-center object-contain p-5 drop-shadow-lg transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.06]"
                        />
                      ) : null}
                      <div className="absolute inset-x-0 bottom-0 p-4 pt-12 sm:p-5">
                        <span className="font-display text-lg font-bold text-white sm:text-xl">
                          {name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
        </div>
      </Container>
    </section>
  );
}