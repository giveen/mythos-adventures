// Level thresholds for D&D 5e (XP required for each level)
const XP_THRESHOLDS = [
  0,      // Level 1
  300,    // 2
  900,    // 3
  2700,   // 4
  6500,   // 5
  14000,  // 6
  23000,  // 7
  34000,  // 8
  48000,  // 9
  64000,  // 10
  85000,  // 11
  100000, // 12
  120000, // 13
  140000, // 14
  165000, // 15
  195000, // 16
  225000, // 17
  265000, // 18
  305000, // 19
  355000  // 20
];

function levelForXp(xp) {
  const x = Number(xp) || 0;
  // Find highest level where xp >= threshold
  let level = 1;
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (x >= XP_THRESHOLDS[i]) {
      level = i + 1; // array index 0 -> level1
      break;
    }
  }
  // Cap at 20
  return Math.min(Math.max(level, 1), 20);
}

function xpForNextLevel(level) {
  const l = Number(level) || 1;
  if (l >= 20) return null;
  return XP_THRESHOLDS[l] || null; // threshold for next level (level+1 index)
}

module.exports = { levelForXp, xpForNextLevel, XP_THRESHOLDS };
