'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { userService } from '@/services/user.service'
import { type User } from '../data/schema'

type UserMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<User>
  onSuccess: () => void
}

export function UsersMultiDeleteDialog({
  open,
  onOpenChange,
  table,
  onSuccess,
}: UserMultiDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    const ulids = selectedRows.map((row) => row.original.ulid)
    
    if (ulids.length === 0) {
      toast.error('No users selected')
      return
    }

    try {
      setIsDeleting(true)
      const response = await userService.bulkDeleteUsers(ulids)
      toast.success(response.message)
      onOpenChange(false)
      table.resetRowSelection()
      onSuccess()
    } catch (error) {
      handleServerError(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!isDeleting) {
          onOpenChange(state)
        }
      }}
      handleConfirm={handleDelete}
      disabled={isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete {selectedRows.length}{' '}
            {selectedRows.length > 1 ? 'users' : 'user'}?
            <br />
            This action will permanently remove the selected users from the system. This cannot be undone.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
