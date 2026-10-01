import { useTranslation } from 'react-i18next';
import { HiOutlineTrophy } from 'react-icons/hi2';
import { Seo } from '../../../components/Seo.jsx';
import { Container } from '../../../components/Container.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';
import { paths } from '../../../lib/paths.js';

export default function MyBidsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('account:bids')} description={t('common:tagline')} noIndex />

      <Container className="py-10">
        <h1 className="font-display text-3xl font-bold text-base-dark">{t('account:bids')}</h1>

        <div className="mt-8">
          <EmptyState
            icon={HiOutlineTrophy}
            title={t('auctions:myBids.empty')}
            description={t('auctions:myBids.hint')}
            action={
              <Button to={paths.auctions} variant="primary">
                {t('auctions:myBids.browse')}
              </Button>
            }
          />
        </div>
      </Container>
    </>
  );
}