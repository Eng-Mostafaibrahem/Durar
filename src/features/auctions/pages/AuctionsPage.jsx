import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiExclamationTriangle, HiOutlineFunnel } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { cn } from '../../../utils/cn.js';
import { useAuctions } from '../hooks/useAuctions.js';
import { normalizeAuction } from '../lib/auction.js';
import { AuctionCard } from '../components/AuctionCard.jsx';
import { AuctionsGridSkeleton } from '../components/AuctionsGridSkeleton.jsx';

const TABS = ['live', 'upcoming', 'ended'];

export default function AuctionsPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || 'ar';
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'live';
  const query = useAuctions(tab);

  const items = useMemo(
    () =>
      (query.data?.pages.flatMap((page) => page.items) ?? []).map((item) =>
        normalizeAuction(item, language),
      ),
    [query.data, language],
  );

  const selectTab = (next) => setSearchParams(next === 'live' ? {} : { tab: next });

  return (
    <>
      <Seo title={t('auctions:title')} description={t('auctions:subtitle')} />

      <Container className="py-10">
        <header>
          <h1 className="font-display text-3xl font-bold text-base-dark lg:text-4xl">
            {t('auctions:title')}
          </h1>
          <p className="mt-2 text-sm text-hue-500">{t('auctions:subtitle')}</p>
        </header>

        <div role="tablist" aria-label={t('auctions:title')} className="mt-8 flex gap-6 border-b border-border-100">
          {TABS.map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => selectTab(value)}
              className={cn(
                'relative pb-3 text-sm font-semibold transition-colors',
                tab === value
                  ? 'text-primary-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary-500'
                  : 'text-hue-500 hover:text-base-dark',
              )}
            >
              {t(`auctions:tabs.${value}`)}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {query.isPending ? (
            <AuctionsGridSkeleton />
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
          ) : items.length === 0 ? (
            <EmptyState
              icon={HiOutlineFunnel}
              title={t(`auctions:empty.${tab}`)}
              description={t('auctions:empty.hint')}
            />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} language={language} />
                ))}
              </div>
              {query.hasNextPage && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => query.fetchNextPage()}
                    loading={query.isFetchingNextPage}
                  >
                    {t('common:actions.loadMore')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
}