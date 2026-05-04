// ─── NASAA State Arts Agency Data ────────────────────────────────────────────
// Source: National Assembly of State Arts Agencies (NASAA)
// State Arts Agency Revenues Reports — nasaa-arts.org
//
// NASAA_DATA        — per capita investment (Legislative Approp incl. line items, $/capita)
//                     FY2022 derived · FY2023 direct from Table 6 · FY2024 derived · FY2025 direct from Table 6
// NASAA_TOTALS      — total appropriation & baseline (excl. line items), FY2025, millions USD
// NASAA_RANKS       — per capita rank of 50 states, FY2025, Legislative Approp incl. line items
//
// Update cycle: NASAA publishes twice yearly. Replace values when new report is released.
// FY2026 report expected: summer 2026

// ─── NASAA Real Data ───────────────────────────────────────────────────────
// Source: NASAA State Arts Agency Revenues Reports, Table 6
// Metric: Legislative Appropriation Including Line Items ($/capita)
// FY2022 derived from Table 1/5 revenue totals · FY2023 & FY2025 direct from Table 6
// FY2024 derived from Table 5 FY2024 revenue totals
export const NASAA_DATA = {
  years: [2022, 2023, 2024, 2025],
  national: [2.47, 2.88, 2.23, 2.02],
  states: {
    "Alabama":        [1.32, 1.50, 2.01, 1.58],
    "Alaska":         [0.96, 1.05, 0.94, 1.24],
    "Arizona":        [0.62, 0.68, 0.97, 0.26],
    "Arkansas":       [0.44, 0.45, 0.46, 0.48],
    "California":     [4.31, 3.48, 1.01, 0.82],
    "Colorado":       [0.34, 0.35, 0.39, 0.55],
    "Connecticut":    [9.44, 10.38, 2.27, 1.88],
    "Delaware":       [3.81, 3.81, 4.78, 5.62],
    "Florida":        [1.97, 3.76, 2.59, 1.31],
    "Georgia":        [0.14, 0.14, 0.15, 0.14],
    "Hawaii":         [5.40, 5.05, 11.14, 11.10],
    "Idaho":          [0.47, 0.47, 0.54, 0.47],
    "Illinois":       [5.05, 5.06, 5.17, 2.71],
    "Indiana":        [0.53, 0.53, 0.77, 0.75],
    "Iowa":           [0.46, 0.46, 0.68, 0.69],
    "Kansas":         [0.17, 0.17, 0.35, 0.51],
    "Kentucky":       [0.39, 0.40, 0.41, 0.40],
    "Louisiana":      [0.47, 0.47, 0.46, 0.46],
    "Maine":          [0.73, 0.74, 0.74, 0.74],
    "Maryland":       [4.34, 4.51, 5.70, 5.47],
    "Massachusetts":  [3.10, 3.35, 3.74, 3.76],
    "Michigan":       [0.98, 1.18, 0.87, 1.10],
    "Minnesota":      [7.37, 7.62, 9.68, 10.07],
    "Mississippi":    [0.56, 2.01, 3.57, 3.38],
    "Missouri":       [1.15, 3.01, 4.74, 8.72],
    "Montana":        [0.51, 0.47, 1.02, 1.00],
    "Nebraska":       [1.30, 5.13, 1.33, 1.31],
    "Nevada":         [0.63, 0.66, 0.72, 0.75],
    "New Hampshire":  [0.60, 0.60, 1.04, 1.01],
    "New Jersey":     [6.63, 4.40, 4.93, 4.32],
    "New Mexico":     [0.67, 0.75, 0.82, 0.79],
    "New York":       [5.42, 12.27, 5.59, 4.39],
    "North Carolina": [2.22, 0.85, 1.18, 1.12],
    "North Dakota":   [1.08, 1.10, 1.72, 1.65],
    "Ohio":           [1.71, 1.71, 2.19, 2.15],
    "Oklahoma":       [0.75, 0.81, 1.06, 1.06],
    "Oregon":         [0.96, 2.64, 1.43, 1.89],
    "Pennsylvania":   [0.81, 0.81, 0.81, 0.82],
    "Rhode Island":   [1.99, 2.01, 2.17, 2.15],
    "South Carolina": [8.90, 2.64, 2.49, 2.24],
    "South Dakota":   [1.23, 1.22, 1.47, 1.52],
    "Tennessee":      [1.41, 1.56, 2.17, 2.22],
    "Texas":          [0.34, 0.34, 0.47, 0.46],
    "Utah":           [2.73, 2.79, 2.14, 3.09],
    "Vermont":        [1.23, 1.33, 1.52, 1.50],
    "Virginia":       [0.46, 0.53, 0.54, 0.52],
    "Washington":     [0.42, 0.68, 0.86, 0.98],
    "West Virginia":  [0.51, 0.54, 0.44, 0.46],
    "Wisconsin":      [0.14, 0.14, 0.19, 0.18],
    "Wyoming":        [1.60, 1.54, 1.68, 1.83]
  }
};

