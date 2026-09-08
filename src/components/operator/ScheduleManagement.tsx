import { useState } from "react"
import { schedules } from "../../data/mockData"

export default function ScheduleManagement() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: "#94A3B8" }}
          >
            Operations
          </div>
          <h2
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            Schedule Management
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2 text-sm"
        >
          + New Schedule
        </button>
      </div>

      {showForm && (
        <div className="card rounded-xl p-5" style={{ borderColor: "#FED7AA" }}>
          <div
            className="font-jakarta font-semibold mb-4"
            style={{ color: "#0F172A" }}
          >
            Create Schedule
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Route",
                type: "select",
                options: [
                  "Mumbai → Pune",
                  "Pune → Nashik",
                  "Mumbai → Aurangabad",
                  "Nashik → Mumbai",
                ],
              },
              {
                label: "Bus",
                type: "select",
                options: ["MH-12-AB-4521", "MH-12-CD-7803", "MH-12-EF-1192"],
              },
              {
                label: "Driver",
                type: "select",
                options: ["Ramesh Patil", "Suresh Desai", "Mahesh Jadhav"],
              },
              { label: "Departure Time", type: "time" },
              { label: "Arrival Time", type: "time" },
              { label: "Base Fare (₹)", type: "number" },
              {
                label: "Recurring",
                type: "select",
                options: ["Daily", "Mon-Sat", "Mon-Fri", "Weekends Only"],
              },
              { label: "Effective From", type: "date" },
              { label: "Effective Until", type: "date" },
            ].map((f, i) => (
              <div key={i}>
                <label
                  className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                  style={{ color: "#94A3B8" }}
                >
                  {f.label}
                </label>
                {f.type === "select" ? (
                  <select className="op-select w-full">
                    {f.options!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input className="op-input w-full" type={f.type} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary px-4 py-2 text-sm">
              Create Schedule
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {schedules.map((s, i) => {
          const pct = Math.round((s.bookedSeats / s.totalSeats) * 100)
          return (
            <div key={i} className="card rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-5">
                  <div>
                    <div
                      className="font-mono text-xs mb-0.5"
                      style={{ color: "#94A3B8" }}
                    >
                      {s.id}
                    </div>
                    <div
                      className="font-jakarta font-bold"
                      style={{ color: "#0F172A" }}
                    >
                      {s.route}
                    </div>
                    <div
                      className="font-mono text-xs mt-0.5"
                      style={{ color: "#94A3B8" }}
                    >
                      {s.bus} · {s.busType}
                    </div>
                  </div>
                  <div
                    className="px-4"
                    style={{ borderLeft: "1px solid #F1F5F9" }}
                  >
                    <div
                      className="font-mono text-xs"
                      style={{ color: "#94A3B8" }}
                    >
                      DEPARTS
                    </div>
                    <div
                      className="font-jakarta font-black text-xl"
                      style={{ color: "#F97316" }}
                    >
                      {s.departure}
                    </div>
                  </div>
                  <div
                    className="px-4"
                    style={{ borderLeft: "1px solid #F1F5F9" }}
                  >
                    <div
                      className="font-mono text-xs"
                      style={{ color: "#94A3B8" }}
                    >
                      ARRIVES
                    </div>
                    <div
                      className="font-jakarta font-black text-xl"
                      style={{ color: "#0F172A" }}
                    >
                      {s.arrival}
                    </div>
                  </div>
                  <div
                    className="px-4"
                    style={{ borderLeft: "1px solid #F1F5F9" }}
                  >
                    <div
                      className="font-mono text-xs"
                      style={{ color: "#94A3B8" }}
                    >
                      DRIVER
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#334155" }}
                    >
                      {s.driver}
                    </div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: "#94A3B8" }}
                    >
                      {s.conductor}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="badge badge-green">ACTIVE</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    {s.date}
                  </span>
                  <span
                    className="font-jakarta font-bold text-sm"
                    style={{ color: "#F97316" }}
                  >
                    ₹{s.fare.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#94A3B8" }}
                    >
                      Occupancy
                    </span>
                    <span
                      className="font-mono text-xs font-medium"
                      style={{ color: "#0F172A" }}
                    >
                      {s.bookedSeats}/{s.totalSeats} ({pct}%)
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{ background: "#F1F5F9" }}
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 90
                            ? "#F97316"
                            : pct >= 75
                              ? "#F59E0B"
                              : "#22C55E",
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      background: "#FFF7ED",
                      color: "#F97316",
                      border: "1px solid #FED7AA",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      background: "#F0FDF4",
                      color: "#16A34A",
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    Manifest
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      background: "#F8FAFC",
                      color: "#64748B",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    Cancel Trip
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
