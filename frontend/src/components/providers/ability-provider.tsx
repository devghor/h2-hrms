'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { createAbilityFromPermissions } from '@/lib/casl/ability';

const AbilityContext = createContext<any>(null);

export const AbilityProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const ability = createAbilityFromPermissions(session?.user.permissions || []);
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => useContext(AbilityContext);

export function useCan() {
  const ability = useAbility();
  return (permission: string) => {
    return ability?.can(permission, '');
  };
}
