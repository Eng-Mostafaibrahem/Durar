import { useTranslation } from 'react-i18next';
import { Container } from '../../../components/Container.jsx';
import { cn } from '../../../utils/cn.js';
import { SectionHeader } from './SectionHeader.jsx';
import { contentText, stoneStories } from '../assets/content.js';

import storyCover1 from '../../../assets/story1.png';
import storyCover2 from '../../../assets/story2.png';
import storyCover3 from '../../../assets/story3.png';

const PICTURES = {
  rarity: storyCover1,
  authenticity: storyCover2,
  heritage: storyCover3,
};

// const TONES = {
//   heritage: 'from-primary-500 to-primary-700',
//   authenticity: 'from-secondary-500 to-secondary-700',
//   rarity: 'from-deep-teal to-deep-navy',
// };

export function StoneStories() {
  const { t } = useTranslation();

  return (
    <section className="bg-bg-main py-16 sm:py-20">
      <Container>
        <SectionHeader title={t('home:story.title')} />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stoneStories.map((story) => {
            const PICTURE = PICTURES[story.key];

            return (
              <div
                key={story.key}
                className={cn(
                  'group relative flex isolate min-h-[500px] flex-col justify-end overflow-hidden  p-6 shadow-md shadow-base-dark/10 transition-transform duration-300 ease-(--ease-luxury) hover:-translate-y-1',
                )}
              >
                {/* <Icon
                  aria-hidden="true"
                  className="absolute -end-6 -top-6 size-28 text-white/15 transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-110"
                /> */}

                <img
                  src={PICTURE}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  loading="lazy"
                  className="absolute inset-0 z-[-1] size-full object-cover transition-transform duration-500 ease-(--ease-luxury) group-hover:scale-[1.05]"
                />
                <p className="font-display text-xl font-bold text-white">
                  {t(`home:story.${story.key}`)}
                </p>
                <p className="mt-2 text-sm text-white/75">{contentText(story.body)}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
