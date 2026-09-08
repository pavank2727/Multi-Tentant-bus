import { useState } from "react"

/* ── Types ── */
type SettingsTab = "sms" | "email" | "whatsapp" | "timing"

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center shrink-0 transition-colors"
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "#F97316" : "#E2E8F0",
      }}
    >
      <span
        className="absolute transition-transform"
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          left: checked ? 22 : 4,
        }}
      />
    </button>
  )
}

interface FieldProps {
  label: string
  sub?: string
  children: React.ReactNode
}
function Field({ label, sub, children }: FieldProps) {
  return (
    <div
      className="flex items-start justify-between gap-6 py-4"
      style={{ borderBottom: "1px solid #F1F5F9" }}
    >
      <div className="min-w-0">
        <div
          className="font-jakarta font-semibold text-sm"
          style={{ color: "#0F172A" }}
        >
          {label}
        </div>
        {sub && (
          <div
            className="text-xs mt-0.5"
            style={{ color: "#94A3B8", lineHeight: 1.5 }}
          >
            {sub}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SectionCard({
  title,
  badge,
  children,
}: {
  title: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-white rounded-2xl mb-5"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <div
        className="px-6 py-4 flex items-center gap-2"
        style={{ borderBottom: "1px solid #F1F5F9" }}
      >
        <span
          className="font-jakarta font-black text-sm"
          style={{ color: "#0F172A" }}
        >
          {title}
        </span>
        {badge && (
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "#FFF7ED",
              color: "#F97316",
              border: "1px solid #FED7AA",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="px-6">{children}</div>
    </div>
  )
}

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  suffix,
}: {
  label: string
  placeholder: string
  type?: string
  value: string
  onChange: (v: string) => void
  suffix?: string
}) {
  return (
    <div>
      <label
        className="font-mono text-xs uppercase tracking-wider block mb-1.5"
        style={{ color: "#94A3B8" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className="op-input w-full"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingRight: suffix ? 48 : undefined }}
        />
        {suffix && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs"
            style={{ color: "#94A3B8" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

/* ══════ SMS TAB ══════ */
function SmsTab() {
  const [enabled, setEnabled] = useState(true)
  const [provider, setProvider] = useState("msg91")
  const [apiKey, setApiKey] = useState("MSG91-XXXXXXXXXXXXXXXX")
  const [senderId, setSenderId] = useState("YATHRI")
  const [dlt, setDlt] = useState("")

  const [notifs, setNotifs] = useState({
    booking: true,
    reminder: true,
    cancellation: true,
    delay: true,
    otp: true,
    boarding: false,
  })

  const toggle = (k: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }))

  return (
    <div>
      <SectionCard title="SMS Provider" badge={enabled ? "Active" : "Inactive"}>
        <Field
          label="Enable SMS notifications"
          sub="Send booking confirmations and alerts via SMS to passengers."
        >
          <Toggle checked={enabled} onChange={setEnabled} />
        </Field>

        {enabled && (
          <>
            <Field label="Provider" sub="Select your SMS gateway provider.">
              <select
                className="op-select text-sm"
                style={{ minWidth: 160 }}
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="msg91">MSG91</option>
                <option value="textlocal">TextLocal</option>
                <option value="twilio">Twilio</option>
                <option value="kaleyra">Kaleyra</option>
                <option value="fast2sms">Fast2SMS</option>
              </select>
            </Field>

            <div className="py-4 space-y-4">
              <InputField
                label="API Key"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={setApiKey}
              />
              <InputField
                label="Sender ID"
                placeholder="YATHRI (6 chars)"
                value={senderId}
                onChange={setSenderId}
              />
              <InputField
                label="DLT Template ID (TRAI)"
                placeholder="Required for India SMS delivery"
                value={dlt}
                onChange={setDlt}
              />
            </div>

            <div className="py-3">
              <button
                className="font-mono text-xs px-4 py-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: "#F0FDF4",
                  color: "#138808",
                  border: "1px solid #BBF7D0",
                }}
              >
                Test SMS Connection →
              </button>
            </div>
          </>
        )}
      </SectionCard>

      {enabled && (
        <SectionCard title="SMS Triggers">
          {(Object.entries({
            booking: {
              label: "Booking Confirmation",
              sub: "Sent immediately after a successful booking.",
            },
            otp: {
              label: "OTP / Verification SMS",
              sub: "Sent during passenger login and booking.",
            },
            reminder: {
              label: "Journey Reminder",
              sub: "Sent before departure (timing set in Notification Timing).",
            },
            boarding: {
              label: "Boarding Alert",
              sub: "Sent 1 hour before departure time.",
            },
            delay: {
              label: "Delay / Schedule Change",
              sub: "Sent when operator updates departure time.",
            },
            cancellation: {
              label: "Cancellation & Refund",
              sub: "Sent when booking is cancelled.",
            },
          }) as [keyof typeof notifs, { label: string sub: string }][]).map(
            ([k, v]) => (
              <Field key={k} label={v.label} sub={v.sub}>
                <Toggle checked={notifs[k]} onChange={() => toggle(k)} />
              </Field>
            ),
          )}
        </SectionCard>
      )}
    </div>
  )
}

/* ══════ EMAIL TAB ══════ */
function EmailTab() {
  const [enabled, setEnabled] = useState(true)
  const [method, setMethod] = useState("smtp")
  const [host, setHost] = useState("smtp.gmail.com")
  const [port, setPort] = useState("587")
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [fromName, setFromName] = useState("Yathri Bookings")
  const [fromEmail, setFromEmail] = useState("")
  const [replyTo, setReplyTo] = useState("")

  const [notifs, setNotifs] = useState({
    booking: true,
    reminder: true,
    cancellation: true,
    invoice: true,
    delay: false,
    otp: false,
  })
  const toggle = (k: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }))

  return (
    <div>
      <SectionCard
        title="Email Provider"
        badge={enabled ? "Active" : "Inactive"}
      >
        <Field
          label="Enable Email notifications"
          sub="Send tickets, invoices and alerts to passenger email addresses."
        >
          <Toggle checked={enabled} onChange={setEnabled} />
        </Field>

        {enabled && (
          <>
            <Field label="Delivery Method" sub="Choose how emails are sent.">
              <select
                className="op-select text-sm"
                style={{ minWidth: 160 }}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="smtp">SMTP (Custom)</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="ses">AWS SES</option>
                <option value="brevo">Brevo (Sendinblue)</option>
              </select>
            </Field>

            <div className="py-4 space-y-4">
              {method === "smtp" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="SMTP Host"
                      placeholder="smtp.gmail.com"
                      value={host}
                      onChange={setHost}
                    />
                    <InputField
                      label="SMTP Port"
                      placeholder="587"
                      value={port}
                      onChange={setPort}
                    />
                  </div>
                  <InputField
                    label="Username"
                    placeholder="your@email.com"
                    value={user}
                    onChange={setUser}
                  />
                  <InputField
                    label="Password / App Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={pass}
                    onChange={setPass}
                  />
                </>
              ) : (
                <InputField
                  label="API Key"
                  placeholder={`Enter your ${method} API key`}
                  value={pass}
                  onChange={setPass}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="From Name"
                  placeholder="Yathri Bookings"
                  value={fromName}
                  onChange={setFromName}
                />
                <InputField
                  label="From Email"
                  placeholder="bookings@yourdomain.com"
                  value={fromEmail}
                  onChange={setFromEmail}
                />
              </div>
              <InputField
                label="Reply-To Email"
                placeholder="support@yourdomain.com"
                value={replyTo}
                onChange={setReplyTo}
              />
            </div>

            <div className="py-3">
              <button
                className="font-mono text-xs px-4 py-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: "#F0FDF4",
                  color: "#138808",
                  border: "1px solid #BBF7D0",
                }}
              >
                Send Test Email →
              </button>
            </div>
          </>
        )}
      </SectionCard>

      {enabled && (
        <SectionCard title="Email Triggers">
          {(Object.entries({
            booking: {
              label: "Booking Confirmation + E-Ticket",
              sub: "PDF ticket attached. Sent immediately after booking.",
            },
            invoice: {
              label: "Invoice / Receipt",
              sub: "GST-compliant invoice sent post-payment.",
            },
            reminder: {
              label: "Journey Reminder",
              sub: "Sent before departure (configure time in Notification Timing).",
            },
            cancellation: {
              label: "Cancellation Confirmation",
              sub: "Includes refund amount and timeline.",
            },
            delay: {
              label: "Delay / Rescheduling Alert",
              sub: "Sent when departure time changes.",
            },
            otp: { label: "OTP via Email", sub: "Fallback OTP if SMS fails." },
          }) as [keyof typeof notifs, { label: string sub: string }][]).map(
            ([k, v]) => (
              <Field key={k} label={v.label} sub={v.sub}>
                <Toggle checked={notifs[k]} onChange={() => toggle(k)} />
              </Field>
            ),
          )}
        </SectionCard>
      )}
    </div>
  )
}

/* ══════ WHATSAPP TAB ══════ */
function WhatsappTab() {
  const [enabled, setEnabled] = useState(false)
  const [provider, setProvider] = useState("waba")
  const [token, setToken] = useState("")
  const [phoneId, setPhoneId] = useState("")
  const [bizAccId, setBizAccId] = useState("")

  const [notifs, setNotifs] = useState({
    booking: true,
    reminder: true,
    cancellation: true,
    delay: true,
    boarding: true,
    otp: false,
  })
  const toggle = (k: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }))

  const templates = [
    {
      name: "booking_confirmed",
      label: "Booking Confirmed",
      status: "approved",
      preview:
        "Your booking for {{route}} on {{date}} is confirmed. PNR: {{pnr}}. Seat: {{seat}}.",
    },
    {
      name: "journey_reminder",
      label: "Journey Reminder",
      status: "approved",
      preview:
        "Reminder: Your bus from {{from}} to {{to}} departs tomorrow at {{time}}. Board at {{stop}}.",
    },
    {
      name: "bus_delayed",
      label: "Bus Delayed",
      status: "pending",
      preview:
        "Update: Your bus {{bus_no}} is delayed by {{delay_min}} minutes. New departure: {{new_time}}.",
    },
    {
      name: "cancellation_done",
      label: "Cancellation Done",
      status: "approved",
      preview:
        "Your booking {{pnr}} has been cancelled. Refund of ₹{{amount}} will be processed in 5–7 days.",
    },
  ]

  return (
    <div>
      <SectionCard
        title="WhatsApp Business API"
        badge={enabled ? "Active" : "Inactive"}
      >
        <Field
          label="Enable WhatsApp notifications"
          sub="Send rich messages, tickets, and alerts via WhatsApp to passengers."
        >
          <Toggle checked={enabled} onChange={setEnabled} />
        </Field>

        {enabled && (
          <>
            <Field
              label="Provider"
              sub="Select your WhatsApp Business API partner."
            >
              <select
                className="op-select text-sm"
                style={{ minWidth: 180 }}
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="waba">Meta (Official WABA)</option>
                <option value="interakt">Interakt</option>
                <option value="gupshup">Gupshup</option>
                <option value="wati">WATI</option>
                <option value="aisensy">AiSensy</option>
                <option value="twilio">Twilio WhatsApp</option>
              </select>
            </Field>

            <div className="py-4 space-y-4">
              <InputField
                label="Access Token"
                placeholder="EAAxxxxxxxxxxxxxxxx"
                value={token}
                onChange={setToken}
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Phone Number ID"
                  placeholder="1234567890"
                  value={phoneId}
                  onChange={setPhoneId}
                />
                <InputField
                  label="Business Account ID"
                  placeholder="9876543210"
                  value={bizAccId}
                  onChange={setBizAccId}
                />
              </div>
            </div>

            <div className="py-3 flex items-center gap-3">
              <button
                className="font-mono text-xs px-4 py-2 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: "#F0FDF4",
                  color: "#138808",
                  border: "1px solid #BBF7D0",
                }}
              >
                Test Connection →
              </button>
              <span className="font-mono text-xs" style={{ color: "#94A3B8" }}>
                Meta approval required for each template
              </span>
            </div>
          </>
        )}
      </SectionCard>

      {enabled && (
        <>
          <SectionCard title="WhatsApp Triggers">
            {(Object.entries({
              booking: {
                label: "Booking Confirmation",
                sub: "Sent with full ticket details and QR code.",
              },
              boarding: {
                label: "Boarding Pass",
                sub: "Rich message sent 2 hours before departure.",
              },
              reminder: {
                label: "Journey Reminder",
                sub: "Sent the day before departure.",
              },
              delay: {
                label: "Delay / Schedule Change",
                sub: "Instant update when departure changes.",
              },
              cancellation: {
                label: "Cancellation & Refund",
                sub: "Confirmation with refund breakdown.",
              },
              otp: {
                label: "OTP via WhatsApp",
                sub: "Verification code via WhatsApp message.",
              },
            }) as [keyof typeof notifs, { label: string sub: string }][]).map(
              ([k, v]) => (
                <Field key={k} label={v.label} sub={v.sub}>
                  <Toggle checked={notifs[k]} onChange={() => toggle(k)} />
                </Field>
              ),
            )}
          </SectionCard>

          <SectionCard title="Message Templates">
            <div className="py-2 space-y-3">
              {templates.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl p-4"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-jakarta font-semibold text-sm"
                      style={{ color: "#0F172A" }}
                    >
                      {t.label}
                    </span>
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          t.status === "approved" ? "#F0FDF4" : "#FFFBEB",
                        color: t.status === "approved" ? "#138808" : "#D97706",
                        border: `1px solid ${
                          t.status === "approved" ? "#BBF7D0" : "#FDE68A"
                        }`,
                      }}
                    >
                      {t.status === "approved" ? "✓ Approved" : "⏳ Pending"}
                    </span>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "#64748B", lineHeight: 1.6 }}
                  >
                    {t.preview}
                  </p>
                  <div
                    className="font-mono text-xs mt-2"
                    style={{ color: "#CBD5E1" }}
                  >
                    {t.name}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}

