'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User } from '../type';
import { Button } from '@/components/ui/button';
import { EditUserDialog } from '../edit-user-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { AlertModal } from '@/components/modal/alert-modal';
import { useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Text } from 'lucide-react';
import { useCan } from '@/components/providers/ability-provider';
import { useTranslations } from 'next-intl';
import { invalidateUsersQuery, useDeleteUser } from '@/queries/uam/user';

export const columns: ColumnDef<User>[] = [
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
    },
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    )
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email'
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

      return (
        <div className='w-full text-center'>
          {can('edit:users') ? <EditUserDialog {...row.original} /> : ''}
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onConfirm}
            loading={isPending}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='sm' onClick={() => setOpen(true)}>
                <IconTrash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('Delete')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }
  }
];
