import { redirect } from '@tanstack/react-router'
import { buildAbilityFor, type Actions, type Subjects } from '@/lib/casl'
import { useAuthStore } from '@/stores/auth-store'

interface RouteGuardConfig {
  action: Actions
  subject: Subjects
  redirectTo?: string
}

/**
 * Guard function to check permissions before loading a route
 * Use in route's beforeLoad hook
 */
export function requirePermission(config: RouteGuardConfig) {
  return ({ location }: { location: { href: string } }) => {
    const { auth } = useAuthStore.getState()
    
    // Check if user is authenticated
    if (!auth.user || !auth.accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }

    // Build ability from user permissions
    const ability = buildAbilityFor(auth.user.permissions || [])

    // Check if user has required permission
    if (!ability.can(config.action, config.subject)) {
      throw redirect({
        to: config.redirectTo || '/errors/forbidden',
      })
    }
  }
}
