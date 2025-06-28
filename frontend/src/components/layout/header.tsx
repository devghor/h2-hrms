import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ThemeSelector } from '../theme-selector';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';
import { IconBell } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { NotificationBtn } from './notification-btn';
import LanguageSwitcher from '../language/language-switcher';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        {/* <CtaGithub /> */}
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <LanguageSwitcher />
        <ModeToggle />
        <NotificationBtn count={1} />
        <UserNav />
        {/* <ThemeSelector /> */}
      </div>
    </header>
  );
}
