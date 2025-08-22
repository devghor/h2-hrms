import { NavItem } from '@/types';
import { Home, HousePlugIcon, Key, Settings, Shield, StoreIcon, TableIcon, Users } from 'lucide-react';
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
            { ...path.uam.users, icon: Users, can: 'READ_UAM_USERS' },
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
    {
        title: 'Configuration',
        icon: Settings,
        can: 'READ_CONFIGURATION',
        children: [
            { ...path.configuration.companies, icon: StoreIcon, can: 'READ_CONFIGURATION_COMPANIES' },
            { ...path.configuration.divisions, icon: Users, can: 'READ_CONFIGURATION_DIVISIONS' },
            { ...path.configuration.departments, icon: HousePlugIcon, can: 'READ_CONFIGURATION_DEPARTMENTS' },
            { ...path.configuration.desks, icon: TableIcon, can: 'READ_CONFIGURATION_DESKS' },
        ],
    },
];
