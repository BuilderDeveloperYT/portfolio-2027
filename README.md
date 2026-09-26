# [NOME] — Portfolio

Portfolio personale realizzato con **React + TypeScript + Vite + Tailwind CSS**.
Funziona interamente in locale: nessun backend, nessun database esterno, nessun
servizio cloud. Tutti i dati (progetti e immagini) vengono salvati nel browser
tramite **IndexedDB**.

---

## 1. Installazione

```bash
npm install
```

## 2. Configurazione credenziali admin

Copia il file di esempio e personalizza username e password:

```bash
cp .env.example .env
```

Apri `.env` e modifica:

```
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=la-tua-password
```

Un file `.env` con valori di default (`admin` / `changeme123`) è già presente
nel progetto: **cambialo prima di usare il sito**.

> ⚠️ **Importante**: questa autenticazione è **client-side** e pensata
> esclusivamente per uso locale/personale. Le credenziali finiscono nel
> bundle JavaScript del sito e **non rappresentano un sistema sicuro** per
> un'applicazione esposta pubblicamente su Internet. Se in futuro vorrai
> pubblicare il sito online, sostituisci questo meccanismo con
> un'autenticazione reale lato server.

## 3. Avvio in sviluppo

```bash
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173`.

## 4. Build di produzione

```bash
npm run build
npm run preview   # per testare la build in locale
```

---

## 5. Dove modificare i tuoi dati personali

Tutti i testi statici (nome, titolo, descrizione hero, sezione "chi sono",
formazione, competenze, link di contatto) si trovano in un unico file:

```
src/data/siteContent.ts
```

Apri il file e sostituisci i placeholder:

- `[NOME]` → il tuo nome
- `[EMAIL]` → la tua email
- `[GITHUB_URL]` → link al tuo profilo GitHub
- `[LINKEDIN_URL]` → link al tuo profilo LinkedIn

Puoi anche modificare liberamente i testi di "chi sono", le voci di
formazione (`education`) e l'elenco delle competenze (`skills`) nello stesso
file.

Il `<title>` della pagina e i meta tag SEO/Open Graph si trovano in
`index.html`.

---

## 6. Come accedere all'area admin

1. Vai su `http://localhost:5173/admin`
2. Inserisci username e password configurati nel file `.env`
3. Verrai reindirizzato alla dashboard (`/admin/dashboard`)

Le route `/admin/dashboard`, `/admin/projects/new` e
`/admin/projects/:id/edit` sono protette: se non hai effettuato il login
verrai reindirizzato automaticamente al login.

## 7. Come aggiungere un progetto

1. Dalla dashboard, clicca **"+ Nuovo progetto"**
2. Compila nome, slug (generato automaticamente ma modificabile), breve
   descrizione, descrizione completa, categoria e stato
3. Aggiungi le tecnologie una per una (invio o pulsante "Aggiungi")
4. Inserisci eventuali link (GitHub, Live Demo, Website, Documentazione) —
   i campi lasciati vuoti non verranno mostrati nel portfolio pubblico
5. Carica una **cover** (obbligatoria) e, facoltativamente, altre immagini
   nella **gallery**
6. Controlla l'**anteprima live** sulla destra, che si aggiorna mentre
   compili il form
7. Attiva "Pubblica progetto" se vuoi che sia visibile subito su
   `/progetti`, altrimenti resterà salvato solo in dashboard
8. Clicca **"Salva progetto"**

Il progetto apparirà automaticamente su `/progetti` (se pubblicato), senza
bisogno di modificare alcun file di codice.

## 8. Come caricare le immagini

Nel form di creazione/modifica progetto:

- **Cover principale**: clicca sul riquadro tratteggiato o trascina un file;
  formati supportati JPG, JPEG, PNG, WEBP. Passando il mouse sopra
  un'immagine già caricata puoi sostituirla o rimuoverla.
- **Gallery**: clicca "+ Aggiungi immagini" per selezionarne più di una in
  un colpo solo. Passando il mouse su ogni miniatura puoi spostarla
  (frecce ←/→) o eliminarla.

