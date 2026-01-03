'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { userService } from '@/services/user.service'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { refreshUsers } = useUsers()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return

    try {
      setIsDeleting(true)
      await userService.deleteUser(currentRow.ulid)
      toast.success('User deleted successfully')
      onOpenChange(false)
      setValue('')
      refreshUsers()
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
          setValue('')
        }
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove the user from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter user name to confirm deletion.'
              disabled={isDeleting}
            />
          </Label>

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
