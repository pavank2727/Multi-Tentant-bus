import React, { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import OperatorAuth, {
  type OperatorProfile,
} from "../components/operator/OperatorLogin"
import {
  BrandProvider,
  useBrand,
  brandToCssVars,
} from "../contexts/BrandContext"

type OperatorView = "dashboard" | "buses" | "seats" | "routes" | "schedules" | "fares" | "drivers" | "reports" | "settings" | "branding"

const operatorNav: { id: OperatorView; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "buses", label: "Bus Fleet", icon: "⊟" },
  { id: "seats", label: "Seat Designer", icon: "⊞" },
  { id: "routes", label: "Routes", icon: "↗" },
  { id: "schedules", label: "Schedules", icon: "◷" },
  { id: "fares", label: "Fare & Pricing", icon: "₹" },
  { id: "drivers", label: "Drivers & Staff", icon: "◉" },
  { id: "reports", label: "Reports", icon: "▣" },
  { id: "branding", label: "Branding", icon: "🎨" },
  { id: "settings", label: "Settings", icon: "⚙" },
]

/* ── Operator Portal inner (has brand context) ───────────────── */
function OperatorPortalInner({
  operator,
  onLogout,
  onExit,
}: {
  operator: OperatorProfile
  onLogout: () => void
  onExit: () => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname.split("/").pop() as OperatorView
  const view: OperatorView = operatorNav.some((item) => item.id === currentPath)
    ? currentPath
    : "dashboard"
  const { brand } = useBrand()

  return (
    <div
      className="flex h-full"
      style={
        {
          ...brandToCssVars(brand),
          background: brand.surface,
        } as React.CSSProperties
      }
    >
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col bg-white"
        style={{ borderRight: `1px solid ${brand.border}` }}
      >
        {/* Logo + operator identity */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: `1px solid ${brand.border}` }}
        >
          {/* Brand logo — uses operator's brand name & colors */}
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="flex items-center justify-center font-bold text-sm shrink-0"
              style={{
                width: 34,
                height: 34,
                background: brand.primary,
                color: brand.primaryFg,
                borderRadius: brand.radius,
                fontFamily: `'${brand.fontHeading}', sans-serif`,
              }}
            >
              {brand.logoValue.slice(
                0,
                brand.logoType === "initials" ? 2 : 1,
              ) || operator.initials}
            </div>
            <div>
              <div
                className="font-bold leading-none text-sm"
                style={{
                  color: brand.textBase,
                  fontFamily: `'${brand.fontHeading}', sans-serif`,
                }}
              >
                {brand.brandName}
              </div>
              <div
                className="font-mono leading-none mt-0.5"
                style={{
                  color: brand.textMuted,
                  fontSize: 9,
                  letterSpacing: "0.06em",
                }}
              >
                OPERATOR PORTAL
              </div>
            </div>
          </div>

          {/* Operator identity card */}
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{
              background: `color-mix(in srgb, ${brand.primary} 10%, white)`,
              border: `1px solid color-mix(in srgb, ${brand.primary} 30%, white)`,
            }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center font-bold text-xs shrink-0"
              style={{
                background: brand.primary,
                color: brand.primaryFg,
                borderRadius: brand.radius,
                fontFamily: `'${brand.fontHeading}', sans-serif`,
              }}
            >
              {operator.initials}
            </div>
            <div className="min-w-0">
              <div
                className="font-bold text-sm truncate"
                style={{
                  color: brand.textBase,
                  fontFamily: `'${brand.fontHeading}', sans-serif`,
                }}
              >
                {operator.companyName}
              </div>
              <div
                className="font-mono text-xs truncate"
                style={{ color: brand.primary }}
              >
                {operator.id}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {operatorNav.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/operator/${item.id}`)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${
                view === item.id ? "nav-item-active" : ""
              }`}
            >
              <span style={{ fontSize: 13, opacity: 0.75 }}>{item.icon}</span>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: `'${brand.fontBody}', sans-serif` }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div
          className="px-4 py-3 space-y-1"
          style={{ borderTop: `1px solid ${brand.border}` }}
        >
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              color: brand.primary,
              fontFamily: `'${brand.fontBody}', sans-serif`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `color-mix(in srgb, ${brand.primary} 8%, white)`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span>⎋</span> <span>Logout</span>
          </button>
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-slate-50"
            style={{
              color: "#94A3B8",
              fontFamily: `'${brand.fontBody}', sans-serif`,
            }}
          >
            <span>←</span> <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: brand.surface }}
      >
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white"
          style={{ borderBottom: `1px solid ${brand.border}` }}
        >
          <div>
            <div
              className="font-semibold text-sm"
              style={{
                color: brand.textBase,
                fontFamily: `'${brand.fontHeading}', sans-serif`,
              }}
            >
              {operatorNav.find((n) => n.id === view)?.label}
            </div>
            <div
              className="text-xs"
              style={{
                color: brand.textMuted,
                fontFamily: `'${brand.fontMono}', monospace`,
              }}
            >
              {operator.companyName} · {operator.city}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="text-xs"
              style={{
                color: brand.textMuted,
                fontFamily: `'${brand.fontMono}', monospace`,
              }}
            >
              Sun, 06 Sep 2026
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22C55E" }}
              />
              <span
                className="text-xs"
                style={{
                  color: "#16A34A",
                  fontFamily: `'${brand.fontMono}', monospace`,
                }}
              >
                Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-xs"
                style={{
                  background: brand.primary,
                  color: brand.primaryFg,
                  borderRadius: "50%",
                  fontFamily: `'${brand.fontHeading}', sans-serif`,
                }}
              >
                {operator.initials}
              </div>
              <div className="hidden sm:block">
                <div
                  className="font-semibold text-xs"
                  style={{
                    color: brand.textBase,
                    fontFamily: `'${brand.fontHeading}', sans-serif`,
                  }}
                >
                  {operator.ownerName}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: brand.textMuted,
                    fontFamily: `'${brand.fontMono}', monospace`,
                  }}
                >
                  {operator.fleetSize}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  )
}

/* ── Operator Portal (auth gate + brand provider) ────────────── */
function OperatorPortal() {
  const navigate = useNavigate()
  const [operator, setOperator] = useState<OperatorProfile | null>(null)

  if (!operator) {
    return <OperatorAuth onLogin={(op) => setOperator(op)} onBack={() => navigate("/")} />
  }

  return (
    <BrandProvider>
      <OperatorPortalInner
        operator={operator}
        onLogout={() => setOperator(null)}
        onExit={() => navigate("/")}
      />
    </BrandProvider>
  )
}


export default OperatorPortal
