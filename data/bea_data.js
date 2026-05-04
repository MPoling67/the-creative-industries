// ─── BEA ACPSA State Data ─────────────────────────────────────────────────────
// Source: U.S. Bureau of Economic Analysis
// Arts and Cultural Production Satellite Account (ACPSA), April 2025 release
// Final published dataset — BEA discontinued regular ACPSA production Feb 2026
// Tables: 2 (Value Added by State), 3 (% of GDP), 8 (Employment by State)
// Jobs % calculated from BLS 2023 civilian employed by state
//
// Fields per state:
//   gdp_b      — total arts & cultural value added, billions USD (2023)
//   gdp_pct    — arts & cultural production as % of state GDP (2023)
//   jobs       — total arts & cultural employment (2023)
//   jobs_pct   — creative jobs as % of state civilian workforce (2023)

export const BEA_DATA = {
  national: {
    gdp_b: 1169.75,
    gdp_pct: 4.2,
    jobs: 5395370,
    jobs_pct: 3.4
  },
  states: {
    "Alabama":        { gdp_b: 7.1,    gdp_pct: 2.3, jobs: 61167,   jobs_pct: 3.0 },
    "Alaska":         { gdp_b: 1.47,   gdp_pct: 2.2, jobs: 13291,   jobs_pct: 3.9 },
    "Arizona":        { gdp_b: 15.8,   gdp_pct: 3.0, jobs: 95294,   jobs_pct: 2.9 },
    "Arkansas":       { gdp_b: 3.85,   gdp_pct: 2.2, jobs: 32906,   jobs_pct: 2.5 },
    "California":     { gdp_b: 288.9,  gdp_pct: 7.5, jobs: 821183,  jobs_pct: 4.4 },
    "Colorado":       { gdp_b: 19.7,   gdp_pct: 3.7, jobs: 121228,  jobs_pct: 4.1 },
    "Connecticut":    { gdp_b: 13.94,  gdp_pct: 4.0, jobs: 53421,   jobs_pct: 3.1 },
    "Delaware":       { gdp_b: 1.13,   gdp_pct: 1.2, jobs: 10156,   jobs_pct: 2.2 },
    "Florida":        { gdp_b: 50.85,  gdp_pct: 3.2, jobs: 307615,  jobs_pct: 3.0 },
    "Georgia":        { gdp_b: 31.22,  gdp_pct: 3.8, jobs: 164919,  jobs_pct: 3.4 },
    "Hawaii":         { gdp_b: 3.25,   gdp_pct: 2.9, jobs: 19608,   jobs_pct: 3.0 },
    "Idaho":          { gdp_b: 2.77,   gdp_pct: 2.3, jobs: 25272,   jobs_pct: 3.0 },
    "Illinois":       { gdp_b: 37.39,  gdp_pct: 3.4, jobs: 226407,  jobs_pct: 3.7 },
    "Indiana":        { gdp_b: 10.09,  gdp_pct: 2.0, jobs: 92643,   jobs_pct: 2.9 },
    "Iowa":           { gdp_b: 5.2,    gdp_pct: 2.0, jobs: 48290,   jobs_pct: 3.1 },
    "Kansas":         { gdp_b: 5.48,   gdp_pct: 2.4, jobs: 49454,   jobs_pct: 3.5 },
    "Kentucky":       { gdp_b: 6.92,   gdp_pct: 2.5, jobs: 51094,   jobs_pct: 2.6 },
    "Louisiana":      { gdp_b: 6.56,   gdp_pct: 2.1, jobs: 48591,   jobs_pct: 2.4 },
    "Maine":          { gdp_b: 2.5,    gdp_pct: 2.7, jobs: 18073,   jobs_pct: 2.8 },
    "Maryland":       { gdp_b: 13.67,  gdp_pct: 2.7, jobs: 86234,   jobs_pct: 2.9 },
    "Massachusetts":  { gdp_b: 29.74,  gdp_pct: 4.0, jobs: 130263,  jobs_pct: 3.5 },
    "Michigan":       { gdp_b: 20.55,  gdp_pct: 3.0, jobs: 144279,  jobs_pct: 3.1 },
    "Minnesota":      { gdp_b: 14.8,   gdp_pct: 3.1, jobs: 93918,   jobs_pct: 3.2 },
    "Mississippi":    { gdp_b: 2.71,   gdp_pct: 1.8, jobs: 31781,   jobs_pct: 2.7 },
    "Missouri":       { gdp_b: 12.65,  gdp_pct: 2.9, jobs: 89121,   jobs_pct: 3.1 },
    "Montana":        { gdp_b: 2.45,   gdp_pct: 3.3, jobs: 20269,   jobs_pct: 3.9 },
    "Nebraska":       { gdp_b: 4.1,    gdp_pct: 2.3, jobs: 34454,   jobs_pct: 3.4 },
    "Nevada":         { gdp_b: 12.43,  gdp_pct: 5.1, jobs: 46761,   jobs_pct: 3.2 },
    "New Hampshire":  { gdp_b: 3.51,   gdp_pct: 3.1, jobs: 22986,   jobs_pct: 3.2 },
    "New Jersey":     { gdp_b: 29.19,  gdp_pct: 3.6, jobs: 148377,  jobs_pct: 3.5 },
    "New Mexico":     { gdp_b: 3.46,   gdp_pct: 2.6, jobs: 28153,   jobs_pct: 3.2 },
    "New York":       { gdp_b: 164.71, gdp_pct: 7.6, jobs: 482543,  jobs_pct: 5.1 },
    "North Carolina": { gdp_b: 25.05,  gdp_pct: 3.2, jobs: 167254,  jobs_pct: 3.5 },
    "North Dakota":   { gdp_b: 1.77,   gdp_pct: 2.3, jobs: 14852,   jobs_pct: 3.7 },
    "Ohio":           { gdp_b: 26.12,  gdp_pct: 3.0, jobs: 150783,  jobs_pct: 2.7 },
    "Oklahoma":       { gdp_b: 5.41,   gdp_pct: 2.1, jobs: 48659,   jobs_pct: 2.8 },
    "Oregon":         { gdp_b: 11.07,  gdp_pct: 3.5, jobs: 70137,   jobs_pct: 3.5 },
    "Pennsylvania":   { gdp_b: 30.43,  gdp_pct: 3.1, jobs: 189700,  jobs_pct: 3.1 },
    "Rhode Island":   { gdp_b: 2.57,   gdp_pct: 3.3, jobs: 17424,   jobs_pct: 3.4 },
    "South Carolina": { gdp_b: 9.41,   gdp_pct: 2.9, jobs: 67784,   jobs_pct: 3.0 },
    "South Dakota":   { gdp_b: 1.5,    gdp_pct: 2.0, jobs: 16176,   jobs_pct: 3.7 },
    "Tennessee":      { gdp_b: 21.18,  gdp_pct: 4.0, jobs: 108773,  jobs_pct: 3.4 },
    "Texas":          { gdp_b: 65.57,  gdp_pct: 2.5, jobs: 360964,  jobs_pct: 2.7 },
    "Utah":           { gdp_b: 9.59,   gdp_pct: 3.4, jobs: 69047,   jobs_pct: 4.4 },
    "Vermont":        { gdp_b: 1.25,   gdp_pct: 2.9, jobs: 10412,   jobs_pct: 3.2 },
    "Virginia":       { gdp_b: 21.35,  gdp_pct: 3.0, jobs: 117878,  jobs_pct: 2.9 },
    "Washington":     { gdp_b: 78.99,  gdp_pct: 9.8, jobs: 190684,  jobs_pct: 5.1 },
    "West Virginia":  { gdp_b: 1.57,   gdp_pct: 1.5, jobs: 18145,   jobs_pct: 2.5 },
    "Wisconsin":      { gdp_b: 12.44,  gdp_pct: 2.9, jobs: 95305,   jobs_pct: 3.2 },
    "Wyoming":        { gdp_b: 1.38,   gdp_pct: 2.7, jobs: 11336,   jobs_pct: 3.9 }
  }
};
