import { NavItem } from '@/types';
import { Home, Key, Shield, Users } from 'lucide-react';
import { path } from './paths';

export const mainNavItems: NavItem[] = [
    {
        ...path.dashboard,
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
                ...path.uam.roles,
                icon: Shield,
                can: 'READ_UAM_ROLES',
            },
            {
                ...path.uam.permissions,
                icon: Key,
                can: 'READ_UAM_PERMISSIONS',
            },
        ],
    },
];
