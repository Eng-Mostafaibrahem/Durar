import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn.js';
import phoneImage from '../../../assets/phone.png';
import topoPattern from '../../../assets/vector.svg';
import appStoreBadge from '../../../assets/IOS.png';
import googlePlayBadge from '../../../assets/playStore.png';

const CONTENT = {
  title: { ar: 'حمل تطبيقنا الآن', en: 'Download our app now' },
  description: {
    ar: 'تسوق الآن من مكانك بتطبيقنا بكل سهولة',
    en: 'Shop from anywhere with our app, with ease',
  },
  appStoreAlt: { ar: 'حمّل من App Store', en: 'Download on the App Store' },
  googlePlayAlt: { ar: 'احصل عليه من Google Play', en: 'Get it on Google Play' },
};

// غيّر اللينكات للينكات التطبيق الفعلية
const APP_STORE_URL = '#';
const GOOGLE_PLAY_URL = '#';

export function AppDownloadBanner({ className }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  return (
    <section className={cn('bg-bg-main px-4 pt-16 sm:px-6 sm:pt-24 md:pt-28', className)}>
      <div className="relative isolate mx-auto max-w-screen-2xl rounded-lg bg-[#5c0b1c]">
        {/* خلفية الخطوط الطبوغرافية */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden rounded-lg opacity-40"
          style={{
            backgroundImage: `url(${topoPattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="grid items-center md:grid-cols-2">
          {/* النص: العمود الأول (start) */}
          <div className="px-6 py-10 text-center md:px-[10%] md:py-16 md:text-start">
            <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {CONTENT.title[lang]}
            </h2>

            <p className="mt-3 text-base text-white/90 sm:text-lg lg:text-2xl">
              {CONTENT.description[lang]}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:-translate-y-0.5 p-3 bg-black rounded-md"
              >
                <img
                  src={googlePlayBadge}
                  alt={CONTENT.googlePlayAlt[lang]}
                  decoding="async"
                  loading="lazy"
                  className="h-11 w-auto sm:h-12"
                />
              </a>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:-translate-y-0.5 p-3 bg-black rounded-md"
              >
                <img
                  src={appStoreBadge}
                  alt={CONTENT.appStoreAlt[lang]}
                  decoding="async"
                  loading="lazy"
                  className="h-11 w-auto sm:h-12"
                />
              </a>
            </div>
          </div>

          {/* الموبايل: العمود التاني (end) */}
          <div className="relative order-first h-56 sm:h-72 md:order-none md:h-full md:min-h-[20rem]">
            <img
              src={phoneImage}
              alt=""
              aria-hidden="true"
              decoding="async"
              loading="lazy"
              className="absolute bottom-0 start-1/2 h-[135%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom rtl:translate-x-1/2 md:-top-[22%] md:bottom-auto md:h-[128%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
