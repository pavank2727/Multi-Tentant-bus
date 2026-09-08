import { useState, useMemo } from "react";
import {
  routeFareConfigs, TIER_META,
  type RouteFareConfig, type SeatFareEntry, type SeatTier,
  getFareRange,
} from "../../data/seatFares";

type PriceMode = "base" | "weekend" | "festival" | "lastMin";
type ViewTab = "visual" | "table" | "bulk";

const MODE_LABELS: Record<PriceMode, string> = {
  base: "Base Fare", weekend: "Weekend", festival: "Festival", lastMin: "Last-Minute",
};

// ─── Per-seat fare accessor ─────────────────────────────────────────────────
function getFare(seat: SeatFareEntry, mode: PriceMode): number {
  return mode === "base" ? seat.baseFare
    : mode === "weekend" ? seat.weekendFare
    : mode === "festival" ? seat.festivalFare
    : seat.lastMinFare;
}

// ─── Small seat cell in fare map ────────────────────────────────────────────
function SeatFareCell({
  seat, mode, selected, onClick,
}: {
  seat: SeatFareEntry;
  mode: PriceMode;
  selected: boolean;
  onClick: () => void;
}) {
  const fare = getFare(seat, mode);
  const m = TIER_META[seat.tier];
  return (
    <div
      onClick={onClick}
      title={`${seat.label} · ${m.label} · ₹${fare}`}
      className="rounded-lg cursor-pointer transition-all select-none"
      style={{
        background:   selected ? "#F97316" : m.bg,
        border:       `1.5px solid ${selected ? "#EA580C" : m.border}`,
        color:        selected ? "#fff" : m.text,
        padding:      "4px 3px 3px",
        textAlign:    "center",
        minWidth:     48,
        transform:    selected ? "scale(1.06)" : "scale(1)",
        boxShadow:    selected ? "0 2px 8px rgba(249,115,22,0.3)" : "none",
      }}
    >
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 600, lineHeight: 1 }}>{seat.label}</div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, marginTop: 2, opacity: selected ? 1 : 0.85, lineHeight: 1 }}>₹{fare}</div>
    </div>
  );
}

