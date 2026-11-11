import {
  ArrowUpRight,
  Award,
  Braces,
  Database,
  GitBranch,
  GraduationCap,
  ScanLine,
} from 'lucide-react';
import type { PortfolioData } from '../../types/content';
import { formatMonth, formatPeriod, learningLabel } from '../../utils/content';
import { Section } from '../common/Section';
import { Tags } from '../common/Tags';
import { ExternalLink } from '../common/ExternalLink';

export function About({ data }: { data: PortfolioData }) {
  return (
    <Section
      id="about"
      eyebrow="01 / Sobre mim"
      title="Qualidade começa com boas perguntas."
      className={`about-section${data.profile.photo ? ' about-section-with-photo' : ''}`}
    >
      <div className="about-content">
        {data.profile.photo && (
          <div className="about-portrait">
            <img
              src={data.profile.photo.src}
              alt={data.profile.photo.alt}
              width="640"
              height="800"
              loading="lazy"
              decoding="async"
              style={{
                transform: `scale(${data.profile.photo.zoom})`,
                transformOrigin: `center ${data.profile.photo.originY}%`,
              }}
            />
          </div>
        )}
        <div className="about-text">
          {data.profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {(data.profile.location || data.profile.languages.length > 0) && (
            <dl className="about-facts">
              {data.profile.location && (
                <div>
                  <dt>Localização</dt>
                  <dd>{data.profile.location}</dd>
                </div>
              )}
              {data.profile.languages.length > 0 && (
                <div>
                  <dt>Idiomas</dt>
                  <dd>{data.profile.languages.join(' · ')}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </Section>
  );
}

const icons = [Braces, ScanLine, Database, GitBranch];
export function Skills({ skills }: Pick<PortfolioData, 'skills'>) {
  if (!skills.length) return null;
  return (
    <Section
      id="skills"
      eyebrow="02 / Competências"
      title="As ferramentas. E o olhar por trás delas."
    >
      <div className="skills-grid">
        {skills.map((skill, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article className="skill-card" key={skill.id}>
              <div className="card-top">
                <Icon size={22} strokeWidth={1.5} />
                <span className="mono">0{index + 1}</span>
              </div>
              <h3>{skill.name}</h3>
              {skill.description && <p>{skill.description}</p>}
              <Tags items={skill.items} />
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function Experience({
  experiences,
}: Pick<PortfolioData, 'experiences'>) {
  if (!experiences.length) return null;
  return (
    <Section
      id="experience"
      eyebrow="Trajetória / Experiência"
      title="Qualidade na prática."
    >
      <ol className="timeline">
        {experiences.map((item) => (
          <li key={item.id}>
            <div className="timeline-meta">
              {formatPeriod(item.startDate, item.endDate, item.current) && (
                <p className="mono">
                  {formatPeriod(item.startDate, item.endDate, item.current)}
                </p>
              )}
              {item.current && (
                <span className="status-label">Vínculo atual</span>
              )}
            </div>
            <article>
              <h3>{item.position}</h3>
              <p className="company">{item.company}</p>
              {item.description && <p>{item.description}</p>}
              <Tags items={item.technologies} />
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Education({ education }: Pick<PortfolioData, 'education'>) {
  if (!education.length) return null;
  const labels = {
    completed: 'Concluído',
    'in-progress': 'Em andamento',
    paused: 'Interrompido',
  };
  return (
    <Section
      id="education"
      eyebrow="Trajetória / Formação"
      title="Conhecimento em construção."
    >
      <div className="record-grid">
        {education.map((item) => (
          <article key={item.id} className="record-card">
            <GraduationCap className="accent" size={24} />
            <span className="status-label">{labels[item.status]}</span>
            <h3>{item.course}</h3>
            <p className="company">{item.institution}</p>
            {formatPeriod(item.startDate, item.endDate) && (
              <p className="mono record-date">
                {formatPeriod(item.startDate, item.endDate)}
                {item.status === 'in-progress' && item.endDate && ' (previsão)'}
              </p>
            )}
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Certifications({
  certifications,
}: Pick<PortfolioData, 'certifications'>) {
  if (!certifications.length) return null;
  return (
    <Section
      id="certifications"
      eyebrow={`Aprendizado / ${learningLabel(certifications)}`}
      title="Aprender. Aplicar. Evoluir."
    >
      <div className="record-grid">
        {certifications.map((item) => (
          <article key={item.id} className="record-card">
            <Award size={24} className="accent" />
            <span className="status-label">
              {item.status === 'completed'
                ? item.kind === 'course'
                  ? 'Curso concluído'
                  : 'Concluída'
                : 'Estudo em andamento'}
            </span>
            <h3>{item.name}</h3>
            <p className="company">{item.issuer}</p>
            {item.completionDate && (
              <p className="record-date">
                Conclusão: {formatMonth(item.completionDate)}
              </p>
            )}
            {item.issueDate && (
              <p className="record-date">
                Emissão: {formatMonth(item.issueDate)}
              </p>
            )}
            {item.expiryDate && (
              <p className="record-date">
                Validade: {formatMonth(item.expiryDate)}
              </p>
            )}
            {item.credentialId && (
              <p className="mono credential">Credencial: {item.credentialId}</p>
            )}
            {item.verificationUrl && (
              <ExternalLink className="text-link" href={item.verificationUrl}>
                Verificar credencial <ArrowUpRight size={16} />
              </ExternalLink>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
