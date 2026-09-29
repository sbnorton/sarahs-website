import { assetPathPrefix } from "../../data/progammingSectionData";
import {
  projectStatusDefinitions,
  projectTagDefinitions,
  projects,
} from "../../data/projects";
import styles from "./ProgrammingSection.module.css";
import shared from "../../styles/shared.module.css";
import { cn } from "./../portfolioStyles";

export default function ProgrammingSection() {
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
        {projects.map((project) => (
          <article
            className={cn(
              styles.projectCard,
              styles[projectStatusDefinitions[project.status].tone],
            )}
            key={project.title}
          >
            <div>
              <p className={cn(styles.projectTitle)}>{project.name}</p>
              <p className={cn(styles.projectStatus)}>
                {projectStatusDefinitions[project.status].label}
              </p>
            </div>
            <div className={cn(styles.projectMeta)}>
              <p className={cn(styles.projectDescription)}>{project.description}</p>
              <span className={cn(styles.cardRule)} aria-hidden="true">
                <img alt="" src={`${assetPathPrefix}/9a1d2.svg`} />
              </span>
              <div className={cn(styles.tagRow)}>
                {project.tags.map((tag) => (
                  <span key={tag}>{projectTagDefinitions[tag].label}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
