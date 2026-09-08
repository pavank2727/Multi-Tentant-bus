import { useState } from "react"
import YathriLogo from "../YathriLogo"

interface SearchPageProps {
  onSearch: (from: string, to: string, date: string) => void
  onLogin: () => void
  onMyTrips: () => void
}

const cities = ["Mumbai", "Pune", "Nashik", "Aurangabad", "Nagpur", "Kolhapur"]
const popular = [
  { from: "Mumbai", to: "Pune", fare: "₹320+", icon: "🌆" },
  { from: "Pune", to: "Nashik", fare: "₹280+", icon: "🏔" },
  { from: "Mumbai", to: "Aurangabad", fare: "₹580+", icon: "🕌" },
  { from: "Nashik", to: "Mumbai", fare: "₹320+", icon: "🌊" },
]

export default function SearchPage({
  onSearch,
  onLogin,
  onMyTrips,
}: SearchPageProps) {
  const [from, setFrom] = useState("Mumbai")
  const [to, setTo] = useState("Pune")
  const [date, setDate] = useState("2026-09-10")
  const [passengers, setPax] = useState(1)

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div style={{ background: "#fff", minHeight: "100%" }}>
      {/* Navbar */}
      <header
        className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20"
        style={{ borderBottom: "1px solid #F1F5F9" }}
      >
        <YathriLogo
          size={36}
          textColor="#0F172A"
          showTagline
          tagline="BOOK · TRAVEL · ARRIVE"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={onMyTrips}
            className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            style={{ color: "#64748B" }}
          >
            My Trips
          </button>
          <button onClick={onLogin} className="btn-primary px-4 py-2 text-sm">
            Login / Sign Up
          </button>
        </div>
      </header>

      {/* Hero band */}
      <div
        className="relative overflow-hidden"
        style={{ background: "#F97316", paddingTop: 48, paddingBottom: 88 }}
      >
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span
              className="font-mono text-xs text-white"
              style={{ letterSpacing: "0.06em" }}
            >
              INDIA'S TRUSTED BUS NETWORK
            </span>
          </div>
          <h1
            className="font-jakarta font-black text-white mb-2"
            style={{ fontSize: 44, lineHeight: 1.1 }}
          >
            Book Your Bus Ticket
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
            Premium sleepers, semi-sleepers & seaters across Maharashtra and
            beyond
          </p>
        </div>
      </div>

      {/* Search card — floating over hero */}
      <div className="px-6 -mt-12 max-w-3xl mx-auto relative z-10 pb-10">
        <div
          className="bg-white rounded-2xl shadow-xl p-6"
          style={{ border: "1px solid #E2E8F0" }}
        >
          <div
            className="grid gap-3 mb-4"
            style={{ gridTemplateColumns: "1fr 44px 1fr 1fr" }}
          >
            {/* From */}
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                From
              </label>
              <select
                className="cu-input appearance-none"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="flex items-end pb-0.5">
              <button
                onClick={swap}
                className="w-10 h-11 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110"
                style={{
                  background: "#FFF7ED",
                  color: "#F97316",
                  border: "1.5px solid #FED7AA",
                }}
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                To
              </label>
              <select
                className="cu-input appearance-none"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {cities
                  .filter((c) => c !== from)
                  .map((c) => (
                    <option key={c}>{c}</option>
                  ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Journey Date
              </label>
              <input
                type="date"
                className="cu-input"
                value={date}
                min="2026-09-05"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Passengers + Search */}
          <div className="flex items-center gap-4">
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Passengers
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPax(Math.max(1, passengers - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{
                    background: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    color: "#0F172A",
                  }}
                >
                  −
                </button>
                <span
                  className="font-jakarta font-black text-xl w-8 text-center"
                  style={{ color: "#0F172A" }}
                >
                  {passengers}
                </span>
                <button
                  onClick={() => setPax(Math.min(6, passengers + 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{
                    background: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    color: "#0F172A",
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => onSearch(from, to, date)}
              className="btn-primary flex-1 py-3 text-base"
              style={{ borderRadius: 12, fontSize: 15 }}
            >
              Search Buses →
            </button>
          </div>
        </div>

        {/* Popular routes */}
        <div className="mt-8">
          <div
            className="font-mono text-xs uppercase tracking-widest mb-4"
            style={{ color: "#94A3B8" }}
          >
            Popular Routes
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popular.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setFrom(r.from)
                  setTo(r.to)
                  onSearch(r.from, r.to, date)
                }}
                className="card card-hover rounded-xl p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                    style={{ background: "#FFF7ED" }}
                  >
                    {r.icon}
                  </div>
                  <div>
                    <div
                      className="font-jakarta font-semibold text-sm"
                      style={{ color: "#0F172A" }}
                    >
                      {r.from} → {r.to}
                    </div>
                    <div
                      className="font-mono text-xs mt-0.5"
                      style={{ color: "#94A3B8" }}
                    >
                      From {r.fare}
                    </div>
                  </div>
                </div>
                <span style={{ color: "#F97316" }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Why Yathri */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            {
              icon: "🔒",
              title: "100% Secure Payment",
              desc: "UPI, Cards, Net Banking — encrypted",
            },
            {
              icon: "📲",
              title: "Instant E-Ticket",
              desc: "PNR & QR code delivered immediately",
            },
            {
              icon: "↩️",
              title: "Hassle-free Refunds",
              desc: "Up to 90% refund on early cancellation",
            },
          ].map((f, i) => (
            <div key={i} className="card rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div
                className="font-jakarta font-semibold text-sm mb-1"
                style={{ color: "#0F172A" }}
              >
                {f.title}
              </div>
              <div className="text-xs" style={{ color: "#94A3B8" }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
