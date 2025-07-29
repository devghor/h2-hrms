'use client';
import { columns } from './user-table/columns';
import { UserTable } from './user-table';
import { User } from './type';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  PAGE_KEY,
  PER_PAGE_KEY
} from '@/config/pagination';
import {
  parseAsArrayOf,
  parseAsIndex,
  parseAsString,
  parseAsStringLiteral,
  useQueryState
} from 'nuqs';
import { useUsers } from '@/queries/uam/user';

export default function UserList() {
  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsIndex.withDefault(DEFAULT_PAGE)
  );
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsIndex.withDefault(DEFAULT_PER_PAGE)
  );
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [name, setName] = useQueryState('name');

  const { data, isLoading } = useUsers({
    page,
    perPage,
    name,
    sort
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  const users: User[] = data.data ?? [];
  const totalPage = data.meta.last_page ?? null;

  return <UserTable data={users} columns={columns} pageCount={totalPage} />;
}
