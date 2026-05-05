import { useState, useEffect, useMemo } from "react";
import HeroBanner from "./HeroBanner.jsx";

// ── LOGGER ────────────────────────────────────────────────────────────────────
const LOGGER = "https://script.google.com/macros/s/AKfycbxtCPP6q6wqCUYlSEtNdyQxFF_22K94lvgP4MJytXYX-kWqpCYkZnXG7tYV5fSZThYj/exec";
function logEvent(event, extra = {}) {
  const now = new Date();
  const ts = now.toLocaleString("en-US", { month:"long", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit", hour12:true });
  fetch(LOGGER, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ timestamp:ts, event, app:"Creative Industries Scorecard", ...extra }) }).catch(() => {});
}

// ── INDUSTRY COMPARISON DATA (BEA GDP by Industry 2023, BLS 2023) ─────────────
const INDUSTRIES = [
  { name:"Creative Industries",    gdp_pct:4.2,  jobs_m:5.4,  color:"#861442", highlight:true  },
  { name:"Construction",           gdp_pct:4.0,  jobs_m:7.9,  color:"#5b8dd9", highlight:false },
  { name:"Retail Trade",           gdp_pct:5.1,  jobs_m:15.5, color:"#e07a30", highlight:false },
  { name:"Leisure & Hospitality",  gdp_pct:3.9,  jobs_m:16.9, color:"#4caf8a", highlight:false },
  { name:"Healthcare",             gdp_pct:8.4,  jobs_m:21.3, color:"#c46ab0", highlight:false },
  { name:"Information",            gdp_pct:6.6,  jobs_m:3.2,  color:"#d4b800", highlight:false },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt    = n => n != null ? n.toLocaleString() : "N/A";
const fmtB   = n => n != null ? `$${n}B` : "N/A";
const fmtPct = n => n != null ? `${n}%` : "N/A";
const fmtM   = n => n != null ? `$${n.toFixed(1)}M` : "N/A";
const fmtCap = n => n != null ? `$${n.toFixed(2)}/cap` : "N/A";

const STATE_COLORS = ["#5b8dd9","#e07a30","#4caf8a","#c46ab0","#d4b800","#e06060","#60c0c0","#b09060"];

const ALL_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming"
];

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

// ── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ label, sub }) {
  return (
    <div style={{ paddingTop:"2rem", paddingBottom:"0.75rem" }}>
      <p style={{ fontSize:11, fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase", color:"#be3650", marginBottom:4 }}>{label}</p>
      {sub && <p style={{ fontSize:13, fontWeight:300, color:"#8a8a84", lineHeight:1.6 }}>{sub}</p>}
    </div>
  );
}

// ── HORIZONTAL BAR ROW ────────────────────────────────────────────────────────
function BarRow({ name, value, max, label, sub, color, highlight }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display:"grid", gridTemplateColumns:"180px 1fr 160px", alignItems:"center", gap:12, padding:"4px 0" }}>
      <div style={{ fontFamily: highlight ? "var(--font-display)" : "var(--font-body)",
        fontWeight: highlight ? 700 : 400, fontSize:14,
        color: highlight ? "#f0ede8" : "#c8c4bc",
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {name}
      </div>
      <div style={{ height:8, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, animation:"dot-bar 0.8s ease forwards" }} />
      </div>
      <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:14,
        color: highlight ? "#f0ede8" : "#c8c4bc", textAlign:"right", whiteSpace:"nowrap" }}>
        {label}{sub && <span style={{ color:"#8a8a84", fontSize:11, marginLeft:6 }}>{sub}</span>}
      </div>
    </div>
  );
}

