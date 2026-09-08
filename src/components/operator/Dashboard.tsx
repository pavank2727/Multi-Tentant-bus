import { buses, schedules, revenueData, operator } from "../../data/mockData";

function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className="card rounded-xl p-5">
      <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>{label}</div>
      <div className="font-jakarta font-black text-3xl mb-1" style={{ color: accent ? "#F97316" : "#0F172A" }}>{value}</div>
      <div className="text-xs" style={{ color: "#94A3B8" }}>{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const running = buses.filter(b => b.status === "running").length;
  const totalBooked = schedules.reduce((a, s) => a + s.bookedSeats, 0);
  const totalCap = schedules.reduce((a, s) => a + s.totalSeats, 0);
  const avgOcc = Math.round((totalBooked / totalCap) * 100);
  const maxRev = Math.max(...revenueData.map(r => r.revenue));

  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>Good morning</div>
          <h1 className="font-jakarta font-black text-2xl" style={{ color: "#0F172A" }}>{operator.name}</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>ID: {operator.id}</span>
            <span className="badge badge-green">VERIFIED</span>
            <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>GST: {operator.gst}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Buses" value={String(operator.totalBuses)} sub={`${running} currently running`} />
        <StatCard label="Active Routes" value={String(operator.activeRoutes)} sub="Across 4 branches" accent />
        <StatCard label="Avg Occupancy" value={`${avgOcc}%`} sub="This week across all routes" />
        <StatCard label="Today's Revenue" value="₹2.85L" sub="+12.4% vs yesterday" accent />
      </div>

      {/* Revenue + Route Performance */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Bar chart */}
        <div className="card rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>Monthly Revenue</div>
              <div className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>
                ₹1,51,90,000 <span className="text-sm font-medium" style={{ color: "#16A34A" }}>▲ 8.2%</span>
              </div>
            </div>
            <span className="badge badge-blue">FY 2026–27</span>
          </div>
          <div className="flex items-end gap-2.5" style={{ height: 100 }}>
            {revenueData.map((d, i) => {
              const h = Math.round((d.revenue / maxRev) * 90);
              const current = i === revenueData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: h,
                      background: current ? "#F97316" : "#FED7AA",
                      transition: "height 0.3s",
                    }}
                  />
                  <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{d.month}</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
            {[
              { label: "Trips (Sep)", val: "271" },
              { label: "Avg Fare", val: "₹679" },
              { label: "Cancellations", val: "4.2%" },
            ].map(s => (
              <div key={s.label}>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{s.label}</div>
                <div className="font-jakarta font-bold text-sm mt-0.5" style={{ color: "#0F172A" }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Route perf */}
        <div className="card rounded-xl p-5">
          <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>Route Performance</div>
          <div className="space-y-4">
            {[
              { route: "MUM → PUNE", rev: "₹9.2L", pct: 91, color: "#F97316" },
              { route: "NSK → MUM",  rev: "₹6.4L", pct: 88, color: "#F97316" },
              { route: "PUNE → NSK", rev: "₹3.8L", pct: 71, color: "#FDBA74" },
              { route: "MUM → AURD", rev: "₹4.2L", pct: 68, color: "#FDBA74" },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-xs" style={{ color: "#334155" }}>{r.route}</span>
                  <span className="font-mono text-xs font-medium" style={{ color: "#0F172A" }}>{r.rev}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#F1F5F9" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
                <div className="font-mono text-xs mt-0.5" style={{ color: "#94A3B8" }}>{r.pct}% occ.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live trips table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <div className="font-jakarta font-semibold" style={{ color: "#0F172A" }}>Live & Upcoming Trips — Today</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
            <span className="font-mono text-xs" style={{ color: "#16A34A" }}>{running} Active</span>
          </div>
        </div>
        <table className="op-table">
          <thead>
            <tr>
              <th>Schedule</th>
              <th>Route</th>
              <th>Bus</th>
              <th>Departure</th>
              <th>Driver</th>
              <th>Seats</th>
              <th>Occupancy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(s => {
              const pct = Math.round((s.bookedSeats / s.totalSeats) * 100);
              return (
                <tr key={s.id}>
                  <td><span className="font-mono text-xs" style={{ color: "#F97316" }}>{s.id}</span></td>
                  <td><span className="font-medium" style={{ color: "#0F172A" }}>{s.route}</span></td>
                  <td><span className="font-mono text-xs" style={{ color: "#64748B" }}>{s.bus}</span></td>
                  <td><span className="font-mono font-medium">{s.departure}</span></td>
                  <td>{s.driver}</td>
                  <td><span className="font-mono text-xs">{s.bookedSeats}/{s.totalSeats}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#F1F5F9", minWidth: 60 }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? "#F97316" : pct >= 75 ? "#F59E0B" : "#22C55E" }} />
                      </div>
                      <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${pct >= 90 ? "badge-red" : pct >= 75 ? "badge-yellow" : "badge-green"}`}>
                      {pct >= 90 ? "NEAR FULL" : pct >= 75 ? "FILLING" : "OPEN"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
