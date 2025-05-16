import React from 'react';
import { PostTable } from './post-table';
import { columns } from './post-table/columns';
import { fetchProduct } from '@/services/product';
import { searchParamsCache } from '@/lib/searchparams';

export default async function TestList() {
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

  const data = await fetchProduct(filters);

  return (
    <>
      <PostTable
        data={data}
        columns={columns}
        totalItems={data.length}
      ></PostTable>
    </>
  );
}
