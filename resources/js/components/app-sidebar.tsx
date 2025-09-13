import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { mainNavItems } from '@/config/nav';
import { SharedData, type NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { AppCompany } from './app-company';

const footerNavItems: NavItem[] = [];

// Helper function to filter nav items based on permissions
function filterNavItemsByPermissions(items: NavItem[], permissions: string[]): NavItem[] {
    return items
        .filter((item) => {
            // If item has no 'can' property, include it
            if (!item.can) return true;
            // Check if user has the required permission
            return permissions.includes(item.can);
        })
        .map((item) => {
            // If item has children, recursively filter them
            if (item.children) {
                const filteredChildren = filterNavItemsByPermissions(item.children, permissions);
                // Only include parent if it has accessible children or if parent itself is accessible
                return {
                    ...item,
                    children: filteredChildren,
                };
            }
            return item;
        })
        .filter((item) => {
            // Remove parent items that have children but no accessible children
            if (item.children) {
                return item.children.length > 0;
            }
            return true;
        });
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    // Filter navigation items based on user permissions
    const filteredMainNavItems = useMemo(() => {
        return filterNavItemsByPermissions(mainNavItems, auth.permissions);
    }, [auth.permissions]);

    const filteredFooterNavItems = useMemo(() => {
        return filterNavItemsByPermissions(footerNavItems, auth.permissions);
    }, [auth.permissions]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <AppCompany />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={filteredFooterNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
