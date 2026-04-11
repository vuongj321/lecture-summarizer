// MonkeyMascot.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Original-style monkey mascot — 6 variants, all pure SVG React components.
//
// Usage:
//   import { MonkeyDefault, MonkeyWaving, MonkeyExcited,
//            MonkeyThinking, MonkeyReading, MonkeySleeping } from "./MonkeyMascot";
//
//   <MonkeyWaving size={200} />
//
// Every component accepts:
//   size  — number (default 120), controls width
//   style — optional inline styles on the outer <svg>
//
// Placement guide:
//   MonkeyDefault   → navbar logo, small branding spots
//   MonkeyWaving    → landing page hero, onboarding welcome screen
//   MonkeyExcited   → waitlist success, quiz complete, achievement unlocked
//   MonkeyThinking  → AI processing / loading states
//   MonkeyReading   → summaries page, documents list
//   MonkeySleeping  → empty states (no uploads yet, no flashcards created)
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  brown:      "#7B4F2E",
  brownDark:  "#5C3418",
  brownLight: "#A0693A",
  face:       "#F2C28A",
  faceDark:   "#E0A870",
  white:      "#FFFFFF",
  eyeWhite:   "#F8F4F0",
  pupil:      "#2A1A0E",
  shine:      "#FFFFFF",
  blush:      "#F4A0A0",
  nose:       "#5C3418",
  mouth:      "#5C3418",
  ear:        "#A0693A",
  earInner:   "#F2C28A",
  capBlue:    "#0043ff",
  capBrim:    "#0035CC",
  tassel:     "#FFD700",
  book:       "#0043ff",
  bookPage:   "#F8F4EE",
  bookLine:   "#C8C0B8",
  zzz:        "#94A3B8",
  star:       "#FFD700",
};

// ── Shared base parts ─────────────────────────────────────────────────────────

function Head({ cx = 100, cy = 108 }) {
  return (
    <>
      <ellipse cx={cx - 52} cy={cy - 2} rx={18} ry={20} fill={C.ear} />
      <ellipse cx={cx - 52} cy={cy - 2} rx={11} ry={13} fill={C.earInner} />
      <ellipse cx={cx + 52} cy={cy - 2} rx={18} ry={20} fill={C.ear} />
      <ellipse cx={cx + 52} cy={cy - 2} rx={11} ry={13} fill={C.earInner} />
      <circle cx={cx} cy={cy} r={58} fill={C.brown} />
      <ellipse cx={cx - 14} cy={cy - 22} rx={20} ry={16} fill={C.brownLight} opacity={0.4} />
      <ellipse cx={cx} cy={cy + 10} rx={40} ry={38} fill={C.face} />
      <ellipse cx={cx} cy={cy + 22} rx={32} ry={18} fill={C.faceDark} opacity={0.25} />
    </>
  );
}

function EyesOpen({ cx = 100, cy = 108 }) {
  return (
    <>
      <ellipse cx={cx - 17} cy={cy - 4} rx={13} ry={14} fill={C.eyeWhite} />
      <circle  cx={cx - 16} cy={cy - 3} r={8}   fill={C.pupil} />
      <circle  cx={cx - 13} cy={cy - 7} r={3}   fill={C.shine} />
      <ellipse cx={cx + 17} cy={cy - 4} rx={13} ry={14} fill={C.eyeWhite} />
      <circle  cx={cx + 18} cy={cy - 3} r={8}   fill={C.pupil} />
      <circle  cx={cx + 21} cy={cy - 7} r={3}   fill={C.shine} />
      <ellipse cx={cx - 28} cy={cy + 8} rx={9}  ry={6}  fill={C.blush} opacity={0.5} />
      <ellipse cx={cx + 28} cy={cy + 8} rx={9}  ry={6}  fill={C.blush} opacity={0.5} />
    </>
  );
}

