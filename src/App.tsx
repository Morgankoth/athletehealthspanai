import { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, LineChart,
} from "recharts";
import { Activity, Heart, Droplet, Wind, TrendingUp, TrendingDown, ChevronRight, AlertTriangle } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   VELOCITY · Healthspan Intelligence
   Member: J.K. · Personal Digital Twin
   Real longitudinal lab data: 2006–2026 (6 blood draws)
   ───────────────────────────────────────────────────────────────────────────── */

const C = {
  ground:    "#1A1712",
  surface:   "#211E18",
  surfaceHi: "#2A2620",
  line:      "#353028",
  lineHi:    "#403A30",
  text:      "#F2EDE4",
  muted:     "#D4C9BC",
  faint:     "#A8998A",
  gold:      "#C9A84C",
  goldLo:    "#2A2310",
  sage:      "#7DB89A",
  sageLo:    "#0F1F18",
  terra:     "#C4614A",
  terraLo:   "#251510",
  amber:     "#D4893A",
  brand:     "#8BA8D4",
};

const MEMBER = {
  initials: "J.K.",
  age: 54,
  bioAge: 48,
  bioAgeDelta: -6,
  sex: "Male",
  ht: "5′11″",
  wt: "183 lb",
  memberSince: "January 2024",
  track: "Healthspan · Executive",
};

// ── Real longitudinal biomarker data 2006–2026 ───────────────────────────────
const DRAWS = [
  { date: "May 2006",  age: 33, label: "2006" },
  { date: "Feb 2007",  age: 34, label: "2007" },
  { date: "Feb 2010",  age: 37, label: "Feb '10" },
  { date: "Jun 2010",  age: 38, label: "Jun '10" },
  { date: "Dec 2014",  age: 42, label: "2014" },
  { date: "Jun 2026",  age: 54, label: "2026" },
];

// Each key maps to an array of 6 values aligned to DRAWS
const LAB_HISTORY = {
  totalChol:    [196, 224, 153, 157, 165, 216],
  ldl:          [121.9, 155, 79, 74, 92, 131],
  hdl:          [59.9, 47.2, 63, 63, 57, 69],
  trig:         [71, 109, 57, 99, 79, 72],
  glucose:      [92, 76, 89, 83, null, 91],
  tsh:          [null, null, 8.17, 4.16, 3.25, 4.40],
  // Single-draw values (Jun 2026 only shown as current)
  apob:         [null, null, null, null, null, 106],
  ldlP:         [null, null, null, null, null, 1543],
  hsCRP:        [null, null, null, null, null, 0.2],
  homocysteine: [null, null, null, null, null, 9.1],
  testosterone: [null, null, null, null, null, 651],
  freeT:        [null, null, null, null, null, 57.3],
  shbg:         [null, null, null, null, null, 69],
  lh:           [null, null, null, null, null, 1.2],
  vitaminD:     [null, null, null, null, null, 48],
  insulin:      [null, null, null, null, null, 5.5],
};

// Build chart-ready data for any marker
function buildSeries(key, refLo, refHi) {
  return DRAWS.map((d, i) => ({
    label: d.label,
    age: d.age,
    value: LAB_HISTORY[key][i],
    refLo,
    refHi,
  })).filter(d => d.value !== null);
}

