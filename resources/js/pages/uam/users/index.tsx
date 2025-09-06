import DataTable from '@/components/data-table/data-table';
import { DatePicker } from '@/components/date-picker';
import { DeleteConfirmDialog } from '@/components/dialog/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { breadcrumbItems } from '@/config/breadcrumbs';
import { KEY_DATA_TABLE } from '@/constants/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.uamUsers];

export default function Index() {
    const { errors } = usePage().props;
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [openAlert, setOpenAlert] = useState(false);

    interface User {
        id: number;
        name: string;
        email: string;
        created_at: string;
        password?: string;
        password_confirmation?: string;
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
                <DatePicker className="w-50" value={value} onChange={onChange} />
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            searchable: false,
            className: 'min-w-[120px] text-center',
            cell: ({ row }: any) => {
                console.log(row);

                return (
                    <>
                        <Button size="sm" onClick={() => handleOpenEdit(row as User)} variant="outline" className="cursor-pointer">
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

    const emptyForm = { name: '', email: '', password: '', password_confirmation: '' };

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

    const handleOpenEdit = (user: User) => {
        setForm({ ...user, password: '', password_confirmation: '' });
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
                route('uam.users.update', form.id),
                {
                    ...form,
                },
                {
                    onSuccess: () => {
                        toast.success('User updated successfully');
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
                route('uam.users.store'),
                {
                    ...form,
                },
                {
                    onSuccess: () => {
                        toast.success('User created successfully');
                        handleClose();
                    },
                    onError: (errors) => {
                        setFormErrors(errors);
                    },
                },
            );
        }
    };

    const handleDelete = (userId: number) => {
        router.delete(route('uam.users.destroy', userId), {
            onSuccess: () => {
                tableRef.current?.refetch();
                toast('User deleted successfully');
            },
            onError: (errors) => {
                toast('Error deleting user');
            },
        });
    };

    return (
        <AppLayout title="Users" breadcrumbs={breadcrumbs}>
            {/* Data table for users */}
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('uam.users.index', { [KEY_DATA_TABLE]: true })}
                extraActions={
                    <>
                        <Button variant="default" className="cursor-pointer" onClick={handleOpenAdd}>
                            Add User
                        </Button>
                    </>
                }
            />

            {/* Dialog for adding/editing user */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" name="name" value={form.name} onChange={handleChange()} placeholder="Name" required />
                        {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" name="email" value={form.email} onChange={handleChange()} placeholder="Email" required />
                        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange()}
                            placeholder="Password"
                            required={!isEdit}
                            autoComplete="new-password"
                        />
                        {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange()}
                            placeholder="Confirm Password"
                            required={!isEdit}
                            autoComplete="new-password"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleClose}>
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
