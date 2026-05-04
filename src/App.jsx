import { useState, useEffect } from "react";
import HeroBanner from "./HeroBanner.jsx";

// ── LOGGER ────────────────────────────────────────────────────────────────────
const LOGGER = "https://script.google.com/macros/s/AKfycbxtCPP6q6wqCUYlSEtNdyQxFF_22K94lvgP4MJytXYX-kWqpCYkZnXG7tYV5fSZThYj/exec";
function logEvent(event, extra = {}) {
  const now = new Date();
  const humanTime = now.toLocaleString("en-US", { month:"long", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit", hour12:true });
  fetch(LOGGER, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ timestamp:humanTime, event, app:"Creative Industries Scorecard", ...extra }) }).catch(() => {});
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt    = n => n != null ? n.toLocaleString() : "N/A";
const fmtB   = n => n != null ? `$${n}B` : "N/A";
const fmtPct = n => n != null ? `${n}%` : "N/A";
const fmtCap = n => n != null ? `$${n.toFixed(2)}/cap` : "N/A";
const fmtM   = n => n != null ? `$${n.toFixed(1)}M` : "N/A";

const STATE_COLORS = ["#5b8dd9","#e07a30","#4caf8a","#c46ab0","#d4b800","#e06060","#60c0c0","#b09060"];

// ── PULSE LOADER ──────────────────────────────────────────────────────────────
function PulseLoader({ text }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 0" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:"#861442",
        display:"inline-block", animation:"dot-pulse 1.2s ease-in-out infinite", flexShrink:0 }} />
      <span style={{ fontSize:13, color:"#f0ede8", fontStyle:"italic", fontWeight:300, opacity:0.6 }}>{text}</span>
    </div>
  );
}

// ── SORT HEADER ───────────────────────────────────────────────────────────────
function SortHeader({ label, col, sortCol, sortDir, onSort, align = "right", className }) {
  const active = sortCol === col;
  return (
    <th className={className} onClick={() => onSort(col)} style={{
      fontFamily:"var(--font-body)", fontSize:10, fontWeight:500,
      letterSpacing:"0.12em", textTransform:"uppercase",
      color: active ? "#be3650" : "#8a8a84",
      padding:"10px 14px", textAlign: align,
      cursor:"pointer", userSelect:"none", whiteSpace:"nowrap",
      borderBottom:"1px solid rgba(255,255,255,0.08)",
      transition:"color 0.15s",
    }}>
      {label} {active ? (sortDir === "asc" ? "↑" : "↓") : <span style={{ opacity:0.3 }}>↕</span>}
    </th>
  );
}

