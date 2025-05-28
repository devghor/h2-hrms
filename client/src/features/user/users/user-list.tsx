'use client';
import { fetchUser } from '@/services/user';
import { useQuery } from '@tanstack/react-query';
import { columns } from './user-table/columns';
import { UserTable } from './user-table';
import { User } from './type';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function UserList() {
    const { data, isLoading } = useQuery({
        queryKey: ['user-list'],
        queryFn: async () => await fetchUser({})
    });

    if (isLoading) {
        return (
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
        );
    }

    const users: User[] = data.data;

    return (
        <UserTable data={users} totalItems={users.length} columns={columns} />
    );
}
