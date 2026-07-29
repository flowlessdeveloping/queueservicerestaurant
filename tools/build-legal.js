#!/usr/bin/env node
/**
 * Genera le pagine legali statiche del sito promozionale a partire dal
 * documento canonico del prodotto QSR:
 *
 *   <QSR>/libs/src/lib/core/legal/legal-content.ts
 *
 * Il testo NON viene riscritto: viene copiato così com'è. Se i documenti nel
 * prodotto cambiano, ri-esegui questo script per riallineare il sito:
 *
 *   node tools/build-legal.js [percorso-repo-qsr]
 *
 * Percorso QSR di default: ../../QSR/qsr rispetto alla radice del sito.
 */

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const QSR_ROOT = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(SITE_ROOT, '..', '..', 'QSR', 'qsr');

const SOURCE = path.join(
  QSR_ROOT,
  'libs/src/lib/core/legal/legal-content.ts'
);

/** Pagine da generare: costante sorgente -> file di destinazione. */
const PAGES = [
  {
    constName: 'PRIVACY_IT',
    file: 'privacy.html',
    title: 'Informativa sulla Privacy',
    description:
      'Informativa sul trattamento dei dati personali della piattaforma SKIP orders.',
  },
  {
    constName: 'TERMS_MERCHANTS_IT',
    file: 'termini.html',
    title: 'Termini e Condizioni — Esercenti',
    description:
      'Termini e condizioni di utilizzo della piattaforma SKIP orders per i locali aderenti.',
  },
  {
    constName: 'COOKIE_IT',
    file: 'cookie.html',
    title: 'Cookie Policy',
    description: 'Informativa sui cookie della piattaforma SKIP orders.',
  },
];

function readSource() {
  if (!fs.existsSync(SOURCE)) {
    console.error(
      `\n[build-legal] Sorgente non trovata:\n  ${SOURCE}\n\n` +
        `Passa il percorso del repo QSR come argomento:\n` +
        `  node tools/build-legal.js C:/progetti/QSR/qsr\n`
    );
    process.exit(1);
  }
  return fs.readFileSync(SOURCE, 'utf8');
}

/** Estrae il contenuto di `const NOME = \`...\`;` dal file TypeScript. */
function extractConst(src, name) {
  const start = src.indexOf(`const ${name} = \``);
  if (start === -1) throw new Error(`Costante ${name} non trovata in legal-content.ts`);
  const from = src.indexOf('`', start) + 1;
  const to = src.indexOf('`;', from);
  if (to === -1) throw new Error(`Delimitatore di chiusura mancante per ${name}`);
  return src.slice(from, to).trim();
}

/**
 * I documenti sorgente sono template literal: risolve le interpolazioni
 * `${...}` note. Se ne compare una sconosciuta lo script si ferma, per non
 * pubblicare un segnaposto grezzo in una pagina legale.
 */
function resolveInterpolations(text, vars) {
  return text.replace(/\$\{(\w+)\}/g, (match, name) => {
    if (!(name in vars)) {
      throw new Error(
        `Interpolazione non risolta "${match}": aggiungila alla mappa vars in build-legal.js`
      );
    }
    return vars[name];
  });
}

/**
 * Il testo sorgente si apre con il titolo del documento e la riga
 * "Ultimo aggiornamento", che la pagina mostra già nella sua intestazione:
 * li rimuove per non ripeterli due volte.
 */
function stripDuplicateHeading(text) {
  return text
    .replace(/^\s*<h2>[\s\S]*?<\/h2>\s*/i, '')
    .replace(/^\s*<p><strong>Ultimo aggiornamento:<\/strong>[^<]*<\/p>\s*/i, '')
    .trim();
}

function extractLastUpdated(src) {
  const m = src.match(/const LAST_UPDATED = '([^']+)'/);
  return m ? m[1] : null;
}

function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  const mesi = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
  ];
  return `${Number(d)} ${mesi[Number(m) - 1]} ${y}`;
}

function page({ title, description, body, updated }) {
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} — SKIP orders</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#0b2540" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/skip-mark-32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/skip-mark-180.png" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <a class="skip-link" href="#main">Vai al contenuto principale</a>

    <header class="site-header scrolled">
      <nav class="nav" aria-label="Navigazione principale">
        <a class="brand" href="index.html" aria-label="SKIP orders — home">
          <img
            src="assets/images/skip-logo-lockup.png"
            alt="SKIP orders"
            width="660"
            height="242"
            class="brand-logo"
          />
        </a>
        <div class="nav-menu">
          <a href="index.html" class="btn btn-primary btn-sm">Torna al sito</a>
        </div>
      </nav>
    </header>

    <main id="main" class="legal-page">
      <div class="container container-narrow">
        <p class="eyebrow eyebrow-dark">Documenti legali</p>
        <h1>${title}</h1>
${updated ? `        <p class="legal-updated">Ultimo aggiornamento: ${updated}</p>\n` : ''}        <div class="legal-content">
${body}
        </div>

        <p class="legal-footnote">
          Questo documento è una copia statica del testo pubblicato nella
          piattaforma SKIP orders. In caso di discordanza fa fede la versione
          consultabile all'interno dell'applicazione.
        </p>

        <p class="legal-back">
          <a href="index.html">&#8592; Torna alla home</a>
        </p>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-bottom">
          <p>&copy; <span id="year">2026</span> SKIP orders. Tutti i diritti riservati.</p>
          <p class="footer-legal">
            <a href="privacy.html">Privacy Policy</a>
            <span aria-hidden="true">·</span>
            <a href="termini.html">Termini di servizio</a>
            <span aria-hidden="true">·</span>
            <a href="cookie.html">Cookie Policy</a>
          </p>
        </div>
      </div>
    </footer>

    <script>
      document.getElementById("year").textContent = new Date().getFullYear();
    </script>
  </body>
</html>
`;
}

function main() {
  const src = readSource();
  const lastUpdatedIso = extractLastUpdated(src);
  const updated = formatDate(lastUpdatedIso);
  const vars = { LAST_UPDATED: updated || lastUpdatedIso || '' };

  for (const p of PAGES) {
    const raw = resolveInterpolations(extractConst(src, p.constName), vars);
    const body = stripDuplicateHeading(raw)
      .split('\n')
      .map((line) => (line.trim() ? '          ' + line : ''))
      .join('\n');

    const out = path.join(SITE_ROOT, p.file);
    fs.writeFileSync(out, page({ ...p, body, updated }), 'utf8');
    console.log(`[build-legal] scritto ${p.file} (da ${p.constName})`);
  }

  console.log(`[build-legal] sorgente: ${SOURCE}`);
  if (updated) console.log(`[build-legal] ultimo aggiornamento: ${updated}`);
}

main();
