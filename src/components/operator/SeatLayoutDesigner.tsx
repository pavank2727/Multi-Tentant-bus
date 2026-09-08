import { useState } from "react"
import { saveLayout } from "../../data/busLayoutStore"

// ─── Types ─────────────────────────────────────────────────────────────────────

type SeatType = "seater" | "lower" | "upper"
type BusMode = "seater" | "sleeper"
type BusSide = "left" | "right"
type DoorPos = "none" | "front-left" | "front-right" | "mid-left" | "mid-right" | "rear-left" | "rear-right"

interface Seat {
  id: string
  label: string
  type: SeatType
  row: number
  col: number
  side: BusSide
}

// ─── Colors ─────────────────────────────────────────────────────────────────────

const C = {
  seater: {
    bg: "#FFF7ED",
    border: "#FED7AA",
    solid: "#F97316",
    text: "#9A3412",
  },
  lower: {
    bg: "#F0FDF4",
    border: "#86EFAC",
    solid: "#16A34A",
    text: "#166534",
  },
  upper: {
    bg: "#EFF6FF",
    border: "#93C5FD",
    solid: "#2563EB",
    text: "#1E40AF",
  },
} as const

const DOOR_COLORS = { entry: "#16A34A", exit: "#EA580C" }

// ─── Label generator ───────────────────────────────────────────────────────────

function makeLabel(
  type: SeatType,
  row: number,
  col: number,
  side: BusSide,
  leftCols: number,
  existing: Seat[],
): string {
  if (type === "seater") {
    const letter = String.fromCharCode(65 + row)
    const num = side === "left" ? col + 1 : leftCols + col + 1
    return `${letter}${num}`
  }
  const prefix = type === "lower" ? "L" : "U"
  return `${prefix}${existing.filter((s) => s.type === type).length + 1}`
}

// ─── Door helpers ───────────────────────────────────────────────────────────────

function doorRowIndex(pos: DoorPos, totalRows: number): number {
  if (pos.startsWith("front")) return 0
  if (pos.startsWith("mid")) return Math.floor(totalRows / 2)
  if (pos.startsWith("rear")) return totalRows - 1
  return -1
}
function doorSideOf(pos: DoorPos): BusSide | null {
  if (pos === "none") return null
  return pos.endsWith("left") ? "left" : "right"
}

// ─── Mini door-position picker ──────────────────────────────────────────────────

const DOOR_POS_GRID: { id: DoorPos row: number col: number label: string }[] = [
  { id: "front-left", row: 0, col: 0, label: "FL" },
  { id: "front-right", row: 0, col: 1, label: "FR" },
  { id: "mid-left", row: 1, col: 0, label: "ML" },
  { id: "mid-right", row: 1, col: 1, label: "MR" },
  { id: "rear-left", row: 2, col: 0, label: "RL" },
  { id: "rear-right", row: 2, col: 1, label: "RR" },
]