// ── B: INDUSTRY COMPARISON ────────────────────────────────────────────────────
function IndustryComparison() {
  const maxGdp  = Math.max(...INDUSTRIES.map(i => i.gdp_pct));
  const maxJobs = Math.max(...INDUSTRIES.map(i => i.jobs_m));

  return (
    <div>
      <SectionHeader
        label="Creative Industries in Context"
        sub="How creative industries compare to other major U.S. sectors — national figures, BEA 2023 · BLS 2023."
      />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {/* GDP Share */}
        <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1rem 1.25rem" }}>
          <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.13em", color:"#861442", marginBottom:12 }}>
            % of U.S. GDP
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {INDUSTRIES.map(ind => (
              <BarRow key={ind.name} name={ind.name} value={ind.gdp_pct} max={maxGdp}
                label={`${ind.gdp_pct}%`} color={ind.color} highlight={ind.highlight} />
            ))}
          </div>
        </div>
        {/* Jobs */}
        <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1rem 1.25rem" }}>
          <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.13em", color:"#861442", marginBottom:12 }}>
            U.S. Jobs (millions)
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {INDUSTRIES.map(ind => (
              <BarRow key={ind.name} name={ind.name} value={ind.jobs_m} max={maxJobs}
                label={`${ind.jobs_m}M`} color={ind.color} highlight={ind.highlight} />
            ))}
          </div>
        </div>
      </div>
      <p style={{ fontSize:10, color:"#5a5a56", marginTop:8, lineHeight:1.6 }}>
        Sources: BEA GDP by Industry 2023 · BLS Quarterly Census of Employment and Wages 2023 ·
        Creative Industries figure from BEA ACPSA 2023 (final dataset — program discontinued February 2026)
      </p>
    </div>
  );
}

// ── C: SORT HEADER ────────────────────────────────────────────────────────────
function SortTh({ label, col, sortCol, sortDir, onSort, align="right", className }) {
  const active = sortCol === col;
  return (
    <th className={className} onClick={() => onSort(col)} style={{
      fontFamily:"var(--font-body)", fontSize:10, fontWeight:500,
      letterSpacing:"0.12em", textTransform:"uppercase",
      color: active ? "#be3650" : "#8a8a84",
      padding:"10px 14px", textAlign:align, cursor:"pointer",
      userSelect:"none", whiteSpace:"nowrap",
      borderBottom:"1px solid rgba(255,255,255,0.08)", transition:"color 0.15s",
    }}>
      {label} {active ? (sortDir==="asc" ? "↑" : "↓") : <span style={{ opacity:0.3 }}>↕</span>}
    </th>
  );
}

// ── C: REGIONAL TABLE ─────────────────────────────────────────────────────────
function RegionalTable({ regionsData }) {
  const [sortCol, setSortCol] = useState("totalGdp");
  const [sortDir, setSortDir] = useState("desc");

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d==="asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  const sorted = useMemo(() => [...regionsData].sort((a,b) => {
    const av = a[sortCol] ?? (typeof a[sortCol]==="string" ? "" : -Infinity);
    const bv = b[sortCol] ?? (typeof b[sortCol]==="string" ? "" : -Infinity);
    if (typeof av === "string") return sortDir==="asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir==="asc" ? av - bv : bv - av;
  }), [regionsData, sortCol, sortDir]);

  return (
    <div>
      <SectionHeader
        label="8 Regions · 50 States"
        sub="Click any column to sort. Pre-computed from BEA ACPSA 2023 + NASAA FY2025."
      />
      <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#1a1a18" }}>
              <SortTh label="Region"       col="region"       align="left" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <SortTh label="Creative GDP" col="totalGdp"                  sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <SortTh label="Avg GDP %"    col="avgGdpPct"    className="hide-mobile" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <SortTh label="Jobs"         col="totalJobs"    className="hide-mobile" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <SortTh label="Avg $/cap"    col="avgInvPercap" className="hide-mobile" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r.region} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", transition:"background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.025)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"11px 14px" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"#f0ede8" }}>{r.region}</div>
                  <div style={{ fontSize:10, color:"#8a8a84", marginTop:2 }}>{r.emoji} {r.stateCount} states</div>
                </td>
                <td style={{ padding:"11px 14px", textAlign:"right" }}>
                  <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color:"#f0ede8" }}>{fmtB(r.totalGdp)}</span>
                </td>
                <td className="hide-mobile" style={{ padding:"11px 14px", textAlign:"right" }}>
                  <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color:"#f0ede8" }}>{fmtPct(r.avgGdpPct)}</span>
                </td>
                <td className="hide-mobile" style={{ padding:"11px 14px", textAlign:"right" }}>
                  <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color:"#f0ede8" }}>{fmt(r.totalJobs)}</span>
                </td>
                <td className="hide-mobile" style={{ padding:"11px 14px", textAlign:"right" }}>
                  <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:16, color: r.avgInvPercap ? "#f0ede8" : "#5a5a56" }}>
                    {r.avgInvPercap ? `$${r.avgInvPercap.toFixed(2)}` : "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize:10, color:"#5a5a56", marginTop:8, lineHeight:1.6 }}>
        Sources: BEA ACPSA 2023 (final dataset — discontinued February 2026) · NASAA FY2025 · BLS 2023
      </p>
    </div>
  );
}

