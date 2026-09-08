import { useState } from "react";
import { routes } from "../../data/mockData";

export default function RouteManagement() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>Network</div>
          <h2 className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>Route Management</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm">+ Add Route</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Routes", value: routes.length, color: "#0F172A" },
          { label: "Total Schedules", value: routes.reduce((a, r) => a + r.activeSchedules, 0), color: "#F97316" },
          { label: "Avg Occupancy", value: `${Math.round(routes.reduce((a, r) => a + r.avgOccupancy, 0) / routes.length)}%`, color: "#16A34A" },
          { label: "Total Distance", value: `${routes.reduce((a, r) => a + r.distance, 0)} km`, color: "#2563EB" },
        ].map((s, i) => (
          <div key={i} className="card rounded-xl p-4">
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: "#94A3B8" }}>{s.label}</div>
            <div className="font-jakarta font-black text-2xl mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="card rounded-xl p-5" style={{ borderColor: "#FED7AA" }}>
          <div className="font-jakarta font-semibold mb-4" style={{ color: "#0F172A" }}>Add New Route</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Source City", placeholder: "Mumbai (Dadar)" },
              { label: "Destination City", placeholder: "Pune (Shivajinagar)" },
              { label: "Distance (km)", placeholder: "155" },
              { label: "Duration", placeholder: "3h 30m" },
              { label: "Via Points", placeholder: "Khopoli, Khalapur" },
              { label: "Boarding Points", placeholder: "Dadar TT, Sion" },
            ].map(f => (
              <div key={f.label}>
                <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>{f.label}</label>
                <input className="op-input w-full" placeholder={f.placeholder} />
              </div>
            ))}
            <div className="col-span-3">
              <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Dropping Points</label>
              <input className="op-input w-full" placeholder="Wakad, Pimpri, Shivajinagar, Swargate" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn-primary px-4 py-2 text-sm">Create Route</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Route cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {routes.map((route, i) => (
          <div
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="card card-hover rounded-xl p-5 cursor-pointer"
            style={{ borderColor: selected === i ? "#F97316" : "#E2E8F0" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-xs mb-1" style={{ color: "#94A3B8" }}>{route.id}</div>
                <div className="font-jakarta font-bold text-base" style={{ color: "#0F172A" }}>
                  {route.from}
                  <span style={{ color: "#F97316", margin: "0 8px" }}>→</span>
                  {route.to}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{route.distance} km</div>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{route.duration}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-blue">{route.activeSchedules} Schedules</span>
              <span className={`badge ${route.avgOccupancy >= 85 ? "badge-red" : route.avgOccupancy >= 70 ? "badge-yellow" : "badge-green"}`}>
                {route.avgOccupancy}% Occupancy
              </span>
            </div>

            <div className="h-1.5 rounded-full mb-1" style={{ background: "#F1F5F9" }}>
              <div className="h-1.5 rounded-full" style={{ width: `${route.avgOccupancy}%`, background: route.avgOccupancy >= 85 ? "#F97316" : "#16A34A" }} />
            </div>

            {selected === i && (
              <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                {[
                  { title: "Via Points", items: route.viaPoints, style: "badge-gray" },
                  { title: "Boarding Points", items: route.boardingPoints, style: "badge-red" },
                  { title: "Dropping Points", items: route.droppingPoints, style: "badge-gray" },
                ].map(section => (
                  <div key={section.title}>
                    <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>{section.title}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {section.items.map(v => <span key={v} className={`badge ${section.style}`}>{v}</span>)}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#FFF7ED", color: "#F97316", border: "1px solid #FED7AA" }}>Edit</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}>Add Schedule</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}>Report</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
