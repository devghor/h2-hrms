import DataTable from '@/components/data-table/data-table';
import { DeleteConfirmDialog } from '@/components/dialog/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.uamPermissions];

export default function Index() {
    const { errors } = usePage().props;
    const tableRef = useRef<{ refetch: () => void }>(null);

    interface Permission {
        id: number;
        name: string;
        guard_name?: string;
        created_at: string;
    }

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
                        <Button size="sm" onClick={() => handleOpenEdit(row as Permission)} variant="outline" className="cursor-pointer">
                            Edit
                        </Button>
                        <DeleteConfirmDialog
                            triggerElement={
                                <Button size="sm" variant="destructive" className="ml-2">
                                    Delete
                                </Button>
                            }
                            onConfirm={() => handleDelete(row.id)}
                        />
                    </>
                );
            },
        },
    ];

    const emptyForm = { name: '', guard_name: '' };
    type FormState = typeof emptyForm & { id?: number };
    const [form, setForm] = useState<FormState>(emptyForm);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

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
            <DataTable ref={tableRef} columns={columns} dataUrl={route('uam.permissions.index', { 'permissions-data-table': true })} />

            {/* Dialog for adding/editing permission */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Permission' : 'Add Permission'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" name="name" value={form.name} onChange={handleChange()} placeholder="Name" required />
                        {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
                        <Label htmlFor="guard_name">Guard Name</Label>
                        <Input type="text" name="guard_name" value={form.guard_name} onChange={handleChange()} placeholder="Guard Name" />
                        {formErrors.guard_name && <p className="text-red-500">{formErrors.guard_name}</p>}
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleClose} type="button">
                                Cancel
                            </Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
