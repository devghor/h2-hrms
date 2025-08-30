import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface Company {
    id?: number;
    company_name: string;
    company_short_name: string;
}
type DrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow?: Company;
};

export function CompaniesMutateDrawer({ open, onOpenChange, currentRow }: DrawerProps) {
    const isUpdate = !!currentRow;

    const { data, setData, errors, put, post, reset, processing, recentlySuccessful } = useForm({
        company_name: '',
        company_short_name: '',
    });

    const submit = (e: React.FormEvent) => {
        console.log(e);
        e.preventDefault();

        if (isUpdate) {
            put(route('configuration.companies.update', currentRow?.id), {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                },
            });
        } else {
            post(route('configuration.companies.store'), {
                onSuccess: () => {
                    reset();
                    toast.success('Company created successfully.');
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v);
                reset();
            }}
        >
            <form onSubmit={submit} id="companies-form">
                <SheetContent className="flex flex-col">
                    <SheetHeader className="text-start">
                        <SheetTitle>{isUpdate ? 'Update' : 'Create'} Company</SheetTitle>
                        <SheetDescription>
                            {isUpdate ? 'Update the company by providing necessary info.' : 'Add a new company by providing necessary info.'}
                            Click save when you&apos;re done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-2 px-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                                type="text"
                                name="company_name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                            />
                            <InputError message={errors.company_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_short_name">Company Short Name</Label>
                            <Input
                                type="text"
                                name="company_short_name"
                                value={data.company_short_name}
                                onChange={(e) => setData('company_short_name', e.target.value)}
                            />
                            <InputError message={errors.company_short_name} />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button form="companies-form" type="submit" disabled={processing}>
                            {isUpdate ? 'Update' : 'Create'} Company
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </form>
        </Sheet>
    );
}
