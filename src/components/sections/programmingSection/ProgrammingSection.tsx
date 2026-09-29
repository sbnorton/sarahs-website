import { useCallback, useState } from "react";
import {
  projectLabelDefinitions,
  projects,
  type Project,
} from "../../../data/programmingProjects";
import ProjectModal from "../../projectModal/ProjectModal";
import styles from "./ProgrammingSection.module.css";
import shared from "/src/styles/shared.module.css";
import { cn } from "../../portfolioStyles";

// Card colours used when a project has no screenshot
const cardPalette = ["mint", "rose", "blue"] as const;

// Same project -> same colour on every render (Math.random would differ
// between server and browser and make the colours flicker on hydration)
function paletteFor(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return cardPalette[hash % cardPalette.length];
}

export default function ProgrammingSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setActiveProject(null), []);

  return (
    <section
      className={cn(styles.programming, shared.sectionPad)}
      id="programming"
    >
      <div className={cn(shared.sectionIntro)}>
        <p className={cn(shared.eyebrow)}>01 - Programming</p>
        <p className={cn(shared.sectionCopy)}>
          As a computer science student at NTNU, I have worked on a lot of
          interesting projects. Here are some of them:
        </p>
      </div>

      <div className={cn(styles.projectGrid)}>
        {projects.slice(0, 2).map((project) => {
          const image = project.screenshots?.[0];

          return (
            <article
              key={project.slug}
              className={cn(
                styles.projectCard,
                image ? styles.withImage : styles[paletteFor(project.slug)],
              )}
            >
              <div>
                {image && (
                  <div className={cn(styles.cardImage)}>
                    <img src={image} alt="" loading="lazy" />
                  </div>
                )}

                {/* Stretched button: the whole card is clickable */}
                <button
                  type="button"
                  className={cn(styles.cardButton)}
                  onClick={() => setActiveProject(project)}
                  aria-haspopup="dialog"
                >
                  <span className={cn(styles.projectTitle)}>
                    {project.title}
                  </span>
                </button>

                <div className={cn(styles.projectLabels)}>
                  {project.labels.map((label) => (
                    <span
                      key={label}
                      className={cn(
                        styles.projectStatus,
                        styles[projectLabelDefinitions[label].tone],
                      )}
                    >
                      {projectLabelDefinitions[label].label}
                    </span>
                  ))}
                </div>
              </div>

              <div className={cn(styles.projectMeta)}>
                <p className={cn(styles.projectDescription)}>
                  {project.description}
                </p>

                <div className={cn(styles.tagRow)}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={closeModal} />
      )}

      <div className={cn(styles.projectActions)}>
        <a href="/programming" className={cn(styles.showMoreButton)}>
          Show me more programming projects! <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