function DoorPicker({
  label,
  value,
  color,
  onChange,
}: {
  label: string
  value: DoorPos
  color: string
  onChange: (p: DoorPos) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-mono text-xs uppercase tracking-wider"
          style={{ color: "#94A3B8" }}
        >
          {label}
        </span>
        {value !== "none" && (
          <button
            onClick={() => onChange("none")}
            className="font-mono text-xs"
            style={{ color: "#94A3B8" }}
          >
            ✕ clear
          </button>
        )}
      </div>
      {/* Mini bus grid */}
      <div
        className="relative"
        style={{
          width: 104,
          height: 88,
          background: "#F8FAFC",
          border: "1.5px solid #E2E8F0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Bus body hint */}
        <div
          style={{
            position: "absolute",
            inset: 4,
            border: "1px dashed #E2E8F0",
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "33%",
            left: 6,
            right: 6,
            height: 1,
            background: "#E2E8F0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "66%",
            left: 6,
            right: 6,
            height: 1,
            background: "#E2E8F0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            bottom: 6,
            left: "50%",
            width: 1,
            background: "#E2E8F020",
            transform: "translateX(-50%)",
          }}
        />

        {/* Labels */}
        {["FRONT", "MID", "REAR"].map((lbl, i) => (
          <div
            key={lbl}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: i === 0 ? 7 : i === 1 ? "40%" : "73%",
              fontSize: 6,
              fontFamily: "JetBrains Mono, monospace",
              color: "#CBD5E1",
              fontWeight: 700,
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            {lbl}
          </div>
        ))}

        {DOOR_POS_GRID.map((p) => {
          const active = value === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(active ? "none" : p.id)}
              style={{
                position: "absolute",
                left: p.col === 0 ? 5 : undefined,
                right: p.col === 1 ? 5 : undefined,
                top:
                  p.row === 0
                    ? 16
                    : p.row === 1
                      ? "calc(33% + 6px)"
                      : "calc(66% + 6px)",
                width: 28,
                height: 20,
                background: active ? color : "#F1F5F9",
                border: `1.5px solid ${active ? color : "#E2E8F0"}`,
                borderRadius: 4,
                fontSize: 7,
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 800,
                color: active ? "#fff" : "#94A3B8",
                cursor: "pointer",
                transition: "all 0.12s",
                zIndex: 2,
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>
      {value !== "none" && (
        <div className="mt-1.5 font-mono text-xs" style={{ color }}>
          ● {value.replace("-", " ").toUpperCase()}
        </div>
      )}
    </div>
  )
}

// ─── Seat cells ────────────────────────────────────────────────────────────────

function SeaterCell({ seat, onRemove }: { seat: Seat onRemove: () => void }) {
  const col = C.seater
  return (
    <div
      onClick={onRemove}
      title={`${seat.label} — click to remove`}
      className="cursor-pointer select-none transition-all hover:brightness-95 active:scale-95 flex-shrink-0 group relative"
      style={{
        width: 46,
        height: 58,
        background: col.bg,
        border: `2px solid ${col.border}`,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 7,
        gap: 3,
        boxShadow: `0 1px 4px ${col.border}66`,
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-10"
        style={{ background: "#F9731618" }}
      >
        <span style={{ fontSize: 14, color: "#F97316", fontWeight: 700 }}>
          ×
        </span>
      </div>
      <div
        style={{
          width: 30,
          height: 5,
          background: col.solid,
          borderRadius: 3,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          width: 34,
          height: 22,
          background: "#fff",
          border: `1.5px solid ${col.border}`,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            color: col.text,
          }}
        >
          {seat.label}
        </span>
      </div>
    </div>
  )
}

function SleeperCell({ seat, onRemove }: { seat: Seat onRemove: () => void }) {
  const col = C[(seat.type as "lower" | "upper")]
  return (
    <div
      onClick={onRemove}
      title={`${seat.label} — ${seat.type} berth · click to remove`}
      className="cursor-pointer select-none transition-all hover:brightness-95 active:scale-[0.97] relative flex-shrink-0 overflow-hidden group"
      style={{
        width: 46,
        height: 86,
        background: col.bg,
        border: `1.5px solid ${col.border}`,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 8,
        boxShadow: `0 2px 6px ${col.border}55`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          bottom: 22,
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent 7px, ${col.border}44 7px, ${col.border}44 8px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 6,
          bottom: 22,
          width: 1,
          background: `${col.border}55`,
          transform: "translateX(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 5,
          left: "50%",
          transform: "translateX(-50%)",
          width: 32,
          height: 16,
          background: "#fff",
          border: `1.5px solid ${col.border}`,
          borderRadius: 5,
          boxShadow: `inset 0 1px 3px ${col.border}44`,
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-10"
        style={{ background: "#F9731618" }}
      >
        <span style={{ fontSize: 14, color: "#F97316", fontWeight: 700 }}>
          ×
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 7,
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 800,
          color: col.text,
          opacity: 0.5,
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}
      >
        {seat.type === "upper" ? "UPR" : "LWR"}
      </div>
      <span
        style={{
          fontSize: 10,
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 700,
          color: col.text,
          position: "relative",
          zIndex: 1,
        }}
      >
        {seat.label}
      </span>
    </div>
  )
}

function AddSlot({ type, onClick }: { type: SeatType onClick: () => void }) {
  const col = C[type]
  return (
    <div
      onClick={onClick}
      title={`Add ${type}`}
      className="cursor-pointer select-none transition-all hover:opacity-100 hover:scale-105 flex items-center justify-center flex-shrink-0"
      style={{
        width: 46,
        height: type === "seater" ? 58 : 86,
        border: `1.5px dashed ${col.border}`,
        borderRadius: 8,
        background: `${col.bg}55`,
        color: col.solid,
        opacity: 0.5,
        fontSize: 22,
        fontWeight: 200,
      }}
    >
      +
    </div>
  )
}

// ─── Door tab (inline with row, on the bus edge) ────────────────────────────────

function DoorTab({
  kind,
  rowHeight,
}: {
  kind: "entry" | "exit"
  rowHeight: number
}) {
  const color = DOOR_COLORS[kind]
  const label = kind === "entry" ? "ENTRY" : "EXIT"
  return (
    <div
      style={{
        width: 14,
        height: rowHeight,
        background: color,
        borderRadius: kind === "entry" ? "4px 0 0 4px" : "0 4px 4px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 6,
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.1em",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
        }}
      >
        {label}
      </span>
    </div>
  )
}

function EmptyDoorSlot({ rowHeight }: { rowHeight: number }) {
  return <div style={{ width: 14, height: rowHeight, flexShrink: 0 }} />
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div
        className="font-mono text-xs uppercase tracking-wider mb-1.5"
        style={{ color: "#94A3B8" }}
      >
        {label}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all"
          style={{
            background: "#F1F5F9",
            border: "1px solid #E2E8F0",
            color: value <= min ? "#CBD5E1" : "#475569",
            fontSize: 16,
          }}
        >
          −
        </button>
        <span
          className="font-mono font-bold text-base w-6 text-center"
          style={{ color: "#0F172A" }}
        >
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all"
          style={{
            background: "#F1F5F9",
            border: "1px solid #E2E8F0",
            color: value >= max ? "#CBD5E1" : "#475569",
            fontSize: 16,
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

function ColPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div
        className="font-mono text-xs uppercase tracking-wider mb-1.5"
        style={{ color: "#94A3B8" }}
      >
        {label}
      </div>
      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="w-8 h-8 rounded-lg font-mono font-bold text-sm transition-all"
            style={{
              background: value === n ? "#F97316" : "#F1F5F9",
              color: value === n ? "#fff" : "#64748B",
              border: `1.5px solid ${value === n ? "#F97316" : "#E2E8F0"}`,
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Driver area ────────────────────────────────────────────────────────────────

function DriverArea({
  driverSide,
  entryPos,
  exitPos,
}: {
  driverSide: BusSide
  entryPos: DoorPos
  exitPos: DoorPos
}) {
  const frontEntry = entryPos.startsWith("front")
  const frontExit = exitPos.startsWith("front")
  const entrySide = doorSideOf(entryPos)
  const exitSide = doorSideOf(exitPos)

  const renderSide = (side: BusSide) => {
    if (side === driverSide) {
      // Steering wheel + driver label
      return (
        <div className="flex items-center gap-2 flex-1">
          <div
            style={{
              width: 34,
              height: 34,
              border: "3px solid #CBD5E1",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                border: "2.5px solid #CBD5E1",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "60%",
                height: 2.5,
                background: "#CBD5E1",
                transform: "translate(-50%,-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                height: "60%",
                width: 2.5,
                background: "#CBD5E1",
                transform: "translate(-50%,-50%)",
              }}
            />
          </div>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                color: "#94A3B8",
                fontWeight: 700,
              }}
            >
              DRIVER
            </div>
            <div
              className="font-mono"
              style={{ fontSize: 7, color: "#CBD5E1" }}
            >
              {side === "left" ? "Left-hand" : "Right-hand"}
            </div>
          </div>
        </div>
      )
    }
    // Opposite side: show front doors if any
    const hasEntry = frontEntry && entrySide === side
    const hasExit = frontExit && exitSide === side
    return (
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        {hasEntry && <DoorBadge kind="entry" />}
        {hasExit && <DoorBadge kind="exit" />}
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 mb-4"
      style={{
        borderBottom: "2px dashed #E2E8F0",
        paddingTop: 14,
        paddingBottom: 12,
      }}
    >
      {renderSide("left")}
      <div style={{ width: 40, textAlign: "center" }}>
        <div className="font-mono" style={{ fontSize: 7, color: "#CBD5E1" }}>
          ← FRONT
        </div>
      </div>
      {renderSide("right")}
    </div>
  )
}

function DoorBadge({ kind }: { kind: "entry" | "exit" }) {
  const color = DOOR_COLORS[kind]
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 8px",
        borderRadius: 6,
        background: `${color}18`,
        border: `1.5px solid ${color}55`,
      }}
    >
      {/* Door icon */}
      <div
        style={{
          width: 10,
          height: 18,
          border: `2px solid ${color}`,
          borderRadius: 2,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 1,
            top: "50%",
            width: 2,
            height: 2,
            background: color,
            borderRadius: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
      <div>
        <div
          className="font-mono"
          style={{
            fontSize: 7,
            fontWeight: 800,
            color,
            letterSpacing: "0.1em",
          }}
        >
          {kind === "entry" ? "ENTRY" : "EXIT"}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function SeatLayoutDesigner() {
  const [busMode, setBusMode] = useState<BusMode>("sleeper")
  const [rows, setRowsRaw] = useState(8)
  const [leftCols, setLeftColsRaw] = useState(2)
  const [rightCols, setRightColsRaw] = useState(1)
  const [seats, setSeats] = useState<Seat[]>([])
  const [busNumber, setBusNumber] = useState("MH-12-AB-4521")
  const [layoutName, setLayoutName] = useState("Custom Layout")
  const [saved, setSaved] = useState(false)

  // Driver & doors
  const [driverSide, setDriverSide] = useState<BusSide>("right")
  const [entryPos, setEntryPos] = useState<DoorPos>("front-right")
  const [exitPos, setExitPos] = useState<DoorPos>("rear-right")

  const setRows = (n: number) => {
    setSeats((p) => p.filter((s) => s.row < n))
    setRowsRaw(n)
    setSaved(false)
  }
  const setLeftCols = (n: number) => {
    setSeats((p) => p.filter((s) => !(s.side === "left" && s.col >= n)))
    setLeftColsRaw(n)
    setSaved(false)
  }
  const setRightCols = (n: number) => {
    setSeats((p) => p.filter((s) => !(s.side === "right" && s.col >= n)))
    setRightColsRaw(n)
    setSaved(false)
  }

  const switchMode = (mode: BusMode) => {
    setBusMode(mode)
    setSeats([])
    setSaved(false)
  }

  const getSeat = (row: number, col: number, side: BusSide, type: SeatType) =>
    seats.find(
      (s) =>
        s.row === row && s.col === col && s.side === side && s.type === type,
    )

  const addSeat = (row: number, col: number, side: BusSide, type: SeatType) => {
    if (getSeat(row, col, side, type)) return
    const label = makeLabel(type, row, col, side, leftCols, seats)
    const id = `${type[0]}${side[0]}${row}${col}${Date.now()}`
    setSeats((p) => [...p, { id, label, type, row, col, side }])
    setSaved(false)
  }

  const removeSeat = (id: string) => {
    setSeats((p) => p.filter((s) => s.id !== id))
    setSaved(false)
  }

  const clearAll = () => {
    setSeats([])
    setSaved(false)
  }
  const fillAll = () => {
    const next: Seat[] = []
    let lc = 1,
      uc = 1
    for (let r = 0; r < rows; r++) {
      for (const side of ["left", "right"] as BusSide[]) {
        const cols = side === "left" ? leftCols : rightCols
        for (let c = 0; c < cols; c++) {
          if (busMode === "seater") {
            const letter = String.fromCharCode(65 + r)
            const num = side === "left" ? c + 1 : leftCols + c + 1
            next.push({
              id: `s${side[0]}${r}${c}`,
              label: `${letter}${num}`,
              type: "seater",
              row: r,
              col: c,
              side,
            })
          } else {
            next.push({
              id: `l${side[0]}${r}${c}`,
              label: `L${lc++}`,
              type: "lower",
              row: r,
              col: c,
              side,
            })
            next.push({
              id: `u${side[0]}${r}${c}`,
              label: `U${uc++}`,
              type: "upper",
              row: r,
              col: c,
              side,
            })
          }
        }
      }
    }
    setSeats(next)
    setSaved(false)
  }

  // Row height used for door tabs
  const rowH = busMode === "seater" ? 58 : 86

  const renderSlot = (row: number, col: number, side: BusSide) => {
    const key = `${row}-${col}-${side}`
    if (busMode === "seater") {
      const seat = getSeat(row, col, side, "seater")
      return seat ? (
        <SeaterCell
          key={key}
          seat={seat}
          onRemove={() => removeSeat(seat.id)}
        />
      ) : (
        <AddSlot
          key={key}
          type="seater"
          onClick={() => addSeat(row, col, side, "seater")}
        />
      )
    }
    const lower = getSeat(row, col, side, "lower")
    const upper = getSeat(row, col, side, "upper")
    return (
      <div key={key} className="flex gap-1">
        {lower ? (
          <SleeperCell seat={lower} onRemove={() => removeSeat(lower.id)} />
        ) : (
          <AddSlot
            type="lower"
            onClick={() => addSeat(row, col, side, "lower")}
          />
        )}
        {upper ? (
          <SleeperCell seat={upper} onRemove={() => removeSeat(upper.id)} />
        ) : (
          <AddSlot
            type="upper"
            onClick={() => addSeat(row, col, side, "upper")}
          />
        )}
      </div>
    )
  }

  const total = seats.length
  const lowerCount = seats.filter((s) => s.type === "lower").length
  const upperCount = seats.filter((s) => s.type === "upper").length
  const seaterCount = seats.filter((s) => s.type === "seater").length
  const slotW = busMode === "seater" ? 46 : 96
  const leftW = leftCols * slotW + (leftCols - 1) * 6
  const rightW = rightCols * slotW + (rightCols - 1) * 6

  return (
    <div
      className="p-6 fade-in"
      style={{ background: "#F8FAFC", minHeight: "100%" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: "#94A3B8" }}
          >
            Seat Designer
          </div>
          <h2
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            Build Bus Layout
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all"
            style={{
              background: "#F1F5F9",
              color: "#64748B",
              border: "1px solid #E2E8F0",
            }}
          >
            Clear All
          </button>
          <button
            onClick={fillAll}
            className="px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all"
            style={{
              background: "#F1F5F9",
              color: "#475569",
              border: "1px solid #E2E8F0",
            }}
          >
            Fill All
          </button>
          <button
            onClick={() => {
              saveLayout({
                busMode,
                rows,
                leftCols,
                rightCols,
                driverSide,
                entryPos,
                exitPos,
                seats,
              })
              setSaved(true)
            }}
            className="px-5 py-2 rounded-xl font-jakarta font-semibold text-sm transition-all"
            style={{
              background: saved ? "#16A34A" : "#F97316",
              color: "#fff",
              boxShadow: saved ? "0 2px 8px #16A34A44" : "0 2px 8px #F9731644",
            }}
          >
            {saved ? "✓ Saved" : "Save Layout"}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Left panel ── */}
        <div className="space-y-4 flex-shrink-0" style={{ width: 264 }}>
          {/* Bus type */}
          <div className="card rounded-xl p-4">
            <div
              className="font-mono text-xs uppercase tracking-widest mb-3"
              style={{ color: "#94A3B8" }}
            >
              Bus Type
            </div>
            <div className="flex gap-2">
              {(["seater", "sleeper"] as BusMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="flex-1 py-2 rounded-lg text-sm font-jakarta font-semibold capitalize transition-all"
                  style={{
                    background: busMode === m ? "#F97316" : "#F8FAFC",
                    color: busMode === m ? "#fff" : "#64748B",
                    border: `1.5px solid ${
                      busMode === m ? "#F97316" : "#E2E8F0"
                    }`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Grid size */}
          <div className="card rounded-xl p-4 space-y-4">
            <div
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              Grid Size
            </div>
            <Stepper
              label="Rows"
              value={rows}
              min={1}
              max={20}
              onChange={setRows}
            />
            <ColPicker
              label="Left columns"
              value={leftCols}
              onChange={setLeftCols}
            />
            <ColPicker
              label="Right columns"
              value={rightCols}
              onChange={setRightCols}
            />
          </div>

          {/* Driver & Doors */}
          <div className="card rounded-xl p-4 space-y-4">
            <div
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              Driver &amp; Doors
            </div>

            {/* Driver side */}
            <div>
              <div
                className="font-mono text-xs uppercase tracking-wider mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Driver side
              </div>
              <div className="flex gap-2">
                {(["left", "right"] as BusSide[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDriverSide(s)}
                    className="flex-1 py-2 rounded-lg text-sm font-mono font-semibold capitalize transition-all"
                    style={{
                      background: driverSide === s ? "#F97316" : "#F8FAFC",
                      color: driverSide === s ? "#fff" : "#64748B",
                      border: `1.5px solid ${
                        driverSide === s ? "#F97316" : "#E2E8F0"
                      }`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "#F1F5F9" }} />

            {/* Entry door */}
            <DoorPicker
              label="Entry Door"
              value={entryPos}
              color={DOOR_COLORS.entry}
              onChange={setEntryPos}
            />

            <div style={{ height: 1, background: "#F1F5F9" }} />

            {/* Exit door */}
            <DoorPicker
              label="Exit Door"
              value={exitPos}
              color={DOOR_COLORS.exit}
              onChange={setExitPos}
            />
          </div>

          {/* Stats */}
          <div className="card rounded-xl p-4">
            <div
              className="font-mono text-xs uppercase tracking-widest mb-3"
              style={{ color: "#94A3B8" }}
            >
              Stats
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span
                  className="font-mono text-xs"
                  style={{ color: "#64748B" }}
                >
                  Total seats
                </span>
                <span
                  className="font-jakarta font-bold text-sm"
                  style={{ color: "#F97316" }}
                >
                  {total}
                </span>
              </div>
              {busMode === "sleeper" ? (
                <>
                  <div className="flex justify-between">
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#64748B" }}
                    >
                      Lower berths
                    </span>
                    <span
                      className="font-jakarta font-bold text-sm"
                      style={{ color: "#16A34A" }}
                    >
                      {lowerCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#64748B" }}
                    >
                      Upper berths
                    </span>
                    <span
                      className="font-jakarta font-bold text-sm"
                      style={{ color: "#2563EB" }}
                    >
                      {upperCount}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#64748B" }}
                  >
                    Seater seats
                  </span>
                  <span
                    className="font-jakarta font-bold text-sm"
                    style={{ color: "#F97316" }}
                  >
                    {seaterCount}
                  </span>
                </div>
              )}
              <div
                style={{ height: 1, background: "#F1F5F9", margin: "4px 0" }}
              />
              <div className="flex justify-between">
                <span
                  className="font-mono text-xs"
                  style={{ color: "#94A3B8" }}
                >
                  Left side
                </span>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "#475569" }}
                >
                  {seats.filter((s) => s.side === "left").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className="font-mono text-xs"
                  style={{ color: "#94A3B8" }}
                >
                  Right side
                </span>
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "#475569" }}
                >
                  {seats.filter((s) => s.side === "right").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Bus visual ── */}
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              {busNumber}
            </span>
            <span
              className="px-2 py-0.5 rounded-full font-mono text-xs"
              style={{
                background: "#FFF7ED",
                color: "#F97316",
                border: "1px solid #FED7AA",
              }}
            >
              {layoutName}
            </span>
            <span className="font-mono text-xs" style={{ color: "#CBD5E1" }}>
              {total === 0 ? "Empty — click + to add seats" : `${total} seats`}
            </span>
          </div>

          {/* Legend row */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: 12,
                  height: 20,
                  background: DOOR_COLORS.entry,
                  borderRadius: 3,
                }}
              />
              <span className="font-mono text-xs" style={{ color: "#64748B" }}>
                Entry door
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: 12,
                  height: 20,
                  background: DOOR_COLORS.exit,
                  borderRadius: 3,
                }}
              />
              <span className="font-mono text-xs" style={{ color: "#64748B" }}>
                Exit door
              </span>
            </div>
            {busMode === "sleeper" && (
              <>
                <div className="flex items-center gap-1.5">
                  <div
                    style={{
                      width: 20,
                      height: 12,
                      background: C.lower.bg,
                      border: `1px solid ${C.lower.border}`,
                      borderRadius: 3,
                    }}
                  />
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#64748B" }}
                  >
                    Lower
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    style={{
                      width: 20,
                      height: 12,
                      background: C.upper.bg,
                      border: `1px solid ${C.upper.border}`,
                      borderRadius: 3,
                    }}
                  />
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#64748B" }}
                  >
                    Upper
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Bus shell */}
          <div
            className="relative mx-auto"
            style={{
              background: "#F8FAFC",
              border: "2.5px solid #CBD5E1",
              borderRadius: 28,
              padding: "0 18px 20px",
              width: "fit-content",
              boxShadow: "0 4px 24px #94A3B822, inset 0 1px 0 #fff",
            }}
          >
            {/* Side stripes */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 60,
                bottom: 20,
                width: 4,
                background: "#F97316",
                borderRadius: "0 0 0 26px",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 60,
                bottom: 20,
                width: 4,
                background: "#F97316",
                borderRadius: "0 0 26px 0",
              }}
            />

            {/* Driver row */}
            <DriverArea
              driverSide={driverSide}
              entryPos={entryPos}
              exitPos={exitPos}
            />

            {/* Column headers */}
            <div className="flex items-center mb-2" style={{ paddingLeft: 26 }}>
              {/* left door tab spacer */}
              <div style={{ width: 14 + 4 }} />
              <div
                className="font-mono text-center"
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#64748B",
                  width: leftW,
                }}
              >
                ← LEFT SIDE
              </div>
              <div style={{ width: 44 }} />
              <div
                className="font-mono text-center"
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#64748B",
                  width: rightW,
                }}
              >
                RIGHT SIDE →
              </div>
              <div style={{ width: 14 + 4 }} />
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {Array.from({ length: rows }, (_, r) => {
                const rowLabel =
                  busMode === "seater"
                    ? String.fromCharCode(65 + r)
                    : String(r + 1)

                const entryRow = doorRowIndex(entryPos, rows)
                const exitRow = doorRowIndex(exitPos, rows)
                const entrySide = doorSideOf(entryPos)
                const exitSide = doorSideOf(exitPos)

                const leftEntryTab = r === entryRow && entrySide === "left"
                const leftExitTab = r === exitRow && exitSide === "left"
                const rightEntryTab = r === entryRow && entrySide === "right"
                const rightExitTab = r === exitRow && exitSide === "right"

                return (
                  <div key={r} className="flex items-center gap-1">
                    {/* Left door column */}
                    <div
                      className="flex gap-0.5 items-center flex-shrink-0"
                      style={{ width: 14 + 4 }}
                    >
                      {leftEntryTab ? (
                        <DoorTab kind="entry" rowHeight={rowH} />
                      ) : leftExitTab ? (
                        <DoorTab kind="exit" rowHeight={rowH} />
                      ) : (
                        <EmptyDoorSlot rowHeight={rowH} />
                      )}
                    </div>

                    {/* Row label */}
                    <div
                      className="font-mono flex-shrink-0 text-right"
                      style={{
                        width: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94A3B8",
                      }}
                    >
                      {rowLabel}
                    </div>

                    {/* Left seats */}
                    <div className="flex gap-1.5 ml-1">
                      {Array.from({ length: leftCols }, (_, c) =>
                        renderSlot(r, c, "left"),
                      )}
                    </div>

                    {/* Aisle */}
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 44, alignSelf: "stretch" }}
                    >
                      <div
                        style={{
                          width: 1,
                          height: "100%",
                          background: "#E2E8F030",
                        }}
                      />
                    </div>

                    {/* Right seats */}
                    <div className="flex gap-1.5">
                      {Array.from({ length: rightCols }, (_, c) =>
                        renderSlot(r, c, "right"),
                      )}
                    </div>

                    {/* Right door column */}
                    <div
                      className="flex gap-0.5 items-center flex-shrink-0 ml-1"
                      style={{ width: 14 + 4 }}
                    >
                      {rightEntryTab ? (
                        <DoorTab kind="entry" rowHeight={rowH} />
                      ) : rightExitTab ? (
                        <DoorTab kind="exit" rowHeight={rowH} />
                      ) : (
                        <EmptyDoorSlot rowHeight={rowH} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add row */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setRows(Math.min(20, rows + 1))}
                disabled={rows >= 20}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all"
                style={{
                  background: rows >= 20 ? "#F1F5F9" : "#FFF7ED",
                  border: `1.5px dashed ${rows >= 20 ? "#E2E8F0" : "#FED7AA"}`,
                  color: rows >= 20 ? "#CBD5E1" : "#F97316",
                }}
              >
                + Add Row
              </button>
            </div>

            {/* Rear */}
            <div className="text-center mt-3">
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: "#CBD5E1",
                  letterSpacing: "0.15em",
                }}
              >
                REAR →
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="font-mono text-xs" style={{ color: "#CBD5E1" }}>
              ←———————— CENTRE AISLE ————————→
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
