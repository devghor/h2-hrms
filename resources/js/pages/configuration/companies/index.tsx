import DataTable from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { path } from '@/config/paths';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useRef, useState } from 'react';
import { CompaniesMutateDrawer } from './components/companies-mutate-drawer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        ...path.dashboard,
    },
    {
        ...path.uam.users,
    },
];

const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        sortable: true,
        searchable: true,
        searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Input type="number" className="w-50" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search ID" />
        ),
    },
    {
        accessorKey: 'name',
        header: 'Name',
        sortable: true,
        searchable: true,
        searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Input type="text" className="w-50" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search Name" />
        ),
    },
    {
        accessorKey: 'guard_name',
        header: 'Guard Name',
        sortable: true,
        searchable: true,
        searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Input type="text" className="w-50" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search Guard Name" />
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        sortable: true,
        searchable: true,
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        sortable: false,
        searchable: false,
        className: 'min-w-[120px] text-center',
        cell: ({ row }: any) => {
            return (
                <>
                    <Button size="sm" variant="outline" className="cursor-pointer">
                        Edit
                    </Button>
                </>
            );
        },
    },
];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [openMutateDrawer, setOpenMutateDrawer] = useState(false);

    return (
        <AppLayout title="Users" breadcrumbs={breadcrumbs}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('configuration.companies.index', { 'companies-data-table': true })}
                extraActions={
                    <>
                        <Button size="sm" onClick={() => setOpenMutateDrawer(true)}>
                            Add Company
                        </Button>
                    </>
                }
            />

            <CompaniesMutateDrawer open={openMutateDrawer} onOpenChange={setOpenMutateDrawer} currentRow={undefined} />
        </AppLayout>
    );
}
