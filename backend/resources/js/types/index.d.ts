import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Company {
    id: number;
    name: string;
    short_name?: string;
    logo?: string;
}

export interface Auth {
    user: User;
    companies: Company[] | null | undefined;
    current_company: Company | null;
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    href?: string;
    children?: NavItem[];
    isActive?: boolean;
    can?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
