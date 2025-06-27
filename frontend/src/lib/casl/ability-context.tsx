'use client';
import { createContext } from 'react';
import { createContextualCan } from '@casl/react';

export const AbilityContext = createContext({});
export const Can = createContextualCan<any>(AbilityContext.Consumer);