// ── Domain data — accurate from Jun 2026 panel ───────────────────────────────
const DOMAINS = [
  {
    key: "Cardiovascular",
    score: 42,
    trend: "worsening",
    flag: true,
    flagLevel: "high",
    markers: [
      { label: "ApoB",              value: "106 mg/dL",   status: "high",    note: "High — optimal <90, treatment target <80" },
      { label: "Total Cholesterol", value: "216 mg/dL",   status: "high",    note: "Elevated — optimal <200" },
      { label: "LDL-C",            value: "131 mg/dL",   status: "high",    note: "Above optimal — target <100 for your risk profile" },
      { label: "LDL-P (NMR)",      value: "1543 nmol/L", status: "moderate",note: "Moderate-high — optimal <935" },
      { label: "HDL-P",            value: "29 umol/L",   status: "high",    note: "Low — optimal >32.8; raises residual risk" },
      { label: "HDL Cholesterol",  value: "69 mg/dL",    status: "optimal", note: "Excellent" },
      { label: "Triglycerides",    value: "72 mg/dL",    status: "optimal", note: "Excellent" },
      { label: "Lp(a)",            value: "33 nmol/L",   status: "optimal", note: "Optimal (<75)" },
      { label: "Non-HDL Chol",     value: "147 mg/dL",   status: "moderate",note: "Elevated — optimal <130" },
    ],
    insight: "ApoB at 106 is the most actionable lever in this panel. It is a better predictor of cardiovascular event risk than LDL-C alone, and it is elevated. The low HDL-P alongside moderate LDL-P paints a pattern of atherogenic particle burden that warrants direct intervention discussion with your physician. The excellent Lp(a) and triglycerides are meaningful protective factors.",
    chartKey: "ldl",
    chartLabel: "LDL-C mg/dL",
    chartRefLo: null,
    chartRefHi: 100,
    extraCharts: [
      { key: "totalChol", label: "Total Cholesterol mg/dL", refHi: 200 },
      { key: "hdl", label: "HDL mg/dL", refLo: 60 },
    ],
  },
  {
    key: "Metabolic",
    score: 91,
    trend: "stable",
    flag: false,
    markers: [
      { label: "A1c",     value: "5.4%",      status: "optimal", note: "Excellent — well below prediabetes threshold" },
      { label: "Glucose", value: "91 mg/dL",  status: "optimal", note: "Normal fasting glucose, consistent across 20 years" },
      { label: "Insulin", value: "5.5 uIU/mL",status: "optimal", note: "Optimal insulin sensitivity (<18.4)" },
      { label: "eGFR",    value: "97 (CysC)",  status: "optimal", note: "Excellent kidney function by Cystatin C" },
    ],
    insight: "Metabolic health is a clear strength. Insulin sensitivity in the optimal range across a 54-year-old man is rare and meaningful — it reflects directly in your biological age advantage. Fasting glucose has been remarkably stable across all six blood draws over 20 years, ranging only from 76 to 92. This consistency is worth protecting with current dietary and exercise patterns.",
    chartKey: "glucose",
    chartLabel: "Fasting Glucose mg/dL",
    chartRefLo: 65,
    chartRefHi: 99,
  },
  {
    key: "Inflammatory",
    score: 88,
    trend: "improving",
    flag: false,
    markers: [
      { label: "hs-CRP",        value: "<0.2 mg/L",   status: "optimal", note: "Excellent — optimal <1.0" },
      { label: "Homocysteine",  value: "9.1 umol/L",  status: "optimal", note: "Normal (<15.2)" },
      { label: "Lp(a)",         value: "33 nmol/L",   status: "optimal", note: "Optimal (<75)" },
    ],
    insight: "Systemic inflammation is exceptionally well controlled. An hs-CRP below 0.2 puts you in the lowest relative cardiovascular risk category by AHA/CDC criteria. Combined with normal homocysteine and optimal Lp(a), this domain is a meaningful contributor to your biological age advantage — and something worth actively protecting through sleep, training load balance, and dietary anti-inflammatory habits.",
    chartKey: "trig",
    chartLabel: "Triglycerides mg/dL",
    chartRefLo: null,
    chartRefHi: 150,
  },
  {
    key: "Hormonal",
    score: 62,
    trend: "stable",
    flag: true,
    flagLevel: "moderate",
    markers: [
      { label: "Testosterone Total", value: "651 ng/dL",  status: "optimal", note: "Upper third for age — solid" },
      { label: "Free Testosterone",  value: "57.3 pg/mL", status: "optimal", note: "Within range (35–155)" },
      { label: "SHBG",               value: "69 nmol/L",  status: "high",    note: "Elevated — ref 10–50. Binds testosterone, reducing free fraction" },
      { label: "LH",                 value: "1.2 mIU/mL", status: "high",    note: "Low (ref 1.5–9.3) — suggests secondary picture worth monitoring" },
      { label: "Cortisol A.M.",      value: "11.4 mcg/dL",status: "optimal", note: "Normal morning cortisol" },
      { label: "DHEA",               value: "159 ng/dL",  status: "optimal", note: "Normal (147–1760)" },
      { label: "IGF-1",              value: "126 ng/mL",   status: "optimal", note: "Z-score –0.2 — appropriate for age" },
    ],
    insight: "Total testosterone is in the upper third for a 54-year-old, which is a genuine strength. However, SHBG at 69 — nearly 40% above the upper reference limit — is binding a meaningful portion of that testosterone and reducing the free fraction. The flagged LH at 1.2 alongside elevated SHBG is a pattern worth a specific conversation with your physician. This is not a crisis, but it warrants monitoring and potentially intervention as SHBG tends to trend higher with age.",
    chartKey: "tsh",
    chartLabel: "TSH mIU/mL",
    chartRefLo: 0.4,
    chartRefHi: 4.5,
  },
  {
    key: "Endocrine",
    score: 82,
    trend: "stable",
    flag: false,
    markers: [
      { label: "TSH",         value: "4.40 mIU/mL",status: "moderate", note: "Within range but trending upper — history of TSH ~8 in 2010" },
      { label: "T3 Free",     value: "3.2 pg/mL",  status: "moderate", note: "Low-normal (ref 2.3–4.2)" },
      { label: "T3 Total",    value: "108 ng/dL",  status: "optimal", note: "Normal (76–181)" },
      { label: "T4 Total",    value: "6.4 mcg/dL", status: "optimal", note: "Normal (4.9–10.5)" },
      { label: "Vitamin D",   value: "48 ng/mL",   status: "optimal", note: "Optimal (30–100)" },
      { label: "Vitamin B12", value: "712 pg/mL",  status: "optimal", note: "Good (200–1100)" },
    ],
    insight: "Thyroid function has improved significantly from the 2010 peak TSH of 8.17 — treated with diet and exercise at the time, no pharmacological intervention. The current TSH of 4.40 is within range but on the upper side, and Free T3 is low-normal. Worth monitoring on your next panel given the history. Vitamin D at 48 is in an optimal position, directly supporting immune function, metabolic efficiency, and bone mineral density.",
    chartKey: "tsh",
    chartLabel: "TSH mIU/mL",
    chartRefLo: 0.4,
    chartRefHi: 4.5,
  },
];

