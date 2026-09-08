import { useState, useEffect } from "react";
import YathriLogo from "../YathriLogo";

interface OperatorLoginProps {
  onLogin: (operator: OperatorProfile) => void;
  onBack: () => void;
}

export interface OperatorProfile {
  companyName: string;
  ownerName: string;
  phone: string;
  city: string;
  fleetSize: string;
  id: string;
  initials: string;
}

/* ── Mock registered operators (simulates a DB) ── */
const REGISTERED: OperatorProfile[] = [
  { companyName: "Rajdhani Travels",    ownerName: "Arjun Sharma",   phone: "9876543210", city: "Mumbai", fleetSize: "12 buses", id: "OP-2024-0842", initials: "AS" },
  { companyName: "Deccan Express",      ownerName: "Priya Nair",     phone: "9823456789", city: "Pune",   fleetSize: "7 buses",  id: "OP-2024-1103", initials: "PN" },
  { companyName: "Konkan King Travels", ownerName: "Suresh Patil",   phone: "9012345678", city: "Nashik", fleetSize: "3 buses",  id: "OP-2024-0391", initials: "SP" },
  { companyName: "Vidarbha Roadways",   ownerName: "Meena Kulkarni", phone: "9456123780", city: "Nagpur", fleetSize: "18 buses", id: "OP-2024-2201", initials: "MK" },
];

const CITIES        = ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad", "Kolhapur", "Thane", "Solapur", "Latur", "Jalgaon"];
const FLEET_OPTIONS = ["1 bus", "2 buses", "3 buses", "4–6 buses", "7–12 buses", "13–20 buses", "21+ buses"];

