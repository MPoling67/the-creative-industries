// HeroBanner.jsx — Creative Industries Scorecard
export default function HeroBanner() {
  return (
    <>
      {/* Top bar */}
      <div style={{
        background: "#111110",
        padding: "7px clamp(16px,4vw,2rem)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
      }}>
        Data on Tap · dataontap.dev
      </div>

      {/* Hero */}
      <div style={{
        background: "#111110",
        padding: "2.25rem clamp(16px,4vw,2rem) 2rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
      }}>
        {/* DOT logo */}
        <div style={{ flexShrink: 0 }}>
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
            <rect x="0"  y="0"  width="24" height="24" fill="#861442"/>
            <rect x="30" y="0"  width="24" height="24" fill="#ffffff" opacity="0.6"/>
            <rect x="0"  y="30" width="24" height="24" fill="#ffffff" opacity="0.25"/>
            <rect x="30" y="30" width="24" height="24" fill="#861442" opacity="0.25"/>
          </svg>
        </div>

        {/* Title + description */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(22px,5vw,32px)",
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            <strong style={{ fontWeight: 700, color: "#f0ede8" }}>Creative Industries</strong>{" "}
            <em style={{ fontWeight: 300, fontStyle: "italic", color: "#be3650" }}>Scorecard</em>
          </div>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: "#c8c4bc",
            lineHeight: "24px",
            maxWidth: 520,
          }}>
            Creative industries employ 5.4M+ Americans and contribute $1.2T to the U.S. economy.
            Explore all 50 states by region — pre-computed data cards, AI-powered narrative analysis, and state-level drill-down.
          </p>
        </div>
      </div>
    </>
  );
}
