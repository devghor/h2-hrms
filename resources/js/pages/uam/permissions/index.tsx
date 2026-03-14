import DataTable from '@/components/data-table/data-table';
import { RowActions } from '@/components/data-table/row-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BulkDeleteButton from '@/components/bulk-delete-button';
import { BaseDialog } from '@/components/dialog/base-dialog';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.uamPermissions];

interface Permission {
    id: number;
    name: string;
    guard_name?: string;
    created_at: string;
}

export default function Index() {
    const { errors } = usePage().props;
    const tableRef = useRef<{ refetch: () => void }>(null);

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
        { accessorKey: 'created_at', header: 'Created At', sortable: true, searchable: true, filterType: 'date' as const },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            searchable: false,
            className: 'w-[60px] text-center',
            cell: ({ row }: any) => (
                <RowActions onEdit={() => handleOpenEdit(row as Permission)} onDelete={() => handleDelete(row.id)} />
            ),
        },
    ];

    const emptyForm = { name: '', guard_name: '' };
    type FormState = typeof emptyForm & { id?: number };
    const [form, setForm] = useState<FormState>(emptyForm);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleOpenEdit = (permission: Permission) => {
        setForm({ ...permission, guard_name: permission.guard_name ?? '' });
        setIsEdit(true);
        setOpen(true);
        setFormErrors({});
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.put(
                route('uam.permissions.update', form.id),
                {
                    ...form,
                },
                {
                    onSuccess: () => {
                        toast.success('Permission updated successfully');
                        tableRef.current?.refetch();
                        handleClose();
                    },
                    onError: (errors) => {
                        setFormErrors(errors);
                    },
                },
            );
        } else {
            router.post(
                route('uam.permissions.store'),
                {
                    ...form,
                },
                {
                    onSuccess: () => {
                        toast.success('Permission created successfully');
                        tableRef.current?.refetch();
                        handleClose();
                    },
                    onError: (errors) => {
                        setFormErrors(errors);
                    },
                },
            );
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        axios.delete(route('uam.permissions.bulk-delete'), { data: { ids: selectedIds } }).then(() => {
            toast.success(`${selectedIds.length} permission(s) deleted successfully`);
            tableRef.current?.refetch();
        }).catch(() => {
            toast.error('Error deleting selected permissions');
        });
    };

    const handleDelete = (permissionId: number) => {
        router.delete(route('uam.permissions.destroy', permissionId), {
            onSuccess: () => {
                tableRef.current?.refetch();
                toast('Permission deleted successfully');
            },
            onError: (errors) => {
                toast('Error deleting permission');
            },
        });
    };

    return (
        <AppLayout title="Permissions" breadcrumbs={breadcrumbs} actions={<Button onClick={handleOpenAdd}>Add Permission</Button>}>
            {/* Data table for permissions */}
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('uam.permissions.index')}
                onSelectionChange={setSelectedIds}
                extraActions={
                    <BulkDeleteButton selectedCount={selectedIds.length} onDelete={handleBulkDelete} />
                }
            />

            {/* Dialog for adding/editing permission */}
            <BaseDialog
                open={open}
                onOpenChange={setOpen}
                title={isEdit ? 'Edit Permission' : 'Add Permission'}
                description={isEdit ? 'Update the details of the existing permission.' : 'Fill in the details to create a new permission.'}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={isEdit ? 'Update' : 'Create'}
            >
                <Label htmlFor="name">Name</Label>
                <Input type="text" name="name" value={form.name} onChange={handleChange()} placeholder="Name" required />
                {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
                <Label htmlFor="guard_name">Guard Name</Label>
                <Input type="text" name="guard_name" value={form.guard_name} onChange={handleChange()} placeholder="Guard Name" />
                {formErrors.guard_name && <p className="text-red-500">{formErrors.guard_name}</p>}
            </BaseDialog>
        </AppLayout>
    );
}