function EyesBig({ cx = 100, cy = 108 }) {
  return (
    <>
      <ellipse cx={cx - 17} cy={cy - 6} rx={15} ry={17} fill={C.eyeWhite} />
      <circle  cx={cx - 16} cy={cy - 5} r={10}  fill={C.pupil} />
      <circle  cx={cx - 12} cy={cy - 10} r={4}  fill={C.shine} />
      <ellipse cx={cx + 17} cy={cy - 6} rx={15} ry={17} fill={C.eyeWhite} />
      <circle  cx={cx + 18} cy={cy - 5} r={10}  fill={C.pupil} />
      <circle  cx={cx + 22} cy={cy - 10} r={4}  fill={C.shine} />
      <ellipse cx={cx - 30} cy={cy + 10} rx={10} ry={7} fill={C.blush} opacity={0.6} />
      <ellipse cx={cx + 30} cy={cy + 10} rx={10} ry={7} fill={C.blush} opacity={0.6} />
    </>
  );
}

function EyesSleepy({ cx = 100, cy = 108 }) {
  return (
    <>
      <ellipse cx={cx - 17} cy={cy - 2} rx={13} ry={8} fill={C.eyeWhite} />
      <ellipse cx={cx - 17} cy={cy - 2} rx={13} ry={8} fill={C.brown} opacity={0.5} />
      <ellipse cx={cx + 17} cy={cy - 2} rx={13} ry={8} fill={C.eyeWhite} />
      <ellipse cx={cx + 17} cy={cy - 2} rx={13} ry={8} fill={C.brown} opacity={0.5} />
    </>
  );
}

function EyesThinking({ cx = 100, cy = 108 }) {
  return (
    <>
      <ellipse cx={cx - 17} cy={cy - 4} rx={13} ry={14} fill={C.eyeWhite} />
      <circle  cx={cx - 16} cy={cy - 2} r={8}   fill={C.pupil} />
      <circle  cx={cx - 13} cy={cy - 6} r={3}   fill={C.shine} />
      <ellipse cx={cx + 17} cy={cy - 4} rx={13} ry={14} fill={C.eyeWhite} />
      <circle  cx={cx + 20} cy={cy - 8} r={8}   fill={C.pupil} />
      <circle  cx={cx + 24} cy={cy - 12} r={3}  fill={C.shine} />
      <path d={`M${cx + 6},${cy - 22} Q${cx + 17},${cy - 28} ${cx + 28},${cy - 24}`}
            stroke={C.brownDark} strokeWidth={3} fill="none" strokeLinecap="round" />
      <ellipse cx={cx - 28} cy={cy + 8} rx={9} ry={6} fill={C.blush} opacity={0.4} />
      <ellipse cx={cx + 28} cy={cy + 8} rx={9} ry={6} fill={C.blush} opacity={0.4} />
    </>
  );
}

function Nose({ cx = 100, cy = 108 }) {
  return <ellipse cx={cx} cy={cy + 14} rx={8} ry={6} fill={C.nose} opacity={0.7} />;
}

function MouthSmile({ cx = 100, cy = 108 }) {
  return (
    <path d={`M${cx - 18},${cy + 24} Q${cx},${cy + 40} ${cx + 18},${cy + 24}`}
          stroke={C.mouth} strokeWidth={3.5} fill="none" strokeLinecap="round" />
  );
}

function MouthOpen({ cx = 100, cy = 108 }) {
  return (
    <>
      <path d={`M${cx - 20},${cy + 22} Q${cx},${cy + 44} ${cx + 20},${cy + 22}`}
            stroke={C.mouth} strokeWidth={3} fill={C.mouth} />
      <path d={`M${cx - 20},${cy + 22} Q${cx},${cy + 30} ${cx + 20},${cy + 22}`}
            fill={C.white} />
    </>
  );
}

function MouthSmall({ cx = 100, cy = 108 }) {
  return (
    <path d={`M${cx - 12},${cy + 24} Q${cx},${cy + 34} ${cx + 12},${cy + 24}`}
          stroke={C.mouth} strokeWidth={3} fill="none" strokeLinecap="round" />
  );
}

