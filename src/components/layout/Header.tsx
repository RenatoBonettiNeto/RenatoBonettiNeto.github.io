import { useEffect, useRef, useState } from 'react';
import { GitFork, Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { PortfolioData } from '../../types/content';
import { navigation, sectionPath } from '../../utils/content';
import { ExternalLink } from '../common/ExternalLink';

export function Header({ data }: { data: PortfolioData }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => {
    if (!open) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="brand"
          aria-label={`${data.profile.brand} Página inicial`}
          onClick={() => setOpen(false)}
        >
          {data.profile.brand}
          <span className="brand-slash" aria-hidden="true">
            /
          </span>
        </Link>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={open ? 'navigation is-open' : 'navigation'}
        >
          {navigation(data).map(({ id, label }) => (
            <Link
              key={id}
              to={sectionPath(id)}
              aria-current={location.hash === `#${id}` ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {data.profile.githubUrl && (
            <ExternalLink
              className="header-github"
              href={data.profile.githubUrl}
              aria-label="GitHub (abre em nova aba)"
            >
              <GitFork size={17} />
              <span>GitHub</span>
              <ArrowUpRight size={14} />
            </ExternalLink>
          )}
        </nav>
      </div>
    </header>
  );
}
