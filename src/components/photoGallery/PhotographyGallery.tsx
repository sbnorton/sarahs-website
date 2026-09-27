import { useEffect, useState, type CSSProperties } from 'react';
import type { GalleryImage } from '../../data/images';
import styles from './PhotographyGallery.module.css';
import { FilterButton } from '../filterButton/FilterButton';

interface Props {
  images: GalleryImage[];
}

export default function PhotographyGallery({ images }: Props) {
  const [activeTag, setActiveTag] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');

  const visibleImages = activeTag === 'All' ? images : images.filter((image) => image.tags.includes(activeTag));

  useEffect(() => {
    if (!selectedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const selectImage = (image: GalleryImage) => {
    setZoomed(false);
    setZoomOrigin('50% 50%');
    setSelectedImage(image);
  };

  const toggleZoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (zoomed) {
      setZoomed(false);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setZoomed(true);
  };

  return (
    <>
      <FilterButton activeFilter={activeTag} setActiveFilter={setActiveTag} />
      <div className={styles.gallery}>
        {visibleImages.map((image) => (
          <button key={image.id} type="button" className={styles.imageButton} onClick={() => selectImage(image)} aria-label={`View ${image.alt}`}>
            <img src={image.thumbnail} alt={image.alt} loading="lazy" />
          </button>
        ))}
      </div>
      {selectedImage && (
        <div className={styles.overlay} role="presentation" onClick={() => setSelectedImage(null)}>
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={selectedImage.alt} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.close} onClick={() => setSelectedImage(null)} aria-label="Close image viewer">Close</button>
            <button type="button" className={`${styles.fullImageButton} ${zoomed ? styles.zoomed : ''}`} onClick={toggleZoom} aria-label={zoomed ? 'Zoom out' : 'Zoom in'}>
              <img src={selectedImage.src} alt={selectedImage.alt} style={{ '--zoom-origin': zoomOrigin } as CSSProperties} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
