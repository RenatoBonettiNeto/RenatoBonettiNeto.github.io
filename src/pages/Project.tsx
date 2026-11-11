import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { PortfolioData, Project as ProjectData } from '../types/content';
import { useMetadata } from '../hooks/useMetadata';
import { Tags } from '../components/common/Tags';
import { ExternalLink } from '../components/common/ExternalLink';
import { ProjectVisual } from '../components/projects/ProjectVisual';
import { NotFound } from './NotFound';

function ProjectContent({
  project,
  name,
}: {
  project: ProjectData;
  name: string;
}) {
  useMetadata(`${project.name} | ${name}`, project.description);
  const details = [
    { title: 'Arquitetura e decisões técnicas', items: project.architecture },
    { title: 'Desafios técnicos', items: project.challenges },
    { title: 'Estratégia de testes e qualidade', items: project.testing },
    { title: 'Resultados e benefícios', items: project.results },
  ];
  return (
    <article className="container project-page">
      <Link to="/#projects" className="text-link back-link">
        <ArrowLeft size={16} /> Todos os projetos
      </Link>
      <header className="project-hero">
        <p className="eyebrow">{project.category}</p>
        <h1>
          {project.name}
          <span className="accent">.</span>
        </h1>
        <p className="detail-summary">{project.summary}</p>
        <p className="detail-description">{project.description}</p>
        <Tags items={project.technologies} />
      </header>
      {project.image ? (
        <img
          className="detail-cover"
          src={project.image.src}
          alt={project.image.alt}
        />
      ) : project.id === 'qa-recorder' ? (
        <div className="detail-visual">
          <ProjectVisual />
        </div>
      ) : null}
      <div className="project-narrative">
        {project.problem && (
          <section>
            <p className="eyebrow">Contexto</p>
            <h2>O problema</h2>
            <p>{project.problem}</p>
          </section>
        )}
        {project.solution && (
          <section>
            <p className="eyebrow">Abordagem</p>
            <h2>A solução</h2>
            <p>{project.solution}</p>
          </section>
        )}
      </div>
      {project.features.length > 0 && (
        <section className="detail-section">
          <p className="eyebrow">Dentro do projeto</p>
          <h2>Funcionalidades principais</h2>
          <div className="feature-grid">
            {project.features.map((feature, index) => (
              <div key={feature.title}>
                <span className="mono accent">
                  {String(index + 1).padStart(2, '0')} /
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {details
        .filter((section) => section.items.length > 0)
        .map((section) => (
          <section className="detail-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul className="detail-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      {project.gallery.length > 0 && (
        <section className="detail-section">
          <h2>Galeria</h2>
          <div className="gallery">
            {project.gallery.map((image) => (
              <figure key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {(project.repositoryUrl || project.links.length > 0) && (
        <section className="detail-section">
          <h2>Explore o projeto</h2>
          <div className="project-links">
            {project.repositoryUrl && (
              <ExternalLink
                className="button button-secondary"
                href={project.repositoryUrl}
              >
                Repositório <ArrowUpRight size={17} />
              </ExternalLink>
            )}
            {project.links.map((link) => (
              <ExternalLink
                key={link.url}
                href={link.url}
                className="text-link"
              >
                {link.label}
                <ArrowUpRight size={16} />
              </ExternalLink>
            ))}
          </div>
        </section>
      )}
      <div className="project-return">
        <Link className="button button-secondary" to="/#projects">
          <ArrowLeft size={17} /> Voltar aos projetos
        </Link>
      </div>
    </article>
  );
}

export function Project({ data }: { data: PortfolioData }) {
  const { slug } = useParams();
  const project = data.projects.find((item) => item.slug === slug);
  return project ? (
    <ProjectContent project={project} name={data.profile.name} />
  ) : (
    <NotFound />
  );
}
