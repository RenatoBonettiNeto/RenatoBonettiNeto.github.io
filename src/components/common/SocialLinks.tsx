import { ArrowUpRight, GitFork, BriefcaseBusiness, Mail } from 'lucide-react';
import type { Profile } from '../../types/content';
import { ExternalLink } from './ExternalLink';
import { Tooltip } from './Tooltip';

export function SocialLinks({
  profile,
  labeled = false,
}: {
  profile: Profile;
  labeled?: boolean;
}) {
  return (
    <div className={`social-links ${labeled ? 'social-labeled' : ''}`}>
      {profile.githubUrl && (
        <Tooltip text="Ver meus repositórios no GitHub" disabled={labeled}>
          <ExternalLink
            href={profile.githubUrl}
            aria-label="GitHub (abre em nova aba)"
          >
            <GitFork size={19} />
            {labeled && (
              <>
                GitHub
                <ArrowUpRight size={16} />
              </>
            )}
          </ExternalLink>
        </Tooltip>
      )}
      {profile.linkedinUrl && (
        <Tooltip
          text="Ver meu perfil profissional no LinkedIn"
          disabled={labeled}
        >
          <ExternalLink
            href={profile.linkedinUrl}
            aria-label="LinkedIn (abre em nova aba)"
          >
            <BriefcaseBusiness size={19} />
            {labeled && (
              <>
                LinkedIn
                <ArrowUpRight size={16} />
              </>
            )}
          </ExternalLink>
        </Tooltip>
      )}
      {profile.email && (
        <Tooltip text="Enviar uma mensagem por e-mail" disabled={labeled}>
          <a
            href={`mailto:${profile.email}`}
            aria-label={`Enviar e-mail para ${profile.email}`}
          >
            <Mail size={19} />
            {labeled && (
              <>
                {profile.email}
                <ArrowUpRight size={16} />
              </>
            )}
          </a>
        </Tooltip>
      )}
    </div>
  );
}
