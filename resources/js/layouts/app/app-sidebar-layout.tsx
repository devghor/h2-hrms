import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    title,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title: string }>) {
    return (
        <AppShell variant="sidebar">
            <Head title={title} />
            <AppSidebar />
            <AppContent title={title} variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="px-4 py-4">{children}</div>
            </AppContent>
        </AppShell>
    );
}