/* ══════ NOTIFICATION TIMING TAB ══════ */
type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function TimingTab() {
  const [quietStart, setQStart] = useState("22:00")
  const [quietEnd, setQEnd] = useState("07:00")
  const [quietEnabled, setQEnabled] = useState(true)

  const [reminderOffset, setReminderOffset] = useState("24")
  const [boardingOffset, setBoardingOffset] = useState("120")
  const [reminderSecond, setReminderSecond] = useState("2")
  const [enableSecond, setEnableSecond] = useState(false)

  const [activeDays, setActiveDays] = useState<Day[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ])
  const toggleDay = (d: Day) =>
    setActiveDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))

  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [batchDelay, setBatchDelay] = useState("5")
  const [retryFailed, setRetry] = useState(true)
  const [retryAfter, setRetryAfter] = useState("30")

  return (
    <div>
      {/* Quiet hours */}
      <SectionCard title="Quiet Hours" badge="Do Not Disturb">
        <Field
          label="Enable quiet hours"
          sub="No notifications will be sent to passengers during this window, even if an event occurs. Messages are queued and sent after quiet hours end."
        >
          <Toggle checked={quietEnabled} onChange={setQEnabled} />
        </Field>

        {quietEnabled && (
          <div className="py-4 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                  style={{ color: "#94A3B8" }}
                >
                  Quiet From
                </label>
                <input
                  className="op-input w-full"
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQStart(e.target.value)}
                />
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "#94A3B8" }}
                >
                  No messages sent after this time
                </div>
              </div>
              <div>
                <label
                  className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                  style={{ color: "#94A3B8" }}
                >
                  Quiet Until
                </label>
                <input
                  className="op-input w-full"
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQEnd(e.target.value)}
                />
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "#94A3B8" }}
                >
                  Messages resume after this time
                </div>
              </div>
            </div>

            {/* Active days */}
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-2"
                style={{ color: "#94A3B8" }}
              >
                Apply Quiet Hours On
              </label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className="w-10 h-10 rounded-lg font-mono text-xs font-semibold transition-all"
                    style={{
                      background: activeDays.includes(d)
                        ? "#F97316"
                        : "#F8FAFC",
                      color: activeDays.includes(d) ? "#fff" : "#64748B",
                      border: `1.5px solid ${
                        activeDays.includes(d) ? "#F97316" : "#E2E8F0"
                      }`,
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Timezone
              </label>
              <select
                className="op-select w-full"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="Asia/Kolkata">
                  Asia/Kolkata (IST, UTC+5:30)
                </option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Preview */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
            >
              <div
                className="font-mono text-xs uppercase tracking-wider mb-2"
                style={{ color: "#EA580C" }}
              >
                Current Window
              </div>
              <div
                className="font-jakarta font-black text-lg"
                style={{ color: "#0F172A" }}
              >
                {quietStart} → {quietEnd}
              </div>
              <div className="text-xs mt-1" style={{ color: "#64748B" }}>
                Notifications are blocked on:{" "}
                {activeDays.join(", ") || "no days"}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Reminder timing */}
      <SectionCard title="Reminder Timing">
        <div className="py-4 space-y-5">
          <div>
            <label
              className="font-mono text-xs uppercase tracking-wider block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              First Journey Reminder
            </label>
            <div className="flex items-center gap-3">
              <input
                className="op-input"
                type="number"
                min="1"
                max="72"
                value={reminderOffset}
                onChange={(e) => setReminderOffset(e.target.value)}
                style={{ width: 90, textAlign: "center" }}
              />
              <span className="text-sm" style={{ color: "#64748B" }}>
                hours before departure
              </span>
            </div>
            <div
              className="font-mono text-xs mt-1.5"
              style={{ color: "#94A3B8" }}
            >
              e.g. {reminderOffset}h before → if bus departs at 08:00, reminder
              sent at {(() => {
                const h = 8 - Math.min(parseInt(reminderOffset) || 0, 8)
                return `${String(h).padStart(2, "0")}:00`
              })()}
            </div>
          </div>

          <Field
            label="Send second reminder"
            sub="Send an additional reminder closer to departure."
          >
            <Toggle checked={enableSecond} onChange={setEnableSecond} />
          </Field>

          {enableSecond && (
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Second Reminder
              </label>
              <div className="flex items-center gap-3">
                <input
                  className="op-input"
                  type="number"
                  min="1"
                  max="24"
                  value={reminderSecond}
                  onChange={(e) => setReminderSecond(e.target.value)}
                  style={{ width: 90, textAlign: "center" }}
                />
                <span className="text-sm" style={{ color: "#64748B" }}>
                  hours before departure
                </span>
              </div>
            </div>
          )}

          <div>
            <label
              className="font-mono text-xs uppercase tracking-wider block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              Boarding Alert
            </label>
            <div className="flex items-center gap-3">
              <input
                className="op-input"
                type="number"
                min="15"
                max="240"
                step="15"
                value={boardingOffset}
                onChange={(e) => setBoardingOffset(e.target.value)}
                style={{ width: 90, textAlign: "center" }}
              />
              <span className="text-sm" style={{ color: "#64748B" }}>
                minutes before departure
              </span>
            </div>
            <div
              className="font-mono text-xs mt-1.5"
              style={{ color: "#94A3B8" }}
            >
              Sent via WhatsApp / SMS as a boarding pass alert
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Delivery settings */}
      <SectionCard title="Delivery Settings">
        <div className="py-4 space-y-5">
          <div>
            <label
              className="font-mono text-xs uppercase tracking-wider block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              Batch Send Delay
            </label>
            <div className="flex items-center gap-3">
              <input
                className="op-input"
                type="number"
                min="0"
                max="60"
                value={batchDelay}
                onChange={(e) => setBatchDelay(e.target.value)}
                style={{ width: 90, textAlign: "center" }}
              />
              <span className="text-sm" style={{ color: "#64748B" }}>
                seconds between messages (avoids spam filters)
              </span>
            </div>
          </div>

          <Field
            label="Retry failed notifications"
            sub="Automatically retry if SMS / email delivery fails. Retries once after the set delay."
          >
            <Toggle checked={retryFailed} onChange={setRetry} />
          </Field>

          {retryFailed && (
            <div>
              <label
                className="font-mono text-xs uppercase tracking-wider block mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Retry After
              </label>
              <div className="flex items-center gap-3">
                <input
                  className="op-input"
                  type="number"
                  min="5"
                  max="120"
                  value={retryAfter}
                  onChange={(e) => setRetryAfter(e.target.value)}
                  style={{ width: 90, textAlign: "center" }}
                />
                <span className="text-sm" style={{ color: "#64748B" }}>
                  minutes after first failure
                </span>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Summary card */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
      >
        <div
          className="font-mono text-xs uppercase tracking-wider mb-3"
          style={{ color: "#138808" }}
        >
          Active Schedule Summary
        </div>
        <div className="space-y-2 text-sm" style={{ color: "#0F172A" }}>
          <div className="flex justify-between">
            <span style={{ color: "#64748B" }}>Quiet hours</span>
            <span className="font-semibold">
              {quietEnabled ? `${quietStart} – ${quietEnd}` : "Disabled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#64748B" }}>First reminder</span>
            <span className="font-semibold">
              {reminderOffset}h before departure
            </span>
          </div>
          {enableSecond && (
            <div className="flex justify-between">
              <span style={{ color: "#64748B" }}>Second reminder</span>
              <span className="font-semibold">
                {reminderSecond}h before departure
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span style={{ color: "#64748B" }}>Boarding alert</span>
            <span className="font-semibold">
              {boardingOffset} min before departure
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#64748B" }}>Retry failed</span>
            <span className="font-semibold">
              {retryFailed ? `After ${retryAfter} min` : "Off"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#64748B" }}>Timezone</span>
            <span className="font-semibold">IST (UTC+5:30)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════ MAIN EXPORT ══════════════ */
const TABS: { id: SettingsTab label: string icon: string }[] = [
  { id: "sms", label: "SMS", icon: "💬" },
  { id: "email", label: "Email", icon: "✉️" },
  { id: "whatsapp", label: "WhatsApp", icon: "📱" },
  { id: "timing", label: "Notification Timing", icon: "⏰" },
]

export default function Settings() {
  const [tab, setTab] = useState<SettingsTab>("sms")
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-jakarta font-black text-xl"
            style={{ color: "#0F172A" }}
          >
            Notification Settings
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            Configure SMS, Email, WhatsApp channels and delivery timing for
            passenger notifications.
          </p>
        </div>
        <button
          onClick={save}
          className="font-jakarta font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: saved ? "#138808" : "#F97316",
            color: "#fff",
            minWidth: 100,
          }}
        >
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl"
        style={{ background: "#F1F5F9" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#0F172A" : "#64748B",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: tab === t.id ? 700 : 500,
            }}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "sms" && <SmsTab />}
      {tab === "email" && <EmailTab />}
      {tab === "whatsapp" && <WhatsappTab />}
      {tab === "timing" && <TimingTab />}
    </div>
  )
}
