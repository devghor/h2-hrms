'use client';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './user-table/columns';
import { UserTable } from './user-table';
import { fetchUser } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

type ProductListingPage = {};

export default function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const { data } = useQuery({
    queryKey: 'user-list',
    queryFn: fetchUser(filters)
  });

  return (
    <UserTable data={products} totalItems={totalProducts} columns={columns} />
  );
}
