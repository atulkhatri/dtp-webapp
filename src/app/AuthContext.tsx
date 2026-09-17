import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dataClient } from '../data/client'
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  clearSession,
  getFavorites,
  getSession,
  getStoredUser,
  isQuestionnaireDone,
  setFavorites,
  setQuestionnaireDone,
  setSession,
  setStoredUser,
  toggleFavorite,
  type FavoritesState,
  type SessionRole,
  type SessionState,
} from '../data/session'
import type { UserProfile } from '../data/types'

interface AuthContextValue {
  session: SessionState | null
  user: UserProfile | null
  ready: boolean
  questionnaireDone: boolean
  favorites: FavoritesState
  login: (email: string, password: string, role: SessionRole) => Promise<{ ok: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role: SessionRole) => Promise<{ ok: boolean; error?: string }>
  continueAsTourist: () => void
  completeQuestionnaire: (profile: UserProfile) => void
  skipQuestionnaire: () => void
  updateUser: (patch: Partial<UserProfile>) => void
  logout: () => void
  toggleFav: (type: 'stays' | 'places', id: string) => void
  seedFavorites: (favs: FavoritesState) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSessionState] = useState<SessionState | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [questionnaireDone, setQDone] = useState(false)
  const [favorites, setFavState] = useState<FavoritesState>({ stays: [], places: [] })

  useEffect(() => {
    const s = getSession()
    const stored = getStoredUser<UserProfile>()
    setSessionState(s)
    setUser(stored)
    setQDone(isQuestionnaireDone())
    setFavState(getFavorites())
    setReady(true)
  }, [])

  const ensureSeedUser = useCallback(async () => {
    const existing = getStoredUser<UserProfile>()
    if (existing) {
      setUser(existing)
      return existing
    }
    const seed = await dataClient.getUser()
    setStoredUser(seed)
    setUser(seed)
    return seed
  }, [])

  const login = useCallback(
    async (email: string, password: string, role: SessionRole) => {
      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        return { ok: false, error: 'Use maya.chen@example.com / travel2026 for this demo.' }
      }
      const next: SessionState = { authenticated: true, role, email: DEMO_EMAIL }
      setSession(next)
      setSessionState(next)
      await ensureSeedUser()
      return { ok: true }
    },
    [ensureSeedUser],
  )

  const signup = useCallback(
    async (name: string, email: string, password: string, role: SessionRole) => {
      if (!name.trim() || !email.trim() || password.length < 6) {
        return { ok: false, error: 'Enter name, email, and a password (6+ characters).' }
      }
      const seed = await dataClient.getUser()
      const profile: UserProfile = {
        ...seed,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      }
      setStoredUser(profile)
      setUser(profile)
      const next: SessionState = { authenticated: true, role, email: profile.email }
      setSession(next)
      setSessionState(next)
      setQuestionnaireDone(false)
      setQDone(false)
      return { ok: true }
    },
    [],
  )

  const continueAsTourist = useCallback(() => {
    if (!session) return
    const next = { ...session, role: 'tourist' as const }
    setSession(next)
    setSessionState(next)
  }, [session])

  const completeQuestionnaire = useCallback((profile: UserProfile) => {
    setStoredUser(profile)
    setUser(profile)
    setQuestionnaireDone(true)
    setQDone(true)
  }, [])

  const skipQuestionnaire = useCallback(async () => {
    await ensureSeedUser()
    setQuestionnaireDone(true)
    setQDone(true)
  }, [ensureSeedUser])

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      setStoredUser(next)
      return next
    })
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSessionState(null)
    setUser(null)
    setQDone(false)
  }, [])

  const toggleFav = useCallback((type: 'stays' | 'places', id: string) => {
    setFavState(toggleFavorite(type, id))
  }, [])

  const seedFavorites = useCallback((favs: FavoritesState) => {
    const current = getFavorites()
    if (current.stays.length === 0 && current.places.length === 0) {
      setFavorites(favs)
      setFavState(favs)
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      ready,
      questionnaireDone,
      favorites,
      login,
      signup,
      continueAsTourist,
      completeQuestionnaire,
      skipQuestionnaire,
      updateUser,
      logout,
      toggleFav,
      seedFavorites,
    }),
    [
      session,
      user,
      ready,
      questionnaireDone,
      favorites,
      login,
      signup,
      continueAsTourist,
      completeQuestionnaire,
      skipQuestionnaire,
      updateUser,
      logout,
      toggleFav,
      seedFavorites,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
