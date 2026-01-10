import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TenantSwitcher } from './tenant-switcher'
import { sidebarData } from '@/config/sidebar'
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TenantSwitcher
          name={user?.tenant.name || 'No Tenant'}
          logo={user?.tenant.logo}
        />

        {/* Replace <TenantSwitcher /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TenantSwitcher dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
