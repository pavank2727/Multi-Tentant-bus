import { drivers } from "../../data/mockData"

export default function DriverManagement() {
  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: "#94A3B8" }}
          >
            Human Resources
          </div>
          <h2
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            Drivers & Staff
          </h2>
        </div>
        <button className="btn-primary px-4 py-2 text-sm">+ Add Driver</button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Drivers", value: drivers.length, color: "#0F172A" },
          {
            label: "On Duty",
            value: drivers.filter((d) => d.status === "on-duty").length,
            color: "#16A34A",
          },
          {
            label: "Off Duty",
            value: drivers.filter((d) => d.status === "off-duty").length,
            color: "#64748B",
          },
          {
            label: "Avg Rating",
            value: (
              drivers.reduce((a, d) => a + d.rating, 0) / drivers.length
            ).toFixed(1),
            color: "#D97706",
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

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {drivers.map((driver, i) => (
          <div key={i} className="card rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-jakarta font-black text-base"
                  style={{ background: "#FFF7ED", color: "#F97316" }}
                >
                  {driver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div
                    className="font-jakarta font-semibold"
                    style={{ color: "#0F172A" }}
                  >
                    {driver.name}
                  </div>
                  <div
                    className="font-mono text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    {driver.id} · {driver.experience}
                  </div>
                </div>
              </div>
              <span
                className={`badge ${
                  driver.status === "on-duty" ? "badge-green" : "badge-gray"
                }`}
              >
                {driver.status === "on-duty" ? "ON DUTY" : "OFF DUTY"}
              </span>
            </div>

            <div
              className="grid grid-cols-2 gap-3 mb-4 pb-4"
              style={{ borderBottom: "1px solid #F1F5F9" }}
            >
              <div>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                  License
                </div>
                <div
                  className="font-mono text-xs mt-0.5"
                  style={{ color: "#334155" }}
                >
                  {driver.license}
                </div>
                <div
                  className="font-mono text-xs"
                  style={{
                    color:
                      new Date(driver.licenseExpiry) < new Date("2026-09-05")
                        ? "#F97316"
                        : "#94A3B8",
                  }}
                >
                  Exp: {driver.licenseExpiry}
                </div>
              </div>
              <div>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                  Contact
                </div>
                <div
                  className="font-mono text-xs mt-0.5"
                  style={{ color: "#334155" }}
                >
                  {driver.contact}
                </div>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                  {driver.currentBus}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <div
                    className="font-mono text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    Trips
                  </div>
                  <div
                    className="font-jakarta font-bold text-sm"
                    style={{ color: "#0F172A" }}
                  >
                    {driver.trips.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div
                    className="font-mono text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    Rating
                  </div>
                  <div
                    className="font-jakarta font-bold text-sm"
                    style={{ color: "#D97706" }}
                  >
                    ★ {driver.rating}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  className="text-xs px-2 py-1 rounded-md"
                  style={{
                    background: "#FFF7ED",
                    color: "#F97316",
                    border: "1px solid #FED7AA",
                  }}
                >
                  Profile
                </button>
                <button
                  className="text-xs px-2 py-1 rounded-md"
                  style={{
                    background: "#F0FDF4",
                    color: "#16A34A",
                    border: "1px solid #BBF7D0",
                  }}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
