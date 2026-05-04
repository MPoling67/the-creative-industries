import { useState, useEffect } from "react";
import HeroBanner from "./HeroBanner.jsx";

// ── LOGGER ────────────────────────────────────────────────────────────────────
const LOGGER = "https://script.google.com/macros/s/AKfycbxtCPP6q6wqCUYlSEtNdyQxFF_22K94lvgP4MJytXYX-kWqpCYkZnXG7tYV5fSZThYj/exec";

function logEvent(event, extra = {}) {
  const now = new Date();
  const humanTime = now.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  fetch(LOGGER, {
    method: "POST", mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timestamp: humanTime, event, app: "Creative Industries Scorecard", ...extra }),
  }).catch(() => {});
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmt(n) { return n != null ? n.toLocaleString() : "N/A"; }
function fmtB(n) { return n != null ? `$${n}B` : "N/A"; }
function fmtPct(n) { return n != null ? `${n}%` : "N/A"; }

function archetypeColor(archClass) {
  const map = {
    "arch-model":      "#6aaa20",
    "arch-leading":    "#1D9E75",
    "arch-developing": "#d4b800",
    "arch-paradox":    "#e07050",
    "arch-atrisk":     "#be3650",
  };
  return map[archClass] || "#be3650";
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function PulseLoader({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#861442",
        display: "inline-block", animation: "dot-pulse 1.2s ease-in-out infinite", flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#f0ede8", fontStyle: "italic", fontWeight: 300, opacity: 0.6 }}>{text}</span>
    </div>
  );
}

function ScoreBar({ score, color = "#861442" }) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div style={{ background: "#2e2e2b", borderRadius: 2, height: 4, overflow: "hidden", marginTop: 4 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, animation: "dot-bar 1.2s ease forwards" }} />
    </div>
  );
}

// ── REGION CARD ───────────────────────────────────────────────────────────────
function RegionCard({ region, isActive, onSelect, analysisLoading }) {
  const isLoading = analysisLoading === region.region;
  return (
    <div
      className="region-card"
      style={{
        background: isActive ? "rgba(134,20,66,0.08)" : "#242422",
        border: isActive ? "1.5px solid #861442" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "1.1rem 1.25rem 1rem",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onClick={() => onSelect(region.region)}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#f0ede8", lineHeight: 1.2 }}>
            {region.region}
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#be3650", marginTop: 3 }}>
            {region.stateCount} states {region.emoji}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: region.scoreColor, lineHeight: 1 }}>
            {region.overallScore}
          </div>
          <div style={{ fontSize: 9, color: "#8a8a84", marginTop: 2 }}>score</div>
        </div>
      </div>

      {/* Score bar */}
      <ScoreBar score={region.overallScore} color={region.scoreColor} />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginTop: 10, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a8a84" }}>Creative GDP</div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "#f0ede8", marginTop: 2 }}>{fmtB(region.totalGdp)}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a8a84" }}>Avg GDP %</div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "#f0ede8", marginTop: 2 }}>{fmtPct(region.avgGdpPct)}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a8a84" }}>Jobs</div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "#f0ede8", marginTop: 2 }}>{fmt(region.totalJobs)}</div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ fontSize: 11, fontWeight: 300, color: "#8a8a84", lineHeight: 1.5, marginBottom: 12 }}>
        {region.tagline}
      </div>

      {/* CTA */}
      <button
        className="btn-region"
        style={{
          width: "100%",
          background: isActive ? "#861442" : "transparent",
          color: isActive ? "#fff" : "#be3650",
          border: isActive ? "none" : "1px solid rgba(134,20,66,0.4)",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          padding: "7px 12px",
          cursor: "pointer",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "all 0.15s",
        }}
        onClick={e => { e.stopPropagation(); onSelect(region.region); }}
      >
        {isLoading ? (
          <PulseLoader text="Analyzing…" />
        ) : isActive ? (
          "✓ Viewing Analysis"
        ) : (
          "View Analysis →"
        )}
      </button>
    </div>
  );
}

