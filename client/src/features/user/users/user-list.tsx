'use client';
import { fetchUser } from '@/services/user';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

type UserList = {};

export default function UserList({}: UserList) {

  const { data } = useQuery({
    queryKey: ['user-list'],
    queryFn: async () => await fetchUser({})
  });

    const { data: session } = useSession();


  console.log('ddd', session)

  return (
    <></>
    // <UserTable data={products} totalItems={} columns={columns} />
  );
}
