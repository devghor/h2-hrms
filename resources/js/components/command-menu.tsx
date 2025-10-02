import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { sidebarData } from '@/config/sidebar';
import { useSearch } from '@/context/search-provider';
import { router, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import React from 'react';
import { ScrollArea } from './ui/scroll-area';

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

export function CommandMenu() {
    const { open, setOpen } = useSearch();
    const { props } = usePage<{ auth: { permissions: string[] } }>();
    const permissions = props.auth.permissions || [];

    const filteredNavGroups = sidebarData.navGroups
        .map((group) => ({
            ...group,
            items: filterSidebarItemsByPermission(group.items, permissions),
        }))
        .filter((group) => group.items.length > 0);

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false);
            command();
        },
        [setOpen],
    );

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <ScrollArea type="hover" className="h-72 pe-1">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {filteredNavGroups.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem: any, i: number) => {
                                if (navItem.url) {
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => router.visit(navItem.url));
                                            }}
                                        >
                                            <div className="flex size-4 items-center justify-center">
                                                <ArrowRight className="size-2 text-muted-foreground/80" />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    );
                                }

                                // Handle collapsible items
                                return navItem.items?.map((subItem: any, j: number) => (
                                    <CommandItem
                                        key={`${navItem.title}-${subItem.url}-${j}`}
                                        value={`${navItem.title}-${subItem.url}`}
                                        onSelect={() => {
                                            runCommand(() => router.visit(subItem.url));
                                        }}
                                    >
                                        <div className="flex size-4 items-center justify-center">
                                            <ArrowRight className="size-2 text-muted-foreground/80" />
                                        </div>
                                        {navItem.title} <ChevronRight /> {subItem.title}
                                    </CommandItem>
                                ));
                            })}
                        </CommandGroup>
                    ))}
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    );
}