// ── METRIC BAR SECTION ────────────────────────────────────────────────────────
function MetricSection({ label, rows, footnote }) {
  const max = Math.max(...rows.map(r => r.value || 0), 0.001);
  return (
    <div style={{ background:"#2e2e2b", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"1rem 1.25rem 1.1rem", marginBottom:10 }}>
      <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.13em", color:"#861442", marginBottom:12 }}>
        {label}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {rows.map(({ state, value, label: valLabel, sub, color }) => {
          const pct = max ? Math.round((value / max) * 100) : 0;
          return (
            <div key={state} style={{ display:"grid", gridTemplateColumns:"130px 1fr 180px", alignItems:"center", gap:10 }}>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:14, color:"#f0ede8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {state}
              </div>
              <div style={{ height:8, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, animation:"dot-bar 0.8s ease forwards" }} />
              </div>
              <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:13, color:"#f0ede8", textAlign:"right", whiteSpace:"nowrap" }}>
                {valLabel}{sub && <span style={{ color:"#8a8a84", fontSize:11, marginLeft:6 }}>{sub}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {footnote && (
        <div style={{ fontSize:10, color:"#5a5a56", marginTop:10, lineHeight:1.6 }}>* {footnote}</div>
      )}
    </div>
  );
}

// ── STATE SCORECARD ───────────────────────────────────────────────────────────
function StateScorecard({ data, color }) {
  const dims = data.dims || {};
  const aColor = { "arch-model":"#6aaa20","arch-leading":"#1D9E75","arch-developing":"#d4b800","arch-paradox":"#e07050","arch-atrisk":"#be3650" }[data.archetype_class] || "#be3650";

  return (
    <div className="dot-anim" style={{ background:"#242422", border:`1px solid ${color}30`, borderLeft:`3px solid ${color}`, borderRadius:10, padding:"1.1rem 1.25rem", marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:300, fontSize:20, color:"#f0ede8", letterSpacing:"-0.02em" }}>{data.state}</div>
          <div style={{ fontSize:10, color:"#8a8a84", marginTop:2 }}>{data.region}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:32, color:data.score_color, lineHeight:1 }}>{data.overall_score}</div>
          <div style={{ fontSize:9, color:"#8a8a84" }}>/100</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 }}>
        {["employment","gdp","pipeline"].map(k => {
          const dim = dims[k] || {};
          return (
            <div key={k} style={{ background:"#2e2e2b", borderRadius:8, padding:"0.65rem 0.75rem" }}>
              <div style={{ fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"#8a8a84", marginBottom:4 }}>{dim.label || k}</div>
              <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:22, color:data.score_color, lineHeight:1, marginBottom:4 }}>{dim.score}</div>
              <div style={{ background:"#1a1a18", borderRadius:2, height:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${dim.score}%`, background:data.score_color, animation:"dot-bar 1.2s ease forwards" }} />
              </div>
              <div style={{ fontSize:10, color:"#8a8a84", lineHeight:1.5, marginTop:5 }}>{dim.note}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background:"#1a1a18", borderLeft:`3px solid ${data.score_color}`, borderRadius:"0 8px 8px 0", padding:"0.75rem 1rem", fontSize:13, fontWeight:300, lineHeight:1.8, color:"#c8c4bc", marginBottom:10 }}>
        {data.narrative}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:10 }}>
        <span style={{ fontSize:10, padding:"3px 10px", borderRadius:99, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:aColor, background:`${aColor}18`, border:`1px solid ${aColor}20` }}>
          {data.archetype}
        </span>
        <span style={{ fontSize:11, color:"#8a8a84" }}>{data.archetype_desc}</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[["Creative GDP", data.creative_gdp],["Investment", data.investment],["Return on $1", data.roi]].map(([label, val]) => (
          <div key={label} style={{ background:"#2e2e2b", borderRadius:8, padding:"0.5rem 0.65rem", textAlign:"center" }}>
            <div style={{ fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", color:"#8a8a84", marginBottom:3 }}>{label}</div>
            <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:14, color:"#f0ede8" }}>{val || "N/A"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── REGION BREAKOUT PANEL ─────────────────────────────────────────────────────
function RegionBreakout({ regionData, analysis, loadingAnalysis, stateAnalysis, loadingState, onStateSelect }) {
  const states = regionData.stateDetails || [];
  const colorMap = {};
  states.forEach((s, i) => { colorMap[s.state] = STATE_COLORS[i % STATE_COLORS.length]; });

  // Flag line-item gap states (total vs baseline differ >20%)
  const lineItemStates = states
    .filter(s => s.inv_total && s.inv_baseline && Math.abs(s.inv_total - s.inv_baseline) / s.inv_total > 0.2)
    .map(s => s.state);

  return (
    <div className="dot-anim">

      {/* ── Three metric sections ── */}
      <MetricSection
        label="Arts & Culture Total GDP"
        rows={states.map(s => ({
          state: s.state, value: s.gdp_b, color: colorMap[s.state],
          label: fmtB(s.gdp_b), sub: s.gdp_pct ? `${s.gdp_pct}% of GDP` : null,
        }))}
      />

      <MetricSection
        label="Arts Investment — NASAA FY2025"
        rows={states.map(s => ({
          state: s.state, value: s.inv_percap, color: colorMap[s.state],
          label: fmtCap(s.inv_percap), sub: s.inv_total ? `${fmtM(s.inv_total)} total` : null,
        }))}
        footnote={lineItemStates.length
          ? `${lineItemStates.join(", ")} include significant legislative line items — total appropriation may differ substantially from baseline. See NASAA FY2025 report.`
          : null}
      />

      <MetricSection
        label="Creative Jobs"
        rows={states.map(s => ({
          state: s.state, value: s.jobs, color: colorMap[s.state],
          label: s.jobs ? s.jobs.toLocaleString() : "N/A", sub: s.jobs_pct ? `${s.jobs_pct}% of workforce` : null,
        }))}
      />

      <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"16px 0" }} />

      {/* ── AI Narrative ── */}
      <div style={{ fontSize:10, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"#be3650", marginBottom:10 }}>
        Regional Analysis
      </div>

      {loadingAnalysis && <div style={{ padding:"0.75rem 0" }}><PulseLoader text={`Analyzing ${regionData.region}…`} /></div>}

      {analysis && !analysis.error && (
        <div className="dot-anim">
          {analysis.headline && (
            <div style={{ fontFamily:"var(--font-display)", fontWeight:300, fontSize:20, color:"#f0ede8", letterSpacing:"-0.02em", marginBottom:8 }}>
              {analysis.headline}
            </div>
          )}
          <p style={{ fontSize:14, fontWeight:300, lineHeight:1.75, color:"#c8c4bc", marginBottom:12 }}>
            {analysis.narrative}
          </p>
          {analysis.opportunity && (
            <div style={{ background:"rgba(134,20,66,0.08)", border:"1px solid rgba(134,20,66,0.25)", borderRadius:8, padding:"0.85rem 1rem", marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.12em", color:"#861442", marginBottom:4 }}>Top Opportunity</div>
              <p style={{ fontSize:13, fontWeight:300, lineHeight:1.7, color:"#f0ede8" }}>{analysis.opportunity}</p>
            </div>
          )}
        </div>
      )}
      {analysis?.error && <p style={{ fontSize:13, color:"#c0705a", marginBottom:12 }}>{analysis.error}</p>}

      <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"16px 0" }} />

      {/* ── State drill-down ── */}
      <div style={{ fontSize:10, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"#be3650", marginBottom:10 }}>
        Drill Down by State
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {states.map(s => {
          const sd = stateAnalysis[s.state];
          const isLoading = loadingState === s.state;
          const color = sd?.score_color || colorMap[s.state];
          return (
            <button key={s.state} onClick={() => onStateSelect(s.state)} style={{
              background: sd ? `${color}18` : "transparent",
              border:`1px solid ${sd ? color : "rgba(255,255,255,0.14)"}`,
              borderRadius:8, color: sd ? "#f0ede8" : "#c8c4bc",
              fontFamily:"var(--font-body)", fontSize:12, fontWeight: sd ? 500 : 300,
              padding:"5px 12px", cursor:"pointer", transition:"all 0.15s",
            }}>
              {isLoading ? "…" : sd ? `${s.state} · ${sd.overall_score}` : s.state}
            </button>
          );
        })}
      </div>

      {states.map(s => stateAnalysis[s.state] && (
        <StateScorecard key={s.state} data={stateAnalysis[s.state]} color={colorMap[s.state]} />
      ))}

      <div style={{ fontSize:10, color:"#5a5a56", marginTop:8 }}>
        Sources: BEA ACPSA 2023 · NASAA FY2025 State Arts Agency Revenues Report · BLS 2023
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

  const [sortCol, setSortCol] = useState("totalGdp");
  const [sortDir, setSortDir] = useState("desc");
  const [activeRegion, setActiveRegion]     = useState(null);

  const [regionAnalysis, setRegionAnalysis]   = useState({});
  const [loadingAnalysis, setLoadingAnalysis] = useState(null);
  const [stateAnalysis, setStateAnalysis]     = useState({});
  const [loadingState, setLoadingState]       = useState(null);

  useEffect(() => {
    fetch("/api/regions")
      .then(r => r.json())
      .then(data => { setRegionsData(data.regions); setNational(data.national); setLoadingRegions(false); })
      .catch(() => { setRegionsError("Could not load region data."); setLoadingRegions(false); });
  }, []);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  async function handleRegionSelect(regionName) {
    if (activeRegion === regionName) { setActiveRegion(null); return; }
    setActiveRegion(regionName);
    if (regionAnalysis[regionName]) return;
    setLoadingAnalysis(regionName);
    logEvent("region_select", { region: regionName });
    try {
      const r = await fetch("/api/anthropic", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ type:"region", region:regionName }),
      });
      const data = await r.json();
      setRegionAnalysis(prev => ({ ...prev, [regionName]: data }));
    } catch {
      setRegionAnalysis(prev => ({ ...prev, [regionName]: { error:"Could not load analysis." } }));
    } finally { setLoadingAnalysis(null); }
  }

  async function handleStateSelect(state) {
    if (stateAnalysis[state]) return;
    setLoadingState(state);
    logEvent("state_select", { state, region: activeRegion });
    try {
      const r = await fetch("/api/anthropic", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ type:"state", state, region: activeRegion }),
      });
      const data = await r.json();
      setStateAnalysis(prev => ({ ...prev, [state]: data }));
    } catch {
      setStateAnalysis(prev => ({ ...prev, [state]: { error:"Could not load." } }));
    } finally { setLoadingState(null); }
  }

  const sortedRegions = regionsData ? [...regionsData].sort((a, b) => {
    const av = a[sortCol] ?? -Infinity;
    const bv = b[sortCol] ?? -Infinity;
    if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === "asc" ? av - bv : bv - av;
  }) : [];

  return (
    <div style={{ minHeight:"100vh", background:"#1a1a18", color:"#f0ede8" }}>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --bg:#1a1a18; --surface:#242422; --surface2:#2e2e2b;
          --border:rgba(255,255,255,0.08); --border2:rgba(255,255,255,0.14);
          --text:#f0ede8; --muted:#c8c4bc;
          --font-display:'Fraunces',Georgia,serif; --font-body:'Plus Jakarta Sans',sans-serif; --radius:10px;
        }
        body { font-family:var(--font-body); background:#1a1a18; }
        @keyframes dot-pulse { 0%,100%{opacity:.25;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        @keyframes dot-bar { from { width:0 } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .dot-anim { animation:fadeUp 0.5s ease both; }

        .btn-primary { background:#861442 !important; color:#fff !important; border:none;
          font-family:var(--font-body); font-size:13px; font-weight:500;
          padding:10px 22px 13px; border-radius:var(--radius); cursor:pointer;
          letter-spacing:0.04em; transition:opacity 0.15s,transform 0.1s; white-space:nowrap; }
        .btn-primary:hover { opacity:0.88; }
        .btn-primary:active { transform:scale(0.97); }

        .region-table { width:100%; border-collapse:collapse; }
        .region-table td { padding:11px 14px; border-bottom:1px solid rgba(255,255,255,0.06); vertical-align:middle; }
        .region-row { cursor:pointer; transition:background 0.15s; }
        .region-row:hover td { background:rgba(255,255,255,0.025); }
        .region-row.active td { background:rgba(134,20,66,0.06); }

        .page-footer-rule { width:100%; height:1.5px; background:rgba(134,20,66,0.5); }
        .page-footer { background:#111110; padding:1.25rem clamp(16px,4vw,2rem);
          font-family:var(--font-body); font-size:11px; font-weight:400;
          color:rgba(255,255,255,0.7); text-align:center; line-height:20px; }
        .page-footer a { color:#861442; text-decoration:none; font-weight:500; }
        .page-footer a:hover { color:#be3650; }

        @media (max-width:640px) {
          .hide-mobile { display:none !important; }
          .region-table td { padding:9px 10px; }
        }
        @media print { .no-print { display:none !important; } }
      `}</style>

      <div style={{ maxWidth:860, margin:"0 auto", overflow:"hidden" }}>

        <h1 style={{ position:"absolute", width:1, height:1, padding:0, margin:-1, overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap", border:0 }}>
          Creative Industries Scorecard — Free State Arts Data Tool | Data on Tap
        </h1>

        <HeroBanner />

        {/* ── NATIONAL STAT BAR ── */}
        {national && (
          <div style={{ background:"#111110", display:"flex", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {[
              { val:`$${(national.gdp_b/1000).toFixed(1)}T`, label:"Creative Industries\nEconomic Impact" },
              { val:`${national.gdp_pct}%`,                   label:"U.S. GDP\nBEA ACPSA 2023" },
              { val:`${(national.jobs/1e6).toFixed(1)}M`,     label:"Creative Jobs\nNationwide" },
              { val:"$2.02/cap",                              label:"Avg Arts Investment\nNASAA FY2025" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                <div style={{ flex:1, padding:"0.9rem clamp(8px,2vw,1.25rem)", textAlign:"center" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:300, fontStyle:"italic", fontSize:"clamp(1rem,2.5vw,1.4rem)", color:"#f0ede8", lineHeight:1, marginBottom:4 }}>{item.val}</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"#f0ede8", opacity:0.6, lineHeight:1.6, whiteSpace:"pre-line" }}>{item.label}</div>
                </div>
                {i < arr.length-1 && <div style={{ width:1, height:28, background:"rgba(255,255,255,0.1)", flexShrink:0 }} />}
              </div>
            ))}
          </div>
        )}

        {/* ── TABLE + BREAKOUT ── */}
        <div style={{ padding:"0 clamp(16px,4vw,2rem) 3rem" }}>

          {loadingRegions && <div style={{ padding:"3rem 0" }}><PulseLoader text="Loading regional data…" /></div>}
          {regionsError  && <p style={{ padding:"2rem 0", fontSize:13, color:"#c0705a" }}>{regionsError}</p>}

          {regionsData && (
            <>
              <div style={{ paddingTop:"1.5rem", paddingBottom:"0.75rem" }}>
                <p style={{ fontSize:11, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"#be3650", marginBottom:5 }}>8 Regions · 50 States</p>
                <p style={{ fontSize:13, fontWeight:300, color:"#8a8a84", lineHeight:1.6 }}>
                  Click any column to sort. Click a region row to expand bar chart breakdown and AI analysis.
                </p>
              </div>

              <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
                <table className="region-table">
                  <thead>
                    <tr style={{ background:"#1a1a18" }}>
                      <SortHeader label="Region"       col="region"       align="left"  sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                      <SortHeader label="Creative GDP" col="totalGdp"                   sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                      <SortHeader label="Avg GDP %"    col="avgGdpPct"    className="hide-mobile" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                      <SortHeader label="Jobs"         col="totalJobs"    className="hide-mobile" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                      <SortHeader label="Avg $/cap"    col="avgInvPercap" className="hide-mobile" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                      <th style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", width:60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRegions.map(region => {
                      const isActive = activeRegion === region.region;
                      return (
                        <>
                          <tr key={region.region} className={`region-row${isActive ? " active" : ""}`}
                            onClick={() => handleRegionSelect(region.region)}>
                            <td>
                              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"#f0ede8" }}>{region.region}</div>
                              <div style={{ fontSize:10, color:"#8a8a84", marginTop:2 }}>{region.emoji} {region.stateCount} states</div>
                            </td>
                            <td style={{ textAlign:"right" }}>
                              <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color:"#f0ede8" }}>{fmtB(region.totalGdp)}</span>
                            </td>
                            <td style={{ textAlign:"right" }} className="hide-mobile">
                              <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color:"#f0ede8" }}>{fmtPct(region.avgGdpPct)}</span>
                            </td>
                            <td style={{ textAlign:"right" }} className="hide-mobile">
                              <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color:"#f0ede8" }}>{fmt(region.totalJobs)}</span>
                            </td>
                            <td style={{ textAlign:"right" }} className="hide-mobile">
                              <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color: region.avgInvPercap ? "#f0ede8" : "#5a5a56" }}>
                                {region.avgInvPercap ? `$${region.avgInvPercap.toFixed(2)}` : "N/A"}
                              </span>
                            </td>
                            <td style={{ textAlign:"right" }}>
                              <span style={{ fontSize:12, fontWeight:500, color: isActive ? "#861442" : "#be3650" }}>
                                {isActive ? "▲" : "▼"}
                              </span>
                            </td>
                          </tr>

                          {isActive && (
                            <tr key={`${region.region}-panel`}>
                              <td colSpan={6} style={{ padding:"0 12px 16px", background:"rgba(134,20,66,0.04)" }}>
                                <RegionBreakout
                                  regionData={region}
                                  analysis={regionAnalysis[region.region]}
                                  loadingAnalysis={loadingAnalysis === region.region}
                                  stateAnalysis={stateAnalysis}
                                  loadingState={loadingState}
                                  onStateSelect={handleStateSelect}
                                />
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize:10, color:"#5a5a56", marginTop:8, lineHeight:1.6 }}>
                Sources: BEA ACPSA 2023 · NASAA FY2025 State Arts Agency Revenues Report · BLS 2023
              </p>
            </>
          )}

          {/* ── VISION CALL CTA ── */}
          <div style={{ marginTop:"2.5rem", background:"rgba(134,20,66,0.08)", border:"1.5px solid #861442", borderRadius:10, padding:"1.5rem clamp(18px,4vw,2rem)" }}>
            <p style={{ fontSize:11, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"#861442", marginBottom:10 }}>
              Ready to Make It Actionable?
            </p>
            <h2 style={{ fontFamily:"var(--font-display)", fontWeight:300, fontSize:"clamp(20px,4vw,28px)", letterSpacing:"-0.02em", color:"#f0ede8", marginBottom:10, lineHeight:1.2 }}>
              Book a <em style={{ fontStyle:"italic", color:"#be3650" }}>Vision Call</em>
            </h2>
            <p style={{ fontSize:14, fontWeight:300, lineHeight:1.75, color:"#c8c4bc", marginBottom:20, maxWidth:520 }}>
              The data tells you where the opportunity is. A Vision Call with Monica turns it into a strategy — whether you're a regional developer, arts administrator, or entrepreneur ready to capitalize on your state's creative economy.
            </p>
            <a href="https://monicapoling.com/work-with-monica" target="_blank" rel="noopener noreferrer"
              className="btn-primary" style={{ display:"inline-block", textDecoration:"none" }}
              onClick={() => logEvent("vision_call_click")}>
              Book Your Vision Call →
            </a>
          </div>
        </div>

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