// ── STATE SCORECARD ───────────────────────────────────────────────────────────
function StateScorecard({ data, onClose }) {
  const aColor = archetypeColor(data.archetype_class);
  const dims = data.dims || {};
  const dimKeys = ["employment", "gdp", "pipeline"];

  return (
    <div className="dot-anim" style={{ background: "#2e2e2b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "1.25rem", marginTop: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 22, color: "#f0ede8", letterSpacing: "-0.02em" }}>
            {data.state}
          </div>
          <div style={{ fontSize: 10, color: "#8a8a84", marginTop: 3 }}>
            {data.region} · BEA ACPSA 2023
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 36, color: data.score_color, lineHeight: 1 }}>
            {data.overall_score}
          </div>
          <div style={{ fontSize: 10, color: "#8a8a84" }}>/100</div>
        </div>
      </div>

      {/* Dimension cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
        {dimKeys.map(k => {
          const dim = dims[k] || {};
          return (
            <div key={k} style={{ background: "#242422", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "0.75rem" }}>
              <div style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a8a84", marginBottom: 4 }}>{dim.label || k}</div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 24, color: data.score_color, lineHeight: 1, marginBottom: 4 }}>{dim.score}</div>
              <ScoreBar score={dim.score} color={data.score_color} />
              <div style={{ fontSize: 10, color: "#8a8a84", lineHeight: 1.5, marginTop: 6 }}>{dim.note}</div>
            </div>
          );
        })}
      </div>

      {/* Narrative */}
      <div style={{ background: "#1a1a18", border: "1px solid rgba(255,255,255,0.06)", borderLeft: `3px solid ${data.score_color}`, borderRadius: "0 8px 8px 0", padding: "0.85rem 1rem", fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: "#c8c4bc", marginBottom: 12 }}>
        {data.narrative}
      </div>

      {/* Archetype */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: aColor, background: `${aColor}18`, border: `1px solid ${aColor}20` }}>
          {data.archetype}
        </span>
        <span style={{ fontSize: 11, color: "#8a8a84", lineHeight: 1.6 }}>{data.archetype_desc}</span>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Creative GDP",     value: data.creative_gdp },
          { label: "Arts Investment",  value: data.investment },
          { label: "Return on $1",     value: data.roi },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "#242422", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "0.65rem 0.75rem", textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a8a84", marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: 16, color: "#f0ede8" }}>{value || "N/A"}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: "#5a5a56", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
        Sources: {data.sources}
      </div>

      <button className="btn-ghost" onClick={onClose} style={{ marginTop: 10, fontSize: 11, padding: "5px 12px" }}>
        ← Back to states
      </button>
    </div>
  );
}

