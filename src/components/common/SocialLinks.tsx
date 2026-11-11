import { ArrowUpRight, GitFork, BriefcaseBusiness, Mail } from 'lucide-react';
import type { Profile } from '../../types/content';
import { ExternalLink } from './ExternalLink';

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
      )}
      {profile.linkedinUrl && (
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
      )}
      {profile.email && (
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
      )}
    </div>
  );
}
