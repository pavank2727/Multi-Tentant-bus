import { useState } from "react";
import { busSearchResults } from "../../data/mockData";

interface BusListingProps {
  from: string; to: string; date: string;
  onSelect: (bus: (typeof busSearchResults)[0]) => void;
  onBack: () => void;
}

export default function BusListing({ from, to, date, onSelect, onBack }: BusListingProps) {
  const [filters, setFilters] = useState({ ac: false, nonAc: false, sleeper: false, seater: false });
  const [sort, setSort] = useState("departure");

  let results = [...busSearchResults];
  if (filters.ac)     results = results.filter(b => b.busType.includes("AC") && !b.busType.includes("Non-AC"));
  if (filters.nonAc)  results = results.filter(b => b.busType.includes("Non-AC"));
  if (filters.sleeper) results = results.filter(b => b.busType.includes("Sleeper"));
  if (filters.seater)  results = results.filter(b => b.busType.includes("Seater"));
  if (sort === "fare")   results.sort((a, b) => a.fare - b.fare);
  if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  if (sort === "seats")  results.sort((a, b) => b.availableSeats - a.availableSeats);

  const toggle = (k: keyof typeof filters) => setFilters(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100%" }}>
      {/* Header */}
      <header className="bg-white px-6 py-3.5 flex items-center gap-4 sticky top-0 z-10" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#64748B" }}>← Back</button>
        <div className="w-px h-4" style={{ background: "#E2E8F0" }} />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#F97316" }}>
            <span className="font-jakarta font-black text-white" style={{ fontSize: 14 }}>E</span>
          </div>
          <span className="font-jakarta font-bold" style={{ color: "#0F172A" }}>{from}</span>
          <span style={{ color: "#F97316" }}>→</span>
          <span className="font-jakarta font-bold" style={{ color: "#0F172A" }}>{to}</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: "#FFF7ED", color: "#F97316" }}>{date}</span>
        </div>
        <div className="ml-auto font-mono text-xs" style={{ color: "#94A3B8" }}>{results.length} buses found</div>
      </header>

      <div className="flex">
        {/* Filter sidebar */}
        <aside className="w-52 shrink-0 bg-white p-4" style={{ borderRight: "1px solid #E2E8F0", minHeight: "calc(100vh - 57px)" }}>
          <div className="font-jakarta font-semibold mb-4" style={{ color: "#0F172A" }}>Filters</div>

          {[
            { title: "AC Type", items: [{ key: "ac" as const, label: "AC" }, { key: "nonAc" as const, label: "Non-AC" }] },
            { title: "Seat Type", items: [{ key: "sleeper" as const, label: "Sleeper" }, { key: "seater" as const, label: "Seater" }] },
          ].map(group => (
            <div key={group.title} className="mb-5">
              <div className="font-mono text-xs uppercase tracking-wider mb-2.5" style={{ color: "#94A3B8" }}>{group.title}</div>
              {group.items.map(f => (
                <label key={f.key} className="flex items-center gap-2.5 mb-2.5 cursor-pointer">
                  <input type="checkbox" checked={filters[f.key]} onChange={() => toggle(f.key)} style={{ accentColor: "#F97316", width: 15, height: 15 }} />
                  <span className="text-sm" style={{ color: "#334155" }}>{f.label}</span>
                </label>
              ))}
            </div>
          ))}

          <div className="mb-5">
            <div className="font-mono text-xs uppercase tracking-wider mb-2.5" style={{ color: "#94A3B8" }}>Sort By</div>
            {[
              { val: "departure", label: "Departure Time" },
              { val: "fare",      label: "Lowest Fare" },
              { val: "rating",    label: "Top Rated" },
              { val: "seats",     label: "Most Seats" },
            ].map(s => (
              <label key={s.val} className="flex items-center gap-2.5 mb-2.5 cursor-pointer">
                <input type="radio" name="sort" value={s.val} checked={sort === s.val} onChange={() => setSort(s.val)} style={{ accentColor: "#F97316" }} />
                <span className="text-sm" style={{ color: "#334155" }}>{s.label}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 p-4 space-y-3">
          {results.map((bus, i) => (
            <div key={i} className="card card-hover rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Top row */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="font-jakarta font-bold text-base" style={{ color: "#0F172A" }}>{bus.operator}</div>
                    <span className="badge badge-gray">{bus.busType}</span>
                    {bus.availableSeats <= 5 && (
                      <span className="badge badge-red">Only {bus.availableSeats} left!</span>
                    )}
                  </div>
                  <div className="text-xs mb-3" style={{ color: "#94A3B8" }}>{bus.busName} · {bus.busNumber}</div>

                  {/* Route timeline */}
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <div className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>{bus.departure}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{bus.boardingPoint}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{bus.duration}</div>
                      <div className="w-full flex items-center">
                        <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
                        <div className="w-2 h-2 rounded-full mx-1.5" style={{ background: "#F97316" }} />
                        <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>{bus.arrival}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{bus.droppingPoint}</div>
                    </div>
                  </div>

                  {/* Amenities + Rating */}
                  <div className="flex items-center gap-4">
                    {bus.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1 text-xs" style={{ color: "#64748B" }}>
                        {a === "WiFi" ? "📶" : a === "Charging" ? "🔌" : a === "Blanket" ? "🛏" : "💧"} {a}
                      </span>
                    ))}
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="font-mono text-sm font-medium" style={{ color: "#D97706" }}>★ {bus.rating}</span>
                      <span className="text-xs" style={{ color: "#94A3B8" }}>({bus.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="ml-6 text-right flex flex-col items-end justify-between" style={{ minWidth: 140 }}>
                  <div>
                    <div className="font-jakarta font-black text-2xl" style={{ color: "#F97316" }}>₹{bus.fare}</div>
                    <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>per seat</div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs mb-2" style={{ color: bus.availableSeats <= 5 ? "#F97316" : "#94A3B8" }}>
                      {bus.availableSeats} seats left
                    </div>
                    <button
                      onClick={() => onSelect(bus)}
                      className="btn-primary w-full py-2.5 px-5 text-sm"
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="card rounded-xl text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-jakarta font-bold text-lg mb-1" style={{ color: "#0F172A" }}>No buses found</div>
              <div className="text-sm" style={{ color: "#94A3B8" }}>Try adjusting your filters</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
