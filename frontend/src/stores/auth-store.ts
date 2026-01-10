import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const TOKEN_EXPIRY = 'token_expiry'

interface AuthUser {
  ulid?: string
  id?: number
  name: string
  email: string
  tenant_id: string | number
  role?: string[]
  permissions?: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    tokenExpiry: string | null
    setAccessToken: (accessToken: string, expiresAt?: string) => void
    resetAccessToken: () => void
    isTokenExpired: () => boolean
    reset: () => void
  }
}

// Helper functions for user persistence in cookies
const USER_COOKIE_KEY = 'auth-user'

const loadUser = (): AuthUser | null => {
  try {
    const stored = getCookie(USER_COOKIE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const saveUser = (user: AuthUser | null) => {
  try {
    if (user) {
      setCookie(USER_COOKIE_KEY, JSON.stringify(user))
    } else {
      removeCookie(USER_COOKIE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? cookieState : ''
  const initExpiry = getCookie(TOKEN_EXPIRY) || null
  const initUser = loadUser()
  
  return {
    auth: {
      user: initUser,
      tokenExpiry: initExpiry,
      setUser: (user) => {
        // Store tenant_id in cookie when user is set
        if (user?.tenant_id) {
          setCookie('tenant_id', String(user.tenant_id))
        }
        // Persist user to cookies
        saveUser(user)
        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      accessToken: initToken,
      setAccessToken: (accessToken, expiresAt) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, accessToken)
          if (expiresAt) {
            // Store expiry as ISO string in cookie
            setCookie(TOKEN_EXPIRY, expiresAt)
          }
          return { 
            ...state, 
            auth: { 
              ...state.auth, 
              accessToken,
              tokenExpiry: expiresAt || null
            } 
          }
        }),
      isTokenExpired: () => {
        const { tokenExpiry } = get().auth
        if (!tokenExpiry) return false
        
        const expiryTime = new Date(tokenExpiry).getTime()
        const currentTime = new Date().getTime()
        
        return currentTime >= expiryTime
      },
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(TOKEN_EXPIRY)
          return { 
            ...state, 
            auth: { 
              ...state.auth, 
              accessToken: '',
              tokenExpiry: null
            } 
          }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(TOKEN_EXPIRY)
          removeCookie('tenant_id')
          saveUser(null) // Clear user from cookies
          return {
            ...state,
            auth: { 
              ...state.auth, 
              user: null, 
              accessToken: '',
              tokenExpiry: null
            },
          }
        }),
    },
  }
})
