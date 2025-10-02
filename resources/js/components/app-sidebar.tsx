'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { sidebarData } from '@/config/sidebar';
import { Company, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, ChevronDown, ChevronsUpDown, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// === Collapsible Nav Items ===
function SidebarCollapsibleItem({ item }: { item: any }) {
    const { state } = useSidebar(); // "expanded" | "collapsed" | "offcanvas"
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    const isChildActive = useMemo(() => item.items.some((sub: any) => url.startsWith(sub.url)), [url, item.items]);

    useEffect(() => {
        if (isChildActive) setOpen(true);
    }, [isChildActive]);

    useEffect(() => {
        if (state === 'collapsed') setOpen(false);
    }, [state]);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        <ChevronDown
                            className={`ml-auto h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''} group-data-[collapsible=icon]:hidden`}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="pl-4">
                        {item.items.map((sub: any) => {
                            const active = url.startsWith(sub.url);
                            return (
                                <SidebarMenuItem key={sub.title}>
                                    <SidebarMenuButton asChild isActive={active}>
                                        <Link href={sub.url}>
                                            {sub.icon && <sub.icon className="mr-2 h-4 w-4" />}
                                            <span className="group-data-[collapsible=icon]:hidden">{sub.title}</span>
                                            {sub.badge && (
                                                <span className="ml-auto rounded-full bg-primary px-2 text-xs text-white group-data-[collapsible=icon]:hidden">
                                                    {sub.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}

// === Logo ===
const Logo = ({ src, alt }: { src?: string | null; alt?: string | null }) => {
    if (src) {
        return <img src={src} alt={alt || ''} className="h-6 w-6 rounded-full object-cover" />;
    }
    return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <Building2 className="h-4 w-4 text-gray-600" />
        </div>
    );
};

// === Company Switcher ===
function CompanySwitcher({ companies, currentCompany }: { companies: Company[] | []; currentCompany: Company | null }) {
    const { isMobile } = useSidebar();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <Logo src={currentCompany?.logo} alt={currentCompany?.short_name || 'Company Logo'} />
                    </div>
                    <div className="grid flex-1 text-start text-sm leading-tight">
                        <span className="truncate font-semibold">{currentCompany?.name}</span>
                    </div>
                    <ChevronsUpDown className="ms-auto" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
            >
                <DropdownMenuLabel>Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companies.map((company) => (
                    <DropdownMenuItem key={company.id} asChild className="cursor-pointer gap-2 p-2">
                        <Link href={`/switch-company/${company.id}`}>{company.name}</Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                    </div>
                    <a className="font-medium text-muted-foreground" href={route('configuration.companies.index')}>
                        Add Company
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// === Helper: Filter sidebar items by permission ===
function filterSidebarItemsByPermission(items: any[], permissions: string[]): any {
    return items
        .map((item) => {
            if (item.can && !permissions.includes(item.can)) return null;

            if (item.items) {
                const filteredChildren = filterSidebarItemsByPermission(item.items, permissions);
                if (filteredChildren.length === 0) return null;
                return { ...item, items: filteredChildren };
            }

            return item;
        })
        .filter(Boolean);
}

// === Main Sidebar ===
export function AppSidebar() {
    const { url, props } = usePage<SharedData>();
    const companies = props.auth.companies || [];
    const currentCompany = props.auth.current_company;
    const permissions = props.auth.permissions || [];

    // Filter nav groups and items
    const filteredNavGroups = sidebarData.navGroups
        .map((group) => ({
            ...group,
            items: filterSidebarItemsByPermission(group.items, permissions),
        }))
        .filter((group) => group.items.length > 0); // remove empty groups

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <CompanySwitcher companies={companies} currentCompany={currentCompany} />
            </SidebarHeader>

            <SidebarContent>
                {filteredNavGroups.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) =>
                                    'items' in item ? (
                                        <SidebarCollapsibleItem key={item.title} item={item} />
                                    ) : (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={url.startsWith(item.url)}>
                                                <Link href={item.url}>
                                                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                    {item.badge && (
                                                        <span className="ml-auto rounded-full bg-primary px-2 text-xs text-white group-data-[collapsible=icon]:hidden">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ),
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
