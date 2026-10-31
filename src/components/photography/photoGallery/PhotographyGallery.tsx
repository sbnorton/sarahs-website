import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GalleryImage } from '../../../data/images';
import styles from './PhotographyGallery.module.css';
import { FilterButton } from '../../ui/filterButton/FilterButton';
import Lightbox from '../lightbox/Lightbox';

import { imageUrl, imageSrcSet, THUMB_WIDTHS } from '../../../lib/images';

interface Props {
  images: GalleryImage[];
}

export default function PhotographyGallery({ images }: Props) {
  const [galleryImages, setGalleryImages] = useState(images);
  const [isLoading, setIsLoading] = useState(Boolean(import.meta.env.PUBLIC_PHOTOS_API_URL));
  const [activeTag, setActiveTag] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.PUBLIC_PHOTOS_API_URL;
    if (!apiUrl) {
      return;
    }

    let isCurrent = true;

    fetch(apiUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Photo API returned ${response.status}`);
        }

        return (await response.json()) as GalleryImage[];
      })
      .then((apiImages) => {
        if (isCurrent && Array.isArray(apiImages)) {
          setGalleryImages(apiImages);
        }
      })
      .catch(() => {
        // Keep the manifest images when the API is unavailable.
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const visibleImages = useMemo(
    () =>
      activeTag === 'All'
        ? galleryImages
        : galleryImages.filter((image) => image.tags.includes(activeTag)),
    [galleryImages, activeTag],
  );

  const close = useCallback(() => setSelectedIndex(null), []);

  return (
    <>
      {isLoading && <p role="status">Loading photos…</p>}
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
              style={{ aspectRatio: `${image.width || 3} / ${image.height || 2}` }}
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
