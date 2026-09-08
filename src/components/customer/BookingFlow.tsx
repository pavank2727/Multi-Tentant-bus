import { useState } from "react"
import { busSearchResults } from "../../data/mockData"
import YathriLogo from "../YathriLogo"

type Step = "passenger" | "payment" | "confirmation"
interface BookingFlowProps {
  bus: typeof busSearchResults[0]
  seats: string[]
  fareMap?: Record<string, number>
  onDone: () => void
  onBack: () => void
}

const PNR = "ERR" + Math.random().toString(36).slice(2, 8).toUpperCase()

function StepBar({ current }: { current: number }) {
  const steps = ["Select Seats", "Passenger Details", "Payment", "Confirmation"]
  return (
    <div
      className="bg-white px-6 py-2.5"
      style={{ borderBottom: "1px solid #F1F5F9" }}
    >
      <div className="max-w-2xl mx-auto flex items-center">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                style={{
                  background:
                    i < current
                      ? "#16A34A"
                      : i === current
                        ? "#F97316"
                        : "#F1F5F9",
                  color: i <= current ? "#fff" : "#94A3B8",
                }}
              >
                {i < current ? "✓" : i + 1}
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    i === current
                      ? "#F97316"
                      : i < current
                        ? "#16A34A"
                        : "#94A3B8",
                }}
              >
                {s}
              </span>
            </div>
            {i < 3 && (
              <div
                className="flex-1 h-px mx-2"
                style={{ background: i < current ? "#BBF7D0" : "#E2E8F0" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PassengerStep({
  seats,
  bus,
  onNext,
}: {
  seats: string[]
  bus: typeof busSearchResults[0]
  onNext: (data: { name: string age: string gender: string }[]) => void
}) {
  const [pax, setPax] = useState(
    seats.map(() => ({ name: "", age: "", gender: "Male" })),
  )
  const upd = (i: number, f: string, v: string) =>
    setPax((p) => p.map((x, j) => (j === i ? { ...x, [f]: v } : x)))

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div
        className="font-jakarta font-black text-xl"
        style={{ color: "#0F172A" }}
      >
        Passenger Details
      </div>
      {seats.map((seat, i) => (
        <div key={seat} className="card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-sm"
              style={{ background: "#FFF7ED", color: "#F97316" }}
            >
              {i + 1}
            </div>
            <span
              className="font-jakarta font-semibold"
              style={{ color: "#0F172A" }}
            >
              Passenger {i + 1}
            </span>
            <span className="badge badge-blue">Seat {seat}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Full Name
              </label>
              <input
                className="cu-input"
                placeholder="Priya Sharma"
                value={pax[i].name}
                onChange={(e) => upd(i, "name", e.target.value)}
              />
            </div>
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Age
              </label>
              <input
                className="cu-input"
                type="number"
                min="1"
                max="100"
                placeholder="28"
                value={pax[i].age}
                onChange={(e) => upd(i, "age", e.target.value)}
              />
            </div>
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Gender
              </label>
              <select
                className="cu-input"
                value={pax[i].gender}
                onChange={(e) => upd(i, "gender", e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className="card rounded-xl p-5">
        <div
          className="font-jakarta font-semibold mb-3"
          style={{ color: "#0F172A" }}
        >
          Contact for Updates
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="font-mono text-xs uppercase tracking-wider block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              Mobile Number
            </label>
            <input className="cu-input" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label
              className="font-mono text-xs uppercase tracking-wider block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              Email (optional)
            </label>
            <input
              className="cu-input"
              placeholder="priya@email.com"
              type="email"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => onNext(pax)}
        disabled={pax.some((p) => !p.name || !p.age)}
        className="btn-primary w-full py-3 text-base disabled:opacity-50"
      >
        Proceed to Payment →
      </button>
    </div>
  )
}

function PaymentStep({ total, onPay }: { total: number onPay: () => void }) {
  const [method, setMethod] = useState("upi")
  const [processing, setProcessing] = useState(false)

  const pay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      onPay()
    }, 2000)
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <div
        className="font-jakarta font-black text-xl"
        style={{ color: "#0F172A" }}
      >
        Payment
      </div>

      <div className="card rounded-xl p-5">
        <div
          className="font-mono text-xs uppercase tracking-wider mb-1"
          style={{ color: "#94A3B8" }}
        >
          Amount Due
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="font-jakarta font-black text-4xl"
            style={{ color: "#F97316" }}
          >
            ₹{total.toLocaleString()}
          </span>
          <span className="text-sm" style={{ color: "#94A3B8" }}>
            incl. GST
          </span>
        </div>
      </div>

      <div className="card rounded-xl p-5">
        <div
          className="font-jakarta font-semibold mb-4"
          style={{ color: "#0F172A" }}
        >
          Payment Method
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: "upi",
              label: "UPI",
              icon: "📱",
              sub: "Google Pay, PhonePe, Paytm",
            },
            {
              id: "card",
              label: "Credit/Debit Card",
              icon: "💳",
              sub: "Visa, Mastercard, RuPay",
            },
            {
              id: "netbanking",
              label: "Net Banking",
              icon: "🏦",
              sub: "All major banks",
            },
            {
              id: "wallet",
              label: "Wallet",
              icon: "👛",
              sub: "Paytm, Amazon Pay",
            },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className="flex items-start gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                border: `1.5px solid ${
                  method === m.id ? "#F97316" : "#E2E8F0"
                }`,
                background: method === m.id ? "#FFF7ED" : "#fff",
              }}
            >
              <span className="text-xl">{m.icon}</span>
              <div>
                <div
                  className="font-medium text-sm"
                  style={{ color: method === m.id ? "#F97316" : "#0F172A" }}
                >
                  {m.label}
                </div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>
                  {m.sub}
                </div>
              </div>
            </button>
          ))}
        </div>

        {method === "upi" && (
          <div className="mt-4">
            <label
              className="font-mono text-xs uppercase tracking-wider block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              UPI ID
            </label>
            <input className="cu-input" placeholder="yourname@upi" />
          </div>
        )}
        {method === "card" && (
          <div className="mt-4 space-y-3">
            <input className="cu-input" placeholder="Card Number" />
            <div className="grid grid-cols-2 gap-3">
              <input className="cu-input" placeholder="MM / YY" />
              <input className="cu-input" placeholder="CVV" type="password" />
            </div>
            <input className="cu-input" placeholder="Cardholder Name" />
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-2 text-xs"
        style={{ color: "#94A3B8" }}
      >
        <span>🔒</span>
        <span>Secured by Razorpay · End-to-end encrypted</span>
      </div>

      <button
        onClick={pay}
        disabled={processing}
        className="btn-primary w-full py-4 text-base disabled:opacity-70"
      >
        {processing ? "Processing…" : `Pay ₹${total.toLocaleString()} →`}
      </button>
    </div>
  )
}

function ConfirmationStep({
  bus,
  seats,
  onDone,
}: {
  bus: typeof busSearchResults[0]
  seats: string[]
  onDone: () => void
}) {
  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "#F0FDF4" }}
        >
          <span className="text-3xl">✅</span>
        </div>
        <div
          className="font-jakarta font-black text-2xl mb-1"
          style={{ color: "#0F172A" }}
        >
          Booking Confirmed!
        </div>
        <div className="text-sm" style={{ color: "#64748B" }}>
          Your e-ticket has been sent via SMS and email
        </div>
      </div>

      {/* Ticket */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ border: "2px solid #E2E8F0" }}
      >
        {/* Red header */}
        <div className="px-5 py-4" style={{ background: "#F97316" }}>
          <div className="flex items-center justify-between">
            <div>
              <YathriLogo size={28} textColor="#fff" />
              <div className="font-mono text-xs text-white opacity-70">
                {bus.operator} · {bus.busType}
              </div>
            </div>
            <div className="font-mono text-sm text-white opacity-80">
              {bus.busNumber}
            </div>
          </div>
        </div>

        {/* Ticket body */}
        <div className="bg-white p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div
                className="font-jakarta font-black text-3xl"
                style={{ color: "#0F172A" }}
              >
                {bus.from}
              </div>
              <div
                className="font-mono text-lg font-medium"
                style={{ color: "#F97316" }}
              >
                {bus.departure}
              </div>
            </div>
            <div className="text-center">
              <div
                className="font-mono text-xs mb-1"
                style={{ color: "#94A3B8" }}
              >
                {bus.duration}
              </div>
              <div className="text-xl" style={{ color: "#F97316" }}>
                →
              </div>
            </div>
            <div className="text-right">
              <div
                className="font-jakarta font-black text-3xl"
                style={{ color: "#0F172A" }}
              >
                {bus.to}
              </div>
              <div
                className="font-mono text-lg font-medium"
                style={{ color: "#64748B" }}
              >
                {bus.arrival}
              </div>
            </div>
          </div>

          <div
            className="h-px my-4"
            style={{
              background:
                "repeating-linear-gradient(90deg, #E2E8F0 0, #E2E8F0 6px, transparent 6px, transparent 12px)",
            }}
          />

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "PNR", value: PNR },
              { label: "Seats", value: seats.join(", ") },
              { label: "Date", value: "10 Sep 2026" },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                  {item.label}
                </div>
                <div
                  className="font-mono font-bold text-sm"
                  style={{ color: "#0F172A" }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* QR */}
          <div
            className="flex items-center justify-center py-4 rounded-xl"
            style={{ background: "#F8FAFC", border: "1px dashed #E2E8F0" }}
          >
            <div className="text-center">
              <div className="grid grid-cols-5 gap-0.5 w-20 mx-auto mb-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{
                      background:
                        (i * 7 + i) % 3 === 0 ? "#0F172A" : "transparent",
                    }}
                  />
                ))}
              </div>
              <div className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                Scan at boarding
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          className="flex-1 py-3 rounded-xl font-medium text-sm"
          style={{
            background: "#EFF6FF",
            color: "#2563EB",
            border: "1px solid #BFDBFE",
          }}
        >
          📥 Download PDF
        </button>
        <button
          className="flex-1 py-3 rounded-xl font-medium text-sm"
          style={{
            background: "#F0FDF4",
            color: "#16A34A",
            border: "1px solid #BBF7D0",
          }}
        >
          📤 WhatsApp
        </button>
      </div>
      <button onClick={onDone} className="btn-primary w-full py-3 text-sm">
        Back to Home
      </button>
    </div>
  )
}

export default function BookingFlow({
  bus,
  seats,
  fareMap = {},
  onDone,
  onBack,
}: BookingFlowProps) {
  const [step, setStep] = useState<Step>("passenger")
  const subtotal = seats.reduce((a, id) => a + (fareMap[id] ?? bus.fare), 0)
  const total = Math.round(subtotal * 1.05)
  const idx = { passenger: 1, payment: 2, confirmation: 3 }[step]

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100%" }}>
      <header
        className="bg-white px-6 py-3.5 flex items-center gap-4 sticky top-0 z-10"
        style={{ borderBottom: "1px solid #E2E8F0" }}
      >
        {step !== "confirmation" && (
          <button
            onClick={onBack}
            className="text-sm font-medium"
            style={{ color: "#64748B" }}
          >
            ← Back
          </button>
        )}
        <div className="w-px h-4" style={{ background: "#E2E8F0" }} />
        <div className="flex items-center gap-2">
          <YathriLogo size={28} textColor="#0F172A" />
          <span className="font-jakarta font-bold" style={{ color: "#0F172A" }}>
            {bus.from} → {bus.to}
          </span>
          <span className="font-mono text-sm" style={{ color: "#94A3B8" }}>
            · {seats.length} seat{seats.length > 1 ? "s" : ""}
          </span>
        </div>
      </header>
      <StepBar current={idx} />
      {step === "passenger" && (
        <PassengerStep
          seats={seats}
          bus={bus}
          onNext={() => setStep("payment")}
        />
      )}
      {step === "payment" && (
        <PaymentStep total={total} onPay={() => setStep("confirmation")} />
      )}
      {step === "confirmation" && (
        <ConfirmationStep bus={bus} seats={seats} onDone={onDone} />
      )}
    </div>
  )
}
