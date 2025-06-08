'use client';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '../type';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

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
        cell: function Cell() {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem variant='destructive'>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
