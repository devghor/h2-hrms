import { Toaster } from '@/components/ui/sonner';
import { SearchProvider } from '@/context/search-provider';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    title: string;
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
}

export default ({ children, breadcrumbs, actions, ...props }: AppLayoutProps) => (
    <SearchProvider>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} actions={actions} {...props}>
            <Toaster />
            {children}
        </AppLayoutTemplate>
    </SearchProvider>
);
