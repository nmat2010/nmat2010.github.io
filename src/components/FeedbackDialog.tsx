import { useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Mail, Send, X } from "lucide-react";
import { email, feedbackEndpoint } from "@/data/contact";

const KINDS = [
  { id: "idea", label: "An idea", hint: "A feature or something you'd love to see", prompt: "What would you love to see here?" },
  { id: "change", label: "Change something", hint: "Something confusing, hard to read or not working for you", prompt: "What's confusing, hard to read, or not working for you?" },
  { id: "bug", label: "A bug", hint: "Something broke", prompt: "What broke, and where? What were you doing?" },
  { id: "hello", label: "Just saying hi", hint: "Anything else", prompt: "Say hi, or tell me anything at all." },
] as const;

const MAX = 1500;
const INK = "#2a2118";
const RED = "#c8402b";
const BLUE = "#1f4e8c";
const HAND = { fontFamily: '"Patrick Hand", "Be Vietnam Pro", cursive' };
/** the endpoint is set: send from the page itself instead of through the visitor's email app */
const live = feedbackEndpoint.trim().length > 0;

/** A round postmark struck over the corner of the page, dated today. */
const Postmark = () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="h-[4.75rem] w-[4.75rem] shrink-0 -rotate-12 opacity-80 mix-blend-multiply sm:h-24 sm:w-24" style={{ color: RED }}>
      <defs>
        <path id="pm-top" d="M16,50 a34,34 0 0,1 68,0" />
        <path id="pm-bottom" d="M9,50 a41,41 0 0,0 82,0" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <g fill="currentColor" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="8.6" letterSpacing="1.6">
        <text><textPath href="#pm-top" startOffset="50%" textAnchor="middle">THU'S ALLEY</textPath></text>
        <text><textPath href="#pm-bottom" startOffset="50%" textAnchor="middle">SÀI GÒN</textPath></text>
      </g>
      <g fill="currentColor" fontFamily='"Courier Prime", monospace' fontWeight="700" textAnchor="middle">
        <text x="50" y="49" fontSize="10.5">{day}</text>
        <text x="50" y="60" fontSize="9">{now.getFullYear()}</text>
      </g>
    </svg>
  );
};

/**
 * Feedback on the site or the alley. The site is static, so the note is posted as JSON to `feedbackEndpoint` (a form
 * service or a Worker), which delivers it to Thu: the visitor needs no email app. If no endpoint is set, or it can't
 * be reached, it falls back to composing an email or copying the message. `context` says where the visitor was
 * ("the alley, café" / "view mode") so the note arrives with its setting.
 */
