import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NavUser } from '@/components/nav-user';
import { Notification } from '@/components/notification';
import { SearchProvider } from '@/context/search-provider';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    title,
    actions,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title: string; actions?: React.ReactNode }>) {
    return (
        <AppShell variant="sidebar">
            <Head title={title} />
            <AppSidebar />
            <AppContent title={title} variant="sidebar" className="overflow-x-hidden">
                <SearchProvider>
                    <AppSidebarHeader fixed>
                        <div className="ms-auto flex items-center space-x-4">
                            <Notification />
                            <NavUser />
                        </div>
                    </AppSidebarHeader>
                </SearchProvider>
                <div className="px-4 py-4">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    <div className="flex items-center justify-between">
                        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                        <div>{actions}</div>
                    </div>
                    <div className="mt-4">{children}</div>
                </div>
            </AppContent>
        </AppShell>
    );
}
