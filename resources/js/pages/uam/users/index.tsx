import { AppContent } from '@/components/app-content';
import DataTable from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index() {
    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            sortable: true,
            searchable: true,
            searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
                <Input type="number" className="w-full" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search ID" />
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            sortable: true,
            searchable: true,
            searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
                <Input type="text" className="w-full" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search Name" />
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            sortable: true,
            searchable: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            sortable: true,
            searchable: true,
            searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
                <Input type="date" className="w-full" value={value} onChange={(e) => onChange(e.target.value)} />
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            searchable: false,
            className: 'min-w-[120px] text-center',
            cell: ({ row }: any) => (
                <Button size="sm" onClick={() => console.log('Edit user:', row.id)}>
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <AppContent title="Users" description="Manage your users">
                <DataTable
                    columns={columns}
                    dataUrl={route('uam.users.index', { 'data-table': true })}
                    extraActions={
                        <>
                            <Button variant="default">Add User</Button>
                        </>
                    }
                />
            </AppContent>
        </AppLayout>
    );
}
