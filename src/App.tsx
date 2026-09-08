import { useState } from "react"
import Dashboard from "./components/operator/Dashboard"
import BusManagement from "./components/operator/BusManagement"
import SeatLayoutDesigner from "./components/operator/SeatLayoutDesigner"
import RouteManagement from "./components/operator/RouteManagement"
import ScheduleManagement from "./components/operator/ScheduleManagement"
import FareManagement from "./components/operator/FareManagement"
import DriverManagement from "./components/operator/DriverManagement"
import Reports from "./components/operator/Reports"
import Settings from "./components/operator/Settings"
import Branding from "./components/operator/Branding"
import SearchPage from "./components/customer/SearchPage"
import BusListing from "./components/customer/BusListing"
import SeatSelection from "./components/customer/SeatSelection"
import BookingFlow from "./components/customer/BookingFlow"
import MyTrips from "./components/customer/MyTrips"
import LoginModal from "./components/customer/LoginModal"
import { busSearchResults } from "./data/mockData"
import YathriLogo from "./components/YathriLogo"
import OperatorAuth, {
  type OperatorProfile,
} from "./components/operator/OperatorLogin"
import {
  BrandProvider,
  useBrand,
  brandToCssVars,
} from "./contexts/BrandContext"

type OperatorView = "dashboard" | "buses" | "seats" | "routes" | "schedules" | "fares" | "drivers" | "reports" | "settings" | "branding"
type CustomerView = "search" | "listing" | "seat-selection" | "booking" | "my-trips"
type Portal = "landing" | "operator" | "customer"

