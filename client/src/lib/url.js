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
  if (!img || typeof img !== 'string') return null
  if (/^https?:\/\//i.test(img)) return img
  if (img.startsWith('profile-')) return `/uploads/profiles/${img}`
  if (img.includes('default-avatar') || img.startsWith('avatars/')) return null
  if (img.startsWith('/uploads') || img.startsWith('/images')) return img
  return `/images/${img}`
}
