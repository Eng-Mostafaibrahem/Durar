import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

/* المحتوى الافتراضي (ar/en) جوه الكومبوننت نفسه */
const DEFAULT_CONTENT = {
  title: {
    ar: "اقتني قطعة تحمل قصة",
    en: "Own a piece that carries a story",
  },
  subtitle: {
    ar: "تشكيلة من الأحجار الكريمة والمجوهرات النادرة، لكل قطعة حكاية تستحق أن تُروى.",
    en: "A curated selection of rare gemstones and jewelry, each with a story worth telling.",
  },
  placeholder: {
    ar: "ابحث عن حجر أو قطعة...",
    en: "Search for a gem or piece...",
  },
  button: { ar: "بحث", en: "Search" },
  tags: [
    { ar: "أحجار كريمة", en: "Gemstones" },
    { ar: "نيازك", en: "Meteorites" },
    { ar: "مجوهرات", en: "Jewelry" },
  ],
};

export  function PageHero({
  image,                         // صورة الخلفية (مطلوبة)
  content = DEFAULT_CONTENT,     // تقدر تمرر محتوى مختلف بنفس الشكل
  eyebrow,
  title,
  subtitle,
  primaryCta,
  primaryTo,
  secondaryCta,
  secondaryTo,
  filterAction,
  searchValue,
  searchPlaceholder,
  searchButtonLabel,
  onSearch,                      // (query) => void
  onTagClick,                    // (tag, lang) => void
  showSearch = false,
  showTags = false,
  overlay = "bg-black/60",       // لون الـ overlay
  minHeight = "min-h-[520px] md:min-h-[640px]",
  className = "",
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const [query, setQuery] = useState(searchValue ?? "");
  const heroTitle = title ?? content.title?.[lang] ?? DEFAULT_CONTENT.title[lang];
  const heroSubtitle =
    subtitle ?? (title ? "" : content.subtitle?.[lang] ?? DEFAULT_CONTENT.subtitle[lang]);
  const placeholder =
    searchPlaceholder ?? content.placeholder?.[lang] ?? DEFAULT_CONTENT.placeholder[lang];
  const submitLabel = searchButtonLabel ?? content.button?.[lang] ?? DEFAULT_CONTENT.button[lang];

  useEffect(() => {
    if (searchValue !== undefined) setQuery(searchValue);
  }, [searchValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`relative isolate flex items-center justify-center overflow-hidden ${minHeight} ${className}`}
    >
      {/* الخلفية */}
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div className={`absolute inset-0 -z-10 ${overlay}`} />

      {/* المحتوى */}
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center text-white">
        {eyebrow && <p className="text-sm font-semibold tracking-wide text-white/80">{eyebrow}</p>}

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">{heroTitle}</h1>

        {heroSubtitle && (
          <p className="max-w-xl text-sm text-white/80 md:text-base">{heroSubtitle}</p>
        )}

        {showSearch && onSearch && (
          <form
            onSubmit={handleSubmit}
            className="mt-2 flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-lg"
          >
            <FiSearch className="ms-3 shrink-0 text-xl text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={placeholder}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="rounded-full bg-[#5c0b1c] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#470815]"
            >
              {submitLabel}
            </button>
          </form>
        )}

        {showTags && content.tags?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {content.tags.map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onTagClick?.(tag, lang)}
                className="rounded-full border border-white/40 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm transition hover:bg-white/15"
              >
                {tag[lang]}
              </button>
            ))}
          </div>
        )}

        {(primaryCta || secondaryCta || filterAction) && (
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {filterAction}
            {primaryCta && primaryTo && (
              <Link
                to={primaryTo}
                className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {primaryCta}
              </Link>
            )}
            {secondaryCta && secondaryTo && (
              <Link
                to={secondaryTo}
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {secondaryCta}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}