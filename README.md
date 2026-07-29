# SKIP orders — sito promozionale

Sito statico di presentazione della piattaforma **SKIP orders** (progetto QSR),
pubblicato su GitHub Pages.

## Struttura

| File / cartella        | Contenuto                                                                   |
| ---------------------- | --------------------------------------------------------------------------- |
| `index.html`           | Landing page (hero, funzionalità, come funziona, piattaforma, FAQ, contatti) |
| `style.css`            | Foglio di stile unico, usato anche dalle pagine legali                      |
| `privacy.html`         | Informativa sulla Privacy — **generata**, non modificare a mano             |
| `termini.html`         | Termini e Condizioni per gli Esercenti — **generata**                       |
| `cookie.html`          | Cookie Policy — **generata**                                                |
| `tools/build-legal.js` | Generatore delle tre pagine legali                                          |
| `assets/images/`       | Logo, icone e screenshot dell'applicazione                                  |

Nessuna dipendenza e nessun build step per la landing page: è HTML, CSS e
JavaScript vanilla. Per l'anteprima basta aprire `index.html` nel browser.

## Pagine legali

I testi legali **non sono scritti qui**: sono copiati dal documento canonico del
prodotto, in modo che sito e applicazione non divergano.

Sorgente: `<repo-QSR>/libs/src/lib/core/legal/legal-content.ts`

Quando quei documenti cambiano, rigenera le pagine:

```sh
node tools/build-legal.js
# oppure, se il repo QSR non si trova in ../../QSR/qsr:
node tools/build-legal.js C:/progetti/QSR/qsr
```

Lo script si ferma di proposito se incontra un segnaposto `${...}` che non sa
risolvere, per evitare di pubblicare testo grezzo in una pagina legale.

## Loghi

Il logo del sito deriva dall'icona ufficiale dell'app
(`<repo-QSR>/assets/icon-only.png`), che ha già lo sfondo trasparente.

| File                       | Uso                               |
| -------------------------- | --------------------------------- |
| `skip-logo-lockup.png`     | Logo esteso: header, hero, footer |
| `skip-mark-512/180/32.png` | Solo simbolo: favicon e icona iOS |
| `og-image.png`             | Anteprima per i social (1200×630) |

## Illustrazioni

`stampa-comanda-banco.svg` e `stampa-comanda-tavolo.svg` sono due SVG scritti a
mano (nessuna dipendenza, nessun font esterno) che mostrano la stampante di
cucina con la comanda in uscita. Le due varianti differiscono solo per
l'etichetta stampata sulla comanda — `BANCO` oppure `TAVOLO 4` — così ogni
passaggio di "Come funziona" mostra il caso corretto.

## Contatti pubblicati sul sito

- Email: queueservicerestaurant@gmail.com
- Telefono / WhatsApp: +39 329 534 3049

Il form contatti non ha backend: compone un messaggio `mailto:` già pronto da
inviare. Per raccogliere i contatti in modo automatico serve un servizio esterno
(es. Formspree, Netlify Forms) oppure una Cloud Function.

## Palette

Derivata dal logo:

| Ruolo      | Valore    |
| ---------- | --------- |
| Navy scuro | `#06172b` |
| Navy       | `#0b2540` |
| Blu        | `#1668c9` |
| Blu chiaro | `#2f86ef` |
| Ciano      | `#35c8ef` |
