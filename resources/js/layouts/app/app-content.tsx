import { cn } from '@/lib/utils';
import React from 'react';

interface AppContentProps {
    className?: string;
    children: React.ReactNode;
}

const AppContent: React.FC<AppContentProps> = ({ className, children }) => {
    return <div className={cn('p-4', className)}>{children}</div>;
};

export default AppContent;
