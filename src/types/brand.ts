export interface BrandConfig {
  /* Identity */
  brandName: string;
  tagline: string;
  logoType: "initials" | "text" | "emoji";
  logoValue: string;        // initials, text or emoji character
  /* Colors */
  primary: string;
  primaryFg: string;        // text on primary
  accent: string;
  accentFg: string;
  bg: string;
  surface: string;
  border: string;
  textBase: string;
  textMuted: string;
  /* Typography */
  fontHeading: string;      // Google Font name
  fontBody: string;
  fontMono: string;
  /* Misc */
  radius: string;           // border-radius token e.g. "10px"
  bookingUrl: string;
}

export const DEFAULT_BRAND: BrandConfig = {
  brandName:   "Yathri",
  tagline:     "Book · Travel · Arrive",
  logoType:    "initials",
  logoValue:   "Y",
  primary:     "#F97316",
  primaryFg:   "#ffffff",
  accent:      "#138808",
  accentFg:    "#ffffff",
  bg:          "#ffffff",
  surface:     "#F8FAFC",
  border:      "#E2E8F0",
  textBase:    "#0F172A",
  textMuted:   "#64748B",
  fontHeading: "Plus Jakarta Sans",
  fontBody:    "Inter",
  fontMono:    "JetBrains Mono",
  radius:      "10px",
  bookingUrl:  "yathri.in/book/your-brand",
};
