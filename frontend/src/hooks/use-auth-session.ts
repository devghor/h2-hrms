'use client';

import { useSession } from 'next-auth/react';

export function useAuthSession() {
  const { data: session, status } = useSession({ required: true });

  return {
    session,
    status,
    loading: status === 'loading',
    authenticated: status === 'authenticated'
  };
}
