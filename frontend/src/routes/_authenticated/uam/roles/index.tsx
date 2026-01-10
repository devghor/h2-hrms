import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Roles } from '@/features/uam/roles'
import { hasPermission } from '@/lib/casl'

const rolesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Search filters
  name: z.string().optional().catch(''),
  description: z.string().optional().catch(''),
  // Date range filters
  from_date: z.string().optional().catch(''),
  to_date: z.string().optional().catch(''),
  // Sorting
  sort_by: z.string().optional().catch(''),
  sort_order: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/uam/roles/')({  
  validateSearch: rolesSearchSchema,
  beforeLoad: () => {
    // Check if user has READ_UAM_ROLE permission
    if (!hasPermission('READ_UAM_ROLE')) {
      throw redirect({ to: '/403' })
    }
  },
  component: Roles,
})
