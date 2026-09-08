import { useState, useEffect, useRef } from "react"
import { type BrandConfig, DEFAULT_BRAND } from "../../types/brand"
import { useBrand } from "../../contexts/BrandContext"

/* ─── Font catalogue ─── */
const HEADING_FONTS = [
  "Plus Jakarta Sans",
  "Poppins",
  "Outfit",
  "DM Sans",
  "Work Sans",
  "Nunito",
  "Raleway",
  "Josefin Sans",
  "Playfair Display",
  "Lora",
  "Fraunces",
  "DM Serif Display",
]
const BODY_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Source Sans 3",
  "IBM Plex Sans",
  "Nunito",
  "Poppins",
  "Work Sans",
  "Lato",
  "Manrope",
]
const MONO_FONTS = [
  "JetBrains Mono",
  "Space Mono",
  "DM Mono",
  "Fira Code",
  "Source Code Pro",
  "Courier Prime",
]

/* ─── Colour presets ─── */
const PRESETS = [
  {
    label: "Saffron India",
    primary: "#F97316",
    accent: "#138808",
    bg: "#ffffff",
    textBase: "#0F172A",
  },
  {
    label: "Royal Blue",
    primary: "#2563EB",
    accent: "#7C3AED",
    bg: "#ffffff",
    textBase: "#0F172A",
  },
  {
    label: "Forest Green",
    primary: "#16A34A",
    accent: "#CA8A04",
    bg: "#ffffff",
    textBase: "#0F172A",
  },
  {
    label: "Crimson",
    primary: "#DC2626",
    accent: "#1D4ED8",
    bg: "#ffffff",
    textBase: "#0F172A",
  },
  {
    label: "Midnight Navy",
    primary: "#1E3A5F",
    accent: "#F97316",
    bg: "#F8FAFC",
    textBase: "#0F172A",
  },
  {
    label: "Violet",
    primary: "#7C3AED",
    accent: "#EC4899",
    bg: "#ffffff",
    textBase: "#0F172A",
  },
  {
    label: "Teal",
    primary: "#0D9488",
    accent: "#F59E0B",
    bg: "#ffffff",
    textBase: "#0F172A",
  },
  {
    label: "Warm Charcoal",
    primary: "#374151",
    accent: "#F97316",
    bg: "#FAFAF9",
    textBase: "#1C1917",
  },
]

/* ─── Radius presets ─── */
const RADII = [
  { label: "Sharp", value: "4px" },
  { label: "Soft", value: "10px" },
  { label: "Rounded", value: "16px" },
  { label: "Pill", value: "999px" },
]

/* ─── Helpers ─── */
function hexToRgb(h: string) {
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)
  return { r, g, b }
}
function luminance(h: string) {
  const { r, g, b } = hexToRgb(h)
  return 0.299 * r + 0.587 * g + 0.114 * b
}
function fgFor(bg: string) {
  return luminance(bg) > 160 ? "#0F172A" : "#ffffff"
}

