'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

/**
 * Recursive Nav Item
 */
function RenderNavItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
    const page = usePage();

    const isActive = useMemo(() => {
        if (item.href && page.url.startsWith(item.href)) return true;
        if (item.children) {
            return item.children.some((child) => page.url.startsWith(child.href || ''));
        }
        return false;
    }, [item, page.url]);

    const [isOpen, setIsOpen] = useState(isActive);

    // Update isOpen when URL changes and becomes active (for navigation changes)
    useEffect(() => {
        if (isActive) {
            setIsOpen(true);
        }
    }, [page.url]); // Only trigger on URL changes, not isActive changes

    if (item.children && item.children.length > 0) {
        return (
            <Collapsible key={item.title} open={isOpen} onOpenChange={setIsOpen}>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={isActive}>
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                            <ChevronDown
                                className={`ml-auto h-4 w-4 transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="ml-4 space-y-1 overflow-hidden border-l pl-2 transition-all duration-300 ease-out data-[state=closed]:animate-out data-[state=closed]:fade-out-50 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-100 data-[state=open]:slide-in-from-top-2">
                        <SidebarMenu>
                            {item.children.map((child, index) => (
                                <div
                                    key={child.title}
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: 'both',
                                    }}
                                    className="duration-200 animate-in fade-in-50 slide-in-from-left-2"
                                >
                                    <RenderNavItem item={child} depth={depth + 1} />
                                </div>
                            ))}
                        </SidebarMenu>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.href ? page.url.startsWith(item.href) : false} tooltip={{ children: item.title }}>
                <Link href={item.href || '#'} prefetch>
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

/**
 * Main Sidebar Nav
 */
export function NavMain({ items = [] }: { items: NavItem[] }) {
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <RenderNavItem key={item.title} item={item} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
