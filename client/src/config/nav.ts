import { paths } from '@/constants/paths';
import { NavItem } from '@/types';

// Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    can: 'read:dashboard'
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
    can: 'read:product'
  },
  {
    title: 'Account',
    url: '#',
    icon: 'billing',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm'],
        can: 'read:profile'
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login',
        can: 'access:login'
      }
    ],
    can: 'read:account'
  },
  {
    title: 'UAM',
    url: '#',
    icon: 'billing',
    isActive: true,
    items: [
      {
        title: 'Users',
        url: paths.uam.users,
        icon: 'userPen',
        shortcut: ['m', 'm'],
        can: 'read:users'
      },
      {
        title: 'Roles',
        url: paths.uam.roles,
        icon: 'userPen',
        shortcut: ['m', 'm'],
        can: 'read:roles'
      },
      {
        title: 'Permissions',
        url: paths.uam.permissions,
        icon: 'userPen',
        shortcut: ['m', 'm'],
        can: 'read:permissions'
      }
    ],
    can: 'read:uam'
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
    can: 'read:kanban'
  }
];
