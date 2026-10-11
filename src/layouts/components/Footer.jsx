import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Container } from '../../components/Container.jsx';
import { LanguageSwitcher } from '../../components/LanguageSwitcher.jsx';
import { paths } from '../../lib/paths.js';
import topoPattern from '../../assets/Vector.svg';
import vision2030 from '../../assets/vision.webp';
import logo from '../../assets/logo 4.png';

const MAIN_LINKS = [
  { to: paths.about, labelKey: 'story' },
  { to: paths.shop, labelKey: 'shop' },
  { to: paths.collections, labelKey: 'collections' },
  { to: paths.auctions, labelKey: 'auctions' },
  { to: paths.museumPage, labelKey: 'museum' },
];

const LEGAL_LINKS = [
  { to: paths.terms, labelKey: 'pages:terms.title' },
  { to: paths.privacy, labelKey: 'pages:privacy.title' },
];

export function Footer() {
  const { t } = useTranslation();
  const email = t('pages:contact.emailValue');
  const phone = t('pages:contact.phoneValue');

  return (
    <footer className="relative isolate mt-20 overflow-hidden bg-[#5c0b1c] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `url(${topoPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Container className="flex flex-col items-center gap-5 pb-6 pt-10 text-center sm:gap-6 sm:pt-12">
        <Link to={paths.home} aria-label={t('common:footer.home')}>
          <img src={logo} alt="" decoding="async" className="h-32 w-auto sm:h-32" />
        </Link>

        <LanguageSwitcher className="text-gray-400" />

        <nav aria-label={t('common:footer.navLabel')}>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-base sm:gap-x-8 sm:text-xl">
            {MAIN_LINKS.map(({ to, labelKey }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {t(`common:footer.${labelKey}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-sm sm:text-lg">
          {LEGAL_LINKS.map(({ to, labelKey }) => (
            <li key={to}>
              <Link
                to={to}
                className="rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {t(labelKey)}
              </Link>
            </li>
          ))}
        </ul>

        {/* التواصل: عمود في الموبايل، صف من sm */}
        <ul className="flex flex-col items-center gap-2 text-xs text-white/90 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:text-sm">
          <li className="flex items-center gap-2">
            <FiMail className="size-4 shrink-0" aria-hidden="true" />
            <a href={`mailto:${email}`} dir="ltr" className="hover:underline">
              {email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FiPhone className="size-4 shrink-0" aria-hidden="true" />
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="hover:underline">
              {phone}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FiMapPin className="size-4 shrink-0" aria-hidden="true" />
            <span>{t('pages:contact.showroomValue')}</span>
          </li>
        </ul>
      </Container>

      <div className="border-t border-white/40">
        <Container className="flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-white/90 sm:flex-row sm:text-xs">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:text-start">
            <span>
              © {new Date().getFullYear()} Durar. {t('common:footer.rights')}
            </span>
            {LEGAL_LINKS.map(({ to, labelKey }) => (
              <span key={to} className="flex items-center gap-2">
                <span aria-hidden="true">|</span>
                <Link
                  to={to}
                  className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t(labelKey)}
                </Link>
              </span>
            ))}
          </p>
          <img
            src={vision2030}
            alt="Saudi Vision 2030"
            decoding="async"
            loading="lazy"
            className="h-8 w-auto sm:h-10"
          />
        </Container>
      </div>
    </footer>
  );
}
