import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { profile } from '../data/siteContent';

const links = [
  { to: '/', label: 'Home' },
  { to: '/progetti', label: 'Progetti' },
  { to: '/contatti', label: 'Contatti' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-base-border/80 bg-base-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <NavLink
          to="/"
          className="font-mono text-sm font-semibold tracking-tight text-base-text focus-ring rounded"
        >
          <span className="text-neon">&gt;</span> {profile.name}
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors focus-ring rounded ${
                  isActive ? 'text-neon' : 'text-base-muted hover:text-base-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contatti" className="btn-primary !px-4 !py-2 text-sm">
            Contattami
          </NavLink>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border border-base-border focus-ring md:hidden"
        >
          <span
            className={`block h-px w-5 bg-base-text transition-transform duration-200 ${
              open ? 'translate-y-[3.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-base-text transition-transform duration-200 ${
              open ? '-translate-y-[3.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden border-b border-base-border/80 bg-base-bg transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-ring ${
                  isActive ? 'bg-neon/10 text-neon' : 'text-base-muted hover:text-base-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contatti" className="btn-primary mt-1 text-sm">
            Contattami
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
