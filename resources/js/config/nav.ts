import { NavItem } from '@/types';
import { Home, Shield, Users } from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        can: 'READ_DASHBOARD',
    },
    {
        title: 'UAM',
        icon: Users,
        can: 'READ_UAM',
        children: [
            { title: 'Users', href: '/uam/users', icon: Users, can: 'READ_UAM_USERS' },
            {
                title: 'Roles',
                href: '/uam/roles',
                icon: Shield,
                can: 'READ_UAM_ROLES',
            },
        ],
    },
];
