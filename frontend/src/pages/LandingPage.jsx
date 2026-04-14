import { useId, useRef, useState } from "react";
import "./LandingPage.css";
import { FEATURES } from "../components/features";
import {
  MonkeyDefault,
  MonkeyWaving,
  MonkeyExcited,
  MonkeyThinking,
} from "../components/MonkeyMascot";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

/** Loose check aligned with typical user@domain.tld (server still validates with EmailStr). */
function isValidWaitlistEmail(value) {
  const s = value.trim();
  if (!s || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// ─── Small reusable components ────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!isValidWaitlistEmail(trimmed)) {
      setError(true);
      emailInputRef.current?.focus();
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? "Request failed");
      }
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MonkeyExcited size={120} />
        <strong style={{ fontSize: 17, fontWeight: 600 }}>
          You're on the list!
        </strong>
        <span style={{ fontSize: 14, color: "rgba(10,13,7,.5)" }}>
          We'll email you when early access opens.
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 8,
          maxWidth: 440,
          margin: "0 auto 10px",
        }}
      >
        <input
          ref={emailInputRef}
          type="email"
          name="waitlist-email"
          autoComplete="email"
          inputMode="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          aria-invalid={error}
          aria-describedby="waitlist-email-hint"
          style={{
            flex: 1,
            border: `1px solid ${error ? "#f87171" : "rgba(10,13,7,.2)"}`,
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
            background: "#fff",
            color: "#0a0d07",
          }}
        />
        <button
          className="mm-btn-blue"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "12px 22px",
            fontSize: 14,
            borderRadius: 10,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "..." : "Notify Me"}
        </button>
      </div>
      <p
        id="waitlist-email-hint"
        style={{ fontSize: 12, color: "rgba(10,13,7,.4)", textAlign: "center" }}
      >
        No spam, ever. Unsubscribe anytime.
      </p>
    </>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const panelId = useId();

  return (
    <div
      style={{
        border: "1px solid rgba(10,13,7,.12)",
        borderRadius: 16,
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        id={triggerId}
        className="mm-faq-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <span
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 700,
            color: "#0a0d07",
            lineHeight: 1.5,
          }}
        >
          {q}
        </span>
        <span
          aria-hidden
          style={{
            fontSize: 20,
            color: "#0a0d07",
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform .2s",
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        style={{
          padding: "0 24px 18px",
          fontSize: 14,
          lineHeight: 1.6,
          color: "#0a0d07",
        }}
      >
        {a}
      </div>
    </div>
  );
}

// ─── Page sections ────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header
      style={{ position: "sticky", top: 0, zIndex: 100, padding: "12px 16px" }}
    >
      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid rgba(10,13,7,.12)",
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,.06)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "10px 24px",
        }}
      >
        <div
          onClick={scrollToTop}
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-.03em",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <MonkeyDefault size={42} /> Monkey Mentor
        </div>
        <div
          className="mm-nav-links"
          role="list"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
            justifyContent: "flex-end",
            marginRight: 12,
          }}
        >
          <span className="mm-nav-link" onClick={() => scrollTo("features")}>
            Features
          </span>
          <span className="mm-nav-link" onClick={() => scrollTo("pricing")}>
            Pricing
          </span>
          <span className="mm-nav-link" onClick={() => scrollTo("faq")}>
            FAQ
          </span>
        </div>
        <button
          className="mm-btn-blue"
          style={{ padding: "9px 22px", fontSize: 14 }}
          onClick={() => scrollTo("waitlist")}
        >
          Join Waitlist
        </button>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="mm-hero"
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: 700,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 60px",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div
        className="mm-hero-bg"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <div
          className="mm-photo"
          style={{
            left: "2%",
            top: "12%",
            width: 160,
            height: 140,
            fontSize: 40,
          }}
        >
          📚
        </div>
        <div
          className="mm-photo"
          style={{
            left: "18%",
            top: "3%",
            width: 120,
            height: 130,
            fontSize: 36,
          }}
        >
          👩‍💻
        </div>
        <div
          className="mm-photo"
          style={{
            left: "42%",
            top: "8%",
            width: 110,
            height: 110,
            fontSize: 36,
          }}
        >
          🎓
        </div>
        <div
          className="mm-photo"
          style={{
            right: "17%",
            top: "2%",
            width: 160,
            height: 150,
            fontSize: 40,
          }}
        >
          👨‍🎓
        </div>
        <div
          className="mm-photo"
          style={{
            right: "2%",
            top: "15%",
            width: 150,
            height: 160,
            fontSize: 40,
          }}
        >
          📝
        </div>
        <div
          className="mm-photo"
          style={{
            left: "17%",
            bottom: "10%",
            width: 110,
            height: 120,
            fontSize: 34,
          }}
        >
          🤓
        </div>
        <div
          className="mm-photo"
          style={{
            left: "49%",
            bottom: "8%",
            width: 90,
            height: 90,
            fontSize: 30,
          }}
        >
          ✏️
        </div>
        <div
          className="mm-photo"
          style={{
            right: "3%",
            bottom: "10%",
            width: 140,
            height: 130,
            fontSize: 38,
          }}
        >
          💡
        </div>
        <div
          className="mm-bubble"
          style={{
            left: "13%",
            top: "30%",
            width: 50,
            height: 50,
            background: "#e6f1fb",
            fontSize: 20,
          }}
        >
          ✅
        </div>
        <div
          className="mm-bubble"
          style={{
            right: "15%",
            top: "35%",
            width: 44,
            height: 44,
            background: "#fdf0e0",
            fontSize: 18,
          }}
        >
          🔊
        </div>
        <div
          className="mm-bubble"
          style={{
            left: "26%",
            bottom: "20%",
            width: 44,
            height: 44,
            background: "#e1f5ee",
            fontSize: 18,
          }}
        >
          🃏
        </div>
        <div
          className="mm-bubble"
          style={{
            right: "24%",
            bottom: "18%",
            width: 48,
            height: 48,
            background: "#fbeaf0",
            fontSize: 20,
          }}
        >
          📊
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <MonkeyWaving size={260} />
        </div>
        <h1
          style={{
            fontSize: 58,
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-1.8px",
            color: "#0a0d07",
            marginBottom: 28,
          }}
        >
          Learning that adapts
          <br /> to{" "}
          <em style={{ fontStyle: "italic", fontWeight: 500 }}>you</em>
        </h1>
        <button
          className="mm-btn-blue"
          style={{
            padding: "18px 36px",
            fontSize: 17,
            fontWeight: 600,
            minHeight: 60,
            minWidth: 220,
          }}
          onClick={() => scrollTo("waitlist")}
        >
          Join the waitlist
        </button>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ["2,400+", "Students already on the waitlist"],
    ["92%", "of active users reported better grades"],
  ];
  return (
    <section style={{ background: "#fff", padding: "56px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "-1.1px",
            maxWidth: 620,
            marginBottom: 48,
            lineHeight: 1.25,
          }}
        >
          The trusted AI study tool for students.
        </h2>
        <div
          className="mm-stats-row"
          style={{ display: "flex", marginBottom: 48 }}
        >
          {items.map(([num, desc], i) => (
            <div
              key={num}
              style={{
                flex: 1,
                borderLeft: "1px solid rgba(10,13,7,.15)",
                paddingLeft: 24,
                marginLeft: i > 0 ? 48 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 500,
                  letterSpacing: "-2.5px",
                  lineHeight: 1.2,
                }}
              >
                {num}
              </div>
              <div style={{ fontSize: 17, marginTop: 4, lineHeight: 1.4 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="mm-btn-blue"
            style={{ padding: "11px 28px", fontSize: 15 }}
            onClick={() => scrollTo("waitlist")}
          >
            Join for Free
          </button>
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section
      id="waitlist"
      aria-label="Join the waitlist"
      style={{ background: "#f9f9fb", padding: "60px 24px" }}
    >
      <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "rgba(10,13,7,.45)",
            marginBottom: 12,
          }}
        >
          Early Access
        </p>
        <h2
          style={{
            fontSize: 38,
            fontWeight: 500,
            letterSpacing: "-1.2px",
            marginBottom: 10,
          }}
        >
          Be the first to try Monkey Mentor
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "rgba(10,13,7,.6)",
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          Join thousands of students on the waitlist. Get notified when we
          launch — and get your first month of Pro free.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section style={{ background: "#fff", padding: "60px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex",
                    flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ textAlign: "center", maxWidth: 680 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Watch a Demo</p>
          <h2 style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-1.4px", lineHeight: 1.2 }}>
            How your lectures become a complete study system
          </h2>
        </div>
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          preload="none"
          poster="/demo_frame.png"
          style={{ width: "100%", borderRadius: 16, display: "block" }}
        >
          <source src="https://lecture-ai-files.s3.us-east-2.amazonaws.com/demo/0414.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const { tag, heading, description, Panel } = FEATURES[activeTab];

  return (
    <section
      id="features"
      aria-label="Features"
      style={{ background: "#f9f9fb", padding: "60px 24px" }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 680 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            Features
          </p>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 500,
              letterSpacing: "-1.4px",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Unleash the power of your course materials
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.5 }}>
            Upload your materials once and unlock a suite of tools designed to
            help you understand faster, retain longer, and stress less.
          </p>
        </div>

        <div
          style={{
            width: "100%",
            border: "1px solid rgba(10,13,7,.12)",
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div className="mm-feat-tabs" style={{ display: "flex" }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`mm-feat-tab${activeTab === i ? " active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {f.label}
              </div>
            ))}
          </div>
          <div
            className="mm-feat-panel"
            style={{
              padding: "32px 40px",
              display: "flex",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div
              className="mm-feat-img"
              style={{ width: "42%", flexShrink: 0 }}
            >
              <Panel />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600 }}>{tag}</p>
              <h3
                style={{
                  fontSize: 36,
                  fontWeight: 500,
                  letterSpacing: "-1.1px",
                  lineHeight: 1.2,
                }}
              >
                {heading}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6 }}>{description}</p>
              <button
                className="mm-btn-blue"
                style={{
                  padding: "9px 22px",
                  fontSize: 13,
                  width: "fit-content",
                }}
                onClick={() => scrollTo("waitlist")}
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchStats() {
  const stats = [
    ["92%", "of active users reported grade improvements"],
    ["85%", "of all users reported grade improvements"],
    ["30%", "reduction in average study time reported"],
  ];
  return (
    <section style={{ background: "#c5f1ec", padding: "60px 24px" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Research
            </p>
            <h2
              style={{
                fontSize: 42,
                fontWeight: 500,
                letterSpacing: "-1.4px",
                lineHeight: 1.2,
              }}
            >
              Finals season put us to the test. We passed.
            </h2>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>
              *Based on early testing with 500 students during finals week
            </p>
          </div>
        </div>
        <div className="mm-res-stats" style={{ display: "flex" }}>
          {stats.map(([num, desc], i) => (
            <div
              key={i}
              style={{
                flex: 1,
                borderLeft: "1px solid rgba(10,13,7,.2)",
                paddingLeft: 24,
                marginLeft: i > 0 ? 48 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 500,
                  letterSpacing: "-2px",
                  lineHeight: 1.2,
                }}
              >
                {num}
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.4, marginTop: 4 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const freeTier = [
    "3 lecture uploads/month",
    "AI summaries",
    "Basic Q&A chat",
    "Community support",
  ];
  const proTier = [
    "Unlimited lecture uploads",
    "AI summaries & full chat",
    "Smart flashcard generation",
    "AI practice quizzes",
    "Progress analytics dashboard",
    "Priority support",
  ];

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      style={{ background: "#fff", padding: "60px 24px" }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: "rgba(10,13,7,.45)",
              marginBottom: 10,
            }}
          >
            Pricing
          </p>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 500,
              letterSpacing: "-1.3px",
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            Simple, student-friendly pricing
          </h2>
          <p style={{ fontSize: 15, color: "rgba(10,13,7,.6)" }}>
            No hidden fees. Cancel anytime.
          </p>
        </div>
        <div
          className="mm-pricing-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          <div
            style={{
              border: "1px solid rgba(10,13,7,.12)",
              borderRadius: 20,
              padding: 32,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: "rgba(10,13,7,.45)",
                marginBottom: 10,
              }}
            >
              Free
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginBottom: 24,
              }}
            >
              <span
                style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-2px" }}
              >
                $0
              </span>
              <span style={{ fontSize: 14, color: "rgba(10,13,7,.4)" }}>
                /month
              </span>
            </div>
            {freeTier.map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    background: "#f0f0ee",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                {f}
              </div>
            ))}
            <button
              className="mm-btn-outline"
              style={{
                width: "100%",
                padding: 13,
                fontSize: 14,
                borderRadius: 12,
                marginTop: 8,
              }}
              onClick={() => scrollTo("waitlist")}
            >
              Join Waitlist
            </button>
          </div>

          <div
            style={{
              border: "2px solid #0043ff",
              borderRadius: 20,
              padding: 32,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#0043ff",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 100,
                whiteSpace: "nowrap",
              }}
            >
              MOST POPULAR
            </div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: "#0043ff",
                marginBottom: 10,
              }}
            >
              Pro
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginBottom: 24,
              }}
            >
              <span
                style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-2px" }}
              >
                $7
              </span>
              <span style={{ fontSize: 14, color: "rgba(10,13,7,.4)" }}>
                /month
              </span>
            </div>
            {proTier.map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    background: "#e6f1fb",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    flexShrink: 0,
                    color: "#0043ff",
                  }}
                >
                  ✓
                </span>
                {f}
              </div>
            ))}
            <button
              className="mm-btn-blue"
              style={{
                width: "100%",
                padding: 13,
                fontSize: 14,
                borderRadius: 12,
                marginTop: 8,
              }}
              onClick={() => scrollTo("waitlist")}
            >
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "Will Monkey Mentor actually help me do better on exams?",
      a: "It really does. We built Monkey Mentor because generic study apps were failing students. Everything here is built around your actual class materials, so when you review, you are reviewing exactly what your professor is going to test you on. Students who use it consistently walk into exams feeling prepared, not panicked.",
    },
    {
      q: "How does the AI understand my lectures?",
      a: "Just upload your PDF and our AI gets to work reading every single page. Lecture slides, textbook chapters, handwritten notes scanned to PDF, it handles all of it. Within seconds it has fully absorbed your material and is ready to answer questions, write summaries, and build study tools like it sat through the lecture with you.",
    },
    {
      q: "What if my exam is tomorrow?",
      a: "Honestly? This is where Monkey Mentor shines. Upload your notes right now and get a sharp summary of the most important concepts in under 10 seconds. Students have told us they learned more in one focused hour with Monkey Mentor the night before an exam than in a full week of passive re-reading. It is never too late to use it.",
    },
    {
      q: "Does Monkey Mentor work on my phone?",
      a: "Totally. The whole app is built to work beautifully on any screen. Waiting for class to start, riding the bus, lying in bed the night before a test, pull it up and keep studying. Your progress follows you everywhere.",
    },
    {
      q: "Is my uploaded content private?",
      a: "100%. Your notes are yours. Nobody else can see what you upload and we will never share or sell your data. You study in peace, we keep the lights on, everyone wins.",
    },
  ];

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      style={{ background: "#f9f9fb", padding: "60px 24px" }}
    >
      <div
        className="mm-faq-wrap"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          gap: 60,
          alignItems: "flex-start",
        }}
      >
        <div
          className="mm-faq-left"
          style={{
            width: 460,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "-1.3px",
              lineHeight: 1.2,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.5 }}>
            Find answers about Monkey Mentor, how the AI works, and what we
            support.
          </p>
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}
        >
          {items.map((item, i) => (
            <FaqItem key={i} {...item} />
          ))}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              marginTop: 16,
              paddingTop: 20,
              borderTop: "1px solid rgba(10,13,7,.08)",
            }}
          >
            <p style={{ fontSize: 15, color: "rgba(10,13,7,.6)" }}>
              Still have questions? Try it yourself — it's free.
            </p>
            <button
              className="mm-btn-blue"
              style={{ padding: "10px 24px", fontSize: 14 }}
              onClick={() => scrollTo("waitlist")}
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  // Each link has a label and an onClick action
  const linkGroups = [
    {
      title: "Website",
      links: [
        { label: "Home", action: scrollToTop },
        { label: "Join Waitlist", action: () => scrollTo("waitlist") },
      ],
    },
    {
      title: "Features",
      links: [
        { label: "AI Chat", action: () => scrollTo("features") },
        { label: "Summaries", action: () => scrollTo("features") },
        { label: "Flashcards", action: () => scrollTo("features") },
        { label: "Quizzes", action: () => scrollTo("features") },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", action: () => scrollTo("faq") },
        { label: "Pricing", action: () => scrollTo("pricing") },
      ],
    },
  ];

  return (
    <footer style={{ background: "#f5d5ff", padding: "56px 24px" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div
          className="mm-footer-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 580 }}>
            <h2
              style={{
                fontSize: 48,
                fontWeight: 500,
                letterSpacing: "-1.5px",
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              Ready to transform how you study?
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.5 }}>
              Join the waitlist and get early access plus a free month of Pro.
            </p>
          </div>
          <div
            style={{ display: "flex", gap: 12, flexShrink: 0, paddingTop: 8 }}
          >
            <button
              className="mm-btn-blue"
              style={{ padding: "10px 22px", fontSize: 14 }}
              onClick={() => scrollTo("waitlist")}
            >
              Join Waitlist
            </button>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid rgba(10,13,7,.15)" }} />

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {linkGroups.map(({ title, links }) => (
            <div
              key={title}
              style={{ flex: 1, minWidth: 120, paddingRight: 24 }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                {title}
              </p>
              {links.map(({ label, action }) => (
                <button
                  key={label}
                  type="button"
                  className="mm-footer-link"
                  onClick={action}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <hr style={{ border: 0, borderTop: "1px solid rgba(10,13,7,.15)" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <button
            type="button"
            className="mm-footer-brand"
            onClick={scrollToTop}
          >
            <MonkeyDefault size={26} /> Monkey Mentor
          </button>
          <p style={{ fontSize: 13, color: "rgba(10,13,7,.6)" }}>
            © {new Date().getFullYear()} Monkey Mentor. Built for students.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="mm">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Waitlist />
        <Demo />
        <Features />
        <ResearchStats />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
