import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGem } from 'react-icons/fa';
import { cn } from '../../../utils/cn.js';
import { silkBackgroundStyle } from '../../../assets/silk.js';

const BASE_URL = (import.meta.env.VITE_IMAGES_BASE_URL ?? '').replace(/\/+$/, '');




export function ProductGallery({ images = [], name, backgroundVariant }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const current = images[activeIndex];
  const backgroundStyle = silkBackgroundStyle(backgroundVariant) ?? undefined;

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-500/15',
          backgroundStyle ? 'bg-cover bg-center' : 'bg-silk-fallback',
          !current && 'grid place-items-center',
        )}
        style={backgroundStyle}
      >

        
        {current ? (
          <button
            type="button"
            onClick={() => setZoomed((value) => !value)}
            aria-label={t('common:a11y.zoomImage')}
            aria-pressed={zoomed}
            className={cn(
              'block h-full w-full cursor-zoom-in bg-center bg-no-repeat',
              backgroundStyle && 'bg-cover',
            )}
          >



            <img
              src={`${BASE_URL}/storage${current.image}`}
              alt={name}
              width={640}
              height={800}
              decoding="async"
              fetchPriority="high"
              className={cn(
                'h-full w-full object-cover scale-75 transition-transform duration-300 ease-(--ease-luxury)',
                zoomed && 'scale-[1.7] cursor-zoom-out',
              )}
            />
          </button>
        ) : (
          <FaGem aria-hidden="true" className="size-24 text-white/50" />
        )}
      </div>

      

      {images.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label={t('common:a11y.galleryThumbnails')}>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => {
                setActiveIndex(index);
                setZoomed(false);
              }}
              className={cn(
                'size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors',
                index === activeIndex
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-border-300',
              )}
            >
              <img
                src={`${BASE_URL}/storage${image.image}`}
                alt={`${name} ${index + 1}`}
                width={80}
                height={80}
                decoding="async"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