// ─── Sleeper layout map ──────────────────────────────────────────────────────
function SleeperMap({ seats, mode, selected, onToggle }: {
  seats: SeatFareEntry[];
  mode: PriceMode;
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const lower = seats.filter(s => s.position === "lower").sort((a, b) => +a.seatId.slice(1) - +b.seatId.slice(1));
  const upper = seats.filter(s => s.position === "upper").sort((a, b) => +a.seatId.slice(1) - +b.seatId.slice(1));
  const rows = Math.max(lower.length, upper.length);

  return (
    <div className="rounded-xl p-4 overflow-auto" style={{ background: "#F8FAFC", border: "1.5px dashed #E2E8F0" }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-xs" style={{ color: "#CBD5E1" }}>← FRONT</span>
        <div className="flex gap-6">
          <span className="font-mono text-xs font-medium" style={{ color: "#64748B" }}>LOWER BERTHS</span>
          <span className="font-mono text-xs font-medium" style={{ color: "#64748B" }}>UPPER BERTHS</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="flex gap-1.5">
              {lower[i] && (
                <SeatFareCell
                  seat={lower[i]} mode={mode}
                  selected={selected.has(lower[i].seatId)}
                  onClick={() => onToggle(lower[i].seatId)}
                />
              )}
            </div>
            <div className="flex gap-1.5">
              {upper[i] && (
                <SeatFareCell
                  seat={upper[i]} mode={mode}
                  selected={selected.has(upper[i].seatId)}
                  onClick={() => onToggle(upper[i].seatId)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Seater layout map ───────────────────────────────────────────────────────
function SeaterMap({ seats, mode, selected, onToggle }: {
  seats: SeatFareEntry[];
  mode: PriceMode;
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const labels = "ABCDEFGHIJKLM".split("");
  return (
    <div className="rounded-xl p-4 overflow-auto" style={{ background: "#F8FAFC", border: "1.5px dashed #E2E8F0" }}>
      <div className="font-mono text-xs mb-3" style={{ color: "#CBD5E1" }}>← FRONT (DRIVER)</div>
      <div className="space-y-1.5">
        {labels.map(row => {
          const rowSeats = seats.filter(s => s.seatId.startsWith(row)).sort((a, b) => +a.seatId.slice(1) - +b.seatId.slice(1));
          if (!rowSeats.length) return null;
          return (
            <div key={row} className="flex items-center gap-2">
              <span className="font-mono text-xs w-4" style={{ color: "#CBD5E1" }}>{row}</span>
              <div className="flex gap-1.5">
                {rowSeats.slice(0, 2).map(s => (
                  <SeatFareCell key={s.seatId} seat={s} mode={mode} selected={selected.has(s.seatId)} onClick={() => onToggle(s.seatId)} />
                ))}
              </div>
              <div className="w-4" />
              <div className="flex gap-1.5">
                {rowSeats.slice(2, 4).map(s => (
                  <SeatFareCell key={s.seatId} seat={s} mode={mode} selected={selected.has(s.seatId)} onClick={() => onToggle(s.seatId)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function FareManagement() {
  const [routeIdx, setRouteIdx]     = useState(0);
  const [mode, setMode]             = useState<PriceMode>("base");
  const [viewTab, setViewTab]       = useState<ViewTab>("visual");
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [editFare, setEditFare]     = useState("");
  const [configs, setConfigs]       = useState<RouteFareConfig[]>(routeFareConfigs);
  const [saved, setSaved]           = useState(false);
  const [toggles, setToggles]       = useState({ festival: true, lastMin: true, peak: false });
  const [bulkTier, setBulkTier]     = useState<SeatTier | "all">("all");
  const [bulkMode, setBulkMode]     = useState<PriceMode>("base");
  const [bulkVal, setBulkVal]       = useState("");
  const [bulkPct, setBulkPct]       = useState("");

  const config = configs[routeIdx];
  const range  = getFareRange(config);

  const toggleSeat = (id: string) =>
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const selectAll = (tier?: SeatTier) => {
    const ids = config.seats.filter(s => !tier || s.tier === tier).map(s => s.seatId);
    setSelected(new Set(ids));
  };

  const clearSelection = () => setSelected(new Set());

  const applyFareToSelected = () => {
    const val = parseInt(editFare);
    if (!val || !selected.size) return;
    setConfigs(prev => prev.map((cfg, i) =>
      i !== routeIdx ? cfg : {
        ...cfg,
        seats: cfg.seats.map(s => {
          if (!selected.has(s.seatId)) return s;
          const delta = val - s.baseFare;
          return {
            ...s,
            baseFare: mode === "base" ? val : s.baseFare,
            weekendFare: mode === "weekend" ? val : Math.max(s.baseFare + delta, s.baseFare),
            festivalFare: mode === "festival" ? val : s.festivalFare,
            lastMinFare: mode === "lastMin" ? val : s.lastMinFare,
          };
        }),
      }
    ));
    setSaved(false);
    setEditFare("");
    setSelected(new Set());
  };

  const applyBulkPercent = () => {
    const pct = parseFloat(bulkPct);
    if (!pct) return;
    setConfigs(prev => prev.map((cfg, i) =>
      i !== routeIdx ? cfg : {
        ...cfg,
        seats: cfg.seats.map(s => {
          if (bulkTier !== "all" && s.tier !== bulkTier) return s;
          const apply = (v: number) => Math.round(v * (1 + pct / 100));
          return {
            ...s,
            baseFare:    bulkMode === "base"     ? apply(s.baseFare)    : s.baseFare,
            weekendFare: bulkMode === "weekend"  ? apply(s.weekendFare) : s.weekendFare,
            festivalFare:bulkMode === "festival" ? apply(s.festivalFare): s.festivalFare,
            lastMinFare: bulkMode === "lastMin"  ? apply(s.lastMinFare) : s.lastMinFare,
          };
        }),
      }
    ));
    setBulkPct(""); setSaved(false);
  };

  const tierSummary = useMemo(() => {
    const tiers: SeatTier[] = ["premium", "standard", "budget"];
    return tiers.map(tier => {
      const seats = config.seats.filter(s => s.tier === tier);
      const fares = seats.map(s => getFare(s, mode));
      return {
        tier,
        count: seats.length,
        min: Math.min(...fares),
        max: Math.max(...fares),
      };
    });
  }, [config, mode]);

  const selectedFares = config.seats.filter(s => selected.has(s.seatId)).map(s => getFare(s, mode));
  const selMin = selectedFares.length ? Math.min(...selectedFares) : null;
  const selMax = selectedFares.length ? Math.max(...selectedFares) : null;

  return (
    <div className="p-6 space-y-5 fade-in" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>Pricing</div>
          <h2 className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>Seat-Specific Fare Management</h2>
        </div>
        <button
          onClick={() => setSaved(true)}
          className="btn-primary px-4 py-2 text-sm"
          style={{ background: saved ? "#16A34A" : "#F97316" }}
        >
          {saved ? "✓ All Saved" : "Save Changes"}
        </button>
      </div>

      {/* Route selector + mode switcher */}
      <div className="flex items-center gap-3">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Route / Schedule</div>
          <select
            className="op-select"
            value={routeIdx}
            onChange={e => { setRouteIdx(+e.target.value); setSelected(new Set()); }}
          >
            {configs.map((c, i) => (
              <option key={i} value={i}>{c.routeName} · {c.busId} · {c.scheduleId}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Price Mode</div>
          <div className="flex gap-1.5">
            {(Object.keys(MODE_LABELS) as PriceMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
                style={{
                  background: mode === m ? "#F97316" : "#fff",
                  color:      mode === m ? "#fff"    : "#64748B",
                  border:     `1px solid ${mode === m ? "#F97316" : "#E2E8F0"}`,
                }}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tier summary cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="card rounded-xl p-4">
          <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>Fare Range</div>
          <div className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>₹{range.min} – ₹{range.max}</div>
          <div className="font-mono text-xs mt-0.5" style={{ color: "#94A3B8" }}>{config.seats.length} seats · {config.busType}</div>
        </div>
        {tierSummary.map(t => {
          const m = TIER_META[t.tier];
          return (
            <button
              key={t.tier}
              onClick={() => selectAll(t.tier)}
              className="rounded-xl p-4 text-left transition-all hover:shadow-sm"
              style={{ background: m.bg, border: `1.5px solid ${m.border}` }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: m.dot }} />
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: m.text }}>{m.label}</span>
              </div>
              <div className="font-jakarta font-black text-xl" style={{ color: m.text }}>
                ₹{t.min}{t.min !== t.max ? ` – ₹${t.max}` : ""}
              </div>
              <div className="font-mono text-xs mt-0.5" style={{ color: m.text, opacity: 0.7 }}>{t.count} seats · click to select all</div>
            </button>
          );
        })}
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-2">
        {([["visual", "Seat Map"], ["table", "Fare Table"], ["bulk", "Bulk Edit"]] as [ViewTab, string][]).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setViewTab(v)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: viewTab === v ? "#F97316" : "#fff",
              color:      viewTab === v ? "#fff"    : "#64748B",
              border:     `1px solid ${viewTab === v ? "#F97316" : "#E2E8F0"}`,
            }}
          >
            {label}
          </button>
        ))}
        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-xs" style={{ color: "#64748B" }}>
              {selected.size} selected
              {selMin !== null && <> · ₹{selMin}{selMin !== selMax ? `–₹${selMax}` : ""}</>}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="op-input"
                style={{ width: 90, padding: "6px 10px" }}
                placeholder={`New ₹`}
                value={editFare}
                onChange={e => setEditFare(e.target.value)}
              />
              <button onClick={applyFareToSelected} className="btn-primary px-3 py-1.5 text-xs">Apply to {selected.size} seats</button>
              <button onClick={clearSelection} className="btn-ghost px-3 py-1.5 text-xs">Clear</button>
            </div>
          </div>
        )}
      </div>

      {/* ── VISUAL MAP ─────────────────────────────────────────────────────── */}
      {viewTab === "visual" && (
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr auto" }}>
          <div className="card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-jakarta font-semibold" style={{ color: "#0F172A" }}>
                {config.routeName} · {config.busId}
              </div>
              <div className="flex gap-2">
                <button onClick={() => selectAll()} className="btn-ghost px-3 py-1 text-xs">Select All</button>
                <button onClick={clearSelection} className="btn-ghost px-3 py-1 text-xs">Clear</button>
              </div>
            </div>

            {config.busType === "sleeper" || config.busType === "semi-sleeper" ? (
              <SleeperMap seats={config.seats} mode={mode} selected={selected} onToggle={toggleSeat} />
            ) : (
              <SeaterMap seats={config.seats} mode={mode} selected={selected} onToggle={toggleSeat} />
            )}

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
              {Object.entries(TIER_META).map(([tier, m]) => (
                <div key={tier} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: m.bg, border: `1.5px solid ${m.border}` }} />
                  <span className="text-xs" style={{ color: "#64748B" }}>{m.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ background: "#F97316" }} />
                <span className="text-xs" style={{ color: "#64748B" }}>Selected</span>
              </div>
              <div className="ml-auto font-mono text-xs" style={{ color: "#94A3B8" }}>
                Click individual seats or tier cards above to select
              </div>
            </div>
          </div>

          {/* Quick price editor */}
          <div className="card rounded-xl p-5" style={{ width: 220, alignSelf: "start" }}>
            <div className="font-jakarta font-semibold mb-4" style={{ color: "#0F172A" }}>Quick Edit</div>
            {selected.size === 0 ? (
              <div className="text-center py-6">
                <div className="text-2xl mb-2">🖱</div>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>Click seats on the map to select them</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl p-3" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                  <div className="font-mono text-xs" style={{ color: "#F97316" }}>{selected.size} seats selected</div>
                  {selMin !== null && (
                    <div className="font-jakarta font-bold text-sm mt-0.5" style={{ color: "#F97316" }}>
                      ₹{selMin}{selMin !== selMax ? ` – ₹${selMax}` : ""}
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Set {MODE_LABELS[mode]}</div>
                  <input
                    type="number"
                    className="op-input w-full"
                    placeholder="e.g. 650"
                    value={editFare}
                    onChange={e => setEditFare(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && applyFareToSelected()}
                  />
                </div>

                <button onClick={applyFareToSelected} className="btn-primary w-full py-2 text-sm" disabled={!editFare}>
                  Apply ₹{editFare || "—"}
                </button>
                <button onClick={clearSelection} className="btn-ghost w-full py-2 text-sm">Clear Selection</button>

                <div className="pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <div className="font-mono text-xs mb-2" style={{ color: "#94A3B8" }}>Selected seats</div>
                  <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                    {[...selected].map(id => (
                      <span key={id} className="badge badge-red" style={{ cursor: "pointer" }} onClick={() => toggleSeat(id)}>{id} ×</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FARE TABLE ─────────────────────────────────────────────────────── */}
      {viewTab === "table" && (
        <div className="card rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="font-jakarta font-semibold" style={{ color: "#0F172A" }}>All Seat Fares — {config.routeName}</div>
            <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>{config.seats.length} seats</span>
          </div>
          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            <table className="op-table">
              <thead>
                <tr>
                  <th>Seat</th>
                  <th>Position</th>
                  <th>Tier</th>
                  <th>Base Fare</th>
                  <th>Weekend</th>
                  <th>Festival</th>
                  <th>Last-Min</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {config.seats.map((seat, i) => {
                  const m = TIER_META[seat.tier];
                  return (
                    <tr key={i} style={{ background: selected.has(seat.seatId) ? "#FFF7ED" : "transparent" }}>
                      <td>
                        <div
                          className="inline-flex items-center gap-1.5 cursor-pointer"
                          onClick={() => toggleSeat(seat.seatId)}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ background: m.dot }} />
                          <span className="font-mono text-xs font-medium" style={{ color: "#0F172A" }}>{seat.label}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-gray capitalize">{seat.position}</span></td>
                      <td>
                        <span className="badge" style={{ background: m.bg, color: m.text, border: `1px solid ${m.border}` }}>
                          {m.label}
                        </span>
                      </td>
                      <td><span className="font-mono font-medium">₹{seat.baseFare}</span></td>
                      <td><span className="font-mono text-xs" style={{ color: "#2563EB" }}>₹{seat.weekendFare}</span></td>
                      <td><span className="font-mono text-xs" style={{ color: "#D97706" }}>₹{seat.festivalFare}</span></td>
                      <td><span className="font-mono text-xs" style={{ color: "#16A34A" }}>₹{seat.lastMinFare}</span></td>
                      <td>
                        <button
                          onClick={() => { setSelected(new Set([seat.seatId])); setViewTab("visual"); }}
                          className="text-xs px-2 py-1 rounded-md"
                          style={{ background: "#FFF7ED", color: "#F97316", border: "1px solid #FED7AA" }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BULK EDIT ──────────────────────────────────────────────────────── */}
      {viewTab === "bulk" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Percent adjustment */}
          <div className="card rounded-xl p-5">
            <div className="font-jakarta font-semibold mb-1" style={{ color: "#0F172A" }}>Percentage Adjustment</div>
            <div className="text-xs mb-4" style={{ color: "#64748B" }}>Adjust fares by a % for a selected tier and price mode</div>
            <div className="space-y-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Apply to Tier</div>
                <div className="flex gap-2 flex-wrap">
                  {([["all", "All Tiers"], ["premium", "Premium"], ["standard", "Standard"], ["budget", "Budget"]] as [typeof bulkTier, string][]).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setBulkTier(v)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: bulkTier === v ? "#F97316" : "#F8FAFC",
                        color:      bulkTier === v ? "#fff"    : "#64748B",
                        border:     `1px solid ${bulkTier === v ? "#F97316" : "#E2E8F0"}`,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Price Mode</div>
                <select className="op-select w-full" value={bulkMode} onChange={e => setBulkMode(e.target.value as PriceMode)}>
                  {(Object.entries(MODE_LABELS) as [PriceMode, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-wider mb-1.5" style={{ color: "#94A3B8" }}>Percentage Change</div>
                <div className="flex gap-2">
                  {["-10%", "-5%", "+5%", "+10%", "+15%", "+20%"].map(p => (
                    <button
                      key={p}
                      onClick={() => setBulkPct(p.replace("%", ""))}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all"
                      style={{
                        background: bulkPct === p.replace("%", "") ? "#F97316" : "#F8FAFC",
                        color:      bulkPct === p.replace("%", "") ? "#fff" : p.startsWith("-") ? "#F97316" : "#16A34A",
                        border:     `1px solid ${bulkPct === p.replace("%", "") ? "#F97316" : "#E2E8F0"}`,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="op-input w-full mt-2"
                  placeholder="Custom % (e.g. 12 or -8)"
                  value={bulkPct}
                  onChange={e => setBulkPct(e.target.value)}
                />
              </div>
              <button
                onClick={applyBulkPercent}
                disabled={!bulkPct}
                className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
              >
                Apply {bulkPct ? `${+bulkPct > 0 ? "+" : ""}${bulkPct}%` : "Adjustment"} to {bulkTier === "all" ? "all" : bulkTier} seats
              </button>
            </div>
          </div>

          {/* Dynamic pricing toggles */}
          <div className="space-y-4">
            <div className="card rounded-xl p-5">
              <div className="font-jakarta font-semibold mb-4" style={{ color: "#0F172A" }}>Dynamic Pricing Rules</div>
              <div className="space-y-3">
                {[
                  { key: "festival" as const, label: "Festival Surcharge", note: "Diwali, Dussehra, Holi", color: "#D97706" },
                  { key: "lastMin"  as const, label: "Last-Minute Discount", note: "Within 6 hrs of departure", color: "#16A34A" },
                  { key: "peak"     as const, label: "Peak Hour Pricing", note: "Friday evenings, Sunday mornings", color: "#2563EB" },
                ].map(p => (
                  <div key={p.key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <div>
                      <div className="font-medium text-sm" style={{ color: "#0F172A" }}>{p.label}</div>
                      <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{p.note}</div>
                    </div>
                    <button
                      onClick={() => setToggles(prev => ({ ...prev, [p.key]: !prev[p.key] }))}
                      className="w-11 h-6 rounded-full relative transition-colors shrink-0"
                      style={{ background: toggles[p.key] ? "#F97316" : "#E2E8F0" }}
                    >
                      <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: toggles[p.key] ? "26px" : "4px" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation slabs */}
            <div className="card rounded-xl p-5">
              <div className="font-jakarta font-semibold mb-4" style={{ color: "#0F172A" }}>Cancellation Refund Slabs</div>
              <div className="space-y-2">
                {[
                  { time: "> 48 hrs", pct: "90%", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
                  { time: "24–48 hrs", pct: "70%", color: "#65A30D", bg: "#F7FEE7", border: "#D9F99D" },
                  { time: "12–24 hrs", pct: "50%", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
                  { time: "< 12 hrs",  pct: "0%",  color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
                    <span className="font-mono text-xs" style={{ color: r.color }}>{r.time} before departure</span>
                    <span className="font-jakarta font-bold text-sm" style={{ color: r.color }}>{r.pct} refund</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
