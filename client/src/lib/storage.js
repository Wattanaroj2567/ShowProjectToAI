const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function setToken(token) {
  if (!token) return localStorage.removeItem(TOKEN_KEY)
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setUser(user) {
  if (!user) return localStorage.removeItem(USER_KEY)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

