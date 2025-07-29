'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';
import { Text } from 'lucide-react';
import { useCan } from '@/components/providers/ability-provider';
import { useTranslations } from 'next-intl';
import { Role } from '../types';
import { invalidateUsersQuery, useDeleteUser } from '@/queries/uam/user';

export const columns: ColumnDef<Role>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID'
  },
  {
    id: 'name',
    accessorKey: 'name',
    enableColumnFilter: true,
    meta: {
      label: 'Name',
      placeholder: 'Search name...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description'
  },
  {
    id: 'actions',
    header: () => <div className='w-full text-center'>Actions</div>,
    cell: function Cell({ row }) {
      const t = useTranslations();

      const { mutate, isPending } = useDeleteUser();
      const [open, setOpen] = useState(false);
      const can = useCan();
      const onConfirm = async () => {
        mutate(
          { ...row.original },
          {
            onSuccess: () => {
              invalidateUsersQuery();
              setOpen(false);
              toast.success('Successfully deleted!');
            },
            onError: () => {
              toast.success('Something went wrong!');
            }
          }
        );
      };

      return <div className='w-full text-center'></div>;
    }
  }
];
