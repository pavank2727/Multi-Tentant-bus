// ─── Seat-specific fare configuration ─────────────────────────────────────────

export type SeatTier = "premium" | "standard" | "budget";
export type SeatPosition = "lower" | "upper" | "window" | "aisle";

export interface SeatFareEntry {
  seatId: string;
  label: string;
  position: SeatPosition;
  tier: SeatTier;
  baseFare: number;
  weekendFare: number;
  festivalFare: number;
  lastMinFare: number;
}

export interface RouteFareConfig {
  routeId: string;
  routeName: string;
  scheduleId: string;
  busId: string;
  busType: "sleeper" | "semi-sleeper" | "seater";
  seats: SeatFareEntry[];
}

// ─── Tier colour tokens ────────────────────────────────────────────────────────
export const TIER_META: Record<SeatTier, { label: string; bg: string; border: string; text: string; dot: string }> = {
  premium:  { label: "Premium",  bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", dot: "#DC2626" },
  standard: { label: "Standard", bg: "#FFF7ED", border: "#FDBA74", text: "#EA580C", dot: "#F97316" },
  budget:   { label: "Budget",   bg: "#F0FDF4", border: "#86EFAC", text: "#16A34A", dot: "#22C55E" },
};

// ─── Helper: build sleeper seat fare list ──────────────────────────────────────
function buildSleeperFares(opts: {
  lowerFront: number; lowerMid: number; lowerRear: number;
  upperFront: number; upperMid: number; upperRear: number;
}): SeatFareEntry[] {
  const seats: SeatFareEntry[] = [];

  // Lower berths (L1–L20, rows 1-20)
  for (let i = 1; i <= 20; i++) {
    const tier: SeatTier = i <= 5 ? "premium" : i <= 14 ? "standard" : "budget";
    const base = i <= 5 ? opts.lowerFront : i <= 14 ? opts.lowerMid : opts.lowerRear;
    seats.push({
      seatId: `L${i}`, label: `L${i}`,
      position: "lower", tier,
      baseFare: base,
      weekendFare: Math.round(base * 1.15),
      festivalFare: Math.round(base * 1.30),
      lastMinFare: Math.round(base * 0.88),
    });
  }

  // Upper berths (U1–U20)
  for (let i = 1; i <= 20; i++) {
    const tier: SeatTier = i <= 5 ? "standard" : i <= 14 ? "budget" : "budget";
    const base = i <= 5 ? opts.upperFront : i <= 14 ? opts.upperMid : opts.upperRear;
    seats.push({
      seatId: `U${i}`, label: `U${i}`,
      position: "upper", tier,
      baseFare: base,
      weekendFare: Math.round(base * 1.15),
      festivalFare: Math.round(base * 1.30),
      lastMinFare: Math.round(base * 0.88),
    });
  }

  return seats;
}

// ─── Helper: build 2+2 seater fare list ───────────────────────────────────────
function buildSeaterFares(opts: {
  windowFront: number; windowMid: number; windowRear: number;
  aisleFront: number; aisleMid: number; aisleRear: number;
}): SeatFareEntry[] {
  const seats: SeatFareEntry[] = [];
  const ROWS = 13;
  const labels = "ABCDEFGHIJKLM".split("");

  for (let r = 0; r < ROWS; r++) {
    const row = labels[r];
    const zone = r < 4 ? "front" : r < 9 ? "mid" : "rear";

    // Window seats: col 1 (left window), col 4 (right window)
    const winBase = zone === "front" ? opts.windowFront : zone === "mid" ? opts.windowMid : opts.windowRear;
    const winTier: SeatTier = zone === "front" ? "premium" : zone === "mid" ? "standard" : "budget";

    // Aisle seats: col 2 (left aisle), col 3 (right aisle)
    const aisleBase = zone === "front" ? opts.aisleFront : zone === "mid" ? opts.aisleMid : opts.aisleRear;
    const aisleTier: SeatTier = zone === "front" ? "standard" : "budget";

    [
      { id: `${row}1`, position: "window" as SeatPosition, base: winBase,   tier: winTier },
      { id: `${row}2`, position: "aisle"  as SeatPosition, base: aisleBase, tier: aisleTier },
      { id: `${row}3`, position: "aisle"  as SeatPosition, base: aisleBase, tier: aisleTier },
      { id: `${row}4`, position: "window" as SeatPosition, base: winBase,   tier: winTier },
    ].forEach(s => {
      seats.push({
        seatId: s.id, label: s.id,
        position: s.position, tier: s.tier,
        baseFare: s.base,
        weekendFare: Math.round(s.base * 1.12),
        festivalFare: Math.round(s.base * 1.28),
        lastMinFare: Math.round(s.base * 0.90),
      });
    });
  }
  return seats;
}

// ─── Route fare configs ────────────────────────────────────────────────────────
export const routeFareConfigs: RouteFareConfig[] = [
  {
    routeId: "RT-001", scheduleId: "SCH-001",
    routeName: "Mumbai → Pune",
    busId: "MH-12-AB-4521", busType: "sleeper",
    seats: buildSleeperFares({
      lowerFront: 780, lowerMid: 650, lowerRear: 550,
      upperFront: 620, upperMid: 520, upperRear: 450,
    }),
  },
  {
    routeId: "RT-001", scheduleId: "SCH-002",
    routeName: "Mumbai → Pune",
    busId: "MH-12-CD-7803", busType: "seater",
    seats: buildSeaterFares({
      windowFront: 480, windowMid: 420, windowRear: 360,
      aisleFront:  440, aisleMid:  390, aisleRear:  330,
    }),
  },
  {
    routeId: "RT-004", scheduleId: "SCH-005",
    routeName: "Nashik → Mumbai",
    busId: "MH-12-KL-8891", busType: "sleeper",
    seats: buildSleeperFares({
      lowerFront: 840, lowerMid: 720, lowerRear: 600,
      upperFront: 680, upperMid: 580, upperRear: 500,
    }),
  },
  {
    routeId: "RT-002", scheduleId: "SCH-003",
    routeName: "Pune → Nashik",
    busId: "MH-12-EF-1192", busType: "seater",
    seats: buildSeaterFares({
      windowFront: 330, windowMid: 280, windowRear: 240,
      aisleFront:  300, aisleMid:  260, aisleRear:  220,
    }),
  },
];

// ─── Lookup helpers ────────────────────────────────────────────────────────────
export function getSeatFare(config: RouteFareConfig, seatId: string, mode: "base" | "weekend" | "festival" | "lastMin" = "base"): number {
  const seat = config.seats.find(s => s.seatId === seatId);
  if (!seat) return 0;
  return mode === "base" ? seat.baseFare
    : mode === "weekend" ? seat.weekendFare
    : mode === "festival" ? seat.festivalFare
    : seat.lastMinFare;
}

export function getFareRange(config: RouteFareConfig): { min: number; max: number } {
  const fares = config.seats.map(s => s.baseFare);
  return { min: Math.min(...fares), max: Math.max(...fares) };
}
