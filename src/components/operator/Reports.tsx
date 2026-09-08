import { revenueData } from "../../data/mockData"

const maxRev = Math.max(...revenueData.map((r) => r.revenue))

export default function Reports() {
  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: "#94A3B8" }}
          >
            Analytics
          </div>
          <h2
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            Reports
          </h2>
        </div>
        <div className="flex gap-2">
          <select className="op-select text-sm">
            <option>Sep 2026</option>
            <option>Aug 2026</option>
            <option>FY 2026-27</option>
          </select>
          <button className="btn-ghost px-4 py-2 text-sm">Export PDF</button>
          <button className="btn-ghost px-4 py-2 text-sm">GST Report</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          {
            label: "Total Revenue",
            value: "₹26.4L",
            change: "+8.2%",
            up: true,
          },
          { label: "Total Trips", value: "389", change: "+11.5%", up: true },
          { label: "Avg Occupancy", value: "88%", change: "+4.1%", up: true },
          {
            label: "Cancellation Rate",
            value: "4.2%",
            change: "−1.3%",
            up: true,
          },
          {
            label: "GST Collected",
            value: "₹3.96L",
            change: "+8.2%",
            up: true,
          },
        ].map((k, i) => (
          <div key={i} className="card rounded-xl p-4">
            <div
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              {k.label}
            </div>
            <div
              className="font-jakarta font-black text-xl mt-1"
              style={{ color: "#0F172A" }}
            >
              {k.value}
            </div>
            <div
              className="font-mono text-xs mt-1"
              style={{ color: "#16A34A" }}
            >
              {k.change}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card rounded-xl p-5">
        <div
          className="font-mono text-xs uppercase tracking-widest mb-5"
          style={{ color: "#94A3B8" }}
        >
          Monthly Revenue (₹)
        </div>
        <div className="flex items-end gap-3" style={{ height: 130 }}>
          {revenueData.map((d, i) => {
            const h = Math.round((d.revenue / maxRev) * 120)
            const current = i === revenueData.length - 1
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                  ₹{(d.revenue / 100000).toFixed(1)}L
                </div>
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: h,
                    background: current ? "#F97316" : "#FED7AA",
                  }}
                />
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                  {d.month}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tables row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Route perf */}
        <div className="card rounded-xl overflow-hidden">
          <div
            className="px-5 py-3.5"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div
              className="font-jakarta font-semibold"
              style={{ color: "#0F172A" }}
            >
              Route Performance
            </div>
          </div>
          <table className="op-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Trips</th>
                <th>Revenue</th>
                <th>Occ.</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  route: "Mumbai → Pune",
                  trips: 186,
                  revenue: "₹12.1L",
                  occ: 91,
                },
                {
                  route: "Nashik → Mumbai",
                  trips: 98,
                  revenue: "₹7.1L",
                  occ: 88,
                },
                {
                  route: "Mumbai → Aurangabad",
                  trips: 62,
                  revenue: "₹5.3L",
                  occ: 68,
                },
                {
                  route: "Pune → Nashik",
                  trips: 43,
                  revenue: "₹1.9L",
                  occ: 71,
                },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ color: "#0F172A" }}>{r.route}</td>
                  <td className="font-mono">{r.trips}</td>
                  <td
                    className="font-mono font-medium"
                    style={{ color: "#16A34A" }}
                  >
                    {r.revenue}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 flex-1 rounded-full"
                        style={{ background: "#F1F5F9" }}
                      >
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${r.occ}%`, background: "#F97316" }}
                        />
                      </div>
                      <span
                        className="font-mono text-xs"
                        style={{ color: "#94A3B8" }}
                      >
                        {r.occ}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bus revenue */}
        <div className="card rounded-xl overflow-hidden">
          <div
            className="px-5 py-3.5"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div
              className="font-jakarta font-semibold"
              style={{ color: "#0F172A" }}
            >
              Bus-wise Revenue
            </div>
          </div>
          <table className="op-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Type</th>
                <th>Revenue</th>
                <th>Trips</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  bus: "MH-12-AB-4521",
                  type: "AC Sleeper",
                  rev: "₹8.4L",
                  trips: 142,
                },
                {
                  bus: "MH-12-KL-8891",
                  type: "AC Sleeper",
                  rev: "₹7.2L",
                  trips: 116,
                },
                {
                  bus: "MH-12-CD-7803",
                  type: "AC Semi Sleeper",
                  rev: "₹5.1L",
                  trips: 98,
                },
                {
                  bus: "MH-12-IJ-5566",
                  type: "Non-AC Semi",
                  rev: "₹3.6L",
                  trips: 74,
                },
              ].map((r, i) => (
                <tr key={i}>
                  <td
                    className="font-mono text-xs"
                    style={{ color: "#F97316" }}
                  >
                    {r.bus}
                  </td>
                  <td>
                    <span className="badge badge-gray" style={{ fontSize: 10 }}>
                      {r.type}
                    </span>
                  </td>
                  <td
                    className="font-mono font-medium"
                    style={{ color: "#16A34A" }}
                  >
                    {r.rev}
                  </td>
                  <td className="font-mono">{r.trips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund summary */}
      <div className="card rounded-xl p-5">
        <div
          className="font-mono text-xs uppercase tracking-widest mb-4"
          style={{ color: "#94A3B8" }}
        >
          Refund Report — Aug 2026
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Cancellations", value: "38", unit: "bookings" },
            { label: "Refund Amount", value: "₹18,400", unit: "processed" },
            { label: "Avg Refund %", value: "67%", unit: "of ticket value" },
            { label: "Pending Refunds", value: "2", unit: "within 5–7 days" },
          ].map((r, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: "#F8FAFC", border: "1px solid #F1F5F9" }}
            >
              <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                {r.label}
              </div>
              <div
                className="font-jakarta font-black text-2xl mt-1"
                style={{ color: "#0F172A" }}
              >
                {r.value}
              </div>
              <div
                className="font-mono text-xs mt-0.5"
                style={{ color: "#CBD5E1" }}
              >
                {r.unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
