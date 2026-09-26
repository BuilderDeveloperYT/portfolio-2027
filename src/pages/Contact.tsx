import { useState, type FormEvent } from 'react';
import { contactLinks } from '../data/siteContent';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Nessun backend collegato: il form è pronto per essere connesso a un servizio
    // di invio email (es. mailto, Formspree, EmailJS) a scelta.
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <p className="section-eyebrow">
        <span>Contatti</span>
      </p>
      <h1 className="text-3xl font-bold text-base-text sm:text-4xl">Let&apos;s build something.</h1>
      <p className="mt-3 max-w-xl text-base-muted">
        Hai un progetto, un&apos;idea o semplicemente vuoi entrare in contatto? Scrivimi.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <div>
            <p className="label-field">Email</p>
            <a href={`mailto:${contactLinks.email}`} className="text-sm text-base-text hover:text-neon">
              {contactLinks.email}
            </a>
          </div>
          <div>
            <p className="label-field">GitHub</p>
            <a href={contactLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm text-base-text hover:text-neon">
              {contactLinks.github}
            </a>
          </div>
          <div>
            <p className="label-field">LinkedIn</p>
            <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-base-text hover:text-neon">
              {contactLinks.linkedin}
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-panel space-y-5 p-6">
          {sent ? (
            <div className="py-8 text-center">
              <p className="text-lg font-semibold text-neon">Messaggio pronto per l&apos;invio ✓</p>
              <p className="mt-2 text-sm text-base-muted">
                Collega questo form a un servizio email per completare l&apos;invio effettivo.
              </p>
              <button type="button" onClick={() => setSent(false)} className="btn-secondary mt-6 text-sm">
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="label-field">
                  Nome
                </label>
                <input
                  id="name"
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="label-field">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="message" className="label-field">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="input-field resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Invia messaggio
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
