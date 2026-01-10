import { type ReactNode, useMemo } from 'react'
import { AbilityContext, buildAbilityFor, buildGuestAbility } from '@/lib/casl'
import { useAuthStore } from '@/stores/auth-store'

interface AbilityProviderProps {
  children: ReactNode
}

/**
 * Provider component that builds and provides CASL ability based on user permissions
 */
export function AbilityProvider({ children }: AbilityProviderProps) {
  const user = useAuthStore((state) => state.auth.user)

  const ability = useMemo(() => {
    if (!user || !user.permissions) {
      return buildGuestAbility()
    }
    return buildAbilityFor(user.permissions)
  }, [user?.permissions])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}
