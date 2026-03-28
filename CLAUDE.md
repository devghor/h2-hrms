# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

**Laravel 12 + React 19 + Inertia.js 2** monolith with server-side rendering (SSR).

- **Backend**: Laravel 12, Yajra DataTables, Spatie Permission, Stancl Tenancy
- **Frontend**: React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui (Radix), Lucide + Tabler icons, Sonner (toasts)
- **Bridge**: Inertia.js + Laravel Wayfinder (typed route helpers in `resources/js/wayfinder/`)

## Commands

```bash
# Development (PHP + queue + logs + Vite in parallel)
composer run dev

# Frontend only
npm run dev

# Build
npm run build

# Type check
npm run types

# Lint (auto-fix)
npm run lint

# Format
npm run format

# PHP tests
composer run test

# PHP static analysis
composer run phpstan
```

## Architecture

### Request flow
Browser → Inertia → Laravel route → Controller → Service → DataTable → Inertia render → React page component

### Backend patterns

**Controllers** (`app/Http/Controllers/<Module>/<Entity>/`)
- Constructor-inject the service
- `index()` delegates to a DataTable's `renderInertia('module/entity/index')`
- `store/update/destroy` delegate to service, return `redirect()->back()` or `redirect()->route(...)`
- `bulkDelete()` validates `ids[]` then calls `$service->bulkDelete($ids)` → JSON response

**Services** (`app/Services/<Module>/<Entity>/`)
- Extend `App\Services\Core\CoreService`
- `CoreService` provides `create`, `update`, `delete`, `find`, `all`, `bulkDelete` using Eloquent directly
- Must implement `model()` returning the FQCN of the Eloquent model
- Place all query logic and business logic in the service

**DataTables** (`app/DataTables/`)
- Extend `BaseDataTable`
- Implement `query()`, `dataTable()`, `getColumns()`, `filename()`
- `renderInertia(string $component)` passes data to the React page via Inertia

**Form Requests** (`app/Http/Requests/<Module>/<Entity>/`)
- `Store<Entity>Request` and `Update<Entity>Request` per entity

**Multi-tenancy**: `Company` model extends `Tenant` (Stancl). Active tenant initialised from session via `HandleTenancyFromSession` middleware. Switch via `POST /configuration/companies/{company}/switch`.

**Permissions**: Spatie Laravel Permission. Permission names follow `READ_<MODULE>`, `READ_<MODULE>_<ENTITY>` convention, checked in sidebar via `can:` attribute.

### Frontend patterns

**Pages** (`resources/js/pages/<module>/<entity>/index.tsx`)
- Single `index.tsx` per entity handles list + create + edit + delete in one file
- State: `open` (dialog), `isEdit`, `form`, `formErrors`, `selectedIds`
- `tableRef` with `{ refetch: () => void }` to reload DataTable without full navigation
- CRUD via `router.post/put/delete` (Inertia) for create/update/delete; `axios.delete` for bulk delete
- Errors surfaced as `formErrors` from `onError` callback

**DataTable** (`resources/js/components/data-table/data-table.tsx`)
- Receives `columns`, `dataUrl`, `onSelectionChange`, `extraActions`
- `columns` array: each entry has `accessorKey`, `header`, `sortable`, `searchable`, optional `cell` render

**BaseDialog** (`resources/js/components/dialog/base-dialog.tsx`)
- Props: `open`, `onOpenChange`, `title`, `description`, `onSubmit`, `onCancel`, `submitLabel`
- Wraps form fields as `children`; handles submit confirmation internally

**Layout**: All pages use `<AppLayout title="..." breadcrumbs={breadcrumbs} actions={...}>`

**Navigation config**
- Sidebar items: `resources/js/config/sidebar.ts` — add entries to `sidebarData.navGroups`
- Breadcrumbs: `resources/js/config/breadcrumbs.ts` — add named entries to `breadcrumbItems`
- Each sidebar item has a `can` string matching the Spatie permission name

**Routes** (typed): Use `route('module.entity.action', id)` — ziggy routes auto-generated and typed via Wayfinder.

## Adding a new CRUD entity (the Division pattern)

1. **Migration** in `database/migrations/`
2. **Model** `app/Models/<Module>/<Entity>/<Entity>.php`
3. **Service** `app/Services/<Module>/<Entity>/<Entity>Service.php` — extend `CoreService`
4. **DataTable** `app/DataTables/<Entities>DataTable.php` — extend `BaseDataTable`
5. **Form Requests** `Store<Entity>Request` + `Update<Entity>Request`
6. **Controller** `app/Http/Controllers/<Module>/<Entity>/<Entity>Controller.php`
7. **Routes** in `routes/web.php` — add `Route::resource` + `bulk-delete` route inside the module prefix group
8. **Frontend page** `resources/js/pages/<module>/<entity>/index.tsx` — follow divisions pattern
9. **Sidebar entry** in `resources/js/config/sidebar.ts`
10. **Breadcrumb entry** in `resources/js/config/breadcrumbs.ts`