// ── REGION ANALYSIS PANEL ─────────────────────────────────────────────────────
function RegionAnalysisPanel({ regionData, analysis, stateAnalysis, loadingState, onStateSelect }) {
  const [selectedState, setSelectedState] = useState(null);

  function handleStateClick(state) {
    setSelectedState(state);
    onStateSelect(state);
  }

  return (
    <div className="dot-anim" style={{ marginTop: 24, padding: "1.5rem", background: "#242422", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>

      {/* Region headline */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#be3650", marginBottom: 6 }}>
          Regional Analysis · {regionData.region}
        </div>
        {analysis.headline && (
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 22, color: "#f0ede8", letterSpacing: "-0.02em", marginBottom: 10 }}>
            {analysis.headline}
          </div>
        )}
        <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: "#c8c4bc" }}>
          {analysis.narrative}
        </p>
      </div>

      {/* Opportunity callout */}
      {analysis.opportunity && (
        <div style={{ background: "rgba(134,20,66,0.08)", border: "1px solid rgba(134,20,66,0.25)", borderRadius: 8, padding: "0.85rem 1rem", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#861442", marginBottom: 5 }}>Top Opportunity</div>
          <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: "#f0ede8" }}>{analysis.opportunity}</p>
        </div>
      )}

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 0" }} />

      {/* State drill-down */}
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#be3650", marginBottom: 10 }}>
        Drill Down by State
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {regionData.states.map(state => {
          const isSelected = selectedState === state;
          const isLoading  = loadingState === state;
          const stateData  = stateAnalysis[state];
          const sc = stateData?.score_color || "#8a8a84";
          return (
            <button
              key={state}
              onClick={() => handleStateClick(state)}
              style={{
                background: isSelected ? sc + "20" : "transparent",
                border: `1px solid ${isSelected ? sc : "rgba(255,255,255,0.14)"}`,
                borderRadius: 8,
                color: isSelected ? "#f0ede8" : "#c8c4bc",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: isSelected ? 500 : 300,
                padding: "5px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {isLoading ? "…" : stateData ? `${state} · ${stateData.overall_score}` : state}
            </button>
          );
        })}
      </div>

      {/* State scorecard */}
      {selectedState && loadingState === selectedState && (
        <div style={{ padding: "1rem", background: "#2e2e2b", borderRadius: 8 }}>
          <PulseLoader text={`Scoring ${selectedState}…`} />
        </div>
      )}
      {selectedState && stateAnalysis[selectedState] && (
        <StateScorecard
          data={stateAnalysis[selectedState]}
          onClose={() => setSelectedState(null)}
        />
      )}

      <div style={{ fontSize: 10, color: "#5a5a56", marginTop: 12 }}>
        Sources: {analysis.sources}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [regionsData, setRegionsData]       = useState(null);
  const [national, setNational]             = useState(null);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [regionsError, setRegionsError]     = useState(null);

  const [activeRegion, setActiveRegion]         = useState(null);
  const [regionAnalysis, setRegionAnalysis]     = useState({});  // { regionName: analysisObj }
  const [loadingAnalysis, setLoadingAnalysis]   = useState(null); // regionName | null

  const [stateAnalysis, setStateAnalysis]   = useState({});  // { stateName: analysisObj }
  const [loadingState, setLoadingState]     = useState(null); // stateName | null

  // ── Load region cards on mount ──
  useEffect(() => {
    fetch("/api/regions")
      .then(r => r.json())
      .then(data => {
        setRegionsData(data.regions);
        setNational(data.national);
        setLoadingRegions(false);
      })
      .catch(err => {
        setRegionsError("Could not load region data.");
        setLoadingRegions(false);
      });
  }, []);

  // ── Select a region → fetch AI narrative if not already loaded ──
  async function handleRegionSelect(regionName) {
    if (activeRegion === regionName) {
      setActiveRegion(null);
      return;
    }
    setActiveRegion(regionName);

    if (regionAnalysis[regionName]) return; // already loaded

    setLoadingAnalysis(regionName);
    logEvent("region_select", { region: regionName });

    try {
      const r = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "region", region: regionName }),
      });
      const data = await r.json();
      setRegionAnalysis(prev => ({ ...prev, [regionName]: data }));
    } catch (err) {
      setRegionAnalysis(prev => ({ ...prev, [regionName]: { error: "Could not load analysis." } }));
    } finally {
      setLoadingAnalysis(null);
    }
  }

  // ── Drill down on a state ──
  async function handleStateSelect(state) {
    if (stateAnalysis[state]) return; // already loaded

    setLoadingState(state);
    logEvent("state_select", { state, region: activeRegion });

    try {
      const r = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "state", state, region: activeRegion }),
      });
      const data = await r.json();
      setStateAnalysis(prev => ({ ...prev, [state]: data }));
    } catch (err) {
      setStateAnalysis(prev => ({ ...prev, [state]: { error: "Could not load state data." } }));
    } finally {
      setLoadingState(null);
    }
  }

  const activeRegionData     = regionsData?.find(r => r.region === activeRegion);
  const activeRegionAnalysis = activeRegion ? regionAnalysis[activeRegion] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a18", color: "#f0ede8" }}>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #1a1a18; --surface: #242422; --surface2: #2e2e2b;
          --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.14);
          --text: #f0ede8; --muted: #c8c4bc;
          --accent: #861442; --accent2: #be3650;
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --radius: 10px;
        }
        body { font-family: var(--font-body); background: #1a1a18; }
        @keyframes dot-pulse { 0%,100%{opacity:.25;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        @keyframes dot-bar { from { width: 0 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .dot-anim { animation: fadeUp 0.5s ease both; }

        .btn-primary { background: #861442 !important; color: #ffffff !important; border: none;
          font-family: var(--font-body); font-size: 13px; font-weight: 500;
          padding: 10px 22px 13px; border-radius: var(--radius); cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.15s, transform 0.1s; white-space: nowrap; }
        .btn-primary:hover { opacity: 0.88; }
        .btn-primary:active { transform: scale(0.97); }

        .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border2);
          font-family: var(--font-body); font-size: 13px; padding: 8px 16px;
          border-radius: var(--radius); cursor: pointer; transition: color 0.15s, border-color 0.15s; }
        .btn-ghost:hover { color: #be3650; border-color: #be3650; }

        .btn-region:hover { opacity: 0.85; }

        .region-card:hover { border-color: rgba(134,20,66,0.4) !important; }

        .regions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 2rem clamp(16px,4vw,2rem);
        }

        .page-footer-rule { width: 100%; height: 1.5px; background: rgba(134,20,66,0.5); }
        .page-footer { background: #111110; padding: 1.25rem clamp(16px,4vw,2rem);
          font-family: var(--font-body); font-size: 11px; font-weight: 400;
          color: rgba(255,255,255,0.7); text-align: center; line-height: 20px; }
        .page-footer a { color: #861442; text-decoration: none; font-weight: 500; }
        .page-footer a:hover { color: #be3650; }

        @media (max-width: 640px) {
          .regions-grid { grid-template-columns: 1fr; }
        }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", overflow: "hidden" }}>

        {/* SEO hidden h1 */}
        <h1 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          Creative Industries Scorecard — Free State Arts Data Tool | Data on Tap
        </h1>

        <HeroBanner />

        {/* ── NATIONAL STAT BAR ── */}
        {national && (
          <div style={{ background: "#111110", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { val: `$${national.gdp_b ? (national.gdp_b / 1000).toFixed(1) + "T" : "N/A"}`, label: "Creative Industries\nTotal Economic Impact" },
              { val: `${national.gdp_pct}%`, label: "U.S. GDP\n(BEA ACPSA 2023)" },
              { val: `${(national.jobs / 1e6).toFixed(1)}M`, label: "Creative Jobs\nNationwide" },
              { val: `${national.jobs_pct}%`, label: "Avg Creative Jobs\n% of Workforce" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, padding: "0.9rem clamp(10px,2vw,1.25rem)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.1rem,2.5vw,1.4rem)", color: "#f0ede8", lineHeight: 1, marginBottom: 4 }}>{item.val}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f0ede8", opacity: 0.6, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        )}

        {/* ── REGION GRID ── */}
        <div style={{ background: "#1a1a18" }}>

          {loadingRegions && (
            <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
              <PulseLoader text="Loading regional data…" />
            </div>
          )}

          {regionsError && (
            <div style={{ padding: "2rem", margin: "1rem clamp(16px,4vw,2rem)" }}>
              <p style={{ color: "#c0705a", fontSize: 13 }}>{regionsError}</p>
            </div>
          )}

          {regionsData && (
            <>
              <div style={{ padding: "1.5rem clamp(16px,4vw,2rem) 0.5rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#be3650", marginBottom: 6 }}>
                  8 Regions · 50 States
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 300, color: "#8a8a84", lineHeight: 1.6 }}>
                  Pre-computed from BEA ACPSA 2023 data. Click any region for an AI-generated narrative and state-level drill-down.
                </p>
              </div>

              <div className="regions-grid">
                {regionsData.map((region, i) => (
                  <div key={region.region} style={{ animationDelay: `${i * 0.05}s` }} className="dot-anim">
                    <RegionCard
                      region={region}
                      isActive={activeRegion === region.region}
                      onSelect={handleRegionSelect}
                      analysisLoading={loadingAnalysis}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── ANALYSIS PANEL ── */}
        {activeRegion && (
          <div style={{ padding: "0 clamp(16px,4vw,2rem)", paddingBottom: "1rem" }}>
            {loadingAnalysis === activeRegion && (
              <div className="dot-anim" style={{ marginTop: 24, padding: "1.5rem", background: "#242422", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <PulseLoader text={`Analyzing ${activeRegion}…`} />
              </div>
            )}

            {activeRegionAnalysis && !activeRegionAnalysis.error && activeRegionData && (
              <RegionAnalysisPanel
                regionData={activeRegionData}
                analysis={activeRegionAnalysis}
                stateAnalysis={stateAnalysis}
                loadingState={loadingState}
                onStateSelect={handleStateSelect}
              />
            )}

            {activeRegionAnalysis?.error && (
              <div style={{ marginTop: 24, padding: "1rem", background: "rgba(190,54,80,0.08)", border: "1px solid rgba(190,54,80,0.2)", borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: "#be3650" }}>{activeRegionAnalysis.error}</p>
              </div>
            )}
          </div>
        )}

        {/* ── BOOK A VISION CALL CTA ── */}
        <div style={{ padding: "2rem clamp(16px,4vw,2rem) 3rem" }}>
          <div style={{ background: "rgba(134,20,66,0.08)", border: "1.5px solid #861442", borderRadius: 10, padding: "1.5rem clamp(18px,4vw,2rem)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#861442", marginBottom: 10 }}>
              Ready to Make It Actionable?
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(20px,4vw,28px)", letterSpacing: "-0.02em", color: "#f0ede8", marginBottom: 10, lineHeight: 1.2 }}>
              Book a <em style={{ fontStyle: "italic", color: "#be3650" }}>Vision Call</em>
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: "#c8c4bc", marginBottom: 20, maxWidth: 520 }}>
              The data tells you where the opportunity is. A Vision Call with Monica turns it into a strategy — whether you're a regional developer, arts administrator, or entrepreneur ready to capitalize on your state's creative economy.
            </p>
            <a
              href="https://monicapoling.com/work-with-monica"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-block", textDecoration: "none" }}
              onClick={() => logEvent("vision_call_click")}
            >
              Book Your Vision Call →
            </a>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="page-footer-rule" />
        <footer className="page-footer no-print">
          © 2026 Creative Industries Scorecard &nbsp;◆&nbsp;{" "}
          <a href="https://dataontap.dev" target="_blank" rel="noopener noreferrer">Data on Tap</a>
          &nbsp;◆&nbsp;{" "}
          <a href="https://monicapoling.com" target="_blank" rel="noopener noreferrer">Monica Poling</a>
        </footer>

      </div>
    </div>
  );
}
