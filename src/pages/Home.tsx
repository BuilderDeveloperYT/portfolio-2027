import { Link } from 'react-router-dom';
import { profile, education, skills } from '../data/siteContent';
import TechBadge from '../components/TechBadge';

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-base-border/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start px-5 py-28 sm:px-8 sm:py-36">
          <div className="animate-fadeInUp mb-5 inline-flex items-center gap-2 rounded-full border border-base-border bg-base-panel px-3.5 py-1.5 font-mono text-xs text-base-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            disponibile per nuovi progetti
          </div>

          <h1 className="animate-fadeInUp text-4xl font-extrabold tracking-tight text-base-text sm:text-6xl" style={{ animationDelay: '80ms' }}>
            {profile.name}
          </h1>
          <p
            className="animate-fadeInUp mt-3 font-mono text-lg text-neon sm:text-xl"
            style={{ animationDelay: '150ms' }}
          >
            {profile.title}
          </p>
          <p
            className="animate-fadeInUp mt-6 max-w-2xl text-base leading-relaxed text-base-muted sm:text-lg"
            style={{ animationDelay: '220ms' }}
          >
            {profile.heroDescription}
          </p>

          <div className="animate-fadeInUp mt-9 flex flex-wrap gap-3" style={{ animationDelay: '300ms' }}>
            <Link to="/progetti" className="btn-primary">
              Scopri i miei progetti
            </Link>
            <Link to="/contatti" className="btn-secondary">
              Contattami
            </Link>
          </div>
        </div>
      </section>

      {/* CHI SONO */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[280px_1fr]">
          <div>
            <p className="section-eyebrow">
              <span>01</span> Chi sono
            </p>
            <h2 className="text-2xl font-bold text-base-text sm:text-3xl">Il mio percorso</h2>
          </div>
          <div className="space-y-4">
            {profile.about.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-base-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* FORMAZIONE */}
      <section className="border-t border-base-border/60 bg-base-panel/30">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="grid gap-12 md:grid-cols-[280px_1fr]">
            <div>
              <p className="section-eyebrow">
                <span>02</span> Formazione
              </p>
              <h2 className="text-2xl font-bold text-base-text sm:text-3xl">Percorso di studi</h2>
            </div>
            <div className="relative space-y-10 border-l border-base-border pl-8">
              {education.map((entry) => (
                <div key={entry.institution} className="relative">
                  <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-base-bg bg-neon shadow-neon-sm" />
                  <p className="font-mono text-xs uppercase tracking-wide text-neon">{entry.period}</p>
                  <h3 className="mt-1.5 text-lg font-semibold text-base-text">{entry.institution}</h3>
                  {entry.program && <p className="text-sm font-medium text-base-muted">{entry.program}</p>}
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-muted">{entry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPETENZE */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[280px_1fr]">
          <div>
            <p className="section-eyebrow">
              <span>03</span> Competenze
            </p>
            <h2 className="text-2xl font-bold text-base-text sm:text-3xl">Tecnologie &amp; competenze</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <TechBadge key={skill} label={skill} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="border-t border-base-border/60 bg-base-panel/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-20 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-bold text-base-text sm:text-3xl">Diamo vita a qualcosa insieme.</h2>
            <p className="mt-2 text-base-muted">Dai un'occhiata ai miei progetti o scrivimi direttamente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/progetti" className="btn-secondary">
              Vedi progetti
            </Link>
            <Link to="/contatti" className="btn-primary">
              Contattami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
