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
    description,
    actions,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title: string; description?: string; actions?: React.ReactNode }>) {
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
                <div className="container py-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                        <div>
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                        <div>{actions}</div>
                    </div>
                    <div className="mt-4">{children}</div>
                </div>
            </AppContent>
        </AppShell>
    );
}
