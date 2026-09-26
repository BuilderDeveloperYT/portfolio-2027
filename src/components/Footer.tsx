import { Link } from 'react-router-dom';
import { profile } from '../data/siteContent';

export default function Footer() {
  return (
    <footer className="border-t border-base-border/80 bg-base-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-base-text">
            {profile.name} <span className="text-base-muted">— Developer &amp; Computer Engineering Student</span>
          </p>
          <p className="mt-0.5 text-xs text-base-muted">© 2026 {profile.name}. All rights reserved.</p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-base-muted">
          <Link to="/" className="transition-colors hover:text-neon focus-ring rounded">
            Home
          </Link>
          <Link to="/progetti" className="transition-colors hover:text-neon focus-ring rounded">
            Progetti
          </Link>
          <Link to="/contatti" className="transition-colors hover:text-neon focus-ring rounded">
            Contatti
          </Link>
        </nav>
      </div>
    </footer>
  );
}
