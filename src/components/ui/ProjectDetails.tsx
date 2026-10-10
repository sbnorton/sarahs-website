import { useCallback, useMemo, useState } from 'react';
import { projectLabelDefinitions, type Project } from '../../data/programmingProjects';
import ProjectModal from '../../components/ui/projectModal/ProjectModal';
import styles from './page.module.css';

interface Props {
  projects: Project[];
}

export default function ProjectDetails({ projects }: Props) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState('all');

  const availableTags = useMemo(() => [...new Set(projects.flatMap((p) => p.tags))], [projects]);

  const visibleProjects =
    filter === 'all' ? projects : projects.filter((p) => p.tags.includes(filter));

  const closeModal = useCallback(() => setActiveProject(null), []);

  return (
    <>
      {/* tech filters */}
      <div className={styles.tagFilters} role="group" aria-label="Filter projects by technology">
        {['all', ...availableTags].map((tag) => (
          <button
            key={tag}
            type="button"
            className={styles.tagFilter}
            aria-pressed={filter === tag}
            onClick={() => setFilter(tag)}
          >
            {tag === 'all' ? 'All' : tag}
          </button>
        ))}
      </div>

      {/* Project list */}
      <div className={styles.projectList}>
        {visibleProjects.map((project) => (
          <a
            key={project.slug}
            className={styles.project}
            href={`#${project.slug}`}
            onClick={(event) => {
              event.preventDefault(); // stops the redirect, opens the modal instead
              setActiveProject(project);
            }}
          >
            <span className={styles.projectNumber}>
              {String(projects.indexOf(project) + 1).padStart(2, '0')}
            </span>

            <div className={styles.projectName}>
              <h2>{project.title}</h2>
              <div className={styles.labels}>
                {project.labels.map((label) => {
                  const def = projectLabelDefinitions[label];
                  return (
                    <span key={label} className={`${styles.status} ${styles[def.tone]}`}>
                      {def.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <p className={styles.projectDescription}>{project.description}</p>

            <div className={styles.tags}>
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.projectMeta}>
              <span>{project.year}</span>
              <span className={styles.projectArrow} aria-hidden="true">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      {activeProject && <ProjectModal project={activeProject} onClose={closeModal} />}
    </>
  );
}
