import { useTranslation } from 'react-i18next';
import { PageHero } from '../../../components/PageHero.jsx';
import { paths } from '../../../lib/paths.js';
import heroImage from '../../../assets/museum2.webp';

export function MuseumHero() {
  const { t } = useTranslation('museum');

  return (
    <PageHero
      image={heroImage}
      eyebrow={t('hero.eyebrow')}
      title={t('hero.title')}
      subtitle={t('hero.subtitle')}
      primaryCta={t('hero.primaryCta')}
      primaryTo={paths.shop}
      secondaryCta={t('hero.secondaryCta')}
      secondaryTo={paths.tickets}
      overlay="bg-black/55"
      minHeight="min-h-[440px] md:min-h-[580px]"
    />
  );
}