// ── D: NASAA TREND BARS ───────────────────────────────────────────────────────
function NasaaTrend({ trend, years, natTrend }) {
  const validTrend = trend || [];
  const max = Math.max(...validTrend.filter(v => v != null), ...natTrend.filter(v => v != null), 0.001);

  return (
    <div>
      <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.12em", color:"#861442", marginBottom:10 }}>
        Arts Investment Trend — NASAA FY2022–FY2025
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {years.map((yr, i) => {
          const val    = validTrend[i] ?? null;
          const natVal = natTrend[i]   ?? null;
          const pct    = val != null && max ? Math.round((val / max) * 100) : 0;
          const natPct = natVal != null && max ? Math.round((natVal / max) * 100) : 0;
          const trend_dir = i > 0 && validTrend[i] != null && validTrend[i-1] != null
            ? (validTrend[i] > validTrend[i-1] ? "↑" : validTrend[i] < validTrend[i-1] ? "↓" : "→") : null;
          const trendColor = trend_dir === "↑" ? "#4caf8a" : trend_dir === "↓" ? "#be3650" : "#8a8a84";

          return (
            <div key={yr}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <div style={{ fontSize:10, fontWeight:500, color:"#8a8a84", width:36, flexShrink:0 }}>FY{yr}</div>
                <div style={{ flex:1 }}>
                  {/* State bar */}
                  <div style={{ position:"relative", height:8, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginBottom:3 }}>
                    <div style={{ position:"absolute", height:"100%", width:`${pct}%`, background:"#861442", borderRadius:99, transition:"width 0.6s ease" }} />
                  </div>
                  {/* National avg bar (ghost) */}
                  <div style={{ position:"relative", height:4, background:"rgba(255,255,255,0.04)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ position:"absolute", height:"100%", width:`${natPct}%`, background:"rgba(255,255,255,0.2)", borderRadius:99 }} />
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, minWidth:90 }}>
                  <span style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:14, color:"#f0ede8" }}>
                    {val != null ? `$${val.toFixed(2)}` : "N/A"}
                  </span>
                  {trend_dir && <span style={{ fontSize:11, color:trendColor, marginLeft:4 }}>{trend_dir}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:16, marginTop:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:16, height:4, background:"#861442", borderRadius:2 }} />
          <span style={{ fontSize:10, color:"#8a8a84" }}>State $/cap</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:16, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2 }} />
          <span style={{ fontSize:10, color:"#8a8a84" }}>National avg</span>
        </div>
      </div>
    </div>
  );
}

