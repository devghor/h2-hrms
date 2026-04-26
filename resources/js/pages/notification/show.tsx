import { Button } from '@/components/ui/button';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Bell, CheckCircle, CreditCard, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationItem {
    id: string;
    title: string;
    message: string | null;
    type: string;
    is_read: boolean;
    time: string;
    created_at: string;
}

interface Props {
    notification: NotificationItem;
}

function getIcon(type: string) {
    switch (type.toLowerCase()) {
        case 'newcomment':
        case 'messagenotification':
            return <MessageSquare className="h-5 w-5 text-blue-500" />;
        case 'paymentfailed':
        case 'paymentnotification':
            return <CreditCard className="h-5 w-5 text-red-500" />;
        case 'systemupdated':
        case 'leaveupdated':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        default:
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
}

export default function Show({ notification }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        breadcrumbItems.dashboard,
        breadcrumbItems.notificationIndex,
        { title: notification.title, href: '#' },
    ];

    const handleDelete = () => {
        router.delete(route('notification.destroy', notification.id), {
            onSuccess: () => {
                toast.success('Notification deleted');
                router.visit(route('notification.index'));
            },
        });
    };

    return (
        <AppLayout
            title={notification.title}
            breadcrumbs={breadcrumbs}
            actions={
                <div className="flex gap-2">
                    <Link href={route('notification.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            }
        >
            <div className="mx-auto max-w-2xl">
                <div className="rounded-lg border bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                        {getIcon(notification.type)}
                        <div>
                            <h2 className="text-lg font-semibold">{notification.title}</h2>
                            <p className="text-xs text-muted-foreground">
                                {notification.type} &middot; {notification.time}
                            </p>
                        </div>
                    </div>

                    {notification.message ? (
                        <p className="text-sm leading-relaxed">{notification.message}</p>
                    ) : (
                        <div className="flex flex-col items-center py-8 text-muted-foreground">
                            <Bell className="mb-2 h-8 w-8 opacity-30" />
                            <p className="text-sm">No additional details</p>
                        </div>
                    )}

                    <div className="mt-6 border-t pt-4 text-xs text-muted-foreground">
                        Received: {new Date(notification.created_at).toLocaleString()}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
