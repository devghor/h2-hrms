import React from 'react'
import { cn } from '@/lib/utils'
import UsersProvider from '@/features/users/context/users-context'
import { ProfileDropdown } from '../profile-dropdown'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switch'
import { Header } from './header'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <main
        className={cn(
          'peer-[.header-fixed]/header:mt-16',
          'px-4 py-6',
          fixed && 'fixed-main flex grow flex-col overflow-hidden'
        )}
        {...props}
      >
        {props.children}
      </main>
    </UsersProvider>
  )
}

Main.displayName = 'Main'