/* ─────────── OTP box ─────────── */
function OtpBox({ prefix, onComplete }: { prefix: string; onComplete: () => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer]   = useState(30);
  const [canResend, setCan] = useState(false);

  useEffect(() => {
    setCan(false); setTimer(30);
    const t = setInterval(() => setTimer(v => { if (v <= 1) { setCan(true); clearInterval(t); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  const resend = () => {
    setDigits(["", "", "", "", "", ""]); setCan(false); setTimer(30);
    const t = setInterval(() => setTimer(v => { if (v <= 1) { setCan(true); clearInterval(t); return 0; } return v - 1; }), 1000);
    document.getElementById(`${prefix}-0`)?.focus();
  };

  const handle = (i: number, val: string) => {
    if (val.length > 1) return;
    const next = [...digits]; next[i] = val; setDigits(next);
    if (val && i < 5) document.getElementById(`${prefix}-${i + 1}`)?.focus();
    if (next.every(d => d)) setTimeout(onComplete, 350);
  };

  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) document.getElementById(`${prefix}-${i - 1}`)?.focus();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {digits.map((d, i) => (
          <input key={i} id={`${prefix}-${i}`} className="otp-input" type="number"
            maxLength={1} value={d}
            onChange={e => handle(i, e.target.value)}
            onKeyDown={e => onKey(i, e)} />
        ))}
      </div>
      <div className="text-center">
        {canResend
          ? <button onClick={resend} className="font-medium text-sm" style={{ color: "#F97316" }}>Resend OTP</button>
          : <span className="font-mono text-sm" style={{ color: "#94A3B8" }}>Resend in {timer}s</span>}
      </div>
    </div>
  );
}

/* ─────────── Shared left brand panel ─────────── */
function BrandPanel({ page }: { page: "login" | "register" }) {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[400px] shrink-0 p-10"
      style={{ background: "#fff", borderRight: "1px solid #E2E8F0" }}>
      <YathriLogo size={36} textColor="#0F172A" showTagline tagline="OPERATOR PORTAL" />

      <div>
        <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>
          {page === "login" ? "Welcome back" : "Join the movement"}
        </div>
        <h2 className="font-jakarta font-black mb-5" style={{ fontSize: 30, color: "#0F172A", lineHeight: 1.2 }}>
          {page === "login"
            ? <>Your fleet.<br />Your data.<br />Your earnings.</>
            : <>Built for every<br />operator in India.<br />Start free today.</>}
        </h2>
        <div className="space-y-3">
          {[
            { icon: "₹0",  label: "Commission on every ticket — forever",   green: true },
            { icon: "✓",   label: "Custom seat layouts for your exact bus",  green: false },
            { icon: "✓",   label: "Route, fare & schedule full control",     green: false },
            { icon: "✓",   label: "Revenue dashboard & live analytics",      green: false },
            { icon: "✓",   label: "Free for fleets under 3 buses",           green: false },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 font-mono font-bold text-xs"
                style={{ background: f.green ? "#F0FDF4" : "#FFF7ED", color: f.green ? "#138808" : "#F97316" }}>
                {f.icon}
              </div>
              <span className="text-sm" style={{ color: "#475569" }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 rounded-xl" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
        <div className="font-mono text-xs uppercase tracking-wider mb-1" style={{ color: "#EA580C" }}>No credit card needed</div>
        <div className="text-sm" style={{ color: "#64748B", lineHeight: 1.6 }}>
          Sign up in under 2 minutes. Your portal is ready the moment you verify your number.
        </div>
      </div>
    </div>
  );
}

/* ══════════════ LOGIN PAGE ══════════════ */
function LoginPage({ onLogin, onGoRegister, onBack }: {
  onLogin: (op: OperatorProfile) => void;
  onGoRegister: () => void;
  onBack: () => void;
}) {
  const [phone, setPhone]   = useState("");
  const [step, setStep]     = useState<"phone" | "otp">("phone");
  const [error, setError]   = useState("");

  const handleSend = () => {
    setError("");
    const found = REGISTERED.find(o => o.phone === phone);
    if (!found) { setError("No account found with this number. Please register first."); return; }
    setStep("otp");
  };

  const handleVerified = () => {
    const found = REGISTERED.find(o => o.phone === phone)!;
    onLogin(found);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      <BrandPanel page="login" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="lg:hidden mb-8">
            <YathriLogo size={34} textColor="#0F172A" showTagline tagline="OPERATOR PORTAL" />
          </div>

          {step === "phone" ? (
            <>
              <div className="mb-8">
                <h1 className="font-jakarta font-black mb-1" style={{ fontSize: 26, color: "#0F172A" }}>Operator Login</h1>
                <p className="text-sm" style={{ color: "#64748B" }}>Enter your registered mobile number to continue.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Registered Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="w-16 flex items-center justify-center rounded-xl font-mono font-medium text-sm"
                      style={{ background: "#fff", border: "1.5px solid #E2E8F0", color: "#0F172A" }}>+91</div>
                    <input className="op-input flex-1" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                      type="tel" maxLength={10} placeholder="98765 43210"
                      value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }} />
                  </div>
                </div>

                {error && (
                  <div className="text-sm px-3 py-2.5 rounded-xl flex items-start gap-2"
                    style={{ background: "#FFF7ED", color: "#EA580C", border: "1px solid #FED7AA" }}>
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* Demo hint */}
                <div className="px-3 py-2.5 rounded-xl" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                  <div className="font-mono text-xs mb-1.5" style={{ color: "#138808" }}>DEMO NUMBERS</div>
                  {REGISTERED.map(o => (
                    <button key={o.id} onClick={() => setPhone(o.phone)}
                      className="block text-xs font-mono hover:underline text-left"
                      style={{ color: "#16A34A" }}>
                      {o.phone} — {o.companyName}
                    </button>
                  ))}
                </div>

                <button onClick={handleSend} disabled={phone.length !== 10}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-40" style={{ borderRadius: 12 }}>
                  Send OTP →
                </button>

                <div className="text-center text-sm" style={{ color: "#64748B" }}>
                  Don't have an account?{" "}
                  <button onClick={onGoRegister} className="font-semibold" style={{ color: "#F97316" }}>Register here</button>
                </div>

                <button onClick={onBack} className="w-full text-center text-sm" style={{ color: "#94A3B8" }}>← Back to home</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setStep("phone")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "#94A3B8" }}>← Back</button>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "#FFF7ED" }}>
                <span style={{ fontSize: 22 }}>📱</span>
              </div>
              <h1 className="font-jakarta font-black mb-1" style={{ fontSize: 24, color: "#0F172A" }}>Verify OTP</h1>
              <p className="text-sm mb-8" style={{ color: "#64748B" }}>
                Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
              </p>
              <OtpBox prefix="login" onComplete={handleVerified} />
              <p className="text-center text-xs mt-5" style={{ color: "#94A3B8" }}>Enter any 6-digit code for the demo</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ REGISTER PAGE ══════════════ */
function RegisterPage({ onLogin, onGoLogin, onBack }: {
  onLogin: (op: OperatorProfile) => void;
  onGoLogin: () => void;
  onBack: () => void;
}) {
  const [step, setStep]         = useState<"form" | "otp">("form");
  const [companyName, setCompany] = useState("");
  const [ownerName, setOwner]   = useState("");
  const [phone, setPhone]       = useState("");
  const [city, setCity]         = useState("");
  const [fleetSize, setFleet]   = useState("");
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState("");

  const valid = companyName.trim().length >= 3
    && ownerName.trim().length >= 2
    && phone.length === 10
    && city
    && fleetSize;

  const handleSend = () => {
    setError("");
    if (REGISTERED.find(o => o.phone === phone)) {
      setError("This number is already registered. Please login instead.");
      return;
    }
    setStep("otp");
  };

  const handleVerified = () => {
    const initials = ownerName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const id = "OP-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    onLogin({ companyName: companyName.trim(), ownerName: ownerName.trim(), phone, city, fleetSize, id, initials });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      <BrandPanel page="register" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          <div className="lg:hidden mb-8">
            <YathriLogo size={34} textColor="#0F172A" showTagline tagline="OPERATOR PORTAL" />
          </div>

          {step === "form" ? (
            <>
              <div className="mb-7">
                <h1 className="font-jakarta font-black mb-1" style={{ fontSize: 26, color: "#0F172A" }}>Create your account</h1>
                <p className="text-sm" style={{ color: "#64748B" }}>Set up your operator portal in 2 minutes.</p>
              </div>

              <div className="space-y-4">
                {/* Company name */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Company / Travel Name *</label>
                  <input className="op-input w-full" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                    placeholder="e.g. Rajdhani Travels"
                    value={companyName} onChange={e => setCompany(e.target.value)} />
                </div>

                {/* Owner name */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Owner / Manager Name *</label>
                  <input className="op-input w-full" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                    placeholder="e.g. Arjun Sharma"
                    value={ownerName} onChange={e => setOwner(e.target.value)} />
                </div>

                {/* Phone */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Mobile Number *</label>
                  <div className="flex gap-2">
                    <div className="w-16 flex items-center justify-center rounded-xl font-mono font-medium text-sm"
                      style={{ background: "#fff", border: "1.5px solid #E2E8F0", color: "#0F172A" }}>+91</div>
                    <input className="op-input flex-1" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                      type="tel" maxLength={10} placeholder="98765 43210"
                      value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Email <span style={{ color: "#CBD5E1" }}>(optional)</span></label>
                  <input className="op-input w-full" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                    type="email" placeholder="operator@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                {/* City + Fleet */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>City *</label>
                    <select className="op-select w-full" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                      value={city} onChange={e => setCity(e.target.value)}>
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider block mb-1.5" style={{ color: "#94A3B8" }}>Fleet Size *</label>
                    <select className="op-select w-full" style={{ borderRadius: 10, padding: "11px 14px", fontSize: 14 }}
                      value={fleetSize} onChange={e => setFleet(e.target.value)}>
                      <option value="">Select size</option>
                      {FLEET_OPTIONS.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="text-sm px-3 py-2.5 rounded-xl flex items-start gap-2"
                    style={{ background: "#FFF7ED", color: "#EA580C", border: "1px solid #FED7AA" }}>
                    <span>⚠</span>
                    <span>{error} <button onClick={onGoLogin} className="underline font-semibold">Login instead</button></span>
                  </div>
                )}

                <button onClick={handleSend} disabled={!valid}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-40" style={{ borderRadius: 12 }}>
                  Send OTP to verify →
                </button>

                <div className="text-center text-sm" style={{ color: "#64748B" }}>
                  Already have an account?{" "}
                  <button onClick={onGoLogin} className="font-semibold" style={{ color: "#F97316" }}>Login here</button>
                </div>

                <button onClick={onBack} className="w-full text-center text-sm" style={{ color: "#94A3B8" }}>← Back to home</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setStep("form")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "#94A3B8" }}>← Back</button>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "#FFF7ED" }}>
                <span style={{ fontSize: 22 }}>📱</span>
              </div>
              <h1 className="font-jakarta font-black mb-1" style={{ fontSize: 24, color: "#0F172A" }}>Verify your number</h1>
              <p className="text-sm mb-2" style={{ color: "#64748B" }}>
                OTP sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
              </p>
              <p className="text-sm mb-8 font-jakarta font-semibold" style={{ color: "#0F172A" }}>{companyName}</p>
              <OtpBox prefix="reg" onComplete={handleVerified} />
              <p className="text-center text-xs mt-5" style={{ color: "#94A3B8" }}>Enter any 6-digit code for the demo</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ ROOT EXPORT ══════════════ */
export default function OperatorAuth({ onLogin, onBack }: OperatorLoginProps) {
  const [page, setPage] = useState<"login" | "register">("login");

  if (page === "login") {
    return <LoginPage onLogin={onLogin} onGoRegister={() => setPage("register")} onBack={onBack} />;
  }
  return <RegisterPage onLogin={onLogin} onGoLogin={() => setPage("login")} onBack={onBack} />;
}
