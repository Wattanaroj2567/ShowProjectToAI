export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

export function getApiOrigin() {
  try {
    const u = new URL(API_BASE_URL)
    return `${u.protocol}//${u.host}`
  } catch {
    return 'http://localhost:8080'
  }
}

export function toApiAsset(path) {
  if (!path) return path
  // If already absolute (http/https), return as-is
  if (/^https?:\/\//i.test(path)) return path
  const origin = getApiOrigin()
  // Ensure leading slash
  const p = path.startsWith('/') ? path : `/${path}`
  return `${origin}${p}`
}

// Resolve profile image DB value to a server-served path
// - 'profile-*.jpg' -> '/uploads/profiles/profile-*.jpg'
// - 'avatars/default-avatar.png' -> '/images/avatars/default-avatar.png'
// - already starts with '/uploads' or '/images' -> keep
// - otherwise prefix with '/images/' as a safe default
export function resolveProfileImagePath(img) {
  // Return a usable image path or null (to trigger letter-avatar fallback)
  if (!img) return null
  if (typeof img !== 'string') return null
  const s = img.trim()
  if (!s) return null
  // If string accidentally stored like "/images/https://..." (from older client), recover the absolute URL
  const httpIdx = s.indexOf('http')
  if (httpIdx > 0) {
    const maybeAbs = s.slice(httpIdx)
    if (/^https?:\/\//i.test(maybeAbs)) return maybeAbs
  }
  // Absolute URLs (e.g., Google profile photos) -> keep
  if (/^https?:\/\//i.test(s)) return s
  // Uploaded profile file name from our server
  if (s.startsWith('profile-')) return `/uploads/profiles/${s}`
  // Explicit default placeholders -> treat as no image
  if (s.includes('default-avatar') || s.startsWith('avatars/')) return null
  // Already a server path
  if (s.startsWith('/uploads') || s.startsWith('/images')) return s
  // Fallback under images
  return `/images/${s}`
}
