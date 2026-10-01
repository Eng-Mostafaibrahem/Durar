import { useTranslation } from 'react-i18next';
import { Seo } from '../../../components/Seo.jsx';
import { Hero } from '../components/Hero.jsx';
import { FeaturedPicks } from '../components/FeaturedPicks.jsx';
import { OffersShowcase } from '../components/OffersShowcase.jsx';
import { CollectionsShowcase } from '../components/CollectionsShowcase.jsx';
import { EditorialBlock } from '../components/EditorialBlock.jsx';
import { SelectedPieces } from '../components/SelectedPieces.jsx';
import { FeaturedAuction } from '../components/FeaturedAuction.jsx';
import { StoneStories } from '../components/StoneStories.jsx';
import { BehindTheStone } from '../components/BehindTheStone.jsx';
import { OriginEditorial } from '../components/OriginEditorial.jsx';
import { MuseumSection } from '../components/Showroom.jsx';
import { VisitBanner } from './../components/GalleryCta';
import { FaqSection } from './../components/FaqAccordion';
import { AppDownloadBanner } from './../components/AppCta';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('home:hero.title')} description={t('common:tagline')} />

      <Hero />
      <SelectedPieces />
      <CollectionsShowcase />
      <EditorialBlock />
      <FeaturedPicks />
      {/* <OffersShowcase /> */}
      <FeaturedAuction />
      <StoneStories />
      <BehindTheStone />
      <OriginEditorial />
      <MuseumSection />
      <VisitBanner />
      <FaqSection />
      <AppDownloadBanner />
    </>
  );
}