// ── Biological age trajectory ─────────────────────────────────────────────────
const BIO_AGE_TRAJ = [
  { mo: "Jan '24", bio: 51.2, chron: 53 },
  { mo: "Apr '24", bio: 50.1, chron: 53 },
  { mo: "Jul '24", bio: 49.2, chron: 54 },
  { mo: "Oct '24", bio: 48.7, chron: 54 },
  { mo: "Jan '25", bio: 48.0, chron: 54 },
  { mo: "Apr '25", bio: 48.2, chron: 54 },
  { mo: "Jul '25", bio: null, chron: 54, forecast: 47.6 },
  { mo: "Oct '25", bio: null, chron: 54, forecast: 47.1 },
  { mo: "Jan '26", bio: null, chron: 54, forecast: 46.8 },
];

// Real HealthKit data — pulled live June/July 2026
const VITALS = {
  rhr: 54,          // today's resting HR (7d avg 55.3, 30d avg 54.1)
  hrv: 35,          // today's HRV SDNN — above 30d avg of 27.5ms (green signal)
  hrv30dAvg: 27.5,  // 30-day baseline
  hrv7dAvg: 28.2,
  vo2: 42.42,       // June 2026 — up from 39.64 in January (+2.78 improvement)
  spo2: 98,
  stepsWeekAvg: 52775,  // 4-week weekly average
  activeKcalWeek: 4889, // 4-week weekly average
  rhrPct: 90,       // 90th percentile vs men 50-59 (54 bpm resting is excellent)
  vo2Pct: 82,       // 82nd percentile — 42.42 at age 54 is well above median
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Courier+Prime:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${C.ground}; font-family: 'Inter', sans-serif;
    color: ${C.text}; min-height: 100vh; -webkit-tap-highlight-color: transparent; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 2px; }
`;

// ── Primitives ────────────────────────────────────────────────────────────────
const Label = ({ children, color = C.faint, size = 10.5 }) => (
  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: size,
                 color, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.line}`,
                borderRadius: 16, padding: "20px 20px", ...style }}>
    {children}
  </div>
);

