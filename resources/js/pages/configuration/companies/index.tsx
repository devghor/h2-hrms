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

const breadcrumbs: BreadcrumbItem[] = [breadcrumbItems.dashboard, breadcrumbItems.configurationCompanies];

export default function Index() {
    const tableRef = useRef<{ refetch: () => void }>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: undefined, company_name: '', company_short_name: '', company_logo: null as File | null });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const columns = [
        { accessorKey: 'id', header: 'ID', sortable: true, searchable: true },
        { accessorKey: 'company_name', header: 'Company Name', sortable: true, searchable: true },
        { accessorKey: 'company_short_name', header: 'Short Name', sortable: true, searchable: true },
        {
            accessorKey: 'company_logo',
            header: 'Logo',
            cell: ({ row }: any) => (row.company_logo ? <img src={row.company_logo} alt="Logo" className="h-8" /> : null),
        },
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
        setForm({ id: undefined, company_name: '', company_short_name: '', company_logo: null });
        setIsEdit(false);
        setOpen(true);
        setFormErrors({});
    };

    const handleEdit = (row: any) => {
        setForm({ id: row.id, company_name: row.company_name, company_short_name: row.company_short_name, company_logo: null });
        setIsEdit(true);
        setOpen(true);
        setFormErrors({});
    };

    const handleDelete = (id: number) => {
        router.delete(route('configuration.companies.destroy', id), {
            onSuccess: () => tableRef.current?.refetch(),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('company_name', form.company_name);
        data.append('company_short_name', form.company_short_name);
        if (form.company_logo) data.append('company_logo', form.company_logo);
        const onFinish = () => setLoading(false);
        if (isEdit && form.id) {
            data.append('_method', 'PUT');
            router.post(route('configuration.companies.update', form.id), data, {
                forceFormData: true,
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
            router.post(route('configuration.companies.store'), data, {
                forceFormData: true,
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
        <AppLayout title="Companies" breadcrumbs={breadcrumbs}>
            <DataTable
                ref={tableRef}
                columns={columns}
                dataUrl={route('configuration.companies.index', { 'data-table': true })}
                extraActions={<Button onClick={handleOpenAdd}>Add Company</Button>}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Company' : 'Add Company'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                        <div>
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input name="company_name" value={form.company_name} onChange={handleChange} required />
                            {formErrors.company_name && <p className="text-sm text-red-500">{formErrors.company_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="company_short_name">Short Name</Label>
                            <Input name="company_short_name" value={form.company_short_name} onChange={handleChange} required />
                            {formErrors.company_short_name && <p className="text-sm text-red-500">{formErrors.company_short_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="company_logo">Logo</Label>
                            <Input name="company_logo" type="file" accept="image/*" onChange={handleChange} />
                            {formErrors.company_logo && <p className="text-sm text-red-500">{formErrors.company_logo}</p>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? 'Update' : 'Create'} Company
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
