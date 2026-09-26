// ---------------------------------------------------------------------------
// Contenuti statici del sito. Modifica questo file per aggiornare
// nome, testi, formazione, competenze e contatti.
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Tiziano Somma',
  title: 'Computer Engineering Student & Developer',
  heroDescription:
    'Studente di Ingegneria Informatica e Automatica alla Sapienza Università di Roma, con una formazione scientifica e una forte passione per programmazione, tecnologia e sviluppo software.',
  about: [
    'Ho studiato per cinque anni al Liceo Scientifico – Scienze Applicate, sviluppando una solida base scientifica e informatica.',
    'Attualmente studio Ingegneria Informatica e Automatica presso la Sapienza Università di Roma, dove sto approfondendo le mie conoscenze in informatica, programmazione e tecnologie digitali.',
    'Mi interessa trasformare idee e problemi in soluzioni concrete attraverso il codice, sperimentando continuamente nuove tecnologie e lavorando a progetti personali.',
  ],
};

export const contactLinks = {
  email: 'info@tizianosomma.it',
  github: 'https://github.com/tizianosomma',
  linkedin: 'https://www.linkedin.com/in/tizianosomma/',
};

export interface EducationEntry {
  period: string;
  institution: string;
  program: string;
  description: string;
}

export const education: EducationEntry[] = [
  {
    period: '2026 — Presente',
    institution: 'Sapienza Università di Roma',
    program: 'Ingegneria Informatica e Automatica',
    description:
      'Percorso universitario orientato all\'informatica, alla programmazione, ai sistemi e alle tecnologie ingegneristiche.',
  },
  {
    period: '2021 — 2026',
    institution: 'Liceo Scientifico – Scienze Applicate',
    program: '',
    description:
      'Formazione scientifica e informatica, con particolare attenzione a matematica, informatica, fisica e materie STEM.',
  },
];

export const skills: string[] = [
  'Python',
  'JavaScript',
  'Java',
  'HTML',
  'CSS',
  'Git',
  'GitHub',
  'Discord Bot Development',
  'Web Development',
  'Software Development',
  'Cybersecurity',
];
