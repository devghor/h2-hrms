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
import { Company, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';

export function AppCompany() {
    const { isMobile } = useSidebar();
    const [activeCompany, setActiveCompany] = React.useState<Company>();
    const { auth } = usePage<SharedData>().props;

    React.useEffect(() => {
        if (auth.companies && auth.current_company_id) {
            const company = auth.companies.find((c) => c.id === auth.current_company_id);
            setActiveCompany(company || auth.companies[0]);
        } else {
            setActiveCompany(auth.companies ? auth.companies[0] : undefined);
        }
    }, [auth.companies, auth.current_company_id]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {activeCompany?.id}
                            </div>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-semibold">{activeCompany?.company_name}</span>
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
                        {auth.companies?.map((company, index) => (
                            <DropdownMenuItem key={company.id} onClick={() => setActiveCompany(company)} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-sm border">{company.id}</div>
                                {company.company_name}
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
