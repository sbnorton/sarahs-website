import { galleryImages } from '../../../data/images';
import { imageSrcSet, imageUrl, THUMB_WIDTHS } from '../../../lib/images';
import styles from './PhotographySection.module.css';
import shared from '/src/styles/shared.module.css';
import { cn } from '../../portfolioStyles';

export default function PhotographySection() {
  const previewImages = galleryImages.slice(0, 3);

  return (
    <section className={cn(styles.photoSection, shared.sectionPad)} id="photography">
      <div className={cn(shared.sectionIntro, shared.light)}>
        <p className={cn(shared.eyebrow)}>02 - Photography</p>
        <p className={cn(shared.sectionCopy)}>
          Even though I am usually placed in front of the computer, I also enjoy taking photos. It
          can be everything from landscape, weddings, portraits or travel photography! Contact me if
          you are ever in need of a photographer with dad jokes. Take a look at some of my work
          here:
        </p>
      </div>
      <div className={cn(styles.photoStrip)}>
        {previewImages.map((image, index) => (
          <a
            className={cn(index === 1 ? styles.photoMain : styles.photoEdge)}
            href="/photography"
            key={image.id}
          >
            <img
              src={imageUrl(image.key, 800)}
              srcSet={imageSrcSet(image.key, THUMB_WIDTHS)}
              sizes="(max-width: 520px) 25vw, 20vw"
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </div>
      <div className={cn(styles.galleryCta)}>
        <a href="/photography">
          Visit the gallery <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
