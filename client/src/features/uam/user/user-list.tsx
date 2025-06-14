'use client';
import { useUsers } from '@/services/user';
import { columns } from './user-table/columns';
import { UserTable } from './user-table';
import { User } from './type';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DEFAULT_PAGE, PER_PAGE } from '@/config/pagination';

export default function UserList() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [perPage, setPerPage] = useState(PER_PAGE);
  const [sort, setSort] = useState('');
  const [name, setName] = useState('');

  const { data, isLoading } = useUsers({
    page,
    perPage,
    sort,
    name
  });

  useEffect(() => {
    setPage(parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10));
    setPerPage(parseInt(searchParams.get('perPage') || `${PER_PAGE}`, 10));
    setSort(searchParams.get('sort') || '');
    setName(searchParams.get('name') || '');
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