Le immagini vengono salvate come file binari (Blob) direttamente in
IndexedDB — non vengono convertite in Base64 né salvate in LocalStorage.

## 9. Come modificare un progetto

Dalla dashboard, clicca **"Modifica"** sul progetto desiderato: il form si
apre precompilato con tutti i dati esistenti, inclusa cover e gallery, e
puoi modificare qualsiasi campo allo stesso modo della creazione.

## 10. Come eliminare un progetto

Dalla dashboard, clicca **"Elimina"**: ti verrà chiesta una conferma
("Sei sicuro di voler eliminare questo progetto? Questa operazione non può
essere annullata."). Confermando, vengono eliminati sia i dati del
progetto sia tutte le immagini associate (cover e gallery) da IndexedDB.

## 11. Pubblicare / nascondere un progetto

Nella colonna "Visibilità" della dashboard puoi cliccare direttamente sul
badge **Pubblicato / Nascosto** per cambiare stato senza aprire il form di
modifica. Un progetto nascosto resta visibile solo in dashboard, non nella
pagina pubblica `/progetti`.

---

## 12. Come funzionano IndexedDB e LocalStorage in questo progetto

- **IndexedDB** (database `portfolio-db`) contiene due "object store":
  - `projects`: tutti i dati testuali dei progetti (titolo, descrizioni,
    tecnologie, link, stato, ordine, riferimenti alle immagini, ecc.)
  - `images`: i file immagine veri e propri, salvati come Blob, referenziati
    dai progetti tramite un id
- **LocalStorage** viene usato solo per la sessione di login admin (una
  piccola chiave con username e timestamp di accesso)

I dati sono legati al **browser e all'origine** (`http://localhost:5173`)
in cui li hai creati: se apri il sito da un browser diverso, in modalità
navigazione in incognito, o dopo aver cancellato i dati di navigazione, non
li ritroverai. Non c'è alcuna sincronizzazione tra dispositivi o browser
diversi, perché tutto resta sul tuo computer.

## 13. Come cancellare/resettare i dati locali

Per ripartire da zero puoi:

- **Dagli strumenti sviluppatore del browser**: apri DevTools →
  Application (Chrome/Edge) o Storage (Firefox) → IndexedDB →
  `portfolio-db` → tasto destro → "Delete database". Elimina anche la voce
  `portfolio_admin_session` sotto Local Storage se vuoi forzare il logout.
- **Dalla console del browser**, con il sito aperto:
  ```js
  indexedDB.deleteDatabase('portfolio-db');
  localStorage.removeItem('portfolio_admin_session');
  ```
  poi ricarica la pagina.

---

## 14. Struttura del progetto

```
src/
├── components/       # Componenti riutilizzabili (Navbar, Footer, card, uploader...)
├── pages/             # Pagine pubbliche (Home, Projects, ProjectDetail, Contact)
│   └── admin/         # Pagine area admin (Login, Dashboard, ProjectForm)
├── data/              # Contenuti statici modificabili (siteContent.ts)
├── hooks/             # Hook custom (useProjects, useAuth, useImageUrl)
├── services/          # Logica IndexedDB e autenticazione
├── types/             # Tipi TypeScript condivisi
├── utils/             # Funzioni di utilità (formattazione)
├── App.tsx            # Definizione delle route
└── main.tsx           # Entry point
```

## 15. Stack tecnologico

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- IndexedDB nativo (nessuna libreria esterna per la persistenza)

## 16. Note finali

- Il form di contatto (`/contatti`) è predisposto ma non collegato a un
  servizio di invio email reale (non essendoci un backend): puoi collegarlo
  facilmente a un servizio come Formspree, EmailJS o un semplice `mailto:`.
- Nessun dato personale, progetto, esperienza o link è stato inventato:
  dove necessario trovi placeholder chiaramente indicati (`[NOME]`,
  `[EMAIL]`, `[GITHUB_URL]`, `[LINKEDIN_URL]`) da sostituire con i tuoi dati
  reali.
