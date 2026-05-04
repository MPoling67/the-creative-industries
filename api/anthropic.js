// ─── api/anthropic.js ─────────────────────────────────────────────────────────
// Vercel serverless function — POST /api/anthropic
// Handles two call types:
//   { type: 'region', region: 'New England' }
//   { type: 'state',  state: 'Massachusetts', region: 'New England' }
//
// All prompts are built server-side. Data never touches the client.

import { BEA_DATA } from '../data/bea_data.js';
import { NASAA_DATA, NASAA_TOTALS, NASAA_RANKS } from '../data/nasaa_data.js';
import { REGIONS } from '../data/regions.js';

const NAT = BEA_DATA.national;

// ── Data helper ───────────────────────────────────────────────────────────────
function getStateData(state) {
  const bea     = BEA_DATA.states[state] || {};
  const nasaaArr = (NASAA_DATA.states && NASAA_DATA.states[state]) || [];
  const tot     = (NASAA_TOTALS.states && NASAA_TOTALS.states[state]) || {};
  const rank    = (NASAA_RANKS.states  && NASAA_RANKS.states[state])  ?? null;

  const validPercaps = nasaaArr.filter(v => v != null);
  const inv_percap      = validPercaps[validPercaps.length - 1] ?? null;
  const inv_percap_prev = validPercaps[validPercaps.length - 2] ?? null;

  const natNasaa = (NASAA_DATA.national || []).filter(v => v != null);
  const nat_percap = natNasaa[natNasaa.length - 1] ?? null;

  const roi = (bea.gdp_b && tot.total_fy2025)
    ? Math.round((bea.gdp_b * 1e9) / (tot.total_fy2025 * 1e6)).toLocaleString()
    : null;

  return {
    gdp_b:            bea.gdp_b    ?? null,
    gdp_pct:          bea.gdp_pct  ?? null,
    jobs:             bea.jobs     ?? null,
    jobs_pct:         bea.jobs_pct ?? null,
    inv_total:        tot.total_fy2025    ?? null,
    inv_baseline:     tot.baseline_fy2025 ?? null,
    inv_percap,
    inv_percap_prev,
    nasaa_rank:       rank,
    nat_gdp_b:        NAT.gdp_b,
    nat_gdp_pct:      NAT.gdp_pct,
    nat_jobs:         NAT.jobs,
    nat_jobs_pct:     NAT.jobs_pct,
    nat_percap,
    roi,
  };
}

// ── Prompt builders ───────────────────────────────────────────────────────────
function buildRegionPrompt(regionName) {
  const { states } = REGIONS[regionName];

  const stateBlocks = states.map(state => {
    const d = getStateData(state);
    const lines = [
      `${state.toUpperCase()}:`,
      `  Creative GDP: $${d.gdp_b}B (${d.gdp_pct}% of state GDP)`,
      `  Creative jobs: ${d.jobs ? d.jobs.toLocaleString() : 'N/A'} (${d.jobs_pct}% of workforce)`,
    ];
    if (d.inv_percap !== null) lines.push(`  Arts investment: $${d.inv_percap}/capita FY2025 (rank #${d.nasaa_rank}/50)`);
    if (d.roi)                 lines.push(`  ROI: $${d.roi} creative GDP per $1 invested`);
    return lines.join('\n');
  }).join('\n\n');

  return `You are a creative industries analyst writing a regional intelligence brief for the ${regionName} region of the United States.

NATIONAL BENCHMARKS (BEA ACPSA 2023):
  Creative GDP: $${NAT.gdp_b}B (${NAT.gdp_pct}% of U.S. GDP)
  Creative jobs: ${NAT.jobs.toLocaleString()} (${NAT.jobs_pct}% of workforce)

VERIFIED STATE DATA FOR ${regionName.toUpperCase()}:
${stateBlocks}

Write a sharp regional brief using ONLY the data above. No hallucination, no generic filler.

Return ONLY valid JSON, no markdown, no preamble:

{
  "region": "${regionName}",
  "headline": "<6 words or fewer — the single most defining thing about this region's creative economy>",
  "narrative": "<3-4 sentences: what makes this region distinctive, which state leads and why (use specific numbers), where the biggest gap is, and one forward-looking insight>",
  "topState": "<state name with highest creative GDP in this region>",
  "gapState": "<state name most underperforming relative to its potential — explain briefly in archetype_note>",
  "opportunity": "<1 sentence — the single highest-leverage opportunity for this region's creative economy>",
  "sources": "BEA ACPSA 2023, NASAA FY2025"
}`;
}

