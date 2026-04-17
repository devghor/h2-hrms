# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

**Laravel 12 + React 19 + Inertia.js 2** monolith with SSR.

- **Backend**: Laravel 12, Yajra DataTables, Spatie Permission, Stancl Tenancy
- **Frontend**: React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui, Lucide + Tabler icons, Sonner
- **Bridge**: Inertia.js + Laravel Wayfinder (typed route helpers in `resources/js/wayfinder/`)

## Commands

```bash
composer run dev   # PHP + queue + logs + Vite in parallel
npm run dev        # frontend only
npm run build
npm run types      # TypeScript check
npm run lint       # auto-fix
npm run format
composer run test
composer run phpstan
```

## Architecture

### Backend

**Controllers** (`app/Http/Controllers/<Module>/<Entity>/`) — constructor-inject service; `index()` calls `DataTable::renderInertia()`; `store/update/destroy` delegate to service; `bulkDelete()` validates `ids[]` → JSON.

**Services** (`app/Services/<Module>/<Entity>/`) — extend `CoreService` (provides `create/update/delete/find/all/bulkDelete`); implement `model()` returning the Eloquent FQCN.

**DataTables** (`app/DataTables/`) — extend `BaseDataTable`; implement `query()`, `dataTable()`, `getColumns()`, `filename()`.

**Multi-tenancy**: `Company` extends Stancl `Tenant`; active tenant set from session via `HandleTenancyFromSession` middleware.

**Permissions**: Spatie Permission; names follow `READ_<MODULE>` / `READ_<MODULE>_<ENTITY>`, checked in sidebar via `can:`.

### Frontend

**Pages** (`resources/js/pages/<module>/<entity>/index.tsx`) — one file per entity for list + CRUD dialogs. Key state: `open`, `isEdit`, `form`, `formErrors`, `selectedIds`, `tableRef`. Use `router.post/put/delete` for mutations; `axios.delete` for bulk delete.

**Components**: `DataTable` (`components/data-table/`), `BaseDialog` (`components/dialog/base-dialog.tsx`), layout via `<AppLayout title breadcrumbs actions>`.

**Navigation**: sidebar in `resources/js/config/sidebar.ts`, breadcrumbs in `resources/js/config/breadcrumbs.ts`. Each sidebar item has a `can` string matching the permission name.

**Routes**: use Ziggy `route('module.entity.action', id)` — typed via Wayfinder.

## Adding a new CRUD entity

1. Migration → Model → Service (extend `CoreService`) → DataTable (extend `BaseDataTable`) → Form Requests (`Store`/`Update`)
2. Controller → Routes (`Route::resource` + `bulk-delete`) in `routes/web.php`
3. Frontend page (`index.tsx`) → sidebar entry → breadcrumb entry