function useFontLoader(fonts: string[]) {
  useEffect(() => {
    const loaded = new Set<string>()
    fonts.forEach((f) => {
      if (loaded.has(f)) return
      loaded.add(f)
      const id = `gf-${f.replace(/ /g, "-")}`
      if (document.getElementById(id)) return
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@400;500;600;700;800&display=swap`
      document.head.appendChild(link)
    })
  }, [fonts.join(",")])
}

/* ─── Section wrapper ─── */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-white rounded-2xl mb-5"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <div className="px-6 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <span
          className="font-jakarta font-black text-sm"
          style={{ color: "#0F172A" }}
        >
          {title}
        </span>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

/* ─── Color swatch picker ─── */
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label
        className="font-mono text-xs uppercase tracking-wider block mb-1.5"
        style={{ color: "#94A3B8" }}
      >
        {label}
      </label>
      <button
        onClick={() => ref.current?.click()}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:shadow-sm"
        style={{ border: "1.5px solid #E2E8F0", background: "#fff" }}
      >
        <span
          className="w-6 h-6 rounded-md shrink-0"
          style={{ background: value, border: "1px solid rgba(0,0,0,0.1)" }}
        />
        <span className="font-mono text-sm" style={{ color: "#0F172A" }}>
          {value}
        </span>
      </button>
      <input
        ref={ref}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 1,
          height: 1,
        }}
      />
    </div>
  )
}

/* ─── Live preview panel ─── */
function LivePreview({ brand }: { brand: BrandConfig }) {
  useFontLoader([brand.fontHeading, brand.fontBody, brand.fontMono])

  const heading = {
    fontFamily: `'${brand.fontHeading}', sans-serif`,
    fontWeight: 800,
  }
  const body = { fontFamily: `'${brand.fontBody}', sans-serif` }
  const mono = { fontFamily: `'${brand.fontMono}', monospace` }

  return (
    <div className="sticky top-6">
      <div
        className="font-mono text-xs uppercase tracking-widest mb-3"
        style={{ color: "#94A3B8" }}
      >
        Live Preview
      </div>

      {/* Navbar preview */}
      <div
        className="rounded-2xl overflow-hidden mb-3"
        style={{ border: "1.5px solid #E2E8F0", background: brand.bg }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            borderBottom: `1px solid ${brand.border}`,
            background: brand.bg,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
              style={{
                background: brand.primary,
                color: brand.primaryFg,
                borderRadius: brand.radius,
                ...heading,
              }}
            >
              {brand.logoType === "emoji"
                ? brand.logoValue
                : brand.logoValue.slice(0, 2).toUpperCase()}
            </div>
            <span style={{ ...heading, color: brand.textBase, fontSize: 14 }}>
              {brand.brandName}
            </span>
          </div>
          <div
            className="px-3 py-1 text-xs font-semibold"
            style={{
              background: brand.primary,
              color: brand.primaryFg,
              borderRadius: brand.radius,
              ...body,
            }}
          >
            Login
          </div>
        </div>

        {/* Hero band */}
        <div
          className="px-4 py-5 text-center"
          style={{ background: brand.primary }}
        >
          <div
            className="text-xs mb-1"
            style={{ ...mono, color: brand.primaryFg, opacity: 0.7 }}
          >
            BOOK YOUR BUS TICKET
          </div>
          <div
            style={{
              ...heading,
              color: brand.primaryFg,
              fontSize: 18,
              lineHeight: 1.2,
            }}
          >
            {brand.brandName}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ ...body, color: brand.primaryFg, opacity: 0.75 }}
          >
            {brand.tagline}
          </div>
        </div>

        {/* Search card preview */}
        <div className="p-4" style={{ background: brand.surface }}>
          <div
            className="rounded-xl p-3 mb-3"
            style={{
              background: brand.bg,
              border: `1px solid ${brand.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex-1 px-3 py-2 rounded-lg text-xs"
                style={{
                  ...body,
                  background: brand.surface,
                  border: `1px solid ${brand.border}`,
                  color: brand.textBase,
                }}
              >
                Mumbai
              </div>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                style={{
                  background: brand.primary,
                  color: brand.primaryFg,
                  borderRadius: brand.radius,
                }}
              >
                ⇄
              </div>
              <div
                className="flex-1 px-3 py-2 rounded-lg text-xs"
                style={{
                  ...body,
                  background: brand.surface,
                  border: `1px solid ${brand.border}`,
                  color: brand.textBase,
                }}
              >
                Pune
              </div>
            </div>
            <div
              className="w-full py-2 rounded-lg text-xs font-semibold text-center"
              style={{
                ...heading,
                background: brand.primary,
                color: brand.primaryFg,
                borderRadius: brand.radius,
              }}
            >
              Search Buses →
            </div>
          </div>

          {/* Bus card */}
          <div
            className="rounded-xl p-3"
            style={{
              background: brand.bg,
              border: `1px solid ${brand.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div style={{ ...heading, color: brand.textBase, fontSize: 12 }}>
                {brand.brandName} Express
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  ...mono,
                  background: brand.accent + "22",
                  color: brand.accent,
                }}
              >
                AC Sleeper
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div
                className="text-xs"
                style={{ ...mono, color: brand.textMuted }}
              >
                08:00 → 11:30
              </div>
              <div
                className="font-bold text-sm"
                style={{ ...heading, color: brand.primary }}
              >
                ₹499
              </div>
            </div>
            <div
              className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold text-center"
              style={{
                ...heading,
                background: brand.accent,
                color: brand.accentFg,
                borderRadius: brand.radius,
              }}
            >
              Select Seats
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            borderTop: `1px solid ${brand.border}`,
            background: brand.bg,
          }}
        >
          <span style={{ ...heading, color: brand.textBase, fontSize: 11 }}>
            {brand.brandName}
          </span>
          <span style={{ ...mono, color: brand.textMuted, fontSize: 9 }}>
            Powered by Yathri
          </span>
        </div>
      </div>

      {/* Booking URL */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
      >
        <div className="font-mono text-xs mb-1" style={{ color: "#138808" }}>
          YOUR BOOKING LINK
        </div>
        <div
          className="font-mono text-xs break-all"
          style={{ color: "#0F172A" }}
        >
          yathri.in/book/{brand.brandName.toLowerCase().replace(/\s+/g, "-")}
        </div>
      </div>
    </div>
  )
}

/* ════════════════ MAIN ════════════════ */
export default function Branding() {
  const { brand, setBrand, resetBrand } = useBrand()
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] =
    useState<"identity" | "colors" | "typography" | "advanced">("identity")

  useFontLoader([...HEADING_FONTS, ...BODY_FONTS, ...MONO_FONTS])

  const set = <K extends keyof BrandConfig>(key: K, value: BrandConfig[K]) =>
    setBrand({ ...brand, [key]: value })

  const applyPreset = (p: typeof PRESETS[0]) => {
    setBrand({
      ...brand,
      primary: p.primary,
      primaryFg: fgFor(p.primary),
      accent: p.accent,
      accentFg: fgFor(p.accent),
      bg: p.bg,
      textBase: p.textBase,
    })
  }

  const reset = () => resetBrand()

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const FORM_TABS = [
    { id: "identity" as const, label: "Identity" },
    { id: "colors" as const, label: "Colours" },
    { id: "typography" as const, label: "Typography" },
    { id: "advanced" as const, label: "Advanced" },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            White-Label Branding
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            Customise every colour, font and identity element — your passengers
            see your brand, not ours.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="font-jakarta font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: "#F8FAFC",
              color: "#64748B",
              border: "1px solid #E2E8F0",
            }}
          >
            Reset
          </button>
          <button
            onClick={save}
            className="font-jakarta font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: saved ? "#138808" : "#F97316",
              color: "#fff",
              minWidth: 110,
            }}
          >
            {saved ? "✓ Saved" : "Publish Brand"}
          </button>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* ── Left: form ── */}
        <div>
          {/* Sub-tab bar */}
          <div
            className="flex gap-1 mb-5 p-1 rounded-xl"
            style={{ background: "#F1F5F9" }}
          >
            {FORM_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex-1 py-2 rounded-lg text-sm transition-all font-jakarta font-semibold"
                style={{
                  background: activeTab === t.id ? "#fff" : "transparent",
                  color: activeTab === t.id ? "#0F172A" : "#64748B",
                  boxShadow:
                    activeTab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── IDENTITY ── */}
          {activeTab === "identity" && (
            <>
              <Section title="Brand Identity">
                <div className="space-y-4">
                  <div>
                    <label
                      className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                      style={{ color: "#94A3B8" }}
                    >
                      Brand / Company Name
                    </label>
                    <input
                      className="op-input w-full"
                      placeholder="Your Travel Name"
                      value={brand.brandName}
                      onChange={(e) => set("brandName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                      style={{ color: "#94A3B8" }}
                    >
                      Tagline
                    </label>
                    <input
                      className="op-input w-full"
                      placeholder="e.g. Safe · Fast · Affordable"
                      value={brand.tagline}
                      onChange={(e) => set("tagline", e.target.value)}
                    />
                  </div>
                </div>
              </Section>

              <Section title="Logo Mark">
                <div className="mb-4">
                  <label
                    className="font-mono text-xs uppercase tracking-wider block mb-2"
                    style={{ color: "#94A3B8" }}
                  >
                    Logo Type
                  </label>
                  <div className="flex gap-2">
                    {(["initials", "text", "emoji"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => set("logoType", t)}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                        style={{
                          background:
                            brand.logoType === t ? "#F97316" : "#F8FAFC",
                          color: brand.logoType === t ? "#fff" : "#64748B",
                          border: `1.5px solid ${
                            brand.logoType === t ? "#F97316" : "#E2E8F0"
                          }`,
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label
                      className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                      style={{ color: "#94A3B8" }}
                    >
                      {brand.logoType === "initials"
                        ? "Initials (2 chars)"
                        : brand.logoType === "emoji"
                          ? "Emoji"
                          : "Short Text"}
                    </label>
                    <input
                      className="op-input w-full"
                      maxLength={
                        brand.logoType === "initials"
                          ? 2
                          : brand.logoType === "emoji"
                            ? 2
                            : 10
                      }
                      placeholder={
                        brand.logoType === "initials"
                          ? "RJ"
                          : brand.logoType === "emoji"
                            ? "🚌"
                            : "Brand"
                      }
                      value={brand.logoValue}
                      onChange={(e) => set("logoValue", e.target.value)}
                    />
                  </div>
                  {/* Logo preview */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 flex items-center justify-center font-bold text-base"
                      style={{
                        background: brand.primary,
                        color: brand.primaryFg,
                        borderRadius: brand.radius,
                        fontFamily: `'${brand.fontHeading}', sans-serif`,
                      }}
                    >
                      {brand.logoValue.slice(
                        0,
                        brand.logoType === "initials" ? 2 : 1,
                      ) || "Y"}
                    </div>
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{
                          color: "#0F172A",
                          fontFamily: `'${brand.fontHeading}', sans-serif`,
                        }}
                      >
                        {brand.brandName || "Brand"}
                      </div>
                      <div className="text-xs" style={{ color: "#94A3B8" }}>
                        Logo preview
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload placeholder */}
                <div
                  className="mt-4 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer transition-all hover:border-orange-300"
                  style={{
                    border: "2px dashed #E2E8F0",
                    background: "#F8FAFC",
                  }}
                >
                  <span style={{ fontSize: 28 }}>🖼</span>
                  <div
                    className="font-jakarta font-semibold text-sm mt-2"
                    style={{ color: "#64748B" }}
                  >
                    Upload custom logo
                  </div>
                  <div
                    className="font-mono text-xs mt-1"
                    style={{ color: "#94A3B8" }}
                  >
                    PNG, SVG — max 1 MB · 1:1 ratio recommended
                  </div>
                  <div
                    className="font-mono text-xs mt-0.5"
                    style={{ color: "#CBD5E1" }}
                  >
                    Coming in next release
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ── COLOURS ── */}
          {activeTab === "colors" && (
            <>
              <Section title="Colour Presets">
                <div className="grid grid-cols-4 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className="rounded-xl p-3 text-left transition-all hover:shadow-md"
                      style={{
                        background: p.bg,
                        border: `1.5px solid ${p.primary}33`,
                      }}
                    >
                      <div className="flex gap-1 mb-2">
                        <div
                          className="w-5 h-5 rounded-md"
                          style={{ background: p.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-md"
                          style={{ background: p.accent }}
                        />
                      </div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: p.textBase, fontSize: 10 }}
                      >
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Custom Colours">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <ColorPicker
                      label="Primary Color"
                      value={brand.primary}
                      onChange={(v) => {
                        set("primary", v)
                        set("primaryFg", fgFor(v))
                      }}
                    />
                    <ColorPicker
                      label="Accent / CTA Color"
                      value={brand.accent}
                      onChange={(v) => {
                        set("accent", v)
                        set("accentFg", fgFor(v))
                      }}
                    />
                    <ColorPicker
                      label="Page Background"
                      value={brand.bg}
                      onChange={(v) => set("bg", v)}
                    />
                  </div>
                  <div className="space-y-4">
                    <ColorPicker
                      label="Surface / Cards"
                      value={brand.surface}
                      onChange={(v) => set("surface", v)}
                    />
                    <ColorPicker
                      label="Border Color"
                      value={brand.border}
                      onChange={(v) => set("border", v)}
                    />
                    <ColorPicker
                      label="Base Text"
                      value={brand.textBase}
                      onChange={(v) => set("textBase", v)}
                    />
                  </div>
                </div>

                {/* Contrast check */}
                <div
                  className="mt-5 rounded-xl p-4 space-y-2"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                >
                  <div
                    className="font-mono text-xs uppercase tracking-wider mb-2"
                    style={{ color: "#94A3B8" }}
                  >
                    Contrast Check
                  </div>
                  {[
                    {
                      label: "Primary text on primary bg",
                      fg: brand.primaryFg,
                      bg: brand.primary,
                    },
                    {
                      label: "Base text on page bg",
                      fg: brand.textBase,
                      bg: brand.bg,
                    },
                    {
                      label: "Accent text on accent bg",
                      fg: brand.accentFg,
                      bg: brand.accent,
                    },
                  ].map((c) => {
                    const lFg = luminance(c.fg)
                    const lBg = luminance(c.bg)
                    const ratio =
                      (Math.max(lFg, lBg) + 12.75) /
                      (Math.min(lFg, lBg) + 12.75)
                    const pass = ratio >= 4.5
                    return (
                      <div
                        key={c.label}
                        className="flex items-center justify-between text-xs"
                      >
                        <span style={{ color: "#64748B" }}>{c.label}</span>
                        <span
                          className="font-mono px-2 py-0.5 rounded-full"
                          style={{
                            background: pass ? "#F0FDF4" : "#FFF7ED",
                            color: pass ? "#138808" : "#EA580C",
                            border: `1px solid ${pass ? "#BBF7D0" : "#FED7AA"}`,
                          }}
                        >
                          {ratio.toFixed(1)}:1 {pass ? "✓ AA" : "✗ Fail"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Section>
            </>
          )}

          {/* ── TYPOGRAPHY ── */}
          {activeTab === "typography" && (
            <Section title="Font Pairing">
              <div className="space-y-6">
                {/* Heading font */}
                <div>
                  <label
                    className="font-mono text-xs uppercase tracking-wider block mb-2"
                    style={{ color: "#94A3B8" }}
                  >
                    Heading Font
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {HEADING_FONTS.map((f) => (
                      <button
                        key={f}
                        onClick={() => set("fontHeading", f)}
                        className="px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                        style={{
                          fontFamily: `'${f}', sans-serif`,
                          fontWeight: 700,
                          background:
                            brand.fontHeading === f ? "#FFF7ED" : "#F8FAFC",
                          border: `1.5px solid ${
                            brand.fontHeading === f ? "#F97316" : "#E2E8F0"
                          }`,
                          color:
                            brand.fontHeading === f ? "#F97316" : "#0F172A",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div
                    className="mt-3 px-4 py-3 rounded-xl"
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: `'${brand.fontHeading}', sans-serif`,
                        fontWeight: 800,
                        fontSize: 22,
                        color: "#0F172A",
                      }}
                    >
                      Book Your Journey
                    </div>
                    <div
                      style={{
                        fontFamily: `'${brand.fontHeading}', sans-serif`,
                        fontWeight: 400,
                        fontSize: 13,
                        color: "#64748B",
                        marginTop: 2,
                      }}
                    >
                      Heading preview — {brand.fontHeading}
                    </div>
                  </div>
                </div>

                {/* Body font */}
                <div>
                  <label
                    className="font-mono text-xs uppercase tracking-wider block mb-2"
                    style={{ color: "#94A3B8" }}
                  >
                    Body Font
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BODY_FONTS.map((f) => (
                      <button
                        key={f}
                        onClick={() => set("fontBody", f)}
                        className="px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                        style={{
                          fontFamily: `'${f}', sans-serif`,
                          background:
                            brand.fontBody === f ? "#FFF7ED" : "#F8FAFC",
                          border: `1.5px solid ${
                            brand.fontBody === f ? "#F97316" : "#E2E8F0"
                          }`,
                          color: brand.fontBody === f ? "#F97316" : "#0F172A",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div
                    className="mt-3 px-4 py-3 rounded-xl"
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: `'${brand.fontBody}', sans-serif`,
                        fontSize: 14,
                        color: "#334155",
                        lineHeight: 1.7,
                      }}
                    >
                      No hidden fees. No commission. You pay what the operator
                      charges — nothing more, nothing less.
                    </div>
                  </div>
                </div>

                {/* Mono font */}
                <div>
                  <label
                    className="font-mono text-xs uppercase tracking-wider block mb-2"
                    style={{ color: "#94A3B8" }}
                  >
                    Mono / Data Font
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {MONO_FONTS.map((f) => (
                      <button
                        key={f}
                        onClick={() => set("fontMono", f)}
                        className="px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                        style={{
                          fontFamily: `'${f}', monospace`,
                          background:
                            brand.fontMono === f ? "#FFF7ED" : "#F8FAFC",
                          border: `1.5px solid ${
                            brand.fontMono === f ? "#F97316" : "#E2E8F0"
                          }`,
                          color: brand.fontMono === f ? "#F97316" : "#0F172A",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div
                    className="mt-3 px-4 py-2 rounded-xl"
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: `'${brand.fontMono}', monospace`,
                        fontSize: 13,
                        color: "#64748B",
                      }}
                    >
                      PNR: YTH-2026-8K42 · DEP: 08:00 · SEAT: A3
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* ── ADVANCED ── */}
          {activeTab === "advanced" && (
            <>
              <Section title="Border Radius">
                <div className="flex gap-3 mb-5">
                  {RADII.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => set("radius", r.value)}
                      className="flex-1 py-3 text-sm font-semibold transition-all"
                      style={{
                        borderRadius:
                          r.value === "999px" ? 999 : parseInt(r.value),
                        background:
                          brand.radius === r.value ? "#F97316" : "#F8FAFC",
                        color: brand.radius === r.value ? "#fff" : "#64748B",
                        border: `1.5px solid ${
                          brand.radius === r.value ? "#F97316" : "#E2E8F0"
                        }`,
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {/* Preview buttons */}
                <div className="flex gap-3">
                  {["Book Now", "Select Seat", "Pay ₹499"].map((l) => (
                    <div
                      key={l}
                      className="px-4 py-2 text-sm font-semibold"
                      style={{
                        background: brand.primary,
                        color: brand.primaryFg,
                        borderRadius: brand.radius,
                        fontFamily: `'${brand.fontHeading}', sans-serif`,
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="White-Label Booking URL">
                <div className="space-y-3">
                  <div>
                    <label
                      className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                      style={{ color: "#94A3B8" }}
                    >
                      Your Public Booking Link
                    </label>
                    <div className="flex gap-2">
                      <div
                        className="flex-1 px-3 py-2.5 rounded-xl font-mono text-sm"
                        style={{
                          background: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          color: "#0F172A",
                        }}
                      >
                        yathri.in/book/
                        {brand.brandName.toLowerCase().replace(/\s+/g, "-") ||
                          "your-brand"}
                      </div>
                      <button
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: "#F0FDF4",
                          color: "#138808",
                          border: "1px solid #BBF7D0",
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    <div
                      className="font-mono text-xs mt-1.5"
                      style={{ color: "#94A3B8" }}
                    >
                      Share this link with passengers. They see your brand,
                      powered silently by Yathri.
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 space-y-2"
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      className="font-mono text-xs uppercase tracking-wider mb-2"
                      style={{ color: "#94A3B8" }}
                    >
                      Custom Domain (Enterprise)
                    </div>
                    <input
                      className="op-input w-full"
                      placeholder="book.yourcompany.in"
                      value={brand.bookingUrl}
                      onChange={(e) => set("bookingUrl", e.target.value)}
                    />
                    <div
                      className="font-mono text-xs"
                      style={{ color: "#94A3B8" }}
                    >
                      Point a CNAME record to portal.yathri.in and we handle
                      SSL.
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg inline-block font-mono text-xs"
                      style={{
                        background: "#FFF7ED",
                        color: "#F97316",
                        border: "1px solid #FED7AA",
                      }}
                    >
                      Available on Pro plan
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Powered-by Badge">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <div
                      className="font-jakarta font-semibold text-sm"
                      style={{ color: "#0F172A" }}
                    >
                      Show "Powered by Yathri"
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "#94A3B8" }}
                    >
                      Displayed in footer and ticket. Hide on Pro plan.
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full font-mono text-xs"
                    style={{
                      background: "#FFF7ED",
                      color: "#F97316",
                      border: "1px solid #FED7AA",
                    }}
                  >
                    Pro only
                  </div>
                </div>
              </Section>
            </>
          )}
        </div>

        {/* ── Right: live preview ── */}
        <LivePreview brand={brand} />
      </div>
    </div>
  )
}
