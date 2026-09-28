# Landers Tax (מיסי לנדר)

Marketing site and eligibility calculator for an Israeli tax-refund service for employees and reservists. Hebrew, RTL, static. Hosted on Netlify; leads and uploaded files arrive through Netlify Forms.

## Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/ on http://localhost:4173
```

Requires Node 20+.

## Before launch

Everything business-specific lives in `src/content/business.ts`. Search for `TODO` there and fill in:

- `whatsapp` (confirm the number has WhatsApp), `email` (must be a real, public address)
- `legalName`, `registrationNumber` (ח.פ. / ע.מ.)
- `fees` (percentages, and whether they include VAT)
- `processingDays` (the range shown to visitors)

## Deploy (Netlify)

Netlify builds from GitHub using `netlify.toml` (`npm run build`, publish `dist`, Node 20). No environment variables are needed.

Leads use Netlify Forms. Because the forms are rendered by React, `index.html` contains hidden copies that Netlify detects at deploy time:

| Form | Used for | Fields |
| --- | --- | --- |
| `tax-lead` | Calculator, and the upload page without files | `source`, `fullName`, `phone`, `email`, `taxYear`, `estimate`, `isMiloimnik`, `comments`, `extraDetails`, `eligibilityReasons`, `consent` |
| `advanced-file-lead` | Upload page with files | same, plus `attachmentsList` and `file1`..`file5` |

`src/lib/leads.ts` posts to `/` with the matching `form-name`. If you rename a form or add a field, change both places.

In the Netlify UI:

1. Forms → form detection must be enabled (it already is if the old site received submissions).
2. Forms → Form notifications → add an email notification per form, to the address that should receive leads.
3. Uploaded files are listed on each submission in Forms. Netlify limits uploads to 8 MB per submission; the upload page caps at 5 files and 7 MB in total.

Locally (`npm run dev`) Netlify Forms do not exist, so the form falls back to a prefilled WhatsApp message instead of sending.

Have a lawyer read `src/pages/Legal.tsx` (terms, privacy, accessibility). The copy is careful but generic.

## Structure

```
src/
  app/          App shell and hash router
  content/      Business details and navigation (edit here, not in pages)
  lib/          Tax estimate engine, formatting, lead submission
  state/        Calculator inputs (persisted to sessionStorage for the tab)
  components/
    ui/         Design primitives (Button, Card, Slider, Segmented, Sheet ...)
    calc/       Calculator form, result panel, mobile estimate dock, lead sheet
    layout/     Nav and Footer
  pages/        Home, Calculator, Upload, Reservists, Pricing, Legal
public/         Logos (SVG + PNG), favicon, OG image
assets/         Original brand files
```

## Design notes

- One typeface (Rubik Variable), brand navy `#142347` and orange `#FF6900` from the logo. Navy text on orange buttons for contrast.
- Frosted glass is limited to the floating layer (nav, mobile estimate dock, sheets). Content cards are opaque.
- Light and dark follow the OS. Reduced motion, reduced transparency and increased contrast are honoured.
- The calculator runs entirely in the browser. Nothing is sent anywhere until the visitor submits the contact form; then the answers, the estimate and any files chosen on the upload page go with it.

## Tax engine

`src/lib/tax.ts` applies the real annual brackets, credit points and common credits (partial-year work, job change, unemployment, reserve pay, children, discharged soldiers, degree, donations, pension deposits, qualifying localities) per year 2020 to 2025. It is an estimate; the copy says so everywhere it appears. Update the tables when the Tax Authority publishes new figures.
