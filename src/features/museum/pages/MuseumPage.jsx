import { useTranslation } from 'react-i18next';
import { Seo } from '../../../components/Seo.jsx';
import { MuseumHero } from '../components/MuseumHero.jsx';
import { MuseumProducts } from '../components/MuseumProducts.jsx';
import { MuseumTicketBanner } from '../components/MuseumTicketBanner.jsx';

export default function MuseumPage() {
  const { t } = useTranslation('museum');

  return (
    <>
      <Seo title={t('pageTitle')} description={t('pageDescription')} />
      <MuseumHero />
      <MuseumProducts />
      {/* <MuseumTicketBanner /> */}
    </>
  );
}