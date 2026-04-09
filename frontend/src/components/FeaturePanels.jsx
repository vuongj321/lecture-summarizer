import { useState } from "react";
// Note: FEATURES array lives in features.js to satisfy react-refresh/only-export-components

export function ChatPanel() {
  const messages = [
    { from: "user", text: "What's the key idea from today's lecture?" },
    {
      from: "ai",
      text: "The central concept is nucleophilic substitution — when a nucleophile attacks an electrophilic carbon and displaces a leaving group. SN1 is two-step; SN2 is concerted.",
    },
    { from: "user", text: "Which one inverts stereochemistry?" },
    {
      from: "ai",
      text: "SN2 — because the nucleophile attacks from the back, flipping the molecule like an umbrella in wind.",
    },
  ];

  return (
    <div
      style={{
        background: "#eef2ff",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
      }}
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            background: msg.from === "user" ? "#fff" : "#eef2ff",
            border: "1px solid #e0e7ff",
            borderRadius:
              msg.from === "user" ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
            padding: "10px 14px",
            fontSize: 13,
            color: "#0a0d07",
            maxWidth: msg.from === "user" ? 260 : 300,
            lineHeight: 1.6,
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export function SummaryPanel() {
  const tags = ["SN1", "SN2", "Kinetics", "Stereochemistry"];

  return (
    <div
      style={{
        background: "#f0fdf4",
        borderRadius: 16,
        padding: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #d1fae5",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            color: "rgba(0,0,0,.4)",
            marginBottom: 10,
          }}
        >
          AI Summary — Organic Chemistry Lecture 4
        </p>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "#0a0d07",
            marginBottom: 14,
          }}
        >
          This lecture covers nucleophilic substitution (SN1 &amp; SN2),
          examining how substrate structure and solvent polarity affect reaction
          mechanism and rate. Key takeaway: tertiary substrates favor SN1 via
          carbocation; primary substrates favor SN2 via backside attack.
        </p>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#d1fae5",
                borderRadius: 100,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
                color: "#065f46",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FlashcardsPanel() {
  const [flipped, setFlipped] = useState(false);

  const question =
    "What is the SN2 mechanism and what stereochemical outcome does it produce?";
  const answer =
    "A concerted bimolecular mechanism where bond forming and breaking happen simultaneously, resulting in inversion of configuration (Walden inversion).";
  const ratings = ["Again", "Hard", "Good", "Easy"];
  const ratingColors = ["#fee2e2", "#fef3c7", "#d1fae5", "#dbeafe"];

  return (
    <div
      style={{
        background: "#fff7ed",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".07em",
          color: "rgba(0,0,0,.4)",
        }}
      >
        Flashcard 3 of 12
      </p>

      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          background: "#fff",
          border: "2px solid #fed7aa",
          borderRadius: 12,
          padding: "20px 18px",
          minHeight: 100,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            color: "rgba(0,0,0,.35)",
          }}
        >
          {flipped ? "Answer" : "Question"}
        </p>
        <p style={{ fontSize: 14, color: "#0a0d07", lineHeight: 1.6 }}>
          {flipped ? answer : question}
        </p>
        {!flipped && (
          <p style={{ fontSize: 11, color: "rgba(0,0,0,.35)", marginTop: 4 }}>
            Click to reveal answer
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {ratings.map((label, i) => (
          <button
            key={label}
            onClick={() => setFlipped(false)}
            style={{
              flex: 1,
              padding: "7px 4px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,.15)",
              background: ratingColors[i],
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: "#0a0d07",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuizPanel() {
  const [selected, setSelected] = useState(null);
  const options = ["SN1", "SN2", "E1", "E2"];
  const correct = 1;

  const getStyle = (i) => {
    if (selected === null)
      return { bg: "#f3e8ff", border: "1px solid #e9d5ff" };
    if (i === correct) return { bg: "#d1fae5", border: "2px solid #10b981" };
    if (i === selected) return { bg: "#fee2e2", border: "2px solid #f87171" };
    return { bg: "#f3e8ff", border: "1px solid #e9d5ff" };
  };

  return (
    <div
      style={{
        background: "#fdf4ff",
        borderRadius: 16,
        padding: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e9d5ff",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            color: "rgba(0,0,0,.4)",
            marginBottom: 10,
          }}
        >
          Question 2 of 8
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0a0d07",
            marginBottom: 14,
            lineHeight: 1.5,
          }}
        >
          Which mechanism proceeds with inversion of configuration?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {options.map((opt, i) => {
            const { bg, border } = getStyle(i);
            return (
              <div
                key={opt}
                onClick={() => setSelected(i)}
                style={{
                  background: bg,
                  border,
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{opt}</span>
                {selected !== null && i === correct && (
                  <span style={{ fontSize: 12, color: "#065f46" }}>
                    ✓ Correct
                  </span>
                )}
                {selected !== null && i === selected && i !== correct && (
                  <span style={{ fontSize: 12, color: "#991b1b" }}>✗</span>
                )}
              </div>
            );
          })}
        </div>
        {selected === null && (
          <p
            style={{
              fontSize: 11,
              color: "rgba(0,0,0,.35)",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Tap an answer
          </p>
        )}
      </div>
    </div>
  );
}

export function ProgressPanel() {
  const topics = [
    { name: "SN1 & SN2 Mechanisms", pct: 82 },
    { name: "Carbonyl Chemistry", pct: 61 },
    { name: "Stereochemistry", pct: 44 },
    { name: "Aromatic Substitution", pct: 20 },
  ];

  const barColor = (pct) => {
    if (pct > 70) return "#0284c7";
    if (pct > 45) return "#f59e0b";
    return "#f87171";
  };

  return (
    <div
      style={{
        background: "#f0f9ff",
        borderRadius: 16,
        padding: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #bae6fd",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            color: "rgba(0,0,0,.4)",
            marginBottom: 14,
          }}
        >
          Your Progress — Organic Chemistry
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {topics.map(({ name, pct }) => (
            <div key={name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#0a0d07",
                  marginBottom: 5,
                }}
              >
                <span>{name}</span>
                <span style={{ fontWeight: 600 }}>{pct}%</span>
              </div>
              <div
                style={{ background: "#e0f2fe", borderRadius: 100, height: 7 }}
              >
                <div
                  style={{
                    background: barColor(pct),
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: 100,
                    transition: "width .6s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
