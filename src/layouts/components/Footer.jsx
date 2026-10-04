import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaYoutube, FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Container } from '../../components/Container.jsx';
import { LanguageSwitcher } from '../../components/LanguageSwitcher.jsx';
import { paths } from '../../lib/paths.js';
import topoPattern from '../../assets/Vector.svg';
import vision2030 from '../../assets/vision.webp';
import logo from '../../assets/logo 4.png';

const CONTENT = {
  copyright: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  home: { ar: 'الرئيسية', en: 'Home' },
  navLabel: { ar: 'روابط الفوتر', en: 'Footer' },
  email: 'Durar@example.com',
  phone: '+966 5612345678',
  address: {
    ar: 'الرياض، طريق الملك فهد، المملكة العربية السعودية',
    en: 'Riyadh, King Fahd Road, Saudi Arabia',
  },
};

const MAIN_LINKS = [
  { to: paths.about, label: { ar: 'قصتنا', en: 'Our story' } },
  { to: paths.shop, label: { ar: 'اكتشف', en: 'Discover' } },
  { to: paths.auctions, label: { ar: 'مقتنياتنا', en: 'Collections' } },
  { to: '/museum', label: { ar: 'زيارة المتحف', en: 'Visit the museum' } },
];

const LEGAL_LINKS = [
  { to: '/terms', label: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' } },
  { to: '/privacy', label: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' } },
];

// غيّر اللينكات للحسابات الفعلية
const SOCIALS = [
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaXTwitter, href: '#', label: 'X' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
];

export function Footer() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

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
        <Link to={paths.home} aria-label={CONTENT.home[lang]}>
          <img src={logo} alt="" decoding="async" className="h-32 w-auto sm:h-32" />
        </Link>

        <LanguageSwitcher className="text-gray-400" />

        <nav aria-label={CONTENT.navLabel[lang]}>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-base sm:gap-x-8 sm:text-xl">
            {MAIN_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-opacity hover:opacity-70">
                  {l.label[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-sm sm:text-lg">
          {LEGAL_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="transition-opacity hover:opacity-70">
                {l.label[lang]}
              </Link>
            </li>
          ))}
        </ul>

        {/* التواصل: عمود في الموبايل، صف من sm */}
        <ul className="flex flex-col items-center gap-2 text-xs text-white/90 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:text-sm">
          <li className="flex items-center gap-2">
            <FiMail className="size-4 shrink-0" aria-hidden="true" />
            <a href={`mailto:${CONTENT.email}`} dir="ltr">{CONTENT.email}</a>
          </li>
          <li className="flex items-center gap-2">
            <FiPhone className="size-4 shrink-0" aria-hidden="true" />
            <a href={`tel:${CONTENT.phone.replace(/\s/g, '')}`} dir="ltr">{CONTENT.phone}</a>
          </li>
          <li className="flex items-center gap-2">
            <FiMapPin className="size-4 shrink-0" aria-hidden="true" />
            <span>{CONTENT.address[lang]}</span>
          </li>
        </ul>

        <ul className="flex items-center gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-white/80 transition-colors hover:bg-white hover:text-[#5c0b1c] sm:size-8"
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Container>

      <div className="border-t border-white/40">
        <Container className="flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-white/90 sm:flex-row sm:text-xs">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:text-start">
            <span>
              © {new Date().getFullYear()} Durar. {CONTENT.copyright[lang]}
            </span>
            {LEGAL_LINKS.map((l) => (
              <span key={l.to} className="flex items-center gap-2">
                <span aria-hidden="true">|</span>
                <Link to={l.to} className="hover:underline">{l.label[lang]}</Link>
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