import { useCallback, useMemo, useState } from 'react';
import type { GalleryImage } from '../../../data/images';
import styles from './PhotographyGallery.module.css';
import { FilterButton } from '../../ui/filterButton/FilterButton';
import Lightbox from '../lightbox/Lightbox';

import { imageUrl, imageSrcSet, THUMB_WIDTHS } from '../../../lib/images';

interface Props {
  images: GalleryImage[];
}

export default function PhotographyGallery({ images }: Props) {
  const [activeTag, setActiveTag] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visibleImages = useMemo(
    () => (activeTag === 'All' ? images : images.filter((i) => i.tags.includes(activeTag))),
    [images, activeTag],
  );

  const close = useCallback(() => setSelectedIndex(null), []);

  return (
    <>
      <FilterButton activeFilter={activeTag} setActiveFilter={setActiveTag} />
      <div className={styles.gallery}>
        {visibleImages.map((image, i) => (
          <button
            key={image.id}
            type="button"
            className={styles.imageButton}
            onClick={() => setSelectedIndex(i)}
            aria-label={`View ${image.alt}`}
          >
            <img
              src={imageUrl(image.key, 800)}
              srcSet={imageSrcSet(image.key, THUMB_WIDTHS)}
              sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              alt={image.alt}
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          key={visibleImages[selectedIndex].id}
          images={visibleImages}
          index={selectedIndex}
          onClose={close}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  );
}