function buildStatePrompt(state, regionName) {
  const d = getStateData(state);

  const investmentLines = [];
  if (d.inv_percap !== null) {
    investmentLines.push(`- Per capita investment: $${d.inv_percap}/capita (national avg: $${d.nat_percap}/capita)`);
    if (d.inv_percap_prev !== null) investmentLines.push(`- Prior period: $${d.inv_percap_prev}/capita`);
  }
  if (d.inv_total)    investmentLines.push(`- Total state arts appropriation: $${d.inv_total}M`);
  if (d.nasaa_rank)   investmentLines.push(`- Rank among 50 states: #${d.nasaa_rank}`);
  if (d.roi)          investmentLines.push(`- Return ratio: $${d.roi} creative GDP per $1 of public arts investment`);
  if (!investmentLines.length) investmentLines.push('- NASAA investment data: pending — omit investment metrics from output');

  return `You are a creative industries analyst. Score ${state}'s creative industries using ONLY the verified data below. Do NOT use web search or memory for different numbers.

REGION: ${regionName}

VERIFIED DATA FOR ${state.toUpperCase()} — BEA ACPSA 2023 & NASAA FY2025:

Creative Industries (BEA ACPSA 2023):
- Creative GDP: $${d.gdp_b}B (national: $${d.nat_gdp_b}B)
- Creative GDP as % of state GDP: ${d.gdp_pct}% (national avg: ${d.nat_gdp_pct}%)
- Total creative jobs: ${d.jobs ? d.jobs.toLocaleString() : 'N/A'} (national: ${d.nat_jobs ? d.nat_jobs.toLocaleString() : 'N/A'})
- Creative jobs as % of workforce: ${d.jobs_pct}% (national avg: ${d.nat_jobs_pct}%)

State Arts Investment (NASAA FY2025):
${investmentLines.join('\n')}

Score ${state} across three dimensions (0–100 each), where 50 = exactly at national average, 100 = top performer. Derive overall score as: employment 35% + gdp 40% + pipeline 25%.

score_color rules: #1D9E75 if overall_score >= 70, #d4b800 if 50–69, #be3650 if below 50.

Return ONLY valid JSON, no markdown, no preamble:

{
  "state": "${state}",
  "region": "${regionName}",
  "overall_score": <number 0-100>,
  "score_color": "<#1D9E75 | #d4b800 | #be3650>",
  "archetype": "<Model | Leading | Developing | Paradox | At risk>",
  "archetype_class": "<arch-model | arch-leading | arch-developing | arch-paradox | arch-atrisk>",
  "archetype_desc": "<one sentence: what this archetype means for ${state} specifically>",
  "dims": {
    "employment": {
      "score": <0-100>,
      "label": "Arts & cultural employment",
      "note": "<one sentence referencing ${state}'s ${d.jobs ? d.jobs.toLocaleString() : 'N/A'} jobs and ${d.jobs_pct}% workforce share vs ${d.nat_jobs_pct}% national>"
    },
    "gdp": {
      "score": <0-100>,
      "label": "Creative industry GDP share",
      "note": "<one sentence: $${d.gdp_b}B / ${d.gdp_pct}% vs national ${d.nat_gdp_pct}%>"
    },
    "pipeline": {
      "score": <0-100>,
      "label": "Public arts investment",
      "note": "<one sentence from investment data above — flag as estimated if NASAA data pending>"
    }
  },
  "narrative": "<2-3 sentences: the specific story of ${state}'s creative economy using only the numbers above>",
  "creative_gdp": "$${d.gdp_b}B",
  "investment": "${d.inv_percap !== null ? '$' + d.inv_percap + '/capita' : 'N/A'}",
  "roi": "${d.roi ? '$' + d.roi : 'N/A'}",
  "sources": "BEA ACPSA 2023, NASAA FY2025"
}`;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, region, state } = req.body || {};

    if (!type || !['region', 'state'].includes(type)) {
      return res.status(400).json({ error: 'type must be "region" or "state"' });
    }
    if (type === 'region' && !region) return res.status(400).json({ error: 'region is required' });
    if (type === 'state'  && (!state || !region)) return res.status(400).json({ error: 'state and region are required' });

    const prompt = type === 'region'
      ? buildRegionPrompt(region)
      : buildStatePrompt(state, region);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      })
    });

    const data = await response.json();
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    if (!textBlocks.length) return res.status(500).json({ error: 'No text in response' });

    const raw   = textBlocks[textBlocks.length - 1].text;
    const clean = raw.replace(/```json|```/g, '').replace(/<[^>]*cite[^>]*>/gi, '').trim();
    const start = clean.indexOf('{');
    const end   = clean.lastIndexOf('}');
    if (start === -1 || end === -1) return res.status(500).json({ error: 'No JSON found', raw });

    const parsed = JSON.parse(clean.slice(start, end + 1));
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: 'API request failed', details: err.message });
  }
}
