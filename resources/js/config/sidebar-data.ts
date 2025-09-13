import {
    Bell,
    Bug,
    Construction,
    FileX,
    HelpCircle,
    LayoutDashboard,
    ListTodo,
    Lock,
    MessagesSquare,
    Monitor,
    Package,
    Palette,
    ServerOff,
    Settings,
    ShieldCheck,
    UserCog,
    UserX,
    Users,
    Wrench,
} from 'lucide-react';

type BaseNavItem = {
    title: string;
    badge?: string;
    icon?: React.ElementType;
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
                    url: '/',
                    icon: LayoutDashboard,
                },
                {
                    title: 'Tasks',
                    url: '/tasks',
                    icon: ListTodo,
                },
                {
                    title: 'Apps',
                    url: '/apps',
                    icon: Package,
                },
                {
                    title: 'Chats',
                    url: '/chats',
                    badge: '3',
                    icon: MessagesSquare,
                },
                {
                    title: 'Users',
                    url: '/users',
                    icon: Users,
                },
            ],
        },
        {
            title: 'Pages',
            items: [
                {
                    title: 'Auth',
                    icon: ShieldCheck,
                    items: [
                        {
                            title: 'Sign In',
                            url: '/sign-in',
                        },
                        {
                            title: 'Sign In (2 Col)',
                            url: '/sign-in-2',
                        },
                        {
                            title: 'Sign Up',
                            url: '/sign-up',
                        },
                        {
                            title: 'Forgot Password',
                            url: '/forgot-password',
                        },
                        {
                            title: 'OTP',
                            url: '/otp',
                        },
                    ],
                },
                {
                    title: 'Errors',
                    icon: Bug,
                    items: [
                        {
                            title: 'Unauthorized',
                            url: '/errors/unauthorized',
                            icon: Lock,
                        },
                        {
                            title: 'Forbidden',
                            url: '/errors/forbidden',
                            icon: UserX,
                        },
                        {
                            title: 'Not Found',
                            url: '/errors/not-found',
                            icon: FileX,
                        },
                        {
                            title: 'Internal Server Error',
                            url: '/errors/internal-server-error',
                            icon: ServerOff,
                        },
                        {
                            title: 'Maintenance Error',
                            url: '/errors/maintenance-error',
                            icon: Construction,
                        },
                    ],
                },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/settings',
                            icon: UserCog,
                        },
                        {
                            title: 'Account',
                            url: '/settings/account',
                            icon: Wrench,
                        },
                        {
                            title: 'Appearance',
                            url: '/settings/appearance',
                            icon: Palette,
                        },
                        {
                            title: 'Notifications',
                            url: '/settings/notifications',
                            icon: Bell,
                        },
                        {
                            title: 'Display',
                            url: '/settings/display',
                            icon: Monitor,
                        },
                    ],
                },
                {
                    title: 'Help Center',
                    url: '/help-center',
                    icon: HelpCircle,
                },
            ],
        },
    ],
};
