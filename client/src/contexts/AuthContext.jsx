import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import { getUser, setUser, getToken, setToken, clearAuth } from '../lib/storage'
import { resolveProfileImagePath } from '../lib/url'

export const AuthContext = createContext(null)

function normalizeUser(u) {
  if (!u) return null
  return { ...u, profileImage: resolveProfileImagePath(u.profileImage) }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => normalizeUser(getUser()))
  const [token, setTokenState] = useState(() => getToken())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // keep storage in sync
    setUser(user)
    setToken(token)
  }, [user, token])

  const login = useCallback(async ({ emailOrUsername, password }) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { emailOrUsername, password })
      setTokenState(data.token)
      setUserState(normalizeUser(data.user))
      return data.user
    } finally {
      setLoading(false)
    }
  }, [])

  const loginWithGoogleToken = useCallback((token, user) => {
    setTokenState(token)
    setUserState(normalizeUser(user))
  }, [])

  const register = useCallback(async ({ username, displayName, email, password, confirmPassword }) => {
    setLoading(true)
    try {
      await api.post('/auth/register', { username, displayName, email, password, confirmPassword })
      return true
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUserState(null)
    setTokenState(null)
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, register, logout, loginWithGoogleToken, setUser: (u) => setUserState((prev) => normalizeUser(typeof u === 'function' ? u(prev) : u)) }), [user, token, loading, login, register, logout, loginWithGoogleToken])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
