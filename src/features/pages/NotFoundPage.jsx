import { useTranslation } from 'react-i18next';
import { HiXCircle } from 'react-icons/hi2';
import { Container } from '../../components/Container.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Seo } from '../../components/Seo.jsx';
import { paths } from '../../lib/paths.js';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('pages:notFound.title')} description={t('pages:notFound.body')} noIndex />

      <Container className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-primary-100 text-primary-500">
          <HiXCircle aria-hidden="true" className="size-8" />
        </span>

        <p className="font-sans text-6xl text-primary-500">404</p>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-base-dark">{t('pages:notFound.title')}</h1>
          <p className="max-w-md text-sm text-hue-500">{t('pages:notFound.body')}</p>
        </div>

        <Button to={paths.home}>{t('pages:notFound.backHome')}</Button>
      </Container>
    </>
  );
}
