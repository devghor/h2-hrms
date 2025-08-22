import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { SharedData, Tenant } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';

export function AppTenant() {
    const { isMobile } = useSidebar();
    const [activeTenant, setActiveTenant] = React.useState<Tenant>();
    const { auth } = usePage<SharedData>().props;

    React.useEffect(() => {
        if (auth.tenants && auth.current_tenant_id) {
            const tenant = auth.tenants.find((t) => t.id === auth.current_tenant_id);
            setActiveTenant(tenant || auth.tenants[0]);
        } else {
            setActiveTenant(auth.tenants ? auth.tenants[0] : undefined);
        }
    }, [auth.tenants, auth.current_tenant_id]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {activeTenant?.id}
                            </div>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-semibold">{activeTenant?.company_name}</span>
                            </div>
                            <ChevronsUpDown className="ms-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Company</DropdownMenuLabel>
                        {auth.tenants?.map((tenant, index) => (
                            <DropdownMenuItem key={tenant.id} onClick={() => setActiveTenant(tenant)} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-sm border">{tenant.id}</div>
                                {tenant.company_name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add Company</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
