import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../../data/programmingProjects';
import styles from './ProjectModal.module.css';

interface Props {
  project: Project;
  onClose: () => void;
}

type Slide = { type: 'video'; src: string } | { type: 'image'; src: string; alt: string };

export default function ProjectModal({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);

  // Video first (if any), then every screenshot
  const slides = useMemo<Slide[]>(() => {
    const result: Slide[] = [];
    if (project.videoUrl) result.push({ type: 'video', src: project.videoUrl });
    project.screenshots?.forEach((src, i) =>
      result.push({
        type: 'image',
        src,
        alt: `${project.title} screenshot ${i + 1}`,
      }),
    );
    return result;
  }, [project]);

  const count = slides.length;
  const slide = slides[index];

  const goPrevious = () => setIndex((i) => (i - 1 + count) % count);
  const goNext = () => setIndex((i) => (i + 1) % count);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (count > 1 && event.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + count) % count);
      }
      if (count > 1 && event.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % count);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [onClose, count]);

  // Portal to <body> so parent stacking contexts / transforms can't clip or cover it
  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close project details"
        >
          ×
        </button>

        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>{project.subtitle}</p>
            <h2 className={styles.title}>{project.title}</h2>
          </div>
          {project.year && <span className={styles.year}>{project.year}</span>}
        </header>

        <div className={styles.grid}>
          <div className={styles.media}>
            {slide ? (
              <div
                className={styles.mediaCarousel}
                role="group"
                aria-roledescription="carousel"
                aria-label={`${project.title} media`}
              >
                <div className={styles.mediaViewport}>
                  {slide.type === 'video' ? (
                    <div className={styles.videoFrame}>
                      <iframe
                        src={slide.src}
                        title={`${project.title} demo video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <img className={styles.mediaImage} src={slide.src} alt={slide.alt} />
                  )}

                  {count > 1 && (
                    <>
                      <button
                        type="button"
                        className={`${styles.mediaArrow} ${styles.mediaArrowPrevious}`}
                        onClick={goPrevious}
                        aria-label="Previous media"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className={`${styles.mediaArrow} ${styles.mediaArrowNext}`}
                        onClick={goNext}
                        aria-label="Next media"
                      >
                        ›
                      </button>
                      <span className={styles.mediaCounter} aria-live="polite">
                        {index + 1} / {count}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.placeholder}>No media available</div>
            )}
          </div>

          <aside className={styles.info}>
            <section>
              <p className={styles.label}>Description</p>
              <p>{project.description}</p>
            </section>

            {project.details.length > 0 && (
              <section>
                <p className={styles.label}>Details</p>
                <ul>
                  {project.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <p className={styles.label}>Technologies</p>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </section>

            {project.github && (
              <section>
                <p className={styles.label}>Repository</p>
                <a href={project.github} target="_blank" rel="noreferrer">
                  View on GitHub ↗
                </a>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