// ─── NASAA Totals FY2025 ────────────────────────────────────────────────────
// Source: NASAA FY2025 Report, Table 1 (total incl. line items) & Table 2 (excl.)
// Values in millions of dollars
export const NASAA_TOTALS = {
  states: {
    "Alabama":        { total_fy2025: 8.16,   baseline_fy2025: 6.83  },
    "Alaska":         { total_fy2025: 0.92,   baseline_fy2025: 0.92  },
    "Arizona":        { total_fy2025: 2.00,   baseline_fy2025: 2.00  },
    "Arkansas":       { total_fy2025: 1.47,   baseline_fy2025: 1.47  },
    "California":     { total_fy2025: 32.39,  baseline_fy2025: 32.39 },
    "Colorado":       { total_fy2025: 3.27,   baseline_fy2025: 3.27  },
    "Connecticut":    { total_fy2025: 6.91,   baseline_fy2025: 1.50  },
    "Delaware":       { total_fy2025: 5.91,   baseline_fy2025: 5.91  },
    "Florida":        { total_fy2025: 30.67,  baseline_fy2025: 0.74  },
    "Georgia":        { total_fy2025: 1.59,   baseline_fy2025: 1.59  },
    "Hawaii":         { total_fy2025: 16.05,  baseline_fy2025: 6.55  },
    "Idaho":          { total_fy2025: 0.93,   baseline_fy2025: 0.93  },
    "Illinois":       { total_fy2025: 34.40,  baseline_fy2025: 19.73 },
    "Indiana":        { total_fy2025: 5.20,   baseline_fy2025: 5.20  },
    "Iowa":           { total_fy2025: 2.22,   baseline_fy2025: 1.15  },
    "Kansas":         { total_fy2025: 1.52,   baseline_fy2025: 1.52  },
    "Kentucky":       { total_fy2025: 1.83,   baseline_fy2025: 1.83  },
    "Louisiana":      { total_fy2025: 2.11,   baseline_fy2025: 2.11  },
    "Maine":          { total_fy2025: 1.04,   baseline_fy2025: 1.04  },
    "Maryland":       { total_fy2025: 34.25,  baseline_fy2025: 33.33 },
    "Massachusetts":  { total_fy2025: 26.85,  baseline_fy2025: 25.90 },
    "Michigan":       { total_fy2025: 11.13,  baseline_fy2025: 9.51  },
    "Minnesota":      { total_fy2025: 58.32,  baseline_fy2025: 58.32 },
    "Mississippi":    { total_fy2025: 9.94,   baseline_fy2025: 9.94  },
    "Missouri":       { total_fy2025: 54.44,  baseline_fy2025: 10.95 },
    "Montana":        { total_fy2025: 1.13,   baseline_fy2025: 1.13  },
    "Nebraska":       { total_fy2025: 2.63,   baseline_fy2025: 2.63  },
    "Nevada":         { total_fy2025: 2.44,   baseline_fy2025: 2.44  },
    "New Hampshire":  { total_fy2025: 1.42,   baseline_fy2025: 1.42  },
    "New Jersey":     { total_fy2025: 41.06,  baseline_fy2025: 32.36 },
    "New Mexico":     { total_fy2025: 1.69,   baseline_fy2025: 1.69  },
    "New York":       { total_fy2025: 87.28,  baseline_fy2025: 82.78 },
    "North Carolina": { total_fy2025: 12.41,  baseline_fy2025: 12.29 },
    "North Dakota":   { total_fy2025: 1.31,   baseline_fy2025: 1.31  },
    "Ohio":           { total_fy2025: 25.56,  baseline_fy2025: 25.56 },
    "Oklahoma":       { total_fy2025: 4.35,   baseline_fy2025: 3.95  },
    "Oregon":         { total_fy2025: 8.06,   baseline_fy2025: 2.18  },
    "Pennsylvania":   { total_fy2025: 10.66,  baseline_fy2025: 10.66 },
    "Rhode Island":   { total_fy2025: 2.40,   baseline_fy2025: 2.00  },
    "South Carolina": { total_fy2025: 12.25,  baseline_fy2025: 12.05 },
    "South Dakota":   { total_fy2025: 1.41,   baseline_fy2025: 1.41  },
    "Tennessee":      { total_fy2025: 16.02,  baseline_fy2025: 15.72 },
    "Texas":          { total_fy2025: 14.32,  baseline_fy2025: 14.32 },
    "Utah":           { total_fy2025: 10.84,  baseline_fy2025: 10.84 },
    "Vermont":        { total_fy2025: 0.97,   baseline_fy2025: 0.97  },
    "Virginia":       { total_fy2025: 4.59,   baseline_fy2025: 4.59  },
    "Washington":     { total_fy2025: 7.80,   baseline_fy2025: 7.80  },
    "West Virginia":  { total_fy2025: 0.81,   baseline_fy2025: 0.81  },
    "Wisconsin":      { total_fy2025: 1.08,   baseline_fy2025: 1.08  },
    "Wyoming":        { total_fy2025: 1.08,   baseline_fy2025: 1.08  }
  }
};

// ─── NASAA Rankings FY2025 ──────────────────────────────────────────────────
// Source: NASAA FY2025 Report, Table 6 · Legislative Approp Incl. Line Items · rank of 50
export const NASAA_RANKS = {
  states: {
    "Alabama": 20, "Alaska": 25, "Arizona": 48, "Arkansas": 42,
    "California": 32, "Colorado": 39, "Connecticut": 17, "Delaware": 4,
    "Florida": 23, "Georgia": 50, "Hawaii": 1, "Idaho": 43,
    "Illinois": 11, "Indiana": 35, "Iowa": 38, "Kansas": 41,
    "Kentucky": 47, "Louisiana": 44, "Maine": 37, "Maryland": 5,
    "Massachusetts": 8, "Michigan": 27, "Minnesota": 2, "Mississippi": 9,
    "Missouri": 3, "Montana": 30, "Nebraska": 24, "Nevada": 36,
    "New Hampshire": 29, "New Jersey": 7, "New Mexico": 34, "New York": 6,
    "North Carolina": 26, "North Dakota": 19, "Ohio": 15, "Oklahoma": 28,
    "Oregon": 16, "Pennsylvania": 33, "Rhode Island": 14, "South Carolina": 12,
    "South Dakota": 21, "Tennessee": 13, "Texas": 46, "Utah": 10,
    "Vermont": 22, "Virginia": 40, "Washington": 31, "West Virginia": 45,
    "Wisconsin": 49, "Wyoming": 18
  }
};