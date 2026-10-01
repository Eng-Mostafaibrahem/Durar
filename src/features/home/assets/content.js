import i18n from '../../../lib/i18n.js';

/**
 * Static fallback content for the landing page. The dashboard project
 * manages the same content through the API (products, categories, banners,
 * FAQ); every entry here is bilingual so the fallback reads naturally in
 * both languages until the endpoints are populated.
 */

export function contentText(item) {
  if (item == null) return '';
  if (typeof item === 'string') return item;

  const language = i18n.resolvedLanguage || 'ar';
  return item[language] ?? item.ar ?? item.en ?? '';
}

const product = (id, categoryKey, backgroundVariant, price, finalPrice, name) => ({
  id,
  categoryKey,
  backgroundVariant,
  price,
  finalPrice,
  name,
});

export const featuredProducts = [
  product(1, 'rings', 'luminous', 24000, 18000, {
    ar: 'خاتم زمرد كولومبي',
    en: 'Colombian Emerald Ring',
  }),
  product(2, 'necklaces', 'satin', 8500, null, {
    ar: 'قلادة نيزك حديدي',
    en: 'Iron Meteorite Pendant',
  }),
  product(3, 'gemstones', 'diagonal', 52000, 39000, {
    ar: 'ياقوت بورمي مصنّف',
    en: 'Certified Burmese Ruby',
  }),
  product(4, 'tiaras', 'deep', 98000, 73500, {
    ar: 'إكليل ألماس رويال',
    en: 'Royal Diamond Tiara',
  }),
];

export const selectedPieces = [
  product(5, 'bracelets', 'deep', 12400, 9920, {
    ar: 'سوار أوبال أسترالي',
    en: 'Australian Opal Bracelet',
  }),
  product(6, 'earrings', 'luminous', 6800, null, {
    ar: 'أقراط تورمالين هندي',
    en: 'Tourmaline Earrings',
  }),
  product(7, 'necklaces', 'satin', 31000, 23250, {
    ar: 'عقد لؤلؤ خليجي',
    en: 'Gulf Pearl Necklace',
  }),
  product(8, 'gemstones', 'diagonal', 44000, null, {
    ar: 'سافير نادر معتمد',
    en: 'Certified Rare Sapphire',
  }),
];

export const featuredAuction = {
  id: 1,
  backgroundVariant: 'deep',
  title: { ar: 'خاتم زمرد «قلب الأرض»', en: 'Emerald Ring "Heart of the Earth"' },
  currentBid: 158000,
  startingPrice: 120000,
  minIncrement: 5000,
  endsAt: new Date(Date.now() + 2 * 86400000 + 7 * 3600000 + 42 * 60000).toISOString(),
  status: 'live',
};

export const stoneStories = [
  {
    key: 'heritage',
    body: {
      ar: 'حِرَف تمتدّ عبر الأجيال، نحفظ إرثها في كل قطعة.',
      en: 'Craft passed down through generations, honored in every piece.',
    },
  },
  {
    key: 'authenticity',
    body: {
      ar: 'كل حجر موثّق بشهادة تتبع منشأه ورحلته.',
      en: 'Every stone is documented with a certificate tracing its origin and journey.',
    },
  },
  {
    key: 'rarity',
    body: {
      ar: 'قطع لا تتكرر، من منابع لم تعد تُروى تتحدث.',
      en: 'One-of-a-kind pieces from sources that seldom speak again.',
    },
  },
];

export const behindRows = [
  {
    key: 'grading',
    icon: 'shield',
    title: { ar: 'كيف نصادق على الأحجار؟', en: 'How do we certify stones?' },
    body: {
      ar: 'نعتمد التقارير من مختبرات عالمية معتمدة، ونضيف بُعدًا إضافيًا عبر خبرائنا قبل أي عرض.',
      en: 'We rely on reports from accredited international labs and add our own expert layer before anything is listed.',
    },
  },
  {
    key: 'origin',
    icon: 'globe',
    title: { ar: 'من أين تأتي النيازات؟', en: 'Where do the meteorites come from?' },
    body: {
      ar: 'من الصحاري والمناطق القطبية، موثّقة بسجلات موقع الاكتشاف وتاريخه.',
      en: 'From deserts and polar regions, documented with the find site and its history.',
    },
  },
  {
    key: 'auction',
    icon: 'clock',
    title: { ar: 'كيف تعمل المزادات؟', en: 'How do the auctions work?' },
    body: {
      ar: 'مزاد مباشر بعدّاد تنازلي واضح، وأدنى زيادة معلنة، وأعلى مزايدة تفوز.',
      en: 'A live auction with a clear countdown, a published increment, and the highest bid wins.',
    },
  },
  {
    key: 'delivery',
    icon: 'truck',
    title: { ar: 'الشحن والتأمين', en: 'Shipping and insurance' },
    body: {
      ar: 'تغليف خاص وتأمين كامل حتى تصل القطعة إلى بابك.',
      en: 'Specialized packaging and full insurance until the piece reaches your door.',
    },
  },
];

export const faqItems = [
  {
    question: { ar: 'هل القطع تشمل شهادات؟', en: 'Do the pieces include certificates?' },
    answer: {
      ar: 'نعم، كل قطعة تأتي بشهادة أصالة، ويمكنك طلب تقرير مختبر مفصّل عند الدفع.',
      en: 'Yes, every piece ships with a certificate of authenticity, and a full lab report can be requested at checkout.',
    },
  },
  {
    question: { ar: 'هل يمكنني إرجاع القطعة؟', en: 'Can I return a piece?' },
    answer: {
      ar: 'نقبل الإرجاع خلال 14 يومًا من الاستلام إذا ظلّت القطعة في حالتها الأصلية بشهاداتها.',
      en: 'Returns are accepted within 14 days of delivery, as long as the piece remains in its original condition with its certificates.',
    },
  },
  {
    question: { ar: 'كيف يتم الشحن الدولي؟', en: 'How does international shipping work?' },
    answer: {
      ar: 'نشحن لمعظم دول العالم عبر شريك لوجستي متخصص في المقتنيات، مع تأمين كامل وتتبع مباشر.',
      en: 'We ship worldwide through a logistics partner specialized in collectibles, fully insured with live tracking.',
    },
  },
  {
    question: { ar: 'ماذا لو فزت في مزاد؟', en: 'What happens if I win an auction?' },
    answer: {
      ar: 'يظهر إجراء «إتمام الدفع» في حسابك، وتُنشأ طلبية القطعة تلقائيًا خلال 24 ساعة من انتهاء المزاد.',
      en: 'A "complete payment" action appears in your account, and a purchase order is created within 24 hours of the auction end.',
    },
  },
];

export const showroomStats = [
  { value: '15+', label: { ar: 'عامًا من التخصص', en: 'years of expertise' } },
  { value: '1200+', label: { ar: 'قطعة موثّقة', en: 'documented pieces' } },
  { value: '20+', label: { ar: 'دولة مصدر', en: 'countries of origin' } },
];

export const editorialSpecs = [
  { key: 'weight', value: { ar: '14.2 قيراط', en: '14.2 carats' } },
  { key: 'origin', value: { ar: 'كولومبيا — منجم موزو', en: 'Colombia — Muzo mine' } },
  { key: 'type', value: { ar: 'زمرد طبيعي غير معالج', en: 'Natural, untreated emerald' } },
  { key: 'certificate', value: { ar: 'GIA + تقريرنا المفصّل', en: 'GIA + our full report' } },
];
