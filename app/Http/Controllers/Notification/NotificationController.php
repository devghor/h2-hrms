<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(15)
            ->through(fn ($n) => $this->transform($n));

        return Inertia::render('notification/index', [
            'notifications' => $notifications,
        ]);
    }

    public function show(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if (! $notification->read_at) {
            $notification->markAsRead();
        }

        return Inertia::render('notification/show', [
            'notification' => $this->transform($notification),
        ]);
    }

    public function dropdown(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(10)
            ->through(fn ($n) => $this->transform($n));

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, string $id)
    {
        $request->user()->notifications()->findOrFail($id)->markAsRead();

        return $request->expectsJson()
            ? response()->json(['ok' => true])
            : back();
    }

    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return $request->expectsJson()
            ? response()->json(['ok' => true])
            : back();
    }

    public function destroy(Request $request, string $id)
    {
        $request->user()->notifications()->findOrFail($id)->delete();

        return $request->expectsJson()
            ? response()->json(['ok' => true])
            : back();
    }

    private function transform($notification): array
    {
        return [
            'id'         => $notification->id,
            'title'      => $notification->data['title'] ?? 'Notification',
            'message'    => $notification->data['message'] ?? null,
            'type'       => class_basename($notification->type),
            'is_read'    => $notification->read_at !== null,
            'time'       => $notification->created_at->diffForHumans(),
            'created_at' => $notification->created_at->toISOString(),
        ];
    }
}
