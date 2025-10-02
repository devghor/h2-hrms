import { Briefcase, Building, IdCard, Key, Landmark, LayoutDashboard, Lock, MonitorCog, Settings, Users } from 'lucide-react';

type BaseNavItem = {
    title: string;
    badge?: string;
    icon?: React.ElementType;
    can?: string;
};

type NavLink = BaseNavItem & {
    url: any['to'] | (string & {});
    items?: never;
};

type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: any['to'] | (string & {}) })[];
    url?: never;
};

type NavItem = NavCollapsible | NavLink;

type NavGroup = {
    title: string;
    items: NavItem[];
    can?: string;
};

type SidebarData = {
    navGroups: NavGroup[];
};

export const sidebarData: SidebarData = {
    navGroups: [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    url: '/dashboard',
                    icon: LayoutDashboard,
                    can: 'READ_DASHBOARD',
                },
            ],
        },
        {
            title: 'Uam',
            items: [
                {
                    title: 'Users',
                    url: '/uam/users',
                    icon: Users,
                    can: 'READ_UAM_USER',
                },
                {
                    title: 'Roles',
                    url: '/uam/roles',
                    icon: Lock,
                    can: 'READ_UAM_ROLE',
                },
                {
                    title: 'Permissions',
                    url: '/uam/permissions',
                    icon: Key,
                    can: 'READ_UAM_PERMISSION',
                },
            ],
        },
        {
            title: 'Configuration',
            items: [
                {
                    title: 'Settings',
                    icon: Settings,
                    can: 'READ_CONFIGURATION_SETTING',
                    items: [
                        {
                            title: 'Companies',
                            url: '/configuration/companies',
                            icon: Landmark,
                            can: 'READ_CONFIGURATION_COMPANY',
                        },
                        {
                            title: 'Divisions',
                            url: '/configuration/divisions',
                            icon: Building,
                            can: 'READ_CONFIGURATION_DIVISION',
                        },
                        {
                            title: 'Departments',
                            url: '/configuration/departments',
                            icon: Briefcase,
                            can: 'READ_CONFIGURATION_DEPARTMENT',
                        },
                        {
                            title: 'Designations',
                            url: '/configuration/designations',
                            icon: IdCard,
                            can: 'READ_CONFIGURATION_DESIGNATION',
                        },
                        {
                            title: 'Desks',
                            url: '/configuration/desks',
                            icon: MonitorCog,
                            can: 'READ_CONFIGURATION_DESK',
                        },
                    ],
                },
            ],
        },
    ],
};
