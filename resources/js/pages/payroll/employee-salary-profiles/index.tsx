import DataTable from '@/components/data-table/data-table';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.payrollEmployeeSalaryProfiles];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true },
        { accessorKey: 'employee_code', header: 'Employee Code', sortable: true, searchable: true },
        { accessorKey: 'full_name', header: 'Full Name', sortable: true, searchable: true },
        { accessorKey: 'designation_name', header: 'Designation', sortable: false },
        { accessorKey: 'basic_amount', header: 'Basic', sortable: true },
        { accessorKey: 'gross_amount', header: 'Gross', sortable: true },
        { accessorKey: 'deduction_amount', header: 'Deduction', sortable: true },
        { accessorKey: 'net_amount', header: 'Net', sortable: true },
        {
            accessorKey: 'employee_status',
            header: 'Employee Status',
            sortable: false,
            cell: ({ row }: any) => {
                const status: string = row.employee_status ?? '—';
                const colorMap: Record<string, string> = {
                    Confirmed: 'bg-green-100 text-green-800',
                    'On Probation': 'bg-yellow-100 text-yellow-800',
                    Suspended: 'bg-red-100 text-red-800',
                    Released: 'bg-gray-100 text-gray-600',
                    Discharged: 'bg-gray-100 text-gray-600',
                    Dismissed: 'bg-red-100 text-red-700',
                    Retired: 'bg-blue-100 text-blue-700',
                };
                const cls = colorMap[status] ?? 'bg-gray-100 text-gray-600';
                return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            className: 'w-[80px] text-center',
            cell: ({ row }: any) => (
                <button
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                    onClick={() => router.visit(route('payroll.employee-salary-profiles.show', row.user_id))}
                    title="Manage Salary"
                >
                    <Settings className="h-3.5 w-3.5" />
                    Manage
                </button>
            ),
        },
    ];

    return (
        <AppLayout title="Employee Salary Profiles" breadcrumbs={breadcrumbs}>
            <DataTable ref={tableRef} columns={columns} dataUrl={route('payroll.employee-salary-profiles.index')} />
        </AppLayout>
    );
}
