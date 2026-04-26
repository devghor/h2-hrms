import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { AlertTriangle, Bell, Check, CheckCircle, CreditCard, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.notificationIndex];

interface NotificationItem {
    id: string;
    title: string;
    message: string | null;
    type: string;
    is_read: boolean;
    time: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedNotifications {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

interface Props {
    notifications: PaginatedNotifications;
}

function getIcon(type: string) {
    switch (type.toLowerCase()) {
        case 'newcomment':
        case 'messagenotification':
            return <MessageSquare className="h-4 w-4 text-blue-500" />;
        case 'paymentfailed':
        case 'paymentnotification':
            return <CreditCard className="h-4 w-4 text-red-500" />;
        case 'systemupdated':
        case 'leaveupdated':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        default:
            return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
}

export default function Index({ notifications }: Props) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const hasUnread = notifications.data.some((n) => !n.is_read);

    const handleMarkAsRead = (id: string) => {
        router.patch(route('notification.read', id), {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post(
            route('notification.mark-all-read'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('All notifications marked as read'),
            },
        );
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        router.delete(route('notification.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Notification deleted'),
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <AppLayout
            title="Notifications"
            breadcrumbs={breadcrumbs}
            actions={
                hasUnread ? (
                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                        <Check className="mr-1.5 h-4 w-4" />
                        Mark all as read
                    </Button>
                ) : undefined
            }
        >
            {notifications.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Bell className="mb-4 h-12 w-12 opacity-30" />
                    <p className="text-sm">You have no notifications</p>
                </div>
            ) : (
                <div className="rounded-lg border">
                    {notifications.data.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 border-b px-4 py-3 last:border-b-0 ${!n.is_read ? 'bg-muted/40' : ''}`}
                        >
                            <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{n.title}</p>
                                    {!n.is_read && (
                                        <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                                            New
                                        </Badge>
                                    )}
                                </div>
                                {n.message && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>}
                                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                {!n.is_read && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Mark as read" onClick={() => handleMarkAsRead(n.id)}>
                                        <Check className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                                <Link href={route('notification.show', n.id)}>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                                        View
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    disabled={deletingId === n.id}
                                    onClick={() => handleDelete(n.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {notifications.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-1">
                    {notifications.links.map((link, idx) => (
                        <Button
                            key={idx}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            className="min-w-9 text-xs"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