function MouthSleep({ cx = 100, cy = 108 }) {
  return (
    <path d={`M${cx - 8},${cy + 26} Q${cx},${cy + 32} ${cx + 8},${cy + 26}`}
          stroke={C.mouth} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  );
}

function GradCap({ cx = 100, topY = 52 }) {
  return (
    <>
      <rect x={cx - 38} y={topY}       width={76} height={12} rx={3} fill={C.capBlue} />
      <rect x={cx - 22} y={topY - 24}  width={44} height={28} rx={4} fill={C.capBlue} />
      <rect x={cx - 38} y={topY + 6}   width={76} height={6}  rx={3} fill={C.capBrim} opacity={0.5} />
      <line x1={cx + 32} y1={topY + 6} x2={cx + 38} y2={topY + 30} stroke={C.tassel} strokeWidth={2.5} />
      <circle cx={cx + 38} cy={topY + 34} r={5} fill={C.tassel} />
    </>
  );
}

// ── Exported variants ─────────────────────────────────────────────────────────

export function MonkeyDefault({ size = 120, style = {} }) {
  // viewBox cropped tightly around the head so it fills the frame at any size
  const cx = 100, cy = 105;
  return (
    <svg width={size} height={size} viewBox="28 34 144 152"
         fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: "middle", ...style }}>
      <Head cx={cx} cy={cy} />
      <EyesOpen cx={cx} cy={cy} />
      <Nose cx={cx} cy={cy} />
      <MouthSmile cx={cx} cy={cy} />
    </svg>
  );
}

export function MonkeyWaving({ size = 120, style = {} }) {
  const cx = 100, cy = 118;
  return (
    <svg width={size} height={size} viewBox="0 0 200 220"
         fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M148,148 Q172,120 184,96 Q190,82 178,76 Q166,70 158,84 Q152,96 148,110"
            fill={C.brown} stroke={C.brownDark} strokeWidth={1.5} />
      <circle cx={180} cy={74} r={14} fill={C.face} />
      <Head cx={cx} cy={cy} />
      <GradCap cx={cx} topY={62} />
      <EyesBig cx={cx} cy={cy} />
      <Nose cx={cx} cy={cy} />
      <MouthOpen cx={cx} cy={cy} />
    </svg>
  );
}

export function MonkeyExcited({ size = 120, style = {} }) {
  const cx = 100, cy = 118;
  return (
    <svg width={size} height={size} viewBox="0 0 200 220"
         fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M52,148 Q30,118 24,90 Q20,74 34,70 Q48,66 54,82 Q60,96 60,115"
            fill={C.brown} stroke={C.brownDark} strokeWidth={1.5} />
      <circle cx={22} cy={68} r={13} fill={C.face} />
      <path d="M148,148 Q170,118 176,90 Q180,74 166,70 Q152,66 146,82 Q140,96 140,115"
            fill={C.brown} stroke={C.brownDark} strokeWidth={1.5} />
      <circle cx={178} cy={68} r={13} fill={C.face} />
      <text x={18}  y={46} fontSize={18} fill={C.star}>★</text>
      <text x={162} y={46} fontSize={14} fill={C.star}>★</text>
      <text x={88}  y={22} fontSize={12} fill={C.star}>★</text>
      <Head cx={cx} cy={cy} />
      <EyesBig cx={cx} cy={cy} />
      <Nose cx={cx} cy={cy} />
      <MouthOpen cx={cx} cy={cy} />
    </svg>
  );
}

