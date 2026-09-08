import { useState, useEffect } from "react"
import YathriLogo from "../YathriLogo"

interface LoginModalProps {
  onClose: () => void
  onLogin: () => void
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)
  const [canResend, setCan] = useState(false)

  useEffect(() => {
    if (step !== "otp") return
    setTimer(30)
    setCan(false)
    const t = setInterval(
      () =>
        setTimer((v) => {
          if (v <= 1) {
            setCan(true)
            clearInterval(t)
            return 0
          }
          return v - 1
        }),
      1000,
    )
    return () => clearInterval(t)
  }, [step])

  const handleOtp = (i: number, val: string) => {
    if (val.length > 1) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
    if (next.every((d) => d)) setTimeout(onLogin, 400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-start justify-between"
          style={{ background: "#F97316" }}
        >
          <div>
            <div className="mb-1">
              <YathriLogo size={30} textColor="#fff" />
            </div>
            <div className="text-white text-sm" style={{ opacity: 0.8 }}>
              {step === "phone"
                ? "Enter your mobile number"
                : "Verify with OTP"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {step === "phone" ? (
            <>
              <div className="mb-5">
                <label
                  className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                  style={{ color: "#94A3B8" }}
                >
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div
                    className="w-16 flex items-center justify-center rounded-xl font-mono font-medium text-sm"
                    style={{
                      background: "#F8FAFC",
                      border: "1.5px solid #E2E8F0",
                      color: "#0F172A",
                    }}
                  >
                    +91
                  </div>
                  <input
                    className="cu-input flex-1"
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => phone.length === 10 && setStep("otp")}
                disabled={phone.length !== 10}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                Send OTP →
              </button>
              <p
                className="text-center text-xs mt-3"
                style={{ color: "#94A3B8" }}
              >
                By continuing, you agree to our Terms of Service
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-5">
                <div
                  className="font-jakarta font-semibold mb-1"
                  style={{ color: "#0F172A" }}
                >
                  Enter OTP
                </div>
                <div className="text-sm" style={{ color: "#94A3B8" }}>
                  Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
                </div>
              </div>
              <div className="flex gap-2 justify-center mb-5">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className="otp-input"
                    type="number"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtp(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !d && i > 0)
                        document.getElementById(`otp-${i - 1}`)?.focus()
                    }}
                  />
                ))}
              </div>
              <div className="text-center mb-4">
                {canResend ? (
                  <button
                    onClick={() => setStep("otp")}
                    className="font-medium text-sm"
                    style={{ color: "#F97316" }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span
                    className="font-mono text-sm"
                    style={{ color: "#94A3B8" }}
                  >
                    Resend in {timer}s
                  </span>
                )}
              </div>
              <button
                onClick={() => otp.every((d) => d) && onLogin()}
                disabled={!otp.every((d) => d)}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                Verify & Login →
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-center text-sm mt-3"
                style={{ color: "#94A3B8" }}
              >
                ← Change number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
