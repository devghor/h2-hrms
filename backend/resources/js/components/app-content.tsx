import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import HeadingSmall from './heading-small';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
    title: string;
    description?: string;
}

export function AppContent({ variant = 'header', title, description, children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main className="px-3 py-2" {...props}>
            <HeadingSmall title={title} description={description} />
            <div className="mt-4">{children}</div>
        </main>
    );
}
