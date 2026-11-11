import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Profile } from '../../types/content';
import { SocialLinks } from '../common/SocialLinks';
import { ExternalLink } from '../common/ExternalLink';

export function Hero({
  profile,
  hasProjects,
}: {
  profile: Profile;
  hasProjects: boolean;
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-topline">
        <p className="eyebrow">
          <span className="status-dot" /> Portfólio profissional
        </p>
        <span className="mono hero-index">QA / DEVELOPMENT / QUALITY</span>
      </div>
      <p className="hero-role mono">{profile.role}</p>
      <h1 id="hero-title">
        {profile.name.split(' ').slice(0, -1).join(' ')} <br />
        <span>
          {profile.name.split(' ').at(-1)}
          <span className="hero-dot">.</span>
        </span>
      </h1>
      <div className="hero-bottom">
        <div className="hero-copy">
          <p>{profile.intro}</p>
          <div className="hero-actions">
            {hasProjects && (
              <Link className="button button-primary" to="/#projects">
                Explorar projetos <ArrowUpRight size={19} />
              </Link>
            )}
            {profile.resumeUrl && (
              <ExternalLink
                className="button button-secondary"
                href={profile.resumeUrl}
              >
                <FileText size={17} /> Currículo <ArrowUpRight size={16} />
              </ExternalLink>
            )}
          </div>
        </div>
        <div className="hero-note">
          <ArrowDownRight size={32} strokeWidth={1} aria-hidden="true" />
          <p>
            Um olhar atento aos detalhes.
            <br />
            <span>Do primeiro requisito à última validação.</span>
          </p>
          <SocialLinks profile={profile} />
        </div>
      </div>
      <Link to="/#about" className="scroll-cue mono">
        <ArrowDown size={14} /> Conheça meu trabalho
      </Link>
    </section>
  );
}
