<?php

namespace App\Http\Middleware;

use App\Models\Configuration\Company\Company;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'permissions' => [
                    'READ_GENERAL',
                    'READ_DASHBOARD',
                    'READ_UAM',
                    'READ_UAM_USER',
                    'READ_UAM_ROLE',
                    'READ_UAM_PERMISSION',
                    'READ_CONFIGURATION',
                    'READ_CONFIGURATION_COMPANY',
                    'READ_CONFIGURATION_DIVISION',
                    'READ_CONFIGURATION_DEPARTMENT',
                    'READ_CONFIGURATION_DESK',
                    'READ_CONFIGURATION_SETTING'
                ],
                'current_company' => Company::find(session(config('tenancy.current_company_session_key'))),
                'companies' => $request->user() ? $request->user()->companies : [],
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
