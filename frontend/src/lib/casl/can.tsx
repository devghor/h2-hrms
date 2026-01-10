import { createContextualCan } from '@casl/react'
import { createContext } from 'react'
import type { AppAbility } from './ability'

// Create the ability context
export const AbilityContext = createContext<AppAbility | undefined>(undefined)

// Create the Can component
export const Can = createContextualCan(AbilityContext.Consumer)
