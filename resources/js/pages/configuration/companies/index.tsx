import { path } from '@/config/paths';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        ...path.dashboard,
    },
    {
        ...path.configuration.companies,
    },
];

export default function Index() {
    return (
        <AppLayout title="Users" breadcrumbs={breadcrumbs}>
            {''}
        </AppLayout>
    );
}
