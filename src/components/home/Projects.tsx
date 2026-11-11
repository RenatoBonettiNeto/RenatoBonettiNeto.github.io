import { ArrowRight, ArrowUpRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PortfolioData } from '../../types/content';
import { Section } from '../common/Section';
import { Tags } from '../common/Tags';
import { ExternalLink } from '../common/ExternalLink';
import { ProjectVisual } from '../projects/ProjectVisual';

export function Projects({ projects }: Pick<PortfolioData, 'projects'>) {
  if (!projects.length) return null;
  return (
    <Section
      id="projects"
      eyebrow="03 / Projetos selecionados"
      title="Ideias que viram ferramentas."
    >
      <div className="projects-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.id}>
            <Link
              className="project-cover"
              to={`/projects/${project.slug}`}
              aria-label={`Conhecer ${project.name}`}
            >
              {project.image ? (
                <img
                  src={project.image.src}
                  alt={project.image.alt}
                  loading="lazy"
                  width="800"
                  height="500"
                />
              ) : project.id === 'qa-recorder' ? (
                <ProjectVisual />
              ) : (
                <div className="generic-project-visual">
                  <Code2 size={48} strokeWidth={1} />
                  <span className="mono">{project.name}</span>
                </div>
              )}
              <span className="cover-arrow">
                <ArrowUpRight size={23} />
              </span>
            </Link>
            <div className="project-copy">
              <p className="eyebrow">
                <span className="project-number">
                  {String(index + 1).padStart(2, '0')}
                </span>{' '}
                {project.category}
              </p>
              <h3>
                <Link to={`/projects/${project.slug}`}>{project.name}</Link>
              </h3>
              <p className="project-summary">{project.summary}</p>
              <p>{project.description}</p>
              <Tags items={project.technologies} />
              <div className="project-links">
                <Link className="text-link" to={`/projects/${project.slug}`}>
                  Conhecer o projeto <ArrowRight size={17} />
                </Link>
                {project.repositoryUrl && (
                  <ExternalLink
                    className="text-link"
                    href={project.repositoryUrl}
                  >
                    Repositório <ArrowUpRight size={16} />
                  </ExternalLink>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
