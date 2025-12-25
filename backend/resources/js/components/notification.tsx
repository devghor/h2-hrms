import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bell, Check, CheckCircle, CreditCard, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function Notification() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Comment',
            description: 'Someone commented on your post.',
            link: '/notifications/1',
            type: 'comment',
            read: false,
            time: '2m ago',
        },
        {
            id: 2,
            title: 'System Update',
            description: 'Version 2.0 is now available.',
            link: '/notifications/2',
            type: 'update',
            read: false,
            time: '1h ago',
        },
        {
            id: 3,
            title: 'Payment Failed',
            description: 'Your recent transaction could not be processed.',
            link: '/notifications/3',
            type: 'payment',
            read: true,
            time: 'Yesterday',
        },
        // Add more sample notifications for testing scroll
        ...Array.from({ length: 6 }, (_, i) => ({
            id: 100 + i,
            title: `Extra Notification ${i + 1}`,
            description: 'This is a sample notification to test scrolling.',
            link: `/notifications/${100 + i}`,
            type: 'update',
            read: i % 2 === 0,
            time: 'Today',
        })),
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment':
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'update':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'payment':
                return <CreditCard className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative scale-95 rounded-full">
                    <Bell className="size-[1.2rem]" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 rounded-full px-1.5 py-0 text-[10px]" variant="destructive">
                            {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex max-h-[500px] w-96 flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />

                {/* List (scrollable if more than 6) */}
                <div className="max-h-[350px] flex-1 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <DropdownMenuItem key={n.id} className={cn('flex flex-col items-start gap-1 px-3 py-2', !n.read && 'bg-muted/50')}>
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getIcon(n.type)}
                                        <p className="text-sm font-medium">{n.title}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!n.read && (
                                            <button
                                                className="text-xs text-gray-500 hover:text-green-600"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    markAsRead(n.id);
                                                }}
                                            >
                                                <Check className="h-3 w-3" />
                                            </button>
                                        )}
                                        <a href={n.link} className="text-xs text-blue-600 hover:underline">
                                            View
                                        </a>
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                                    <p>{n.description}</p>
                                    <span>{n.time}</span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled className="py-6 text-center text-sm text-muted-foreground">
                            🎉 No new notifications
                        </DropdownMenuItem>
                    )}
                </div>

                <DropdownMenuSeparator />

                {/* Footer - View All */}
                <div className="px-3 py-2 text-center">
                    <a href="/notifications" className="text-sm text-blue-600 hover:underline">
                        View All Notifications
                    </a>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
