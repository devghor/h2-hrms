# H2-HRMS

**H2-HRMS** is a community-driven, open-source SaaS HRMS built for Bangladesh — supporting local fiscal year, NBR tax rules, and BDT. It is built as a multi-tenant Laravel monolith with a React + Inertia.js frontend.

> **Note:** This project is under active development. Features are incomplete and the API surface may change.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP |
| Frontend | React 19, TypeScript 5 |
| Bridge | Inertia.js v2 + Laravel Wayfinder |
| Styling | Tailwind CSS 4, Shadcn/ui |
| Icons | Lucide, Tabler |
| Notifications | Sonner |
| DataTables | Yajra DataTables |
| Permissions | Spatie Permission |
| Multi-tenancy | Stancl Tenancy (Company as Tenant) |
| Database | MySQL |
| Asset bundler | Vite |

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- MySQL

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/devghor/h2-hrms.git
cd h2-hrms
```

2. **Install dependencies**

```bash
composer install
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure the database** in `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=h2_hrms
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Run migrations and seeders**

```bash
php artisan migrate --seed
```

6. **Start the development server**

```bash
composer run dev
```

This runs PHP, queue worker, logs, and Vite in parallel.

For frontend-only development:

```bash
npm run dev
```

For production:

```bash
npm run build
php artisan serve
```

## Available Commands

```bash
composer run dev       # Start all services in parallel (PHP + queue + logs + Vite)
composer run test      # Run the test suite
composer run phpstan   # Static analysis

npm run dev            # Frontend dev server
npm run build          # Production build
npm run types          # TypeScript type check
npm run lint           # Lint and auto-fix
npm run format         # Format code
```

## Architecture Overview

### Backend

- **Controllers** live in `app/Http/Controllers/<Module>/<Entity>/`. Each controller constructor-injects a service. `index()` renders via DataTable, mutations delegate to the service, and `bulkDelete()` accepts `ids[]`.
- **Services** live in `app/Services/<Module>/<Entity>/` and extend `CoreService`, which provides `create`, `update`, `delete`, `find`, `all`, and `bulkDelete` via Eloquent.
- **DataTables** live in `app/DataTables/` and extend `BaseDataTable`. Each implements `query()`, `dataTable()`, `getColumns()`, and `filename()`.
- **Multi-tenancy**: `Company` extends Stancl `Tenant`. The active tenant is resolved from the session via `HandleTenancyFromSession` middleware.
- **Permissions**: Spatie Permission with names following `READ_<MODULE>` / `READ_<MODULE>_<ENTITY>`.

### Frontend

- **Pages** live in `resources/js/pages/<module>/<entity>/index.tsx` — one file per entity covering list view and CRUD dialogs.
- **Routing**: Ziggy `route()` helpers, typed via Laravel Wayfinder (`resources/js/wayfinder/`).
- **Navigation**: sidebar config in `resources/js/config/sidebar.ts`; breadcrumbs in `resources/js/config/breadcrumbs.ts`.
- **UI components**: `DataTable` (`components/data-table/`), `BaseDialog` (`components/dialog/base-dialog.tsx`), page layout via `<AppLayout>`.

## Contributing

Contributions are welcome. Please open an issue or pull request. Follow existing module conventions when adding new features.

## License

MIT
