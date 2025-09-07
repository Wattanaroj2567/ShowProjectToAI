// Utilities for rendering user avatars

// Deterministically map a string to an HSL color.
// This gives a "random"-looking but stable color per user.
export function colorFromString(input, { saturation = 65, lightness = 55 } = {}) {
  const str = String(input || '')
  if (!str) {
    // Fallback pleasant violet if nothing to hash
    return `hsl(270 ${saturation}% ${lightness}%)`
  }
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // simple string hash
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0 // keep 32-bit
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} ${saturation}% ${lightness}%)`
}

export function initialFromName(name, username) {
  const base = (name || username || 'U').trim()
  return base ? base.charAt(0).toUpperCase() : 'U'
}

