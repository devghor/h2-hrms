'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { roleService } from '@/services/role.service'
import { type Role } from '../data/schema'

type RoleDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null | undefined
  onSuccess: () => void
}

export function RolesDeleteDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RoleDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!role) return

    try {
      setIsDeleting(true)
      await roleService.deleteRole(role.id)
      toast.success('Role deleted successfully')
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error('Cannot delete system role')
      } else {
        handleServerError(error)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (!role) return null

  const isSystemRole = ['Super Admin', 'Admin'].includes(role.name)

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!isDeleting) {
          onOpenChange(state)
        }
      }}
      handleConfirm={handleDelete}
      disabled={isDeleting || isSystemRole}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Role
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{role.name}</span>?
            <br />
            This action will permanently remove the role from the system. This cannot be undone.
          </p>

          {isSystemRole ? (
            <Alert variant='destructive'>
              <AlertTitle>System Role</AlertTitle>
              <AlertDescription>
                This is a system role and cannot be deleted.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant='destructive'>
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                Please be careful, this operation can not be rolled back.
              </AlertDescription>
            </Alert>
          )}
        </div>
      }
      confirmText={isDeleting ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
