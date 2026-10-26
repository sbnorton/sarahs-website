import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import type { GalleryImage } from '../../../data/images';
import styles from './Lightbox.module.css';

import { imageUrl, imageSrcSet, FULL_WIDTHS } from '../../../lib/images';

interface Props {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: Props) {
  const image = images[index];
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return onClose();
      if (event.key === ' ') {
        event.preventDefault();
        setZoomed((z) => !z);
        return;
      }
      const step =
        event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : event.key === 'ArrowRight' || event.key === 'ArrowDown'
            ? 1
            : 0;
      if (!step) return;
      event.preventDefault();
      onNavigate((index + step + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, images.length, onClose, onNavigate]);

  const toggleZoom = (event: MouseEvent<HTMLButtonElement>) => {
    if (zoomed) return setZoomed(false);
    const b = event.currentTarget.getBoundingClientRect();
    setZoomOrigin(
      `${((event.clientX - b.left) / b.width) * 100}% ${((event.clientY - b.top) / b.height) * 100}%`,
    );
    setZoomed(true);
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={image.alt}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close image viewer"
        >
          Close
        </button>
        <button
          type="button"
          className={`${styles.fullImageButton} ${zoomed ? styles.zoomed : ''}`}
          onClick={toggleZoom}
          aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
        >
          <img
            src={imageUrl(image.key, 1800)}
            srcSet={imageSrcSet(image.key, FULL_WIDTHS)}
            sizes="100vw"
            alt={image.alt}
            style={{ '--zoom-origin': zoomOrigin } as CSSProperties}
          />
        </button>
      </div>
    </div>
  );
}
