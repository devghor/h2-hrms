import DataTable from '@/components/data-table/data-table';
import { DeleteConfirmDialog } from '@/components/dialog/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { DeleteIcon, EditIcon, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.configurationDivisions];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: undefined, name: '', description: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true, searchable: true },
        { accessorKey: 'name', header: 'Name', sortable: true, searchable: true },
        { accessorKey: 'description', header: 'Description', sortable: true, searchable: true },
        { accessorKey: 'created_at', header: 'Created At', sortable: true },
        {
            accessorKey: 'actions',
            header: 'Actions',
            sortable: false,
            cell: ({ row }: any) => (
                <>
                    <Button size="icon" onClick={() => handleEdit(row)} variant="secondary">
                        <EditIcon />
                    </Button>
                    <DeleteConfirmDialog
                        triggerElement={
                            <Button size="icon" variant="secondary" className="ml-2">
                                <DeleteIcon />
                            </Button>
                        }
                        onConfirm={() => handleDelete(row.id)}
                    />
                </>
            ),
        },
    ];

    const handleOpenAdd = () => {
        setForm({ id: undefined, name: '', description: '' });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        setForm({ id: row.id, name: row.name, description: row.description });
        setIsEdit(true);
        setOpen(true);
        setFormErrors({});
    };

    const handleDelete = (id: number) => {
        router.delete(route('configuration.divisions.destroy', id), {
            onSuccess: () => tableRef.current?.refetch(),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data: Record<string, any> = {
            name: form.name,
            description: form.description,
        };
        const onFinish = () => setLoading(false);
        if (isEdit && form.id) {
            router.put(route('configuration.divisions.update', form.id), data, {
                onSuccess: () => {
                    setOpen(false);
                    tableRef.current?.refetch();
                    onFinish();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    onFinish();
                },
            });
        } else {
            router.post(route('configuration.divisions.store'), data, {
                onSuccess: () => {
                    setOpen(false);
                    tableRef.current?.refetch();
                    onFinish();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    onFinish();
                },
            });
        }
    };

    return (
        <AppLayout title="Divisions" breadcrumbs={breadcrumbs}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('configuration.divisions.index', { 'data-table': true })}
                extraActions={<Button onClick={handleOpenAdd}>Add Division</Button>}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Division' : 'Add Division'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" value={form.name} onChange={handleChange} required />
                            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input name="description" value={form.description} onChange={handleChange} />
                            {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? 'Update' : 'Create'} Division
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
