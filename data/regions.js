// ─── api/regions.js ───────────────────────────────────────────────────────────
// Vercel serverless function — GET /api/regions
// Returns pre-computed regional aggregates from BEA + NASAA data.
// No AI call. Instant.

import { BEA_DATA } from '../data/bea_data.js';
import { NASAA_DATA, NASAA_TOTALS, NASAA_RANKS } from '../data/nasaa_data.js';
import { REGIONS } from '../data/regions.js';

const NAT = BEA_DATA.national;

function scoreColor(score) {
  if (score >= 60) return '#1D9E75';
  if (score >= 45) return '#d4b800';
  return '#be3650';
}

function computeRegion(regionName) {
  const { states, emoji, tagline } = REGIONS[regionName];

  let totalGdp   = 0;
  let totalJobs  = 0;
  let gdpPcts    = [];
  let jobsPcts   = [];
  let invPercaps = [];
  let topState   = { name: null, gdp: 0 };
  let stateDetails = [];

  for (const state of states) {
    const bea  = BEA_DATA.states[state]    || {};
    const nasaaArr = (NASAA_DATA.states && NASAA_DATA.states[state]) || [];
    const tot  = (NASAA_TOTALS.states && NASAA_TOTALS.states[state]) || {};

    if (bea.gdp_b)    totalGdp  += bea.gdp_b;
    if (bea.jobs)     totalJobs += bea.jobs;
    if (bea.gdp_pct)  gdpPcts.push(bea.gdp_pct);
    if (bea.jobs_pct) jobsPcts.push(bea.jobs_pct);

    const percap = nasaaArr.filter(v => v != null).pop() ?? null;
    if (percap !== null) invPercaps.push(percap);

    if ((bea.gdp_b || 0) > topState.gdp) {
      topState = { name: state, gdp: bea.gdp_b };
    }

    stateDetails.push({
      state,
      gdp_b:    bea.gdp_b    ?? null,
      gdp_pct:  bea.gdp_pct  ?? null,
      jobs:     bea.jobs     ?? null,
      jobs_pct: bea.jobs_pct ?? null,
      inv_percap: percap,
      inv_total:  tot.total_fy2025 ?? null,
      nasaa_rank: (NASAA_RANKS.states && NASAA_RANKS.states[state]) ?? null,
    });
  }

  const avg = arr => arr.length ? Math.round((arr.reduce((a,b) => a+b,0) / arr.length) * 10) / 10 : null;

  const avgGdpPct  = avg(gdpPcts);
  const avgJobsPct = avg(jobsPcts);
  const avgInvPercap = avg(invPercaps);

  // Score: 50 = at national avg, scaled linearly
  const gdpScore  = avgGdpPct  ? Math.min(100, Math.round((avgGdpPct  / NAT.gdp_pct)  * 50)) : 50;
  const jobsScore = avgJobsPct ? Math.min(100, Math.round((avgJobsPct / NAT.jobs_pct) * 50)) : 50;
  const overallScore = Math.round(gdpScore * 0.6 + jobsScore * 0.4);

  return {
    region:       regionName,
    emoji,
    tagline,
    stateCount:   states.length,
    states,
    stateDetails,
    totalGdp:     Math.round(totalGdp * 10) / 10,
    totalJobs,
    avgGdpPct,
    avgJobsPct,
    avgInvPercap,
    topState:     topState.name,
    overallScore,
    scoreColor:   scoreColor(overallScore),
    // national benchmarks for client-side reference
    nat: {
      gdp_pct:  NAT.gdp_pct,
      jobs_pct: NAT.jobs_pct,
    }
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const regions = Object.keys(REGIONS).map(name => computeRegion(name));
    return res.status(200).json({
      regions,
      national: {
        gdp_b:    NAT.gdp_b,
        gdp_pct:  NAT.gdp_pct,
        jobs:     NAT.jobs,
        jobs_pct: NAT.jobs_pct,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to compute regions', details: err.message });
  }
}
