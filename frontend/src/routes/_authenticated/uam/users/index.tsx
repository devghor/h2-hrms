import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/uam/users'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z.array(z.string()).optional().catch([]),
  // Search filters
  ulid: z.string().optional().catch(''),
  name: z.string().optional().catch(''),
  email: z.string().optional().catch(''),
  tenant_id: z.string().optional().catch(''),
  username: z.string().optional().catch(''),
  // Date range filters
  from_date: z.string().optional().catch(''),
  to_date: z.string().optional().catch(''),
  // Sorting
  sort_by: z.string().optional().catch(''),
  sort_order: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/uam/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
})
