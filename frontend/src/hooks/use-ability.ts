import { useContext } from 'react'
import { AbilityContext, hasAction, hasPermission } from '@/lib/casl'
import type { AppAbility, Actions, Subjects } from '@/lib/casl'

/**
 * Hook to access the CASL ability instance
 */
export function useAbility(): AppAbility {
  const ability = useContext(AbilityContext)
  if (!ability) {
    throw new Error('useAbility must be used within an AbilityProvider')
  }
  return ability
}

/**
 * Hook to check if user can perform an action on a subject
 */
export function useCan(action: Actions, subject: Subjects): boolean {
  const ability = useAbility()
  return ability.can(action, subject)
}

/**
 * Hook to check if user cannot perform an action on a subject
 */
export function useCannot(action: Actions, subject: Subjects): boolean {
  const ability = useAbility()
  return ability.cannot(action, subject)
}

/**
 * Hook to check if user has any permission with the given action
 * @example useHasAction('READ') // true if user has READ_UAM_USER, READ_UAM_ROLE, etc.
 */
export function useHasAction(action: Actions): boolean {
  // Trigger re-render when ability changes
  useAbility()
  return hasAction(action)
}

/**
 * Hook to check if user has a specific permission string
 * @example useHasPermission('READ_UAM_USER')
 */
export function useHasPermission(permission: string): boolean {
  // Trigger re-render when ability changes
  useAbility()
  return hasPermission(permission)
}
