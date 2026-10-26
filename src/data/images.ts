import manifest from './photos.json';

export interface GalleryImage {
  id: string;
  key: string; // path inside the R2 bucket
  alt: string;
  tags: string[];
  width: number;
  height: number;
}

type Entry = Pick<GalleryImage, 'alt' | 'tags' | 'width' | 'height'>;

export const galleryImages: GalleryImage[] = Object.entries(manifest as Record<string, Entry>).map(
  ([file, entry]) => ({ id: file, key: `photos/${file}`, ...entry }),
);