export const FeedbackDialog = ({ context, onClose }: { context: string; onClose: () => void }) => {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("idea");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [done, setDone] = useState<"sent" | "copied" | "delivered" | "failed" | null>(null);
  const [busy, setBusy] = useState(false);
  const trap = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const { label, prompt } = KINDS.find((k) => k.id === kind)!;

  useEffect(() => box.current?.focus(), []);

  const subject = `Feedback on Thu's site: ${label}`;
  const body = `${message.trim()}\n\n${from.trim() ? `From: ${from.trim()}\n` : ""}Where I was: ${context}`;
  const ready = message.trim().length > 0;

  /** post the note to the endpoint; anything but a clean success leaves the email/copy fallbacks showing */
  const post = async () => {
    if (!ready) return box.current?.focus();
    if (trap.current?.value) return setDone("delivered"); // a bot filled the hidden field: look like it worked
    setBusy(true);
    const abort = new AbortController();
    const timer = window.setTimeout(() => abort.abort(), 12000);
    try {
      const res = await fetch(feedbackEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          kind: label,
          message: message.trim(),
          from: from.trim() || undefined,
          email: from.includes("@") ? from.trim() : undefined,
          where: context,
          page: window.location.href,
        }),
        signal: abort.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      setDone("delivered");
      setMessage("");
    } catch {
      setDone("failed");
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
    }
  };

  const send = () => {
    if (!ready) return box.current?.focus();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDone("sent");
  };
  const copy = async () => {
    if (!ready) return box.current?.focus();
    try {
      await navigator.clipboard.writeText(`To: ${email}\nSubject: ${subject}\n\n${body}`);
      setDone("copied");
    } catch {
      box.current?.select();
    }
  };

  const stamp = "font-display font-bold uppercase tracking-[0.12em]";
  const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e8c]";
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#2a1a0e]/50 p-3"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      // typing here is never a game key: nothing in the dialog reaches the page's shortcuts
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") onClose();
      }}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Feedback"
        className="vintage-paper newsprint relative flex max-h-[92vh] w-[min(94vw,36rem)] flex-col shadow-2xl"
        style={{
          border: "12px solid transparent",
          borderImage: `repeating-linear-gradient(135deg, ${RED} 0 14px, #f3ead7 14px 24px, ${BLUE} 24px 38px, #f3ead7 38px 48px) 12`,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-2 top-2 z-10 p-1.5 text-[#f6ebcf] hover:opacity-80 ${focus}`}
          style={{ background: INK }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7" style={{ color: INK }}>
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <h2 id="feedback-title" className="font-script text-4xl leading-tight sm:text-5xl">
                Dear Thu,
              </h2>
            </div>
            <Postmark />
          </div>

          <fieldset className="mt-5">
            <legend className={`mb-2 text-sm ${stamp}`} style={{ color: BLUE }}>
              This note is
            </legend>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <label
                  key={k.id}
                  title={k.hint}
                  className={`cursor-pointer border-2 px-2.5 py-1 text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1f4e8c] sm:text-sm ${stamp} ${
                    kind === k.id ? "text-[#f6ebcf]" : "hover:bg-[#2a2118]/10"
                  }`}
                  style={kind === k.id ? { background: RED, borderColor: RED } : { borderColor: INK }}
                >
                  <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} className="sr-only" />
                  {k.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className={`mt-5 block text-sm ${stamp}`} style={{ color: BLUE }} htmlFor="feedback-message">
            Your message
          </label>
          <textarea
            id="feedback-message"
            ref={box}
            value={message}
            maxLength={MAX}
            rows={5}
            onChange={(e) => {
              setMessage(e.target.value);
              setDone(null);
            }}
            placeholder={prompt}
            className={`mt-1 w-full resize-y border-0 bg-transparent px-1 text-xl placeholder:text-[#2a2118]/60 ${focus}`}
            style={{
              ...HAND,
              lineHeight: "1.9rem",
              backgroundImage: `repeating-linear-gradient(transparent 0 calc(1.9rem - 1px), rgba(31,78,140,0.4) calc(1.9rem - 1px) 1.9rem)`,
              backgroundAttachment: "local",
            }}
          />
          <p className="font-type text-right text-xs" style={{ color: "rgba(42,33,24,0.7)" }}>
            {message.length} / {MAX}
          </p>

          <div className="mt-2 flex items-end gap-3">
            <p className="font-script text-2xl leading-none">Yours,</p>
            <div className="min-w-0 flex-1">
              <label className="font-type block text-xs" htmlFor="feedback-from" style={{ color: "rgba(42,33,24,0.75)" }}>
                name or email, if you'd like a reply
              </label>
              <input
                id="feedback-from"
                value={from}
                maxLength={120}
                onChange={(e) => setFrom(e.target.value)}
                className={`w-full border-0 border-b-2 bg-transparent px-1 pb-0.5 text-xl ${focus}`}
                style={{ ...HAND, borderColor: INK }}
              />
            </div>
          </div>

          {/* a field only a bot would fill in */}
          <input ref={trap} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <div className="mt-6 flex flex-wrap gap-2.5">
            {live && done !== "delivered" && (
              <button
                onClick={post}
                disabled={busy}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm text-[#f6ebcf] hover:opacity-90 disabled:opacity-60 ${stamp} ${focus}`}
                style={{ background: RED }}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                {busy ? "Sending…" : "Send"}
              </button>
            )}
            {done === "delivered" && (
              <button onClick={onClose} className={`px-4 py-2.5 text-sm text-[#f6ebcf] hover:opacity-90 ${stamp} ${focus}`} style={{ background: RED }}>
                Done
              </button>
            )}
            {(!live || done === "failed") && (
              <>
                <button onClick={send} className={`flex items-center gap-2 px-4 py-2.5 text-sm text-[#f6ebcf] hover:opacity-90 ${stamp} ${focus}`} style={{ background: RED }}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Send by email
                </button>
                <button
                  onClick={copy}
                  className={`flex items-center gap-2 border-2 px-4 py-2 text-sm hover:bg-[#2a2118]/10 ${stamp} ${focus}`}
                  style={{ borderColor: INK }}
                >
                  {done === "copied" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {done === "copied" ? "Copied" : "Copy message"}
                </button>
              </>
            )}
          </div>
          <div role="status" className="mt-3 min-h-[2.75rem] font-serif text-base leading-snug">
            {done === "delivered" && (
              <>
                <p className="font-script text-2xl" style={{ color: RED }}>
                  Cảm ơn bạn!
                </p>
                <p>Thank you. Your note has been sent to Thu.</p>
              </>
            )}
            {done === "failed" && <p>That didn't go through, but your message is still here. You can send it by email or copy it instead.</p>}
            {done === "sent" && <p>Your email app should have opened with the note ready to send. If it didn't, use Copy message and send it to {email}.</p>}
            {done === "copied" && <p>Copied. Paste it into an email to {email}.</p>}
            {!done && live && <p className="italic">Góp ý của bạn giúp mình hoàn thiện hơn. Your note is sent to Thu through a form service, so please keep anything private out of it.</p>}
            {!done && !live && <p>This opens your email app with the note filled in, addressed to {email}.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
