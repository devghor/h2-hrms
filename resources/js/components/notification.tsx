import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertTriangle, Bell, Check, CheckCircle, CreditCard, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NotificationItem {
    id: string;
    title: string;
    message: string | null;
    type: string;
    is_read: boolean;
    time: string;
    created_at: string;
}

interface PaginatedResponse {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    total: number;
}

export function Notification() {
    const { auth } = usePage<SharedData>().props;
    const [unreadCount, setUnreadCount] = useState(auth.unread_notifications_count);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const initializedRef = useRef(false);

    useEffect(() => {
        setUnreadCount(auth.unread_notifications_count);
    }, [auth.unread_notifications_count]);

    // loadingRef keeps fetchPage stable (no state dependency) while loadingRef.current guards concurrent calls
    const fetchPage = useCallback(async (pageNum: number) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const { data } = await axios.get<PaginatedResponse>(route('notification.dropdown'), {
                params: { page: pageNum },
            });
            setItems((prev) => (pageNum === 1 ? data.data : [...prev, ...data.data]));
            setPage(data.current_page);
            setLastPage(data.last_page);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open && !initializedRef.current) {
            initializedRef.current = true;
            fetchPage(1).then(() => setInitialized(true));
        }
        if (!open) {
            initializedRef.current = false;
            setInitialized(false);
            setItems([]);
            setPage(1);
            setLastPage(1);
        }
    }, [open, fetchPage]);

    useEffect(() => {
        if (!sentinelRef.current || !initialized) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading && page < lastPage) {
                    fetchPage(page + 1);
                }
            },
            { root: scrollContainerRef.current, threshold: 0.1 },
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [loading, page, lastPage, initialized, fetchPage]);

    const handleMarkAsRead = (id: string) => {
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        setUnreadCount((c) => Math.max(0, c - 1));
        axios.patch(route('notification.read', id)).catch(() => {
            setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)));
            setUnreadCount((c) => c + 1);
        });
    };

    const handleMarkAllAsRead = () => {
        const snap = { items, count: unreadCount };
        setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        axios.post(route('notification.mark-all-read')).catch(() => {
            setItems(snap.items);
            setUnreadCount(snap.count);
        });
    };

    const getIcon = (type: string) => {
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
    };

    return (
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative scale-95 rounded-full">
                    <Bell className="size-[1.2rem]" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 rounded-full px-1.5 py-0 text-[10px]" variant="destructive">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex max-h-[500px] w-96 flex-col p-0">
                <div className="flex items-center justify-between px-3 py-2">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator className="m-0" />

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ maxHeight: '360px' }}>
                    {!initialized && loading ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
                    ) : items.length === 0 && initialized ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
                    ) : (
                        <>
                            {items.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn('flex flex-col gap-1 border-b px-3 py-2 last:border-b-0', !n.is_read && 'bg-muted/40')}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getIcon(n.type)}
                                            <p className="text-sm font-medium">{n.title}</p>
                                        </div>
                                        <div className="ml-2 flex shrink-0 items-center gap-1.5">
                                            {!n.is_read && (
                                                <button
                                                    className="text-muted-foreground hover:text-green-600"
                                                    title="Mark as read"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleMarkAsRead(n.id);
                                                    }}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                            )}
                                            <Link
                                                href={route('notification.show', n.id)}
                                                className="text-xs text-blue-600 hover:underline"
                                                onClick={() => setOpen(false)}
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                                        <p className="line-clamp-1">{n.message}</p>
                                        <span className="ml-2 shrink-0">{n.time}</span>
                                    </div>
                                </div>
                            ))}

                            {/* IntersectionObserver sentinel */}
                            <div ref={sentinelRef} className="h-4 w-full" />

                            {loading && initialized && (
                                <div className="py-2 text-center text-xs text-muted-foreground">Loading more…</div>
                            )}
                            {!loading && initialized && page >= lastPage && items.length > 0 && (
                                <div className="py-2 text-center text-xs text-muted-foreground">All caught up</div>
                            )}
                        </>
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />
                <div className="px-3 py-2 text-center">
                    <Link
                        href={route('notification.index')}
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setOpen(false)}
                    >
                        View All Notifications
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
