import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 focus:outline-none">
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="end" side={'bottom'}>
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
