import DataTable from '@/components/data-table/data-table';
import { DeleteConfirmDialog } from '@/components/dialog/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KEY_DATA_TABLE } from '@/constants/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index() {
    const { errors } = usePage().props;
    const tableRef = useRef<{ refetch: () => void }>(null);

    interface Role {
        id: number;
        name: string;
        description?: string;
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
            accessorKey: 'description',
            header: 'Description',
            sortable: true,
            searchable: true,
            searchComponent: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
                <Input type="text" className="w-50" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search Description" />
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
                        <Button size="sm" onClick={() => handleOpenEdit(row as Role)} variant="outline" className="cursor-pointer">
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

    const emptyForm = { name: '', description: '' };
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

    const handleOpenEdit = (role: Role) => {
        setForm({
            id: role.id,
            name: role.name,
            description: role.description ?? '',
        });
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
                route('uam.roles.update', form.id),
                {
                    ...form,
                },
                {
                    onSuccess: () => {
                        toast.success('Role updated successfully');
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
                route('uam.roles.store'),
                {
                    ...form,
                },
                {
                    onSuccess: () => {
                        toast.success('Role created successfully');
                        handleClose();
                    },
                    onError: (errors) => {
                        setFormErrors(errors);
                    },
                },
            );
        }
    };

    const handleDelete = (roleId: number) => {
        router.delete(route('uam.roles.destroy', roleId), {
            onSuccess: () => {
                tableRef.current?.refetch();
                toast('Role deleted successfully');
            },
            onError: (errors) => {
                toast('Error deleting role');
            },
        });
    };

    return (
        <AppLayout title="Roles" breadcrumbs={breadcrumbs}>
            {/* Data table for roles */}
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('uam.roles.index', { [KEY_DATA_TABLE]: true })}
                extraActions={
                    <>
                        <Button variant="default" className="cursor-pointer" onClick={handleOpenAdd}>
                            Add Role
                        </Button>
                    </>
                }
            />

            {/* Dialog for adding/editing role */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Role' : 'Add Role'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" name="name" value={form.name} onChange={handleChange()} placeholder="Name" required />
                        {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
                        <Label htmlFor="description">Description</Label>
                        <Input type="text" name="description" value={form.description} onChange={handleChange()} placeholder="Description" />
                        {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
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