const operatorNav: { id: OperatorView label: string icon: string }[] = [
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

/* ── Landing ─────────────────────────────────────────────────── */
function LandingPage({
  onEnterOperator,
  onEnterCustomer,
}: {
  onEnterOperator: () => void
  onEnterCustomer: () => void
}) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#fff", fontFamily: "inherit" }}
    >
      {/* ── Sticky nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white"
        style={{
          borderBottom: "1px solid #F1F5F9",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <YathriLogo size={36} textColor="#0F172A" />
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full ml-1"
            style={{
              background: "#FFF7ED",
              color: "#F97316",
              border: "1px solid #FED7AA",
            }}
          >
            for India
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEnterCustomer}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-slate-50"
            style={{ color: "#64748B" }}
          >
            Book a Ticket
          </button>
          <button
            onClick={onEnterOperator}
            className="btn-primary px-4 py-2 text-sm"
          >
            Operator Login →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          background: "#fff",
          padding: "88px 32px 80px",
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          {/* Mission pill */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
            style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#F97316" }}
            />
            <span
              className="font-mono text-xs font-semibold tracking-wider"
              style={{ color: "#EA580C" }}
            >
              NOT A STARTUP. NOT A UNICORN. A MOVEMENT.
            </span>
          </div>

          <h1
            className="font-jakarta font-black mb-6"
            style={{
              fontSize: "clamp(38px, 6vw, 68px)",
              lineHeight: 1.08,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            India's bus operators have been
            <br />
            <span style={{ color: "#F97316" }}>paying too much</span> for too
            long.
          </h1>

          <p
            className="mb-10 mx-auto"
            style={{
              fontSize: 20,
              lineHeight: 1.7,
              color: "#64748B",
              maxWidth: 620,
            }}
          >
            Platforms take 10–15% commission on every ticket. A small operator
            running 3 buses loses{" "}
            <span style={{ color: "#0F172A", fontWeight: 600 }}>
              ₹10–15 lakh a year
            </span>{" "}
            just in fees. That money belongs to the driver's family. Not to a
            unicorn's investors.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={onEnterOperator}
              className="font-jakarta font-bold px-7 py-3.5 rounded-xl text-base transition-all hover:opacity-90"
              style={{
                background: "#F97316",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
              }}
            >
              Join as an Operator — It's Free →
            </button>
            <button
              onClick={onEnterCustomer}
              className="font-jakarta font-semibold px-7 py-3.5 rounded-xl text-base transition-all"
              style={{
                background: "#F8FAFC",
                color: "#0F172A",
                border: "1px solid #E2E8F0",
              }}
            >
              Book a Ticket
            </button>
          </div>

          {/* Hero stats */}
          <div className="flex items-center justify-center gap-10 mt-14 flex-wrap">
            {[
              { val: "₹0", sub: "commission per ticket", accent: "#138808" },
              {
                val: "₹499/mo",
                sub: "flat fee, all features",
                accent: "#F97316",
              },
              { val: "100%", sub: "operator-owned data", accent: "#2563EB" },
              {
                val: "Free",
                sub: "for fleets under 3 buses",
                accent: "#138808",
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-jakarta font-black"
                  style={{ fontSize: 28, color: s.accent, lineHeight: 1 }}
                >
                  {s.val}
                </div>
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "#94A3B8" }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── We see you ── */}
      <section style={{ background: "#F8FAFC", padding: "0 0" }}>
        {/* Operator pain */}
        <div
          style={{ borderBottom: "1px solid #E2E8F0", padding: "72px 32px" }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="font-mono text-xs uppercase tracking-widest mb-5"
                style={{ color: "#F97316", letterSpacing: "0.15em" }}
              >
                To every bus operator in India
              </div>
              <h2
                className="font-jakarta font-black mb-6"
                style={{
                  fontSize: "clamp(30px, 3.8vw, 46px)",
                  color: "#0F172A",
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                }}
              >
                You wake up before the sun.
                <br />
                You pay the EMI.
                <br />
                You hire the driver.
                <br />
                You fill the diesel.
                <br />
                <span style={{ color: "#F97316" }}>
                  And then you pay them 12% too.
                </span>
              </h2>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginBottom: 20,
                }}
              >
                Every ticket your passenger books on a big platform, 10 to 15
                rupees out of every 100 goes to them. Not to your family. Not to
                your maintenance. Not to your driver's salary.
              </p>
              <p
                style={{ fontSize: 17, lineHeight: 1.75, fontWeight: 600 }}
                className="font-jakarta"
              >
                <span style={{ color: "#0F172A" }}>
                  You own the risk. They own the margin.
                </span>{" "}
                <span style={{ color: "#64748B" }}>
                  That is not a partnership. That is extraction.
                </span>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  label: "You earn on a ₹700 ticket",
                  you: "₹602",
                  them: "₹98 to platform",
                },
                {
                  label: "Run 2 buses, 300 trips/yr",
                  you: "₹12.5L lost",
                  them: "every single year",
                },
                {
                  label: "Surge demand weekend?",
                  you: "You get nothing extra",
                  them: "Platform keeps surge",
                },
                {
                  label: "You want to leave?",
                  you: "Your data stays behind",
                  them: "You start from zero",
                },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid #FED7AA",
                    borderRadius: 12,
                    padding: "14px 18px",
                  }}
                >
                  <div
                    className="font-mono text-xs mb-2"
                    style={{ color: "#94A3B8", letterSpacing: "0.05em" }}
                  >
                    {r.label}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-jakarta font-bold"
                      style={{ color: "#0F172A", fontSize: 15 }}
                    >
                      {r.you}
                    </span>
                    <span
                      className="font-mono text-xs px-2 py-1 rounded-full"
                      style={{
                        background: "#FFF7ED",
                        color: "#EA580C",
                        border: "1px solid #FED7AA",
                      }}
                    >
                      {r.them}
                    </span>
                  </div>
                </div>
              ))}
              <div
                style={{
                  background: "#FFF7ED",
                  border: "1.5px solid #F97316",
                  borderRadius: 14,
                  padding: "18px 20px",
                  marginTop: 4,
                }}
              >
                <div
                  className="font-jakarta font-black"
                  style={{ color: "#0F172A", fontSize: 18, lineHeight: 1.3 }}
                >
                  We built Yathri so this never happens to you again.
                </div>
                <div
                  className="font-mono text-xs mt-2"
                  style={{ color: "#EA580C" }}
                >
                  ₹0 commission. Your data. Your passengers. Your money.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger pain */}
        <div style={{ background: "#fff", padding: "72px 32px" }}>
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  label: "Base fare set by operator",
                  price: "₹500",
                  note: "What the operator charges",
                },
                {
                  label: "+ Platform convenience fee",
                  price: "+ ₹49",
                  note: "For what, exactly?",
                },
                {
                  label: "+ Booking fee",
                  price: "+ ₹30",
                  note: "Just to confirm",
                },
                {
                  label: "+ GST on fees (not on fare)",
                  price: "+ ₹14",
                  note: "Tax on their fee",
                },
                {
                  label: "You actually pay",
                  price: "₹593",
                  note: "18.6% more than the real fare",
                  highlight: true,
                },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: r.highlight ? "#FFF7ED" : "#F8FAFC",
                    border: `1px solid ${r.highlight ? "#F97316" : "#E2E8F0"}`,
                    borderRadius: 12,
                    padding: "13px 18px",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        color: r.highlight ? "#EA580C" : "#64748B",
                        fontSize: 13,
                      }}
                    >
                      {r.label}
                    </span>
                    <span
                      className="font-jakarta font-black"
                      style={{
                        color: r.highlight ? "#F97316" : "#0F172A",
                        fontSize: r.highlight ? 20 : 15,
                      }}
                    >
                      {r.price}
                    </span>
                  </div>
                  <div
                    className="font-mono text-xs mt-1"
                    style={{ color: r.highlight ? "#EA580C" : "#94A3B8" }}
                  >
                    {r.note}
                  </div>
                </div>
              ))}
              <div
                style={{
                  background: "#F0FDF4",
                  border: "1.5px solid #16A34A",
                  borderRadius: 14,
                  padding: "18px 20px",
                  marginTop: 4,
                }}
              >
                <div
                  className="font-jakarta font-black"
                  style={{ color: "#0F172A", fontSize: 17, lineHeight: 1.3 }}
                >
                  On Yathri you pay ₹500.
                  <br />
                  <span style={{ color: "#138808" }}>
                    That is it. That is all.
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div
                className="font-mono text-xs uppercase tracking-widest mb-5"
                style={{ color: "#138808", letterSpacing: "0.15em" }}
              >
                To every passenger in India
              </div>
              <h2
                className="font-jakarta font-black mb-6"
                style={{
                  fontSize: "clamp(30px, 3.8vw, 46px)",
                  color: "#0F172A",
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                }}
              >
                You searched for ₹500.
                <br />
                You got charged ₹593.
                <br />
                <span style={{ color: "#EA580C" }}>Nobody told you why.</span>
              </h2>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginBottom: 20,
                }}
              >
                Convenience fee. Booking fee. Platform fee. Service charge. Call
                it what you want — it is money going to a middleman who did
                nothing except sit between you and the bus.
              </p>
              <p
                className="font-jakarta font-semibold"
                style={{ color: "#64748B", fontSize: 16, lineHeight: 1.7 }}
              >
                And when the platform runs a discount? They fund it by charging
                the operator more.{" "}
                <span style={{ color: "#0F172A" }}>
                  You are not getting a deal. You are getting the illusion of
                  one.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* We are coming */}
        <div
          style={{
            background: "#FFF7ED",
            borderTop: "1px solid #FED7AA",
            padding: "56px 32px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div
              className="font-mono text-xs uppercase tracking-widest mb-5"
              style={{ color: "#F97316" }}
            >
              AND NOW
            </div>
            <h2
              className="font-jakarta font-black mb-5"
              style={{
                fontSize: "clamp(32px, 5vw, 58px)",
                color: "#0F172A",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              We are coming for you.
              <br />
              <span style={{ color: "#F97316" }}>The right way.</span>
            </h2>
            <p
              style={{
                color: "#64748B",
                fontSize: 18,
                lineHeight: 1.8,
                maxWidth: 540,
                marginTop: 0,
                marginRight: "auto",
                marginBottom: 36,
                marginLeft: "auto",
              }}
            >
              Not to compete. Not to disrupt for disruption's sake. We are
              coming to stand beside every operator who never had a fair
              platform and every passenger who was quietly overcharged for
              years.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                border: "1.5px solid #FED7AA",
                borderRadius: 50,
                padding: "12px 28px",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#F97316",
                }}
              />
              <span
                className="font-jakarta font-bold"
                style={{ color: "#0F172A", fontSize: 16 }}
              >
                Yathri — Built with operators. Built for passengers. Built for
                India.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our answer ── */}
      <section style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-3 text-center"
            style={{ color: "#F97316" }}
          >
            OUR ANSWER
          </div>
          <h2
            className="font-jakarta font-black text-center mb-3"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "#0F172A",
              lineHeight: 1.15,
            }}
          >
            We are not here to compete.
            <br />
            We are here to <span style={{ color: "#F97316" }}>correct.</span>
          </h2>
          <p
            className="text-center mb-14 mx-auto"
            style={{
              fontSize: 18,
              color: "#64748B",
              maxWidth: 580,
              lineHeight: 1.7,
            }}
          >
            Yathri is a mission-driven platform. Every decision we make asks one
            question: does this make life better for the operator and the
            passenger? If not, we don't build it.
          </p>

          {/* Comparison table */}
          <div
            style={{
              border: "1.5px solid #E2E8F0",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                background: "#F8FAFC",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #E2E8F0",
                }}
              />
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #E2E8F0",
                  borderLeft: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <div
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: "#94A3B8" }}
                >
                  Other Platforms
                </div>
              </div>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #E2E8F0",
                  borderLeft: "1px solid #E2E8F0",
                  textAlign: "center",
                  background: "#FFF7ED",
                }}
              >
                <div
                  className="font-jakarta font-bold text-sm"
                  style={{ color: "#F97316" }}
                >
                  Yathri
                </div>
              </div>
            </div>
            {[
              ["Commission per ticket", "10–15%", "₹0 forever"],
              [
                "Monthly platform fee",
                "₹0 (they take more later)",
                "₹499 flat. All features.",
              ],
              ["Free tier for small ops", "No", "Yes — under 3 buses, free"],
              ["You own your passenger data", "No", "Always. 100%."],
              [
                "Surge pricing revenue",
                "Platform keeps it",
                "Operator keeps it",
              ],
              [
                "Custom seat layouts",
                "Fixed templates only",
                "Full designer, your way",
              ],
              ["Open API / data export", "Locked in", "Export anytime, free"],
            ].map(([feature, them, us], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  borderBottom: i < 6 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div
                  style={{
                    padding: "14px 20px",
                    fontSize: 14,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </div>
                <div
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: "#94A3B8",
                    borderLeft: "1px solid #F1F5F9",
                    textAlign: "center",
                  }}
                >
                  {them}
                </div>
                <div
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#16A34A",
                    borderLeft: "1px solid #F1F5F9",
                    textAlign: "center",
                    background: "#F0FDF422",
                  }}
                >
                  {us}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Operators + Customers ── */}
      <section style={{ background: "#F8FAFC", padding: "80px 32px" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Operators */}
          <div
            style={{
              background: "#FFF7ED",
              borderRadius: 24,
              padding: 36,
              border: "1.5px solid #FED7AA",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{ background: "#fff", border: "1px solid #FED7AA" }}
            >
              <span
                className="font-mono text-xs font-bold"
                style={{ color: "#F97316" }}
              >
                FOR OPERATORS
              </span>
            </div>
            <h3
              className="font-jakarta font-black mb-3"
              style={{ fontSize: 28, color: "#0F172A", lineHeight: 1.2 }}
            >
              Run your fleet.
              <br />
              Keep your money.
            </h3>
            <p
              style={{
                color: "#64748B",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Everything a large fleet operator has — route control, live
              scheduling, custom seat layouts, driver tracking, revenue
              analytics — now available to operators with 1 bus or 100.
            </p>
            <div className="space-y-2 mb-8">
              {[
                "Custom seat & berth layout designer",
                "Real-time booking & seat management",
                "Route, schedule & fare control",
                "Driver & staff management",
                "Revenue dashboard & reports",
                "Direct passenger communication",
                "Zero commission. Zero surprises.",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: "#138808",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}
                    >
                      ✓
                    </span>
                  </div>
                  <span style={{ color: "#374151", fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onEnterOperator}
              className="w-full py-3 rounded-xl font-jakarta font-bold text-sm transition-all hover:opacity-90"
              style={{ background: "#F97316", color: "#fff" }}
            >
              Start Free — No Credit Card →
            </button>
          </div>

          {/* Customers */}
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: 36,
              border: "1.5px solid #E2E8F0",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              <span
                className="font-mono text-xs font-bold"
                style={{ color: "#16A34A" }}
              >
                FOR PASSENGERS
              </span>
            </div>
            <h3
              className="font-jakarta font-black mb-3"
              style={{ fontSize: 28, color: "#0F172A", lineHeight: 1.2 }}
            >
              Book honestly.
              <br />
              Travel confidently.
            </h3>
            <p
              style={{
                color: "#64748B",
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              No inflated fares. No mystery fees. You see the real seat layout,
              pick the exact berth you want, and pay what the operator charges —
              nothing more.
            </p>
            <div className="space-y-2 mb-8">
              {[
                "Real seat layouts — see exactly what you book",
                "Lower fares (operators pass savings to you)",
                "No booking fee. No convenience fee.",
                "Upper berth, lower berth — your choice",
                "Transparent cancellation policy",
                "Direct operator contact",
                "Women-only seat filters",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}
                    >
                      ✓
                    </span>
                  </div>
                  <span style={{ color: "#475569", fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onEnterCustomer}
              className="w-full py-3 rounded-xl font-jakarta font-bold text-sm transition-all hover:bg-slate-50"
              style={{
                background: "#F8FAFC",
                color: "#0F172A",
                border: "1.5px solid #E2E8F0",
              }}
            >
              Find a Bus →
            </button>
          </div>
        </div>
      </section>

      {/* ── Mission statement ── */}
      <section
        style={{
          background: "#fff",
          padding: "80px 32px",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-6"
            style={{ color: "#F97316" }}
          >
            OUR MISSION
          </div>
          <h2
            className="font-jakarta font-black mb-6"
            style={{
              fontSize: "clamp(28px, 4.5vw, 50px)",
              color: "#0F172A",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            "We want every bus operator in India — from Kanyakumari to Kashmir —
            to have access to tools that were only built for the powerful."
          </h2>
          <p
            style={{
              color: "#64748B",
              fontSize: 18,
              lineHeight: 1.75,
              marginBottom: 40,
            }}
          >
            We are not a startup chasing a Series B. We are not building to
            sell. We believe India's 25 lakh bus operators are the backbone of
            rural and semi-urban mobility — and they deserve a platform that is
            on their side. Not extracting from them.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 16,
              textAlign: "left",
            }}
          >
            {[
              {
                num: "25L+",
                label: "Bus operators in India",
                note: "Most without any digital tools",
                accent: "#F97316",
              },
              {
                num: "₹45,000 Cr",
                label: "Lost to platform fees yearly",
                note: "Across the industry",
                accent: "#EA580C",
              },
              {
                num: "Day 1",
                label: "We are free for small ops",
                note: "Always. Not a trial.",
                accent: "#138808",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 14,
                  padding: 20,
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  className="font-jakarta font-black"
                  style={{ fontSize: 28, color: s.accent, lineHeight: 1 }}
                >
                  {s.num}
                </div>
                <div
                  className="font-inter font-semibold mt-1 mb-0.5"
                  style={{ color: "#0F172A", fontSize: 13 }}
                >
                  {s.label}
                </div>
                <div
                  className="font-mono"
                  style={{ color: "#94A3B8", fontSize: 11 }}
                >
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enter portals ── */}
      <section style={{ background: "#F8FAFC", padding: "80px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-3 text-center"
            style={{ color: "#94A3B8" }}
          >
            GET STARTED
          </div>
          <h2
            className="font-jakarta font-black text-center mb-10"
            style={{ fontSize: 36, color: "#0F172A", lineHeight: 1.2 }}
          >
            Where do you want to go?
          </h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <button
              onClick={onEnterOperator}
              className="card card-hover rounded-2xl p-7 text-left group"
              style={{ background: "#fff" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "#FFF7ED" }}
              >
                <span style={{ fontSize: 24 }}>🖥</span>
              </div>
              <div
                className="font-jakarta font-black text-lg mb-1.5"
                style={{ color: "#0F172A" }}
              >
                Operator Portal
              </div>
              <div
                className="text-sm mb-5"
                style={{ color: "#64748B", lineHeight: 1.65 }}
              >
                Design seat layouts, manage your fleet, set routes and fares,
                track drivers and revenue — all in one place. Free to start.
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Seat Designer", "Fleet", "Routes", "Reports", "Drivers"].map(
                  (f) => (
                    <span key={f} className="badge badge-red">
                      {f}
                    </span>
                  ),
                )}
              </div>
              <div
                className="flex items-center gap-1.5 font-jakarta font-semibold text-sm"
                style={{ color: "#F97316" }}
              >
                Enter Operator Portal{" "}
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={onEnterCustomer}
              className="card card-hover rounded-2xl p-7 text-left group"
              style={{ background: "#fff" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "#F0FDF4" }}
              >
                <span style={{ fontSize: 24 }}>🎫</span>
              </div>
              <div
                className="font-jakarta font-black text-lg mb-1.5"
                style={{ color: "#0F172A" }}
              >
                Book a Ticket
              </div>
              <div
                className="text-sm mb-5"
                style={{ color: "#64748B", lineHeight: 1.65 }}
              >
                Search buses, choose your exact berth from the real seat map,
                and book directly with the operator. No hidden charges.
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["Search", "Real Seat Map", "Booking", "My Trips"].map((f) => (
                  <span key={f} className="badge badge-gray">
                    {f}
                  </span>
                ))}
              </div>
              <div
                className="flex items-center gap-1.5 font-jakarta font-semibold text-sm"
                style={{ color: "#16A34A" }}
              >
                Find a Bus{" "}
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#F8FAFC",
          borderTop: "1px solid #E2E8F0",
          padding: "40px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <YathriLogo
            size={32}
            textColor="#0F172A"
            showTagline
            tagline="BUILT FOR INDIA. BY INDIA."
          />
          <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
            No investors. No commission. No compromise. — Yathri, 2024
          </div>
        </div>
      </footer>
    </div>
  )
}

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
  const [view, setView] = useState<OperatorView>("dashboard")
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
              onClick={() => setView(item.id)}
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

        {view === "dashboard" && <Dashboard />}
        {view === "buses" && <BusManagement />}
        {view === "seats" && <SeatLayoutDesigner />}
        {view === "routes" && <RouteManagement />}
        {view === "schedules" && <ScheduleManagement />}
        {view === "fares" && <FareManagement />}
        {view === "drivers" && <DriverManagement />}
        {view === "reports" && <Reports />}
        {view === "settings" && <Settings />}
        {view === "branding" && <Branding />}
      </main>
    </div>
  )
}

/* ── Operator Portal (auth gate + brand provider) ────────────── */
function OperatorPortal({ onExit }: { onExit: () => void }) {
  const [operator, setOperator] = useState<OperatorProfile | null>(null)

  if (!operator) {
    return <OperatorAuth onLogin={(op) => setOperator(op)} onBack={onExit} />
  }

  return (
    <BrandProvider>
      <OperatorPortalInner
        operator={operator}
        onLogout={() => setOperator(null)}
        onExit={onExit}
      />
    </BrandProvider>
  )
}

/* ── Customer Portal ─────────────────────────────────────────── */
function CustomerPortal({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<CustomerView>("search")
  const [searchParams, setSearchParams] = useState({
    from: "Mumbai",
    to: "Pune",
    date: "2026-09-10",
  })
  const [selectedBus, setSelectedBus] =
    useState<typeof busSearchResults[0] | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedFareMap, setSelectedFareMap] =
    useState<Record<string, number>>({})
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSearch = (from: string, to: string, date: string) => {
    setSearchParams({ from, to, date })
    setView("listing")
  }

  const handleSelectBus = (bus: typeof busSearchResults[0]) => {
    setSelectedBus(bus)
    setView("seat-selection")
  }

  const handleBook = (seats: string[], fareMap: Record<string, number>) => {
    setSelectedSeats(seats)
    setSelectedFareMap(fareMap)
    if (!isLoggedIn) {
      setShowLogin(true)
    } else {
      setView("booking")
    }
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
    setView("booking")
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC" }}>
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
      {view === "search" && (
        <SearchPage
          onSearch={handleSearch}
          onLogin={() => setShowLogin(true)}
          onMyTrips={() => setView("my-trips")}
        />
      )}
      {view === "listing" && (
        <BusListing
          from={searchParams.from}
          to={searchParams.to}
          date={searchParams.date}
          onSelect={handleSelectBus}
          onBack={() => setView("search")}
        />
      )}
      {view === "seat-selection" && selectedBus && (
        <SeatSelection
          bus={selectedBus}
          onBook={handleBook}
          onBack={() => setView("listing")}
        />
      )}
      {view === "booking" && selectedBus && (
        <BookingFlow
          bus={selectedBus}
          seats={selectedSeats}
          fareMap={selectedFareMap}
          onDone={() => setView("search")}
          onBack={() => setView("seat-selection")}
        />
      )}
      {view === "my-trips" && <MyTrips onBack={() => setView("search")} />}
    </div>
  )
}

/* ── Root ────────────────────────────────────────────────────── */
export default function App() {
  const [portal, setPortal] = useState<Portal>("landing")
  return (
    <div className="h-full">
      {portal === "landing" && (
        <LandingPage
          onEnterOperator={() => setPortal("operator")}
          onEnterCustomer={() => setPortal("customer")}
        />
      )}
      {portal === "operator" && (
        <OperatorPortal onExit={() => setPortal("landing")} />
      )}
      {portal === "customer" && (
        <CustomerPortal onExit={() => setPortal("landing")} />
      )}
    </div>
  )
}
