import { AbilityBuilder, PureAbility, createMongoAbility } from '@casl/ability'

// Define action types
export type Actions = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EDIT'

// Subject is just a string - no need to define all possible subjects
export type Subjects = string

export type AppAbility = PureAbility<[Actions, Subjects]>

// Store raw permissions globally
let userPermissions: string[] = []

/**
 * Build CASL ability based on user permissions
 * Stores permissions like "READ_UAM_USER", "EDIT_UAM_ROLE" from server
 */
export function buildAbilityFor(permissions: string[] = []): AppAbility {
  // Store raw permissions
  userPermissions = permissions
  
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  permissions.forEach((permission) => {
    // Parse permission format: ACTION_SUBJECT (e.g., READ_UAM_USER, EDIT_UAM_ROLE)
    const parts = permission.split('_')
    if (parts.length >= 2) {
      const action = parts[0] as Actions
      const subject = parts.slice(1).join('_')

      // Grant the ability
      can(action, subject)
    }
  })

  return build()
}

/**
 * Check if user has any permission with the given action
 * @example hasAction('READ') // true if user has READ_UAM_USER, READ_UAM_ROLE, etc.
 */
export function hasAction(action: Actions): boolean {
  return userPermissions.some(permission => permission.startsWith(`${action}_`))
}

/**
 * Check if user has a specific permission string
 * @example hasPermission('READ_UAM_USER')
 */
export function hasPermission(permission: string): boolean {
  return userPermissions.includes(permission)
}

/**
 * Get all raw permissions
 */
export function getPermissions(): string[] {
  return [...userPermissions]
}

/**
 * Default ability for unauthenticated users
 */
export function buildGuestAbility(): AppAbility {
  return buildAbilityFor([])
}
