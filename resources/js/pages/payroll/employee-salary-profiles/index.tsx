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
        { accessorKey: 'net_amount', header: 'Net', sortable: true },
        {
            accessorKey: 'is_active',
            header: 'Profile Status',
            sortable: false,
            cell: ({ row }: any) => (
                <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {row.is_active ? 'Profile Set' : 'Not Set'}
                </span>
            ),
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
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('payroll.employee-salary-profiles.index')}
            />
        </AppLayout>
    );
}
