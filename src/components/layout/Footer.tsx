import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Profile } from '../../types/content';
import { SocialLinks } from '../common/SocialLinks';

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="site-footer container">
      <div>
        <Link className="brand" to="/">
          {profile.brand}
        </Link>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
      <div className="footer-right">
        <SocialLinks profile={profile} />
        <Link className="back-top" to="/" aria-label="Voltar ao início">
          <ArrowUp size={17} />
        </Link>
      </div>
    </footer>
  );
}
