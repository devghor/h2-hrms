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
import { invalidateUsersQuery, useDeleteUser } from '@/services/user';
import { toast } from 'sonner';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Text } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { createAbilityFromPermissions } from '@/lib/casl/ability';

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
      const { mutate, isPending } = useDeleteUser();
      const [open, setOpen] = useState(false);
      const { data: session } = useSession();
      const ability = createAbilityFromPermissions(session?.user.permissions!);
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
          {ability.can('edit:users', '') ? (
            <EditUserDialog {...row.original} />
          ) : (
            ''
          )}
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
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }
  }
];
