import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiExclamationTriangle, HiOutlineSwatch } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { PageHero } from '../../../components/PageHero.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../../components/ui/Skeleton.jsx';
import { useCategories } from '../hooks/useCategories.js';
import { localized } from '../../../lib/response.js';
import { paths } from '../../../lib/paths.js';
import { resolveImageUrl } from '../../../utils/media.js';
import banner from '../../../assets/shop-banner.webp';
import categoryCover from '../../../assets/card-bg/category-card.webp';

const TONES = [
  'from-secondary-500 to-secondary-700',
  'from-border-500 to-primary-700',
  'from-primary-500 to-primary-700',
  'from-secondary-700 to-deep-navy',
  'from-deep-teal to-secondary-700',
  'from-deep-navy to-primary-600',
];

function CategoryCard({ category, index, language }) {
  const { name, description } = localized(category, ['name', 'description'], language);
  const image = resolveImageUrl(category.image ?? category.cover_image);

  return (
    <Link
      to={paths.collection(category.id)}
      className="group relative isolate flex aspect-[4/3] min-h-48 items-end overflow-hidden rounded-xl bg-gradient-to-br shadow-sm transition-[transform,box-shadow] duration-300 ease-(--ease-luxury) hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500"
    >
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${TONES[index % TONES.length]}`} />
      <img
        src={categoryCover}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full object-cover mix-blend-soft-light transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.04]"
      />
      {image && (
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="absolute inset-0 -z-10 m-auto size-3/4 object-contain p-4 drop-shadow-xl transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />
      <div className="w-full p-5 text-white sm:p-6">
        <h2 className="font-display text-xl font-bold sm:text-2xl">{name}</h2>
        {description && <p className="mt-1 line-clamp-2 text-sm text-white/80">{description}</p>}
      </div>
    </Link>
  );
}

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const query = useCategories();
  const categories = query.data?.items ?? [];
  const title = t('home:collections.title');
  const description = t('home:collections.subtitle');

  return (
    <>
      <Seo title={title} description={description} />
      <PageHero
        image={banner}
        eyebrow={t('common:appName')}
        title={title}
        subtitle={description}
        showSearch={false}
        showTags={false}
        minHeight="min-h-[320px] md:min-h-[400px]"
        className="bg-dark-gradient"
      />

      <Container className="py-10 sm:py-14">
        {query.isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/3] min-h-48" />
            ))}
          </div>
        ) : query.isError ? (
          <EmptyState
            icon={HiExclamationTriangle}
            title={t('common:states.error')}
            description={t('common:states.noResults')}
            action={
              <Button variant="outline" onClick={() => query.refetch()}>
                {t('common:actions.retry')}
              </Button>
            }
          />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={HiOutlineSwatch}
            title={t('products:empty.title')}
            description={t('products:empty.hint')}
            action={<Button to={paths.shop}>{t('common:actions.browse')}</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                language={language}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}