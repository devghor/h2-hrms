import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { breadcrumbItems } from '@/config/breadcrumbs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
    module: string;
    feature: string;
    action: string;
}

interface Role {
    id: number;
    name: string;
    description?: string;
    permissions: number[];
}

interface PermissionGroup {
    [module: string]: {
        [feature: string]: Permission[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    breadcrumbItems.dashboard,
    breadcrumbItems.uamRoles,
    {
        title: 'Edit Role',
        href: '',
    },
];

export default function EditRole({ role, allPermissions }: { role: Role; allPermissions: Permission[] }) {
    const [form, setForm] = useState({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions || [],
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handlePermissionChange = (permissionId: number) => {
        setForm((prev) => {
            const permissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter((id) => id !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions };
        });
    };

    const handleSelectAllFeature = (featurePermissions: Permission[]) => {
        const featureIds = featurePermissions.map((p) => p.id);
        const allSelected = featureIds.every((id) => form.permissions.includes(id));

        setForm((prev) => {
            const permissions = allSelected
                ? prev.permissions.filter((id) => !featureIds.includes(id))
                : [...new Set([...prev.permissions, ...featureIds])];
            return { ...prev, permissions };
        });
    };

    const handleSelectAllModule = (modulePermissions: Permission[]) => {
        const moduleIds = modulePermissions.map((p) => p.id);
        const allSelected = moduleIds.every((id) => form.permissions.includes(id));

        setForm((prev) => {
            const permissions = allSelected
                ? prev.permissions.filter((id) => !moduleIds.includes(id))
                : [...new Set([...prev.permissions, ...moduleIds])];
            return { ...prev, permissions };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('uam.roles.update', role.id), form, {
            onSuccess: () => {
                toast.success('Role updated successfully');
            },
            onError: (errors) => {
                setFormErrors(errors);
            },
        });
    };

    // Group permissions by module and feature
    const permissionsByModuleAndFeature = allPermissions.reduce<PermissionGroup>((acc, perm) => {
        if (!acc[perm.module]) {
            acc[perm.module] = {};
        }
        if (!acc[perm.module][perm.feature]) {
            acc[perm.module][perm.feature] = [];
        }
        acc[perm.module][perm.feature].push(perm);
        return acc;
    }, {});

    const isFeatureFullySelected = (featurePermissions: Permission[]) => {
        return featurePermissions.every((perm) => form.permissions.includes(perm.id));
    };

    const isModuleFullySelected = (modulePermissions: Permission[]) => {
        return modulePermissions.every((perm) => form.permissions.includes(perm.id));
    };

    const isFeaturePartiallySelected = (featurePermissions: Permission[]) => {
        return featurePermissions.some((perm) => form.permissions.includes(perm.id)) && !isFeatureFullySelected(featurePermissions);
    };

    return (
        <AppLayout title="Edit Role" breadcrumbs={breadcrumbs}>
            <div className="py-auto container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Role</CardTitle>
                        <CardDescription>Modify role details and assign permissions to control access levels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information Section */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Role Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                            placeholder="Enter role name"
                                        />
                                        {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            className="w-full"
                                            placeholder="Enter role description"
                                        />
                                        {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Permissions Section */}
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-lg font-semibold">Permissions</Label>
                                    <p className="mt-1 text-sm text-muted-foreground">Select the permissions this role should have access to.</p>
                                </div>

                                <div className="space-y-8">
                                    {Object.entries(permissionsByModuleAndFeature).map(([module, features]) => {
                                        const allModulePermissions = Object.values(features).flat();
                                        const moduleFullySelected = isModuleFullySelected(allModulePermissions);

                                        return (
                                            <div key={module} className="space-y-4">
                                                {/* Module Header */}
                                                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                                                    <Checkbox
                                                        checked={moduleFullySelected}
                                                        onCheckedChange={() => handleSelectAllModule(allModulePermissions)}
                                                        className="data-[state=checked]:bg-primary"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-primary">{module.toUpperCase()}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {moduleFullySelected
                                                                ? 'All permissions selected'
                                                                : `${form.permissions.filter((id) => allModulePermissions.map((p) => p.id).includes(id)).length} of ${allModulePermissions.length} selected`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                <div className="ml-8 space-y-6">
                                                    {Object.entries(features).map(([feature, permissions]) => {
                                                        const featureFullySelected = isFeatureFullySelected(permissions);
                                                        const featurePartiallySelected = isFeaturePartiallySelected(permissions);

                                                        return (
                                                            <div key={feature} className="space-y-3">
                                                                {/* Feature Header */}
                                                                <div className="flex items-center gap-3 rounded-md border bg-background p-3">
                                                                    <Checkbox
                                                                        checked={featureFullySelected}
                                                                        ref={(el) => {
                                                                            if (el) {
                                                                                el.indeterminate = featurePartiallySelected;
                                                                            }
                                                                        }}
                                                                        onCheckedChange={() => handleSelectAllFeature(permissions)}
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium text-foreground">{feature}</h4>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Individual Permissions */}
                                                                <div className="ml-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                    {permissions.map((perm) => (
                                                                        <label
                                                                            key={perm.id}
                                                                            className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted/50"
                                                                        >
                                                                            <Checkbox
                                                                                checked={form.permissions.includes(perm.id)}
                                                                                onCheckedChange={() => handlePermissionChange(perm.id)}
                                                                            />
                                                                            <div className="min-w-0 flex-1">
                                                                                <span className="block truncate text-sm font-medium text-foreground">
                                                                                    {perm.action || perm.name}
                                                                                </span>
                                                                                {perm.action && (
                                                                                    <span className="block truncate text-xs text-muted-foreground">
                                                                                        {perm.name}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {formErrors.permissions && <p className="text-sm text-red-500">{formErrors.permissions}</p>}
                            </div>

                            {/* Actions */}
                            <Separator />

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.visit(route('uam.roles.index'))}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="min-w-[120px]">
                                    Update Role
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
