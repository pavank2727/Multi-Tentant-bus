import { useState } from "react"
import { buses } from "../../data/mockData"

const statusBadge = (s: string) => {
  if (s === "running") return <span className="badge badge-green">RUNNING</span>
  if (s === "idle") return <span className="badge badge-gray">IDLE</span>
  if (s === "maintenance")
    return <span className="badge badge-red">MAINTENANCE</span>
  return null
}

export default function BusManagement() {
  const [filter, setFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)

  const filtered =
    filter === "all" ? buses : buses.filter((b) => b.status === filter)

  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: "#94A3B8" }}
          >
            Fleet Management
          </div>
          <h2
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            Bus Fleet
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2 text-sm"
        >
          + Register Bus
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Fleet", value: buses.length, color: "#0F172A" },
          {
            label: "Running",
            value: buses.filter((b) => b.status === "running").length,
            color: "#16A34A",
          },
          {
            label: "Idle",
            value: buses.filter((b) => b.status === "idle").length,
            color: "#64748B",
          },
          {
            label: "Maintenance",
            value: buses.filter((b) => b.status === "maintenance").length,
            color: "#F97316",
          },
        ].map((s, i) => (
          <div key={i} className="card rounded-xl p-4">
            <div
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              {s.label}
            </div>
            <div
              className="font-jakarta font-black text-2xl mt-1"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card rounded-xl p-5" style={{ borderColor: "#FED7AA" }}>
          <div
            className="font-jakarta font-semibold mb-4"
            style={{ color: "#0F172A" }}
          >
            Register New Bus
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Bus Number",
                placeholder: "MH-12-XX-0000",
                type: "text",
              },
              { label: "Seating Capacity", placeholder: "40", type: "number" },
              { label: "Fitness Expiry", placeholder: "", type: "date" },
            ].map((f) => (
              <div key={f.label}>
                <label
                  className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                  style={{ color: "#94A3B8" }}
                >
                  {f.label}
                </label>
                <input
                  className="op-input w-full"
                  type={f.type}
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Bus Type
              </label>
              <select className="op-select w-full">
                <option>Sleeper</option>
                <option>Semi Sleeper</option>
                <option>Seater</option>
              </select>
            </div>
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                AC / Non-AC
              </label>
              <select className="op-select w-full">
                <option>AC</option>
                <option>Non-AC</option>
              </select>
            </div>
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Amenities
              </label>
              <div className="flex gap-3 flex-wrap mt-1">
                {["WiFi", "Charging", "Water Bottle", "Blanket"].map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <input type="checkbox" style={{ accentColor: "#F97316" }} />
                    <span
                      className="font-inter text-xs"
                      style={{ color: "#334155" }}
                    >
                      {a}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary px-4 py-2 text-sm">
              Register Bus
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

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "running", "idle", "maintenance"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all"
            style={{
              background: filter === f ? "#F97316" : "#fff",
              color: filter === f ? "#fff" : "#64748B",
              border: `1px solid ${filter === f ? "#F97316" : "#E2E8F0"}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card rounded-xl overflow-hidden">
        <table className="op-table">
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Current Route</th>
              <th>Driver</th>
              <th>Amenities</th>
              <th>Rating</th>
              <th>Next Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bus, i) => (
              <tr key={i}>
                <td>
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: "#F97316" }}
                  >
                    {bus.id}
                  </span>
                </td>
                <td>
                  <div
                    className="font-medium text-xs"
                    style={{ color: "#0F172A" }}
                  >
                    {bus.type}
                  </div>
                  <div
                    className="font-mono text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    {bus.subtype}
                  </div>
                </td>
                <td>
                  <span className="font-mono">{bus.capacity}</span>
                </td>
                <td>
                  <span
                    style={{ color: bus.route === "—" ? "#CBD5E1" : "#334155" }}
                  >
                    {bus.route}
                  </span>
                </td>
                <td>{bus.driver}</td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {bus.amenities.map((a) => (
                      <span key={a} className="badge badge-gray">
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: "#D97706" }}
                  >
                    ★ {bus.rating}
                  </span>
                </td>
                <td>
                  <span
                    className="font-mono text-xs"
                    style={{
                      color:
                        new Date(bus.nextService) < new Date("2026-09-10")
                          ? "#F97316"
                          : "#64748B",
                    }}
                  >
                    {bus.nextService}
                  </span>
                </td>
                <td>{statusBadge(bus.status)}</td>
                <td>
                  <div className="flex gap-1.5">
                    <button
                      className="font-mono text-xs px-2 py-1 rounded-md"
                      style={{
                        background: "#FFF7ED",
                        color: "#F97316",
                        border: "1px solid #FED7AA",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="font-mono text-xs px-2 py-1 rounded-md"
                      style={{
                        background: "#F8FAFC",
                        color: "#64748B",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      Track
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
