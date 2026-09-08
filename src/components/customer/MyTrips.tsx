import { useState } from "react"
import { trips } from "../../data/mockData"

interface MyTripsProps {
  onBack: () => void
}

type Tab = "upcoming" | "completed" | "cancelled"

export default function MyTrips({ onBack }: MyTripsProps) {
  const [tab, setTab] = useState<Tab>("upcoming")
  const filtered = trips.filter((t) => t.status === tab)

  const tabColor: Record<Tab, {
    bg: string
    border: string
    text: string
    activeBg: string
  }> = {
    upcoming: {
      bg: "#FFF7ED",
      border: "#FDBA74",
      text: "#EA580C",
      activeBg: "#EA580C",
    },
    completed: {
      bg: "#F0FDF4",
      border: "#BBF7D0",
      text: "#16A34A",
      activeBg: "#16A34A",
    },
    cancelled: {
      bg: "#FFF7ED",
      border: "#FED7AA",
      text: "#F97316",
      activeBg: "#F97316",
    },
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100%" }}>
      <header
        className="bg-white px-6 py-3.5 flex items-center gap-4 sticky top-0 z-10"
        style={{ borderBottom: "1px solid #E2E8F0" }}
      >
        <button
          onClick={onBack}
          className="text-sm font-medium"
          style={{ color: "#64748B" }}
        >
          ← Home
        </button>
        <div className="w-px h-4" style={{ background: "#E2E8F0" }} />
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#F97316" }}
          >
            <span
              className="font-jakarta font-black text-white"
              style={{ fontSize: 14 }}
            >
              E
            </span>
          </div>
          <span className="font-jakarta font-bold" style={{ color: "#0F172A" }}>
            My Trips
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="card rounded-xl p-4 mb-5 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-jakarta font-black text-xl"
            style={{ background: "#FFF7ED", color: "#F97316" }}
          >
            P
          </div>
          <div>
            <div
              className="font-jakarta font-semibold"
              style={{ color: "#0F172A" }}
            >
              Priya Sharma
            </div>
            <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
              +91 98765 43210 · priya@email.com
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
              Wallet Balance
            </div>
            <div
              className="font-jakarta font-bold text-sm"
              style={{ color: "#16A34A" }}
            >
              ₹0.00
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {(["upcoming", "completed", "cancelled"] as Tab[]).map((t) => {
            const c = tabColor[t]
            const active = tab === t
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
                style={{
                  background: active ? c.activeBg : "#fff",
                  color: active ? "#fff" : c.text,
                  border: `1.5px solid ${active ? c.activeBg : c.border}`,
                }}
              >
                {t} ({trips.filter((tr) => tr.status === t).length})
              </button>
            )
          })}
        </div>

        <div className="space-y-4">
          {filtered.map((trip, i) => {
            const c = tabColor[(trip.status as Tab)]
            return (
              <div key={i} className="card rounded-xl overflow-hidden">
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{
                    background: c.bg,
                    borderBottom: `1px solid ${c.border}`,
                  }}
                >
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: c.text }}
                  >
                    PNR: {trip.pnr}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: c.bg,
                      color: c.text,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {trip.status.toUpperCase()}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <div
                          className="font-jakarta font-black text-xl"
                          style={{ color: "#0F172A" }}
                        >
                          {trip.route.split(" → ")[0]}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "#94A3B8" }}
                        >
                          {trip.boardingPoint}
                        </div>
                      </div>
                      <span style={{ color: "#F97316" }}>→</span>
                      <div>
                        <div
                          className="font-jakarta font-black text-xl"
                          style={{ color: "#0F172A" }}
                        >
                          {trip.route.split(" → ")[1]}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "#94A3B8" }}
                        >
                          {trip.droppingPoint}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-jakarta font-bold text-lg"
                        style={{ color: "#F97316" }}
                      >
                        ₹{trip.fare.toLocaleString()}
                      </div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: "#94A3B8" }}
                      >
                        Seats: {trip.seats.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-3 gap-3 mb-3 pb-3"
                    style={{ borderBottom: "1px solid #F1F5F9" }}
                  >
                    <div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: "#94A3B8" }}
                      >
                        Date
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: "#0F172A" }}
                      >
                        {trip.date}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: "#94A3B8" }}
                      >
                        Departure
                      </div>
                      <div
                        className="font-mono font-medium"
                        style={{ color: "#0F172A" }}
                      >
                        {trip.departure}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: "#94A3B8" }}
                      >
                        Bus
                      </div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: "#0F172A" }}
                      >
                        {trip.bus}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{ color: "#94A3B8" }}>
                      Passengers: {trip.passengers.join(", ")}
                    </div>
                    <div className="flex gap-2">
                      {tab === "upcoming" && (
                        <>
                          <button
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{
                              background: "#EFF6FF",
                              color: "#2563EB",
                              border: "1px solid #BFDBFE",
                            }}
                          >
                            📥 Download
                          </button>
                          <button
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{
                              background: "#FFFBEB",
                              color: "#D97706",
                              border: "1px solid #FDE68A",
                            }}
                          >
                            🔄 Reschedule
                          </button>
                          <button
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{
                              background: "#FFF7ED",
                              color: "#F97316",
                              border: "1px solid #FED7AA",
                            }}
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}
                      {tab === "completed" && (
                        <>
                          <button
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{
                              background: "#EFF6FF",
                              color: "#2563EB",
                              border: "1px solid #BFDBFE",
                            }}
                          >
                            📥 Download
                          </button>
                          <button
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{
                              background: "#FFF7ED",
                              color: "#F97316",
                              border: "1px solid #FED7AA",
                            }}
                          >
                            ⭐ Rate
                          </button>
                        </>
                      )}
                      {tab === "cancelled" && (
                        <button
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{
                            background: "#F0FDF4",
                            color: "#16A34A",
                            border: "1px solid #BBF7D0",
                          }}
                        >
                          ↩ Refund Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="card rounded-xl text-center py-16">
              <div className="text-4xl mb-3">🎫</div>
              <div
                className="font-jakarta font-bold"
                style={{ color: "#0F172A" }}
              >
                No {tab} trips
              </div>
              <div className="text-sm mt-1" style={{ color: "#94A3B8" }}>
                Your {tab} bookings will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