function StatusDot({ status }) {
  const color = status === "optimal" ? C.sage : status === "moderate" ? C.amber : C.terra;
  return <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

// ── Sparkline chart for bottom sheet ─────────────────────────────────────────
function MarkerSparkline({ chartKey, chartLabel, chartRefLo, chartRefHi }) {
  const series = buildSeries(chartKey, chartRefLo, chartRefHi);
  if (series.length < 2) return null;

  const vals = series.map(d => d.value);
  const minV = Math.min(...vals) * 0.88;
  const maxV = Math.max(...vals) * 1.08;
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const delta = last.value - prev.value;
  const improving = chartRefHi ? delta < 0 : delta > 0;
  const deltaColor = improving ? C.sage : C.terra;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <Label color={C.faint} size={9}>{chartLabel} · {series.length} draws · 2006–2026</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22,
                         fontWeight: 700, color: C.text }}>{last.value}</span>
          <span style={{ fontFamily: "'Courier Prime',monospace", fontSize: 10,
                         color: deltaColor }}>
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}
          </span>
        </div>
      </div>
      <div style={{ height: 110 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 6, right: 4, bottom: 0, left: -28 }}>
            <XAxis dataKey="label"
              tick={{ fill: C.faint, fontSize: 9, fontFamily: "'Courier Prime',monospace" }}
              axisLine={false} tickLine={false} />
            <YAxis domain={[minV, maxV]}
              tick={{ fill: C.faint, fontSize: 9, fontFamily: "'Courier Prime',monospace" }}
              axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.lineHi}`,
              borderRadius: 8, fontSize: 11 }} labelStyle={{ color: C.muted }} />
            {chartRefHi && (
              <ReferenceLine y={chartRefHi} stroke={C.terra} strokeDasharray="4 3" strokeOpacity={0.5}
                label={{ value: `ref ${chartRefHi}`, fill: C.terra, fontSize: 8,
                         fontFamily: "'Courier Prime',monospace", position: "insideTopRight" }} />
            )}
            {chartRefLo && (
              <ReferenceLine y={chartRefLo} stroke={C.sage} strokeDasharray="4 3" strokeOpacity={0.5}
                label={{ value: `ref ${chartRefLo}`, fill: C.sage, fontSize: 8,
                         fontFamily: "'Courier Prime',monospace", position: "insideBottomRight" }} />
            )}
            <Line type="monotone" dataKey="value" stroke={C.gold} strokeWidth={2}
              dot={{ fill: C.gold, r: 3.5, strokeWidth: 0 }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Bottom sheet ──────────────────────────────────────────────────────────────
function DomainSheet({ domain, onClose }) {
  if (!domain) return null;
  const scoreColor = domain.score >= 80 ? C.sage : domain.score >= 65 ? C.amber : C.terra;

  return (
    <div style={{ position: "fixed", inset: 0, background: `${C.ground}F0`, zIndex: 50,
                  display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
         onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderTop: `1px solid ${C.lineHi}`,
        borderRadius: "20px 20px 0 0", padding: "24px 20px 44px",
        maxHeight: "82vh", overflowY: "auto",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 3, background: C.line, borderRadius: 99, margin: "0 auto 22px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <Label color={C.gold}>{domain.key} domain</Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 44,
                             fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
                {domain.score}th
              </span>
              <Label color={C.faint} size={9}>percentile · men 50–59</Label>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: "6px 14px", background: C.surfaceHi,
            border: `1px solid ${C.line}`, borderRadius: 99, fontSize: 13, color: C.muted }}>
            Close
          </button>
        </div>

        {/* Sparkline trend charts */}
        {domain.chartKey && (
          <div style={{ padding: "16px 16px 4px", background: C.surfaceHi,
                        border: `1px solid ${C.line}`, borderRadius: 12, marginBottom: 18 }}>
            <Label color={C.gold} size={9}>Lab trend · real longitudinal data · 2006–2026</Label>
            <div style={{ marginTop: 12 }}>
              <MarkerSparkline
                chartKey={domain.chartKey}
                chartLabel={domain.chartLabel}
                chartRefLo={domain.chartRefLo}
                chartRefHi={domain.chartRefHi}
              />
              {domain.extraCharts && domain.extraCharts.map(ec => (
                <MarkerSparkline key={ec.key}
                  chartKey={ec.key}
                  chartLabel={ec.label}
                  chartRefLo={ec.refLo || null}
                  chartRefHi={ec.refHi || null}
                />
              ))}
            </div>
          </div>
        )}

        {/* Marker list */}
        <div style={{ marginBottom: 18 }}>
          <Label color={C.faint} size={9}>Current markers · June 2026 panel</Label>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {domain.markers.map(m => {
              const mc = m.status === "optimal" ? C.sage : m.status === "moderate" ? C.amber : C.terra;
              return (
                <div key={m.label} style={{ padding: "10px 14px", background: C.surfaceHi,
                  border: `1px solid ${m.status === "high" ? C.terra + "44" : C.line}`,
                  borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StatusDot status={m.status} />
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13,
                                     fontWeight: 500, color: C.text }}>{m.label}</span>
                    </div>
                    <span style={{ fontFamily: "'Courier Prime',monospace", fontSize: 12,
                                   color: mc, fontWeight: 700 }}>{m.value}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.faint, lineHeight: 1.45,
                                paddingLeft: 15 }}>{m.note}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flag */}
        {domain.flag && (
          <div style={{ padding: "12px 14px", background: `${C.terra}10`,
                        border: `1px solid ${C.terra}40`, borderRadius: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <AlertTriangle size={13} color={C.terra} />
              <Label color={C.terra} size={9}>
                {domain.flagLevel === "high" ? "Priority flag" : "Monitor flag"} · {domain.key}
              </Label>
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              {domain.flagLevel === "high"
                ? "One or more markers in this domain are outside optimal range and warrant direct clinical discussion at your next visit."
                : "This domain contains markers worth monitoring at your next panel — not urgent, but worth tracking directionally."}
            </div>
          </div>
        )}

        {/* Insight */}
        <div style={{ padding: "14px 16px", background: `${C.gold}08`,
                      border: `1px solid ${C.gold}22`, borderRadius: 12 }}>
          <Label color={C.gold} size={9}>Engine insight</Label>
          <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginTop: 8 }}>
            {domain.insight}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DEXA Section ──────────────────────────────────────────────────────────────
function DEXASection({ onExpand }) {
  const scans = [
    { date: "Jul 8 '25",  bf: 22.4, fm: 41.1, lm: 142.2, ag: 1.01 },
    { date: "Nov 9 '25",  bf: 20.8, fm: 36.6, lm: 139.9, ag: 0.91 },
  ];
  const curr = scans[1], prev = scans[0];

  const tiles = [
    { l: "Body fat",  v: curr.bf, u: "%",  d: (curr.bf - prev.bf).toFixed(1), good: true },
    { l: "Fat mass",  v: curr.fm, u: "lb", d: (curr.fm - prev.fm).toFixed(1), good: true },
    { l: "Lean mass", v: curr.lm, u: "lb", d: (curr.lm - prev.lm).toFixed(1), good: false,
      flag: "Lean mass −2.3 lb between scans. Monitor protein intake and resistance volume." },
    { l: "A/G ratio", v: curr.ag, u: "",   d: (curr.ag - prev.ag).toFixed(2), good: true },
  ];

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Label color={C.gold}>Body composition · GE Lunar iDXA</Label>
        <div style={{ padding: "3px 9px", background: `${C.gold}10`,
                      border: `1px solid ${C.gold}44`, borderRadius: 4 }}>
          <Label color={C.gold} size={9}>2 scans</Label>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
        {prev.date} → {curr.date} · 4.5 lb fat lost · A/G improved {prev.ag} → {curr.ag} · Bone mineral 6.9 lb
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
        {tiles.map(t => {
          const dc = t.good ? C.sage : t.flag ? C.amber : C.terra;
          return (
            <div key={t.l} style={{ background: C.surfaceHi, border: `1px solid ${C.line}`,
                                    borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <Label color={C.muted} size={10}>{t.l}</Label>
                <Label color={dc} size={9}>{parseFloat(t.d) > 0 ? "+" : ""}{t.d}</Label>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22,
                            fontWeight: 700, color: C.text, lineHeight: 1 }}>
                {t.v}<span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10,
                                    color: C.faint, marginLeft: 3 }}>{t.u}</span>
              </div>
            </div>
          );
        })}
      </div>
      {tiles.filter(t => t.flag).map(t => (
        <div key={t.l} style={{ padding: "10px 13px", background: `${C.amber}10`,
                                border: `1px solid ${C.amber}40`, borderRadius: 10 }}>
          <Label color={C.amber} size={9}>Lean mass note</Label>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>{t.flag}</div>
        </div>
      ))}
    </Card>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [expandedDomain, setExpandedDomain] = useState(null);
  const domain = DOMAINS.find(d => d.key === expandedDomain);

  const READINESS_TRAJ = [
    { d:"Apr 25",actual:78 },{ d:"May 2",actual:81 },{ d:"May 9",actual:76 },
    { d:"May 16",actual:82 },{ d:"May 23",actual:79 },{ d:"May 30",actual:84 },
    { d:"Jun 6",actual:80 },{ d:"Jun 13",actual:83 },{ d:"Jun 20",actual:81 },
    { d:"Jun 27",actual:84 },
    { d:"Jul 4",actual:null,forecast:85,bandLow:79,bandRange:12 },
    { d:"Jul 11",actual:null,forecast:86,bandLow:80,bandRange:12 },
    { d:"Jul 18",actual:null,forecast:87,bandLow:81,bandRange:12 },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: C.ground }}>
        <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 52 }}>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div style={{ padding: "40px 20px 28px",
                        background: `linear-gradient(180deg, ${C.goldLo} 0%, ${C.ground} 100%)`,
                        borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20,
                                 fontWeight: 700, color: C.text }}>Velocity</span>
                  <Label color={C.gold} size={9}>Healthspan</Label>
                </div>
                <Label color={C.faint} size={9}>Digital Twin · Member Dashboard</Label>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 10,
                            background: `${C.gold}22`, border: `1px solid ${C.gold}44`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Playfair Display',serif", fontSize: 13,
                            fontWeight: 700, color: C.gold }}>
                {MEMBER.initials}
              </div>
            </div>

            {/* Biological age hero */}
            <div style={{ marginBottom: 22 }}>
              <Label color={C.gold} size={9}>Biological age · modeled</Label>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 10 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 88,
                               fontWeight: 700, lineHeight: 1, color: C.text,
                               letterSpacing: "-.04em" }}>
                  {MEMBER.bioAge}
                </span>
                <div style={{ paddingBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <TrendingDown size={16} color={C.sage} />
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 19,
                                   fontWeight: 600, color: C.sage }}>
                      {MEMBER.bioAgeDelta * -1} years younger
                    </span>
                  </div>
                  <Label color={C.faint} size={9}>Chronological age {MEMBER.age}</Label>
                </div>
              </div>
            </div>

            {/* Meta strip */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {[
                [MEMBER.initials, C.muted, 500],
                [`${MEMBER.ht} · ${MEMBER.wt}`, C.faint, 400],
                [MEMBER.track, C.gold, 500],
                [`Member since ${MEMBER.memberSince}`, C.faint, 400],
              ].map(([t, c, w], i) => (
                <span key={i} style={{ fontSize: 12.5, color: c, fontWeight: w }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>

            {/* ── Readiness ──────────────────────────────────────────────── */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <Label color={C.gold}>Today's readiness</Label>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 52,
                                   fontWeight: 700, color: C.sage, lineHeight: 1 }}>88</span>
                    <span style={{ fontSize: 13, color: C.muted }}>/100</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13.5, color: C.muted, lineHeight: 1.55 }}>
                    HRV at 35ms is well above your 30-day baseline of 27.5ms — a strong autonomic recovery signal. VO2 max has improved 2.8 points since January. RHR slightly elevated vs last week but within normal variance.
                  </div>
                </div>
                <div style={{ padding: "6px 12px", background: `${C.sage}14`,
                              border: `1px solid ${C.sage}44`, borderRadius: 99 }}>
                  <Label color={C.sage} size={9}>On track</Label>
                </div>
              </div>
              <Label color={C.faint} size={9}>21-day readiness trajectory</Label>
              <div style={{ height: 130, marginTop: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={READINESS_TRAJ} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                    <XAxis dataKey="d" interval={2}
                      tick={{ fill: C.faint, fontSize: 9, fontFamily: "'Courier Prime',monospace" }}
                      axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]}
                      tick={{ fill: C.faint, fontSize: 9, fontFamily: "'Courier Prime',monospace" }}
                      axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.lineHi}`,
                      borderRadius: 8, fontSize: 11 }} labelStyle={{ color: C.muted }} />
                    <Area type="monotone" dataKey="bandLow" stackId="b" stroke="none" fill="transparent" />
                    <Area type="monotone" dataKey="bandRange" stackId="b" stroke="none" fill={`${C.sage}14`} />
                    <Line type="monotone" dataKey="actual" stroke={C.brand} strokeWidth={2}
                      dot={{ fill: C.brand, r: 2.5 }} connectNulls={false} />
                    <Line type="monotone" dataKey="forecast" stroke={C.sage} strokeWidth={2}
                      strokeDasharray="4 3" dot={false} connectNulls={false} />
                    <ReferenceLine x="Jul 4" stroke={C.lineHi} strokeDasharray="3 3"
                      label={{ value: "Today", fill: C.faint, fontSize: 9,
                               fontFamily: "'Courier Prime',monospace", position: "insideTopRight" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* ── Bio Age Chart ───────────────────────────────────────────── */}
            <Card>
              <Label color={C.gold}>Biological age · modeled trajectory</Label>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, marginBottom: 14, lineHeight: 1.55 }}>
                Biological age declined 3.2 years since tracking began. Current trajectory projects continued improvement.
              </div>
              <div style={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={BIO_AGE_TRAJ} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                    <XAxis dataKey="mo" interval={2}
                      tick={{ fill: C.faint, fontSize: 9, fontFamily: "'Courier Prime',monospace" }}
                      axisLine={false} tickLine={false} />
                    <YAxis domain={[44, 56]}
                      tick={{ fill: C.faint, fontSize: 9, fontFamily: "'Courier Prime',monospace" }}
                      axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.lineHi}`,
                      borderRadius: 8, fontSize: 11 }} labelStyle={{ color: C.muted }} />
                    <Line type="monotone" dataKey="chron" stroke={C.line} strokeWidth={1.5}
                      strokeDasharray="4 3" dot={false} connectNulls={true} />
                    <Line type="monotone" dataKey="bio" stroke={C.gold} strokeWidth={2.5}
                      dot={{ fill: C.gold, r: 3 }} connectNulls={false} />
                    <Line type="monotone" dataKey="forecast" stroke={C.sage} strokeWidth={2}
                      strokeDasharray="4 3" dot={false} connectNulls={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                {[
                  { color: C.gold, label: "Biological age" },
                  { color: C.sage, label: "Projected" },
                  { color: C.lineHi, label: "Chronological" },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 16, height: 2, background: color, borderRadius: 1 }} />
                    <Label color={C.faint} size={9}>{label}</Label>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Wearable trend — real HealthKit data ────────────────── */}
            <Card>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <Label color={C.gold}>Wearable trends · Apple HealthKit · 13 weeks</Label>
                <div style={{ padding:"3px 9px", background:`${C.sage}10`,
                              border:`1px solid ${C.sage}44`, borderRadius:4 }}>
                  <Label color={C.sage} size={9}>Live data</Label>
                </div>
              </div>
              {(() => {
                const wData = [{"d": "Apr 4", "rhr": 52.7, "hrv": 28.7}, {"d": "Apr 11", "rhr": 54.7, "hrv": 30.1}, {"d": "Apr 18", "rhr": 52.7, "hrv": 29.2}, {"d": "Apr 25", "rhr": 53.6, "hrv": 28.6}, {"d": "May 2", "rhr": 55.3, "hrv": 30.0}, {"d": "May 9", "rhr": 54.9, "hrv": 32.4}, {"d": "May 16", "rhr": 54.3, "hrv": 30.6}, {"d": "May 23", "rhr": 54.4, "hrv": 29.8}, {"d": "May 30", "rhr": 53.6, "hrv": 31.3}, {"d": "Jun 6", "rhr": 53.3, "hrv": 25.7}, {"d": "Jun 13", "rhr": 52.3, "hrv": 26.3}, {"d": "Jun 20", "rhr": 54.7, "hrv": 27.0}, {"d": "Jun 27", "rhr": 55.0, "hrv": 28.5}];
                return (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <Label color={C.faint} size={9}>Resting HR · 7d avg {VITALS.rhr7dAvg || VITALS.rhr} bpm · 30d avg {VITALS.rhr} bpm</Label>
                    </div>
                    <div style={{ height:90, marginBottom:14 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={wData} margin={{top:4,right:4,bottom:0,left:-28}}>
                          <XAxis dataKey="d" interval={3}
                            tick={{fill:C.faint,fontSize:8,fontFamily:"'Courier Prime',monospace"}}
                            axisLine={false} tickLine={false}/>
                          <YAxis domain={[48,60]}
                            tick={{fill:C.faint,fontSize:8,fontFamily:"'Courier Prime',monospace"}}
                            axisLine={false} tickLine={false}/>
                          <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.lineHi}`,borderRadius:6,fontSize:10}} labelStyle={{color:C.muted}}/>
                          <ReferenceLine y={54} stroke={C.faint} strokeDasharray="3 3" strokeOpacity={0.4}/>
                          <Line type="monotone" dataKey="rhr" stroke={C.terra} strokeWidth={2}
                            dot={{fill:C.terra,r:2,strokeWidth:0}} connectNulls={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <Label color={C.faint} size={9}>HRV SDNN · today {VITALS.hrv}ms · 30d avg {VITALS.hrv30dAvg}ms</Label>
                      <Label color={VITALS.hrv > VITALS.hrv30dAvg ? C.sage : C.amber} size={9}>
                        {VITALS.hrv > VITALS.hrv30dAvg ? "above baseline" : "below baseline"}
                      </Label>
                    </div>
                    <div style={{ height:90 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={wData} margin={{top:4,right:4,bottom:0,left:-28}}>
                          <XAxis dataKey="d" interval={3}
                            tick={{fill:C.faint,fontSize:8,fontFamily:"'Courier Prime',monospace"}}
                            axisLine={false} tickLine={false}/>
                          <YAxis domain={[22,36]}
                            tick={{fill:C.faint,fontSize:8,fontFamily:"'Courier Prime',monospace"}}
                            axisLine={false} tickLine={false}/>
                          <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.lineHi}`,borderRadius:6,fontSize:10}} labelStyle={{color:C.muted}}/>
                          <ReferenceLine y={VITALS.hrv30dAvg} stroke={C.faint} strokeDasharray="3 3" strokeOpacity={0.4}/>
                          <Line type="monotone" dataKey="hrv" stroke={C.brand} strokeWidth={2}
                            dot={{fill:C.brand,r:2,strokeWidth:0}} connectNulls={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop:10, display:"flex", gap:14, flexWrap:"wrap" }}>
                      <div>
                        <Label color={C.faint} size={9}>VO2 Max · Jun 2026</Label>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.sage,marginTop:3}}>
                          {VITALS.vo2} <span style={{fontSize:10,fontFamily:"'Inter',sans-serif",color:C.faint,fontWeight:400}}>ml/kg/min</span>
                        </div>
                        <Label color={C.sage} size={8.5}>+2.8 since January · {VITALS.vo2Pct}th pct</Label>
                      </div>
                      <div>
                        <Label color={C.faint} size={9}>Weekly steps · 4wk avg</Label>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.text,marginTop:3}}>
                          {VITALS.stepsWeekAvg.toLocaleString()}
                        </div>
                        <Label color={C.faint} size={8.5}>~{Math.round(VITALS.stepsWeekAvg/7).toLocaleString()} / day</Label>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>

            {/* ── Vitals ──────────────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Resting HR", value: VITALS.rhr, unit: "bpm", pct: VITALS.rhrPct,
                  icon: <Heart size={13} color={C.terra} />, color: C.terra },
                { label: "HRV",        value: VITALS.hrv, unit: "ms",  pct: 72,
                  icon: <Activity size={13} color={C.brand} />, color: C.brand },
                { label: "VO₂ Max",    value: VITALS.vo2, unit: "ml/kg/min", pct: VITALS.vo2Pct,
                  icon: <Wind size={13} color={C.sage} />, color: C.sage },
                { label: "SpO₂",       value: VITALS.spo2, unit: "%", pct: 97,
                  icon: <Droplet size={13} color={C.brand} />, color: C.brand },
              ].map(v => (
                <Card key={v.label} style={{ padding: "15px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Label color={C.muted} size={10}>{v.label}</Label>
                    {v.icon}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28,
                                fontWeight: 700, color: C.text, lineHeight: 1, marginBottom: 6 }}>
                    {v.value}<span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10,
                                           color: C.faint, marginLeft: 3 }}>{v.unit}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 13,
                                   fontWeight: 600, color: v.color }}>{v.pct}th</span>
                    <Label color={C.faint} size={8.5}>vs men 50–59</Label>
                  </div>
                </Card>
              ))}
            </div>

            {/* ── DEXA ────────────────────────────────────────────────────── */}
            <DEXASection />

            {/* ── Biomarker Domains — tappable ────────────────────────────── */}
            <Card>
              <Label color={C.gold}>Biomarker domains · tap to explore trends</Label>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, marginBottom: 16, lineHeight: 1.5 }}>
                Tap any domain to see the 20-year lab trend chart, individual markers, and engine insight.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {DOMAINS.map(d => {
                  const color = d.score >= 80 ? C.sage : d.score >= 65 ? C.amber : C.terra;
                  return (
                    <button key={d.key} onClick={() => setExpandedDomain(d.key)} style={{
                      textAlign: "left", background: "transparent", padding: 0, width: "100%",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between",
                                    alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {d.flag && <div style={{ width: 6, height: 6, borderRadius: "50%",
                                                   background: d.flagLevel === "high" ? C.terra : C.amber }} />}
                          <Label color={C.muted}>{d.key}</Label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Label color={d.trend === "improving" ? C.sage :
                                         d.trend === "worsening" ? C.terra : C.faint} size={9}>
                            {d.trend}
                          </Label>
                          <Label color={color}>{d.score}th</Label>
                          <ChevronRight size={13} color={C.faint} />
                        </div>
                      </div>
                      <div style={{ background: C.surfaceHi, borderRadius: 2, height: 5 }}>
                        <div style={{ width: `${d.score}%`, background: color, borderRadius: 2,
                                      height: 5, transition: "width .6s ease" }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ApoB priority flag */}
              <div style={{ marginTop: 18, padding: "14px 15px", background: `${C.terra}10`,
                            border: `1px solid ${C.terra}40`, borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                  <AlertTriangle size={13} color={C.terra} />
                  <Label color={C.terra} size={9}>Priority flag · Cardiovascular · ApoB</Label>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 6 }}>
                  ApoB at 106 is the highest-impact lever for your decade outlook.
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
                  This is detectable years before it becomes a diagnosis. Tap Cardiovascular above to see the 20-year cholesterol trend and full marker breakdown.
                </div>
              </div>
            </Card>

            {/* ── Ownership ───────────────────────────────────────────────── */}
            <Card style={{ background: C.goldLo, border: `1px solid ${C.gold}22` }}>
              <Label color={C.gold}>Your Twin · you control access</Label>
              <div style={{ fontSize: 13.5, color: C.muted, marginTop: 8, marginBottom: 16, lineHeight: 1.55 }}>
                This physiological model belongs to you. Velocity holds no rights to share, use, or publish your data without explicit consent.
              </div>
              {[
                { label: "My physician · shared",    on: true },
                { label: "Care team · on request",   on: false },
                { label: "Public · private",          on: false },
              ].map(({ label, on }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", marginBottom: 7,
                  background: on ? `${C.sage}10` : C.surfaceHi,
                  border: `1px solid ${on ? C.sage + "44" : C.line}`, borderRadius: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%",
                                background: on ? C.sage : C.faint, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: on ? C.sage : C.muted }}>{label}</span>
                </div>
              ))}
            </Card>

            <div style={{ textAlign: "center", paddingTop: 6 }}>
              <Label color={C.faint} size={8.5}>Velocity Health · Personal Digital Twin · J.K.</Label>
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        {expandedDomain && (
          <DomainSheet domain={domain} onClose={() => setExpandedDomain(null)} />
        )}
      </div>
    </>
  );
}