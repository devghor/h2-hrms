'use client';
import { ColumnDef } from '@tanstack/react-table';
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

export const columns: ColumnDef<User>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID'
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name'
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
          <EditUserDialog {...row.original} />
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
