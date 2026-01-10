import * as React from 'react'
import { Building2 } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Tenant } from '@/types/auth.types'
import { useNavigate } from '@tanstack/react-router'
import { paths } from '@/config/paths'


export function TenantSwitcher({ name, logo }: Tenant) {
  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' className='cursor-default cursor-pointer' onClick={() => navigate({ to: paths.HOME})}>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            {logo ? (
              <img
                src={logo}
                alt={`${name} logo`}
                className='h-6 w-6 rounded-lg object-cover'
              />
            ) : (
              <Building2 className='size-5' />
            )}
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>{name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