export function MonkeyThinking({ size = 120, style = {} }) {
  const cx = 100, cy = 118;
  return (
    <svg width={size} height={size} viewBox="0 0 200 220"
         fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M60,185 Q44,170 46,150 Q48,130 62,122 Q72,116 78,128 Q84,140 80,155 Q78,165 82,175"
            fill={C.brown} stroke={C.brownDark} strokeWidth={1.5} />
      <ellipse cx={84} cy={180} rx={16} ry={12} fill={C.face} />
      <circle cx={158} cy={60}  r={18} fill="#EEF2FF" stroke="#C7D2FE" strokeWidth={1.5} />
      <circle cx={148} cy={86}  r={10} fill="#EEF2FF" stroke="#C7D2FE" strokeWidth={1.5} />
      <circle cx={140} cy={102} r={6}  fill="#EEF2FF" stroke="#C7D2FE" strokeWidth={1.5} />
      <text x={145} y={66} fontSize={18} textAnchor="middle">💡</text>
      <Head cx={cx} cy={cy} />
      <EyesThinking cx={cx} cy={cy} />
      <Nose cx={cx} cy={cy} />
      <MouthSmall cx={cx} cy={cy} />
    </svg>
  );
}

export function MonkeyReading({ size = 120, style = {} }) {
  const cx = 100, cy = 108;
  return (
    <svg width={size} height={size} viewBox="0 0 200 220"
         fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M56,165 Q40,158 38,178 Q36,196 56,198 Q76,200 100,198"
            fill={C.brown} stroke={C.brownDark} strokeWidth={1.5} />
      <path d="M144,165 Q160,158 162,178 Q164,196 144,198 Q124,200 100,198"
            fill={C.brown} stroke={C.brownDark} strokeWidth={1.5} />
      <path d="M38,176 Q38,162 100,160 L100,200 Q38,200 38,188 Z"
            fill={C.bookPage} stroke={C.book} strokeWidth={2} />
      <path d="M162,176 Q162,162 100,160 L100,200 Q162,200 162,188 Z"
            fill={C.bookPage} stroke={C.book} strokeWidth={2} />
      <line x1={100} y1={160} x2={100} y2={200} stroke={C.book} strokeWidth={2.5} />
      {[168, 176, 184, 192].map(y => (
        <g key={y}>
          <line x1={50}  y1={y} x2={90}  y2={y} stroke={C.bookLine} strokeWidth={1.5} />
          <line x1={110} y1={y} x2={150} y2={y} stroke={C.bookLine} strokeWidth={1.5} />
        </g>
      ))}
      <Head cx={cx} cy={cy} />
      <EyesOpen cx={cx} cy={cy} />
      <Nose cx={cx} cy={cy} />
      <MouthSmile cx={cx} cy={cy} />
    </svg>
  );
}

export function MonkeySleeping({ size = 120, style = {} }) {
  const cx = 100, cy = 118;
  return (
    <svg width={size} height={size} viewBox="0 0 200 220"
         fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <ellipse cx={100} cy={192} rx={52} ry={18} fill={C.brownLight} opacity={0.5} />
      <Head cx={cx} cy={cy} />
      <EyesSleepy cx={cx} cy={cy} />
      <Nose cx={cx} cy={cy} />
      <MouthSleep cx={cx} cy={cy} />
      <text x={140} y={96} fontSize={14} fill={C.zzz} fontWeight="700">z</text>
      <text x={152} y={78} fontSize={18} fill={C.zzz} fontWeight="700">z</text>
      <text x={166} y={58} fontSize={22} fill={C.zzz} fontWeight="700">Z</text>
    </svg>
  );
}

// ── Dev preview ───────────────────────────────────────────────────────────────
export function MonkeyPreview() {
  const variants = [
    { label: "Default",  note: "Nav / branding",          Comp: MonkeyDefault  },
    { label: "Waving",   note: "Hero / welcome",          Comp: MonkeyWaving   },
    { label: "Excited",  note: "Success / achievement",   Comp: MonkeyExcited  },
    { label: "Thinking", note: "Loading / AI processing", Comp: MonkeyThinking },
    { label: "Reading",  note: "Summaries / documents",   Comp: MonkeyReading  },
    { label: "Sleeping", note: "Empty states",            Comp: MonkeySleeping },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 40,
                  background: "#f9f9fb", fontFamily: "Inter, sans-serif" }}>
      {variants.map(({ label, note, Comp }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column",
                                  alignItems: "center", gap: 8 }}>
          <Comp size={130} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0d07" }}>{label}</span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>{note}</span>
        </div>
      ))}
    </div>
  );
}