'use client';
import { useUsers } from '@/services/user';
import { columns } from './user-table/columns';
import { UserTable } from './user-table';
import { User } from './type';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserList() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(2);

  const { data, isLoading } = useUsers({
    page,
    perPage
  });

  useEffect(() => {
    setPage(parseInt(searchParams.get('page') || '1', 10));
    setPerPage(parseInt(searchParams.get('perPage') || '10', 10));
  }, [searchParams]);

  if (!data || isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  const users: User[] = data.data;
  const totalPage = data.meta.last_page;

  return (
    <UserTable
      data={users}
      columns={columns}
      pageCount={totalPage}
      page={page}
      perPage={perPage}
    />
  );
}
