/**
 * Everything specific to the business lives here. Edit this file, not the pages.
 * Placeholders are marked with TODO so they are easy to find before launch.
 */
export const business = {
  name: 'מיסי לנדר',
  nameLatin: 'Landers Tax',
  tagline: 'בודקים אם מגיע לך החזר מס. בלי תשלום מקדים.',

  phone: '058-7979068',
  whatsapp: '972587979068', // international format, digits only. TODO: confirm this number has WhatsApp.
  email: 'hello@landers-tax.co.il', // TODO: real public email (the domain must exist, it is linked from the footer).
  address: 'ישראל',

  // TODO: legal entity details for the terms and privacy pages.
  legalName: 'מיסי לנדר',            // e.g. "מיסי לנדר בע\"מ"
  registrationNumber: 'TODO',         // ח.פ. / ע.מ.
  representativeNote: 'הטיפול בבקשות להחזר מס מבוצע על ידי מייצג מורשה כדין (רואה חשבון או יועץ מס).',

  fees: {
    standard: 15,   // % of the refund actually received
    reservist: 13,  // % for reservists
    vatIncluded: false, // set true if the percentages already include VAT
  },

  /** How long we typically hear back from the Tax Authority, in days. Shown as a range. */
  processingDays: { min: 45, max: 120 },

  lastUpdated: '2026-09-25',
} as const;

export const nav = [
  { to: '/', label: 'ראשי' },
  { to: '/calculator', label: 'בדיקת זכאות' },
  { to: '/upload', label: 'יש לי טופס 106' },
  { to: '/reservists', label: 'משרתי מילואים' },
  { to: '/pricing', label: 'עלויות' },
] as const;

export const legalNav = [
  { to: '/terms', label: 'תנאי שימוש' },
  { to: '/privacy', label: 'מדיניות פרטיות' },
  { to: '/accessibility', label: 'הצהרת נגישות' },
] as const;
