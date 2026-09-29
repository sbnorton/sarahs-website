import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  projectLabelDefinitions,
  type Project,
} from "../../data/programmingProjects";
import styles from "./page.module.css";

interface Props {
  projects: Project[];
}

export default function ProjectDetails({ projects }: Props) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("all");

  const availableTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))],
    [projects],
  );

  const visibleProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  const closeModal = useCallback(() => setActiveProject(null), []);

  return (
    <>
      {/* technology filters */}
      <div
        className={styles.tagFilters}
        role="group"
        aria-label="Filter projects by technology"
      >
        {["all", ...availableTags].map((tag) => (
          <button
            key={tag}
            type="button"
            className={styles.tagFilter}
            aria-pressed={filter === tag}
            onClick={() => setFilter(tag)}
          >
            {tag === "all" ? "All" : tag}
          </button>
        ))}
      </div>

      {/* project list */}
      <div className={styles.projectList}>
        {visibleProjects.map((project) => (
          <a
            key={project.slug}
            className={styles.project}
            href={`#${project.slug}`}
            onClick={(event) => {
              event.preventDefault();
              setActiveProject(project);
            }}
          >
            <span className={styles.projectNumber}>
              {String(projects.indexOf(project) + 1).padStart(2, "0")}
            </span>

            <div className={styles.projectName}>
              <h2>{project.title}</h2>

              <div className={styles.labels}>
                {project.labels.map((label) => {
                  const def = projectLabelDefinitions[label];

                  return (
                    <span
                      key={label}
                      className={`${styles.status} ${styles[def.tone]}`}
                    >
                      {def.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <p className={styles.projectDescription}>
              {project.description}
            </p>

            <div className={styles.tags}>
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.projectMeta}>
              <span>{project.year}</span>

              <span
                className={styles.projectArrow}
                aria-hidden="true"
              >
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={closeModal}
        />
      )}
    </>
  );
}

interface ModalProps {
  project: Project;
  onClose: () => void;
}

type MediaItem =
  | {
      type: "video";
      src: string;
    }
  | {
      type: "image";
      src: string;
      index: number;
    };

function ProjectModal({ project, onClose }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeMedia, setActiveMedia] = useState(0);

  /*
   * build one list containing all available media.
   * the video is shown first, followed by screenshots.
   */
  const media = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];

    if (project.videoUrl) {
      items.push({
        type: "video",
        src: project.videoUrl,
      });
    }

    project.screenshots?.forEach((src, index) => {
      items.push({
        type: "image",
        src,
        index,
      });
    });

    return items;
  }, [project]);

  /*
   * start at the first media item whenever a new project is opened.
   */
  useEffect(() => {
    setActiveMedia(0);
  }, [project]);

  /*
   * modal keyboard handling and body scroll locking.
   */
  useEffect(() => {
    const previouslyFocused =
      document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (media.length <= 1) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveMedia((current) =>
          current === media.length - 1 ? 0 : current + 1,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveMedia((current) =>
          current === 0 ? media.length - 1 : current - 1,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [media.length, onClose]);

  const showPrevious = () => {
    setActiveMedia((current) =>
      current === 0 ? media.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveMedia((current) =>
      current === media.length - 1 ? 0 : current + 1,
    );
  };

  const currentMedia = media[activeMedia];

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div
        className={styles.modalPanel}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close project details"
        >
          ×
        </button>

        <header className={styles.detailHeader}>
          <div>
            <p className={styles.detailSubtitle}>
              {project.subtitle}
            </p>

            <h2 className={styles.detailTitle}>
              {project.title}
            </h2>
          </div>

          {project.year && (
            <span className={styles.detailYear}>
              {project.year}
            </span>
          )}
        </header>

        <div className={styles.detailGrid}>
          {/* media carousel */}
          <div className={styles.detailMedia}>
            {media.length > 0 ? (
              <div className={styles.mediaCarousel}>
                <div className={styles.mediaViewport}>
                  {currentMedia?.type === "video" && (
                    <div className={styles.videoFrame}>
                      <iframe
                        src={currentMedia.src}
                        title={`${project.title} demo video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {currentMedia?.type === "image" && (
                    <img
                      className={styles.mediaImage}
                      src={currentMedia.src}
                      alt={`${project.title} screenshot ${
                        currentMedia.index + 1
                      }`}
                    />
                  )}
                </div>

                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.mediaArrow} ${styles.mediaArrowPrevious}`}
                      onClick={showPrevious}
                      aria-label="Previous media"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      className={`${styles.mediaArrow} ${styles.mediaArrowNext}`}
                      onClick={showNext}
                      aria-label="Next media"
                    >
                      →
                    </button>

                    <div
                      className={styles.mediaCounter}
                      aria-live="polite"
                    >
                      {activeMedia + 1} / {media.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.mediaPlaceholder}>
                No media available
              </div>
            )}
          </div>

          {/* project information */}
          <aside className={styles.detailInfo}>
            <section>
              <p className={styles.detailLabel}>
                Description
              </p>

              <p>{project.description}</p>
            </section>

            {project.details.length > 0 && (
              <section>
                <p className={styles.detailLabel}>Details</p>

                <ul>
                  {project.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <p className={styles.detailLabel}>
                Technologies
              </p>

              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </section>

            {project.github && (
              <section>
                <p className={styles.detailLabel}>
                  Repository
                </p>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub ↗
                </a>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
