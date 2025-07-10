import React from 'react';
import UserPage from '@/features/uam/user';
import { getTitleWithSuffix } from '@/utils/metadata';

export const metadata = {
  title: getTitleWithSuffix('Users'),
  description: 'User managements'
};

export default async function Page() {
  return <UserPage />;
}
