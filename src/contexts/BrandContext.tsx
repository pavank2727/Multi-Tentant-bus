import { createContext, useContext, useState, type ReactNode } from "react"
import { type BrandConfig, DEFAULT_BRAND } from "../types/brand"

interface BrandContextValue {
  brand: BrandConfig
  setBrand: (b: BrandConfig) => void
  updateBrand: <K extends keyof BrandConfig,>(
    key: K,
    value: BrandConfig[K],
  ) => void
  resetBrand: () => void
}

const BrandContext = createContext<BrandContextValue | null>(null)

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>({ ...DEFAULT_BRAND })

  const updateBrand = <K extends keyof BrandConfig,>(
    key: K,
    value: BrandConfig[K],
  ) => setBrand((p) => ({ ...p, [key]: value }))

  const resetBrand = () => setBrand({ ...DEFAULT_BRAND })

  return (
    <BrandContext.Provider value={{ brand, setBrand, updateBrand, resetBrand }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const ctx = useContext(BrandContext)
  if (!ctx) throw new Error("useBrand must be used inside BrandProvider")
  return ctx
}

/** Convert BrandConfig into a flat CSS custom-property map to inject on the portal root. */
export function brandToCssVars(b: BrandConfig): React.CSSProperties {
  return {
    "--brand-primary": b.primary,
    "--brand-primary-fg": b.primaryFg,
    "--brand-accent": b.accent,
    "--brand-accent-fg": b.accentFg,
    "--brand-bg": b.bg,
    "--brand-surface": b.surface,
    "--brand-border": b.border,
    "--brand-text": b.textBase,
    "--brand-muted": b.textMuted,
    "--brand-radius": b.radius,
    "--brand-font-head": `'${b.fontHeading}', sans-serif`,
    "--brand-font-body": `'${b.fontBody}', sans-serif`,
    "--brand-font-mono": `'${b.fontMono}', monospace`,
    /* Override the legacy red tokens so CSS classes pick up the brand */
    "--red": b.primary,
    "--red-light": b.primary + "18",
    "--red-dark": b.primary + "cc",
  } as React.CSSProperties
}
