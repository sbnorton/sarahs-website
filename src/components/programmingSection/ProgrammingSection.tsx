import { assetPathPrefix, projects } from "../../data/progammingSectionData";
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
          As a computer science student at NTNU, I have worked on lots of
          interesting projects. Here are some of them:
        </p>
      </div>
      <div className={cn(styles.projectGrid)}>
        {projects.map((project) => (
          <article
            className={cn(styles.projectCard, styles[project.tone])}
            key={project.title}
          >
            <div>
              <p className={cn(styles.projectTitle)}>
                {project.title}
                <br />
                {project.subtitle}
              </p>
            </div>
            <div className={cn(styles.projectMeta)}>
              <p>About the app here</p>
              <span className={cn(styles.cardRule)} aria-hidden="true">
                <img alt="" src={`${assetPathPrefix}/9a1d2.svg`} />
              </span>
              <div className={cn(styles.tagRow)}>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
        <a className={cn(styles.courseLink)} href="#design">
          Moving in 3D space;
          <br />
          TDT4196 - Grunnleggende visuell databehandling
        </a>
      </div>
    </section>
  );
}