// ── D: STATE DETAIL ───────────────────────────────────────────────────────────
function StateDetail({ stateData, natTrend, natYears }) {
  if (!stateData) return null;
  const s = stateData;
  const roi = (s.gdp_b && s.inv_total)
    ? Math.round((s.gdp_b * 1e9) / (s.inv_total * 1e6)).toLocaleString()
    : null;

  const lineItemGap = s.inv_total && s.inv_baseline &&
    Math.abs(s.inv_total - s.inv_baseline) / s.inv_total > 0.2;

  return (
    <div className="dot-anim">

      {/* State name + region */}
      <div style={{ padding:"1.5rem 0 1rem", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:"1.25rem" }}>
        <div style={{ fontFamily:"var(--font-display)", fontWeight:300, fontSize:"clamp(24px,5vw,36px)", letterSpacing:"-0.02em", color:"#f0ede8", lineHeight:1.1 }}>
          {s.state}
        </div>
        <div style={{ fontSize:11, color:"#be3650", marginTop:4, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase" }}>
          {s.region}
        </div>
      </div>

      {/* Top 3 stat boxes */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:10 }}>
        {[
          { label:"Creative GDP",    value: s.gdp_b ? `$${s.gdp_b}B` : "N/A" },
          { label:"Arts Investment", value: s.inv_percap ? `$${s.inv_percap.toFixed(2)}/cap` : "N/A" },
          { label:"Return on $1",    value: roi ? `$${roi}` : "N/A" },
        ].map(({ label, value }) => (
          <div key={label} style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"0.85rem 1rem", textAlign:"center" }}>
            <div style={{ fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8a8a84", marginBottom:6 }}>{label}</div>
            <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:"clamp(16px,3vw,22px)", color:"#f0ede8", lineHeight:1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Three data boxes — Employment, GDP Share, Public Arts */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>

        {/* Employment */}
        <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1rem" }}>
          <div style={{ fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8a8a84", marginBottom:8 }}>Arts & Cultural Employment</div>
          <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:26, color:"#f0ede8", lineHeight:1, marginBottom:4 }}>
            {s.jobs ? s.jobs.toLocaleString() : "N/A"}
          </div>
          {s.jobs_pct && (
            <div style={{ fontSize:11, color:"#c8c4bc", marginBottom:4 }}>
              {s.jobs_pct}% of workforce
            </div>
          )}
          {s.jobs_pct && (
            <div style={{ fontSize:10, color: s.jobs_pct >= 3.4 ? "#4caf8a" : "#be3650" }}>
              National avg: 3.4%
            </div>
          )}
        </div>

        {/* GDP Share */}
        <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1rem" }}>
          <div style={{ fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8a8a84", marginBottom:8 }}>Creative Industry GDP Share</div>
          <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:26, color:"#f0ede8", lineHeight:1, marginBottom:4 }}>
            {s.gdp_pct ? `${s.gdp_pct}%` : "N/A"}
          </div>
          {s.gdp_b && (
            <div style={{ fontSize:11, color:"#c8c4bc", marginBottom:4 }}>
              ${s.gdp_b}B total
            </div>
          )}
          {s.gdp_pct && (
            <div style={{ fontSize:10, color: s.gdp_pct >= 4.2 ? "#4caf8a" : "#be3650" }}>
              National avg: 4.2%
            </div>
          )}
        </div>

        {/* Public Arts Investment */}
        <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1rem" }}>
          <div style={{ fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8a8a84", marginBottom:8 }}>Public Arts Investment</div>
          <div style={{ fontFamily:"var(--font-display)", fontStyle:"italic", fontWeight:300, fontSize:26, color:"#f0ede8", lineHeight:1, marginBottom:4 }}>
            {s.inv_percap ? `$${s.inv_percap.toFixed(2)}` : "N/A"}
          </div>
          {s.inv_percap && (
            <div style={{ fontSize:11, color:"#c8c4bc", marginBottom:4 }}>
              per capita · {s.inv_total ? fmtM(s.inv_total) + " total" : ""}
            </div>
          )}
          {s.nasaa_rank && (
            <div style={{ fontSize:10, color: s.nasaa_rank <= 25 ? "#4caf8a" : "#be3650" }}>
              Rank #{s.nasaa_rank}/50 states
            </div>
          )}
        </div>

      </div>

      {/* NASAA Trend */}
      <div style={{ background:"#242422", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1.1rem 1.25rem", marginBottom:10 }}>
        <NasaaTrend
          trend={s.nasaa_trend}
          years={s.nasaa_years || natYears}
          natTrend={natTrend}
        />
        {lineItemGap && (
          <div style={{ fontSize:10, color:"#5a5a56", marginTop:10, lineHeight:1.6 }}>
            * Total appropriation includes legislative line items ({fmtM(s.inv_total)}).
            Baseline appropriation: {fmtM(s.inv_baseline)}. See NASAA FY2025 report for detail.
          </div>
        )}
      </div>

      <p style={{ fontSize:10, color:"#5a5a56", marginTop:4, lineHeight:1.6 }}>
        Sources: BEA ACPSA 2023 (final dataset — discontinued February 2026) · NASAA FY2025 State Arts Agency Revenues Report · BLS 2023
      </p>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [regionsData, setRegionsData]       = useState(null);
  const [national, setNational]             = useState(null);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [regionsError, setRegionsError]     = useState(null);
  const [selectedState, setSelectedState]   = useState("");

  useEffect(() => {
    fetch("/api/regions")
      .then(r => r.json())
      .then(data => { setRegionsData(data.regions); setNational(data.national); setLoadingRegions(false); })
      .catch(() => { setRegionsError("Could not load data."); setLoadingRegions(false); });
  }, []);

  // Flat state lookup map from all regions
  const stateMap = useMemo(() => {
    if (!regionsData) return {};
    const map = {};
    regionsData.forEach(r => {
      (r.stateDetails || []).forEach(s => { map[s.state] = { ...s, region: r.region }; });
    });
    return map;
  }, [regionsData]);

  const selectedStateData = selectedState ? stateMap[selectedState] : null;
  const natTrend  = national?.nasaa_national_trend || [];
  const natYears  = national?.nasaa_years || [2022,2023,2024,2025];

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
          letter-spacing:0.04em; transition:opacity 0.15s,transform 0.1s; }
        .btn-primary:hover { opacity:0.88; }
        .btn-primary:active { transform:scale(0.97); }
        .state-select {
          width:100%; padding:11px 36px 11px 14px; background:#111110;
          border:1.5px solid rgba(134,20,66,0.5); border-radius:var(--radius);
          color:#f0ede8; font-family:var(--font-body); font-size:14px; font-weight:300;
          outline:none; cursor:pointer; transition:border-color 0.2s; appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888580' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 14px center;
        }
        .state-select:focus { border-color:#861442; }
        .page-footer-rule { width:100%; height:1.5px; background:rgba(134,20,66,0.5); }
        .page-footer { background:#111110; padding:1.25rem clamp(16px,4vw,2rem);
          font-family:var(--font-body); font-size:11px; font-weight:400;
          color:rgba(255,255,255,0.7); text-align:center; line-height:20px; }
        .page-footer a { color:#861442; text-decoration:none; font-weight:500; }
        .page-footer a:hover { color:#be3650; }
        @media (max-width:640px) {
          .hide-mobile { display:none !important; }
          .two-col { grid-template-columns:1fr !important; }
          .three-col { grid-template-columns:1fr !important; }
        }
        @media print { .no-print { display:none !important; } }
      `}</style>

      <div style={{ maxWidth:860, margin:"0 auto", overflow:"hidden" }}>

        <h1 style={{ position:"absolute", width:1, height:1, padding:0, margin:-1, overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap", border:0 }}>
          Creative Industries Scorecard — Free State Arts Data Tool | Data on Tap
        </h1>

        <HeroBanner />

        {/* ── A: NATIONAL STAT BAR ── */}
        {national && (
          <div style={{ background:"#111110", display:"flex", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {[
              { val:`$${(national.gdp_b/1000).toFixed(1)}T`, label:"Creative Industries\nEconomic Impact" },
              { val:`${national.gdp_pct}%`,                   label:"U.S. GDP\nBEA ACPSA 2023" },
              { val:`${(national.jobs/1e6).toFixed(1)}M`,     label:"Creative Jobs\nNationwide" },
              { val: national.nasaa_nat_percap ? `$${national.nasaa_nat_percap.toFixed(2)}/cap` : "$2.02/cap", label:"Avg Arts Investment\nNASAA FY2025" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                <div style={{ flex:1, padding:"0.9rem clamp(8px,2vw,1.25rem)", textAlign:"center" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:300, fontStyle:"italic", fontSize:"clamp(0.95rem,2.5vw,1.4rem)", color:"#f0ede8", lineHeight:1, marginBottom:4 }}>{item.val}</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:9, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em", color:"#f0ede8", opacity:0.6, lineHeight:1.6, whiteSpace:"pre-line" }}>{item.label}</div>
                </div>
                {i < arr.length-1 && <div style={{ width:1, height:28, background:"rgba(255,255,255,0.1)", flexShrink:0 }} />}
              </div>
            ))}
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div style={{ padding:"0 clamp(16px,4vw,2rem) 3rem" }}>

          {loadingRegions && <div style={{ padding:"3rem 0" }}><PulseLoader text="Loading data…" /></div>}
          {regionsError  && <p style={{ padding:"2rem 0", fontSize:13, color:"#c0705a" }}>{regionsError}</p>}

          {regionsData && (
            <>
              {/* ── B: INDUSTRY COMPARISON ── */}
              <IndustryComparison />

              {/* ── C: REGIONAL TABLE ── */}
              <RegionalTable regionsData={regionsData} />

              {/* ── D: STATE DROPDOWN + DETAIL ── */}
              <div>
                <SectionHeader
                  label="State Breakdown"
                  sub="Select a state to view creative economy data — BEA 2023 snapshot + NASAA FY2022–FY2025 investment trend."
                />

                <div style={{ position:"relative", marginBottom:16 }}>
                  <select
                    className="state-select"
                    value={selectedState}
                    onChange={e => {
                      setSelectedState(e.target.value);
                      if (e.target.value) logEvent("state_select", { state: e.target.value });
                    }}
                  >
                    <option value="">— select a state —</option>
                    {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {selectedStateData && (
                  <StateDetail
                    stateData={selectedStateData}
                    natTrend={natTrend}
                    natYears={natYears}
                  />
                )}
              </div>
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
