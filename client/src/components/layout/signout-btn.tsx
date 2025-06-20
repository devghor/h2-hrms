'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignOutBtn() {
  return (
    <Button
      variant='ghost'
      onClick={() => signOut()}
      className='text-muted-foreground hover:text-destructive hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 transition-colors'
    >
      <LogOut className='h-4 w-4' />
      <span className='text-sm font-medium'>Sign out</span>
    </Button>
  );
}
