export const DEMO_EMAIL = 'maya.chen@example.com'
export const DEMO_PASSWORD = 'travel2026'

const SESSION_KEY = 'dtp.session'
const USER_KEY = 'dtp.user'
const FAVORITES_KEY = 'dtp.favorites'
const QUESTIONNAIRE_DONE_KEY = 'dtp.questionnaireDone'

export type SessionRole = 'tourist' | 'business'

export interface SessionState {
  authenticated: boolean
  role: SessionRole
  email: string
}

export function getSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionState) : null
  } catch {
    return null
  }
}

export function setSession(session: SessionState) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(QUESTIONNAIRE_DONE_KEY)
}

export function getStoredUser<T>(): T | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function isQuestionnaireDone() {
  return localStorage.getItem(QUESTIONNAIRE_DONE_KEY) === '1'
}

export function setQuestionnaireDone(done = true) {
  localStorage.setItem(QUESTIONNAIRE_DONE_KEY, done ? '1' : '0')
}

export interface FavoritesState {
  stays: string[]
  places: string[]
}

export function getFavorites(): FavoritesState {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (raw) return JSON.parse(raw) as FavoritesState
  } catch {
    /* ignore */
  }
  return { stays: [], places: [] }
}

export function setFavorites(favs: FavoritesState) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
}

export function toggleFavorite(type: 'stays' | 'places', id: string): FavoritesState {
  const favs = getFavorites()
  const list = new Set(favs[type])
  if (list.has(id)) list.delete(id)
  else list.add(id)
  const next = { ...favs, [type]: [...list] }
  setFavorites(next)
  return next
}
