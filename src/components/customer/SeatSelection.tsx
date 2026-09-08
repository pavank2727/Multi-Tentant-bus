import { useState, useMemo } from "react";
import { busSearchResults, type SeatStatus } from "../../data/mockData";
import { routeFareConfigs, TIER_META, type SeatFareEntry } from "../../data/seatFares";
import { getLayout, type BusLayout, type DesignedSeat, type DoorPos, type BusSide } from "../../data/busLayoutStore";

interface SeatSelectionProps {
  bus: (typeof busSearchResults)[0];
  onBook: (seats: string[], fareMap: Record<string, number>) => void;
  onBack: () => void;
}

// ── Shared status palette ────────────────────────────────────────────────────

type BookingStatus = "available" | "booked" | "female" | "selected";

const S: Record<BookingStatus, { bg: string; border: string; text: string; solid: string }> = {
  available: { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", solid: "#16A34A" },
  booked:    { bg: "#F1F5F9", border: "#CBD5E1", text: "#94A3B8", solid: "#CBD5E1" },
  female:    { bg: "#FFFBEB", border: "#FDE68A", text: "#92400E", solid: "#F59E0B" },
  selected:  { bg: "#F97316", border: "#EA580C", text: "#fff",    solid: "#fff"    },
};

// ── Customer seat built from designer layout ─────────────────────────────────

interface CustomerSeat extends DesignedSeat {
  status: BookingStatus;
  fare: number;
  fareEntry?: SeatFareEntry;
}

function assignStatuses(seats: DesignedSeat[], busId: string, baseFare: number): CustomerSeat[] {
  const fareConfig = routeFareConfigs.find(c => c.busId === busId);
  const fareMap = Object.fromEntries(fareConfig?.seats.map(s => [s.seatId, s]) ?? []);

  return seats.map((s, i) => {
    // Deterministic status from position hash
    const h = (s.row * 7 + s.col * 13 + (s.side === "left" ? 0 : 5) + (s.type === "upper" ? 3 : 0)) % 10;
    const status: BookingStatus = h < 3 ? "booked" : h === 3 ? "female" : "available";

    const fareEntry = fareMap[s.label];
    const fare = fareEntry?.baseFare ?? (
      s.type === "lower"  ? Math.round(baseFare * 1.0) :
      s.type === "upper"  ? Math.round(baseFare * 0.87) :
                            baseFare
    );

    return { ...s, status, fare, fareEntry };
  });
}

// ── Door helpers ─────────────────────────────────────────────────────────────

const DOOR_COLORS = { entry: "#16A34A", exit: "#EA580C" };

function doorRowIndex(pos: DoorPos, totalRows: number): number {
  if (pos.startsWith("front")) return 0;
  if (pos.startsWith("mid"))   return Math.floor(totalRows / 2);
  if (pos.startsWith("rear"))  return totalRows - 1;
  return -1;
}
function doorSide(pos: DoorPos): BusSide | null {
  if (pos === "none") return null;
  return pos.endsWith("left") ? "left" : "right";
}

// ── Customer cell — seater ────────────────────────────────────────────────────

function CustSeaterCell({ seat, onClick }: { seat: CustomerSeat; onClick: () => void }) {
  const col = S[seat.status];
  const interactive = seat.status === "available" || seat.status === "selected";
  return (
    <div
      onClick={interactive ? onClick : undefined}
      title={`${seat.label} · ₹${seat.fare}${seat.status === "female" ? " · Ladies only" : ""}${seat.status === "booked" ? " · Booked" : ""}`}
      className="flex-shrink-0 transition-all select-none"
      style={{
        width: 46, height: 58,
        background: col.bg, border: `2px solid ${col.border}`,
        borderRadius: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        paddingBottom: 6, gap: 3,
        cursor: interactive ? "pointer" : "not-allowed",
        transform: seat.status === "selected" ? "scale(1.05)" : "scale(1)",
        boxShadow: seat.status === "selected" ? "0 3px 10px #F9731644" : "none",
        opacity: seat.status === "booked" ? 0.6 : 1,
      }}
    >
      <div style={{ width: 30, height: 5, background: col.solid, borderRadius: 3, opacity: 0.85 }} />
      <div style={{ width: 34, height: 22, background: seat.status === "selected" ? "rgba(255,255,255,0.15)" : "#fff", border: `1.5px solid ${col.border}`, borderRadius: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <span style={{ fontSize: 8, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: col.text, lineHeight: 1 }}>{seat.label}</span>
        <span style={{ fontSize: 7, fontFamily: "JetBrains Mono, monospace", color: col.text, opacity: 0.8, lineHeight: 1 }}>₹{seat.fare}</span>
      </div>
    </div>
  );
}

// ── Customer cell — sleeper berth ─────────────────────────────────────────────

function CustBerthCell({ seat, onClick }: { seat: CustomerSeat; onClick: () => void }) {
  const col = S[seat.status];
  const interactive = seat.status === "available" || seat.status === "selected";
  return (
    <div
      onClick={interactive ? onClick : undefined}
      title={`${seat.label} · ${seat.type} berth · ₹${seat.fare}${seat.status === "female" ? " · Ladies only" : ""}${seat.status === "booked" ? " · Booked" : ""}`}
      className="flex-shrink-0 relative overflow-hidden transition-all select-none"
      style={{
        width: 46, height: 86,
        background: col.bg, border: `1.5px solid ${col.border}`,
        borderRadius: 8,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        paddingBottom: 6,
        cursor: interactive ? "pointer" : "not-allowed",
        transform: seat.status === "selected" ? "scale(1.04)" : "scale(1)",
        boxShadow: seat.status === "selected" ? "0 3px 10px #F9731644" : "none",
        opacity: seat.status === "booked" ? 0.5 : 1,
      }}
    >
      {/* Sheet stripes */}
      <div style={{
        position: "absolute", inset: 0, bottom: 28,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent 7px, ${col.border}55 7px, ${col.border}55 8px)`,
      }} />
      {/* Seam */}
      <div style={{ position: "absolute", left: "50%", top: 6, bottom: 28, width: 1, background: `${col.border}66`, transform: "translateX(-50%)" }} />
      {/* Pillow */}
      <div style={{
        position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)",
        width: 32, height: 16,
        background: seat.status === "selected" ? "rgba(255,255,255,0.25)" : "#fff",
        border: `1.5px solid ${col.border}`, borderRadius: 5,
      }} />
      {/* Deck badge */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", fontSize: 7, fontFamily: "JetBrains Mono, monospace", fontWeight: 800, color: col.text, opacity: 0.5, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
        {seat.type === "upper" ? "UPR" : "LWR"}
      </div>
      {/* Label + fare */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, gap: 1 }}>
        <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: col.text }}>{seat.label}</span>
        <span style={{ fontSize: 7, fontFamily: "JetBrains Mono, monospace", color: col.text, opacity: 0.85 }}>₹{seat.fare}</span>
      </div>
      {/* Female badge */}
      {seat.status === "female" && (
        <div style={{ position: "absolute", top: 3, right: 3, fontSize: 8 }}>♀</div>
      )}
    </div>
  );
}

// ── Door tab ─────────────────────────────────────────────────────────────────

function DoorTab({ kind, rowHeight }: { kind: "entry" | "exit"; rowHeight: number }) {
  const color = DOOR_COLORS[kind];
  return (
    <div style={{
      width: 12, height: rowHeight, background: color,
      borderRadius: kind === "entry" ? "4px 0 0 4px" : "0 4px 4px 0",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <span style={{ fontSize: 5, fontFamily: "JetBrains Mono, monospace", fontWeight: 800, color: "#fff", writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.1em" }}>
        {kind === "entry" ? "ENTRY" : "EXIT"}
      </span>
    </div>
  );
}

// ── Designed bus map ─────────────────────────────────────────────────────────

function DesignedBusMap({
  layout, seats, onToggle,
}: {
  layout: BusLayout;
  seats: CustomerSeat[];
  onToggle: (id: string) => void;
}) {
  const { busMode, rows, leftCols, rightCols, driverSide, entryPos, exitPos } = layout;
  const rowH = busMode === "seater" ? 58 : 86;

  const getSeat = (row: number, col: number, side: BusSide, type: "seater" | "lower" | "upper") =>
    seats.find(s => s.row === row && s.col === col && s.side === side && s.type === type);

  const renderSlot = (row: number, col: number, side: BusSide) => {
    const key = `${row}-${col}-${side}`;
    if (busMode === "seater") {
      const seat = getSeat(row, col, side, "seater");
      if (!seat) return <div key={key} style={{ width: 46, height: 58 }} />;
      return <CustSeaterCell key={key} seat={seat} onClick={() => onToggle(seat.id)} />;
    }
    const lower = getSeat(row, col, side, "lower");
    const upper = getSeat(row, col, side, "upper");
    return (
      <div key={key} className="flex gap-1">
        {lower ? <CustBerthCell seat={lower} onClick={() => onToggle(lower.id)} /> : <div style={{ width: 46, height: 86 }} />}
        {upper ? <CustBerthCell seat={upper} onClick={() => onToggle(upper.id)} /> : <div style={{ width: 46, height: 86 }} />}
      </div>
    );
  };

  return (
    <div className="relative mx-auto" style={{
      background: "#F8FAFC", border: "2.5px solid #CBD5E1", borderRadius: 28,
      padding: "0 16px 16px", width: "fit-content",
      boxShadow: "0 4px 24px #94A3B822, inset 0 1px 0 #fff",
    }}>
      {/* Side stripes */}
      <div style={{ position: "absolute", left: 0, top: 56, bottom: 16, width: 4, background: "#F97316", borderRadius: "0 0 0 26px" }} />
      <div style={{ position: "absolute", right: 0, top: 56, bottom: 16, width: 4, background: "#F97316", borderRadius: "0 0 26px 0" }} />

      {/* Driver area */}
      <div className="flex items-center justify-between gap-4 mb-4"
        style={{ borderBottom: "2px dashed #E2E8F0", paddingTop: 12, paddingBottom: 10 }}>
        {driverSide === "left" ? (
          <>
            <div className="flex items-center gap-2">
              <SteeringWheel />
              <div className="font-mono" style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.1em" }}>DRIVER</div>
            </div>
            <FrontDoors entryPos={entryPos} exitPos={exitPos} side="right" />
          </>
        ) : (
          <>
            <FrontDoors entryPos={entryPos} exitPos={exitPos} side="left" />
            <div className="flex items-center gap-2">
              <div className="font-mono" style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.1em" }}>DRIVER</div>
              <SteeringWheel />
            </div>
          </>
        )}
      </div>

      {/* Column headers */}
      <div className="flex items-center mb-1.5" style={{ paddingLeft: 26 }}>
        <div style={{ width: 16 }} />
        <div className="font-mono text-center" style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#94A3B8", width: leftCols * (busMode === "seater" ? 46 : 96) + (leftCols - 1) * 6 }}>← LEFT</div>
        <div style={{ width: 44 }} />
        <div className="font-mono text-center" style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#94A3B8", width: rightCols * (busMode === "seater" ? 46 : 96) + (rightCols - 1) * 6 }}>RIGHT →</div>
        <div style={{ width: 16 }} />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }, (_, r) => {
          const rowLabel = busMode === "seater" ? String.fromCharCode(65 + r) : String(r + 1);
          const entryR = doorRowIndex(entryPos, rows);
          const exitR  = doorRowIndex(exitPos, rows);
          const eS = doorSide(entryPos);
          const xS = doorSide(exitPos);

          return (
            <div key={r} className="flex items-center gap-1">
              {/* Left door */}
              <div style={{ width: 16, flexShrink: 0 }}>
                {r === entryR && eS === "left" ? <DoorTab kind="entry" rowHeight={rowH} /> :
                 r === exitR  && xS === "left" ? <DoorTab kind="exit"  rowHeight={rowH} /> : null}
              </div>
              {/* Row number */}
              <div className="font-mono flex-shrink-0 text-right" style={{ width: 18, fontSize: 9, fontWeight: 700, color: "#CBD5E1" }}>{rowLabel}</div>
              {/* Left seats */}
              <div className="flex gap-1.5 ml-1">
                {Array.from({ length: leftCols }, (_, c) => renderSlot(r, c, "left"))}
              </div>
              {/* Aisle */}
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, alignSelf: "stretch" }}>
                <div style={{ width: 1, height: "100%", background: "#E2E8F030" }} />
              </div>
              {/* Right seats */}
              <div className="flex gap-1.5">
                {Array.from({ length: rightCols }, (_, c) => renderSlot(r, c, "right"))}
              </div>
              {/* Right door */}
              <div style={{ width: 16, flexShrink: 0, marginLeft: 4 }}>
                {r === entryR && eS === "right" ? <DoorTab kind="entry" rowHeight={rowH} /> :
                 r === exitR  && xS === "right" ? <DoorTab kind="exit"  rowHeight={rowH} /> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-3">
        <span className="font-mono" style={{ fontSize: 8, color: "#CBD5E1", letterSpacing: "0.15em" }}>REAR →</span>
      </div>
    </div>
  );
}

function SteeringWheel() {
  return (
    <div style={{ width: 30, height: 30, border: "2.5px solid #CBD5E1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
      <div style={{ width: 10, height: 10, border: "2px solid #CBD5E1", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "60%", height: 2, background: "#CBD5E1", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", height: "60%", width: 2, background: "#CBD5E1", transform: "translate(-50%,-50%)" }} />
    </div>
  );
}

function FrontDoors({ entryPos, exitPos, side }: { entryPos: DoorPos; exitPos: DoorPos; side: BusSide }) {
  const hasEntry = entryPos.startsWith("front") && doorSide(entryPos) === side;
  const hasExit  = exitPos.startsWith("front")  && doorSide(exitPos)  === side;
  if (!hasEntry && !hasExit) return <div />;
  return (
    <div className="flex items-center gap-1.5">
      {hasEntry && <DoorBadge kind="entry" />}
      {hasExit  && <DoorBadge kind="exit"  />}
    </div>
  );
}

function DoorBadge({ kind }: { kind: "entry" | "exit" }) {
  const color = DOOR_COLORS[kind];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 6, background: `${color}18`, border: `1.5px solid ${color}55` }}>
      <div style={{ width: 9, height: 16, border: `2px solid ${color}`, borderRadius: 2, position: "relative" }}>
        <div style={{ position: "absolute", right: 1, top: "50%", width: 2, height: 2, background: color, borderRadius: "50%", transform: "translateY(-50%)" }} />
      </div>
      <div className="font-mono" style={{ fontSize: 7, fontWeight: 800, color, letterSpacing: "0.1em" }}>
        {kind === "entry" ? "ENTRY" : "EXIT"}
      </div>
    </div>
  );
}

// ── Step bar ─────────────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  const steps = ["Select Seats", "Passenger Details", "Payment", "Confirmation"];
  return (
    <div className="bg-white px-6 py-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
      <div className="max-w-5xl mx-auto flex items-center">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                style={{ background: i < current ? "#16A34A" : i === current ? "#F97316" : "#F1F5F9", color: i <= current ? "#fff" : "#94A3B8" }}>
                {i < current ? "✓" : i + 1}
              </div>
              <span className="text-xs font-medium" style={{ color: i === current ? "#F97316" : i < current ? "#16A34A" : "#94A3B8" }}>{s}</span>
            </div>
            {i < 3 && <div className="flex-1 h-px mx-2" style={{ background: i < current ? "#BBF7D0" : "#E2E8F0" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Fallback hardcoded seat cell (existing style, kept for non-designed buses) ─

interface FallbackSeat {
  id: string; label: string; status: SeatStatus; deck: "lower" | "upper"; fareEntry?: SeatFareEntry;
}

function buildFallbackSeats(busId: string): FallbackSeat[] {
  const prebooked = ["L2", "L4", "L7", "L9", "U1", "U3", "U6", "U8", "U10"];
  const female    = ["L5", "U4"];
  const fareConfig = routeFareConfigs.find(c => c.busId === busId);
  const fareMap = Object.fromEntries(fareConfig?.seats.map(s => [s.seatId, s]) ?? []);
  const seats: FallbackSeat[] = [];
  for (let i = 1; i <= 20; i++) {
    const lo = `L${i}`, up = `U${i}`;
    seats.push({ id: lo, label: lo, status: prebooked.includes(lo) ? "booked" : female.includes(lo) ? "female" : "available", deck: "lower", fareEntry: fareMap[lo] });
    seats.push({ id: up, label: up, status: prebooked.includes(up) ? "booked" : female.includes(up) ? "female" : "available", deck: "upper", fareEntry: fareMap[up] });
  }
  return seats;
}

function FallbackSeatCell({ seat, onClick }: { seat: FallbackSeat; onClick: () => void }) {
  const STATUS_COLORS: Record<SeatStatus, { bg: string; border: string; text: string }> = {
    available: { bg: "#F0FDF4", border: "#86EFAC",  text: "#166534" },
    booked:    { bg: "#FFF7ED", border: "#FED7AA",  text: "#9A3412" },
    female:    { bg: "#FFFBEB", border: "#FDE68A",  text: "#92400E" },
    selected:  { bg: "#F97316", border: "#EA580C",  text: "#fff"    },
    empty:     { bg: "#F8FAFC", border: "#E2E8F0",  text: "#CBD5E1" },
  };
  const c = STATUS_COLORS[seat.status];
  const fare = seat.fareEntry?.baseFare;
  const tier = seat.fareEntry?.tier;
  const canClick = seat.status !== "booked" && seat.status !== "female";
  return (
    <div onClick={canClick ? onClick : undefined}
      className="rounded-xl transition-all flex flex-col items-center justify-center"
      style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.text, cursor: canClick ? "pointer" : "not-allowed", width: 56, height: 48, transform: seat.status === "selected" ? "scale(1.06)" : "scale(1)", boxShadow: seat.status === "selected" ? "0 3px 10px rgba(249,115,22,0.3)" : "none" }}>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>{seat.label}</span>
      {fare && <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, marginTop: 2, opacity: 0.75, color: tier ? TIER_META[tier].text : c.text }}>₹{fare}</span>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SeatSelection({ bus, onBook, onBack }: SeatSelectionProps) {
  const designedLayout = getLayout();

  // ── Designed layout path ──────────────────────────────────────────────────
  const [custSeats, setCustSeats] = useState<CustomerSeat[]>(() =>
    designedLayout ? assignStatuses(designedLayout.seats, bus.busNumber, bus.fare) : []
  );

  // ── Fallback path ─────────────────────────────────────────────────────────
  const [fbSeats, setFbSeats] = useState<FallbackSeat[]>(() =>
    designedLayout ? [] : buildFallbackSeats(bus.busNumber)
  );
  const [fbDeck, setFbDeck] = useState<"lower" | "upper">("lower");

  // ── Shared selection state ────────────────────────────────────────────────
  const [selected, setSel] = useState<string[]>([]);
  const [timer, setTimer]  = useState(300);

  const fmt = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

  const toggle = (id: string) => {
    if (designedLayout) {
      const seat = custSeats.find(s => s.id === id);
      if (!seat || seat.status === "booked" || seat.status === "female") return;
      if (selected.includes(id)) {
        setSel(p => p.filter(x => x !== id));
        setCustSeats(p => p.map(s => s.id === id ? { ...s, status: "available" } : s));
      } else if (selected.length < 6) {
        if (selected.length === 0) setTimer(300);
        setSel(p => [...p, id]);
        setCustSeats(p => p.map(s => s.id === id ? { ...s, status: "selected" } : s));
      }
    } else {
      const seat = fbSeats.find(s => s.id === id);
      if (!seat || seat.status === "booked" || seat.status === "female") return;
      if (selected.includes(id)) {
        setSel(p => p.filter(x => x !== id));
        setFbSeats(p => p.map(s => s.id === id ? { ...s, status: "available" } : s));
      } else if (selected.length < 6) {
        if (selected.length === 0) setTimer(300);
        setSel(p => [...p, id]);
        setFbSeats(p => p.map(s => s.id === id ? { ...s, status: "selected" } : s));
      }
    }
  };

  // ── Fare data ─────────────────────────────────────────────────────────────
  const fareMap = useMemo(() => {
    if (designedLayout) {
      return Object.fromEntries(custSeats.map(s => [s.id, s.fare]));
    }
    const fareConfig = routeFareConfigs.find(c => c.busId === bus.busNumber);
    return Object.fromEntries(fareConfig?.seats.map(s => [s.seatId, s.baseFare]) ?? []);
  }, [bus.busNumber, designedLayout, custSeats]);

  const selectedSeatsData = selected.map(id => ({
    id,
    fare: fareMap[id] ?? bus.fare,
    fareEntry: designedLayout
      ? custSeats.find(s => s.id === id)?.fareEntry
      : fbSeats.find(s => s.id === id)?.fareEntry,
  }));

  const subtotal = selectedSeatsData.reduce((a, s) => a + s.fare, 0);
  const gst      = Math.round(subtotal * 0.05);
  const total    = subtotal + gst;

  const hasFareData = !designedLayout && Object.keys(fareMap).length > 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100%" }}>
      {/* Header */}
      <header className="bg-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-10" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm font-medium" style={{ color: "#64748B" }}>← Back</button>
          <div className="w-px h-4" style={{ background: "#E2E8F0" }} />
          <div className="font-jakarta font-bold" style={{ color: "#0F172A" }}>{bus.operator} · {bus.busName}</div>
          <span className="badge badge-gray">{bus.busType}</span>
          {designedLayout && (
            <span className="px-2 py-0.5 rounded-full font-mono text-xs" style={{ background: "#F0FDF4", border: "1px solid #86EFAC", color: "#16A34A" }}>
              Custom Layout
            </span>
          )}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
            <span className="font-mono text-xs font-medium" style={{ color: "#92400E" }}>Locked: {fmt(timer)}</span>
          </div>
        )}
      </header>

      <StepBar current={0} />

      <div className="flex gap-5 max-w-6xl mx-auto p-5">
        {/* ── Seat map ── */}
        <div className="flex-1 min-w-0">
          {/* Trip strip */}
          <div className="card rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div>
                <div className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>{bus.departure}</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>{bus.boardingPoint}</div>
              </div>
              <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>{bus.duration} →</div>
              <div>
                <div className="font-jakarta font-black text-xl" style={{ color: "#0F172A" }}>{bus.arrival}</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>{bus.droppingPoint}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>Fares from</div>
              <div className="font-jakarta font-black text-lg" style={{ color: "#F97316" }}>
                ₹{designedLayout
                  ? Math.min(...custSeats.map(s => s.fare))
                  : (hasFareData ? Math.min(...Object.values(fareMap)) : bus.fare)}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 flex-wrap">
            {[
              { label: "Available",    bg: "#F0FDF4", border: "#86EFAC" },
              { label: "Booked",       bg: "#F1F5F9", border: "#CBD5E1" },
              { label: "Ladies Only",  bg: "#FFFBEB", border: "#FDE68A" },
              { label: "Selected",     bg: "#F97316", border: "#F97316" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded" style={{ background: l.bg, border: `1.5px solid ${l.border}` }} />
                <span className="text-xs" style={{ color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
            {designedLayout && (
              <>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 12, height: 16, background: "#16A34A", borderRadius: 2 }} />
                  <span className="text-xs" style={{ color: "#64748B" }}>Entry door</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 12, height: 16, background: "#EA580C", borderRadius: 2 }} />
                  <span className="text-xs" style={{ color: "#64748B" }}>Exit door</span>
                </div>
              </>
            )}
          </div>

          {/* Bus map */}
          <div className="card rounded-2xl p-5 overflow-x-auto">
            {designedLayout ? (
              <DesignedBusMap layout={designedLayout} seats={custSeats} onToggle={toggle} />
            ) : (
              <>
                {/* Fallback: deck tabs + existing grid */}
                <div className="flex gap-2 mb-4">
                  {(["lower", "upper"] as const).map(d => (
                    <button key={d} onClick={() => setFbDeck(d)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ background: fbDeck === d ? "#F97316" : "#fff", color: fbDeck === d ? "#fff" : "#64748B", border: `1.5px solid ${fbDeck === d ? "#F97316" : "#E2E8F0"}` }}>
                      {d === "lower" ? "🛏 Lower Berth" : "🛏 Upper Berth"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: "2px dashed #E2E8F0" }}>
                  <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>← DRIVER</span>
                  <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>{fbDeck.toUpperCase()} BERTHS</span>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, ri) => {
                    const row = fbSeats.filter(s => s.deck === fbDeck).slice(ri * 2, ri * 2 + 2);
                    return (
                      <div key={ri} className="flex items-center gap-2">
                        <span className="font-mono text-xs w-5 text-right shrink-0" style={{ color: "#CBD5E1" }}>{ri + 1}</span>
                        <div className="flex gap-2">
                          {row.map(seat => <FallbackSeatCell key={seat.id} seat={seat} onClick={() => toggle(seat.id)} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {!designedLayout && (
            <div className="mt-3 text-center">
              <span className="font-mono text-xs" style={{ color: "#CBD5E1" }}>
                Design a layout in the Operator Portal → Seat Designer to see a custom bus map here
              </span>
            </div>
          )}
        </div>

        {/* ── Booking summary ── */}
        <div className="shrink-0" style={{ width: 272 }}>
          <div className="card rounded-xl p-5 sticky top-24">
            <div className="font-jakarta font-bold mb-4" style={{ color: "#0F172A" }}>Booking Summary</div>

            {selected.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🎫</div>
                <div className="text-sm" style={{ color: "#94A3B8" }}>Select seats to continue</div>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {selectedSeatsData.map(s => {
                    const entry = s.fareEntry;
                    const m = entry ? TIER_META[entry.tier] : null;
                    return (
                      <div key={s.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                        style={{ background: m ? m.bg : "#F8FAFC", border: `1px solid ${m ? m.border : "#F1F5F9"}` }}>
                        <div className="flex items-center gap-2">
                          {m && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: m.dot }} />}
                          <div>
                            <div className="font-mono font-medium text-sm" style={{ color: "#0F172A" }}>Seat {s.id}</div>
                            {entry && <div className="font-mono" style={{ fontSize: 10, color: m!.text }}>{m!.label} · {entry.position}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-jakarta font-bold text-sm" style={{ color: m ? m.text : "#F97316" }}>₹{s.fare}</span>
                          <button onClick={() => toggle(s.id)} className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: "#FFF7ED", color: "#F97316" }}>×</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pb-3 mb-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#64748B" }}>Subtotal</span>
                    <span className="font-mono" style={{ color: "#0F172A" }}>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#64748B" }}>GST (5%)</span>
                    <span className="font-mono" style={{ color: "#0F172A" }}>₹{gst}</span>
                  </div>
                </div>

                <div className="flex justify-between font-jakarta font-bold text-lg mb-4">
                  <span style={{ color: "#0F172A" }}>Total</span>
                  <span style={{ color: "#F97316" }}>₹{total}</span>
                </div>

                <button
                  onClick={() => onBook(selected, Object.fromEntries(selectedSeatsData.map(s => [s.id, s.fare])))}
                  className="btn-primary w-full py-3 text-sm"
                >
                  Passenger Details →
                </button>
                <div className="font-mono text-xs text-center mt-2" style={{ color: "#94A3B8" }}>
                  Seats locked for <span style={{ color: "#D97706" }}>{fmt(timer)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
