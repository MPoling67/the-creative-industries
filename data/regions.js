// ─── Region Definitions ───────────────────────────────────────────────────────
// Shared between api/regions.js and api/anthropic.js
// 8 regions covering all 50 states

export const REGIONS = {
  "New England": {
    states: ["Maine","Vermont","New Hampshire","Massachusetts","Rhode Island","Connecticut"],
    emoji: "🦞",
    tagline: "Small states, outsized creative density"
  },
  "Mid-Atlantic": {
    states: ["New York","New Jersey","Pennsylvania","Maryland","Delaware"],
    emoji: "🗽",
    tagline: "The nation's creative and media capital"
  },
  "Southeast": {
    states: ["Virginia","West Virginia","North Carolina","South Carolina","Georgia","Florida"],
    emoji: "🌴",
    tagline: "Film, music, and a fast-growing creative class"
  },
  "Gulf South": {
    states: ["Texas","Oklahoma","Arkansas","Louisiana","Mississippi","Alabama","Tennessee","Kentucky"],
    emoji: "🎸",
    tagline: "Music, storytelling, and emerging tech hubs"
  },
  "Great Lakes": {
    states: ["Ohio","Indiana","Michigan","Wisconsin","Illinois"],
    emoji: "🏙️",
    tagline: "Architecture, design, and industrial creative legacy"
  },
  "Plains": {
    states: ["Minnesota","Iowa","Missouri","North Dakota","South Dakota","Nebraska","Kansas"],
    emoji: "🌾",
    tagline: "Craft traditions and a growing independent arts scene"
  },
  "Rocky Mountain": {
    states: ["Montana","Idaho","Wyoming","Colorado","Utah","Nevada"],
    emoji: "⛰️",
    tagline: "Outdoor culture, gaming, and high-altitude creative growth"
  },
  "Southwest & Pacific": {
    states: ["Arizona","New Mexico","Washington","Oregon","California","Alaska","Hawaii"],
    emoji: "🌊",
    tagline: "Tech, film, Indigenous arts, and the Pacific Rim"
  }
};
