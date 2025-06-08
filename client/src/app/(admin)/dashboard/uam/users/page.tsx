import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import PostList from '@/features/blog/post-list';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { SearchParams } from 'nuqs';
import { searchParamsCache } from '@/lib/searchparams';
import PageHeader from '@/components/layout/page-header';
import UserList from '@/features/user/users/user-list';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { CreateUserDialog } from './_components/create-user-dialog';

type pageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
    return (
        <PageContainer scrollable={false}>
            <PageHeader
                title='Users'
                description='User managements'
                actions={<CreateUserDialog />}
            />
            <UserList />
        </PageContainer>
    );
}
