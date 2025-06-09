'use client';
import { useUsers } from '@/services/user';
import { columns } from './user-table/columns';
import { UserTable } from './user-table';
import { User } from './type';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function UserList() {
  const { data, isLoading } = useUsers({});

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  const users: User[] = data.data;

  return <UserTable data={users} totalItems={users.length} columns={columns} />;
}
