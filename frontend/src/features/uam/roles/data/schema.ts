import { z } from 'zod'

// Permission Schema
const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
})
export type Permission = z.infer<typeof permissionSchema>

// API Role Schema matching backend response
const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  guard_name: z.string(),
  description: z.string().nullable().optional(),
  permissions: z.array(permissionSchema).optional(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Role = z.infer<typeof roleSchema>

// API Pagination Link Schema
const paginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  page: z.number().nullable().optional(),
  active: z.boolean(),
})

// API Pagination Meta Schema
const paginationMetaSchema = z.object({
  current_page: z.number(),
  from: z.number().nullable(),
  last_page: z.number(),
  links: z.array(paginationLinkSchema),
  path: z.string(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
})

// API Response Schema
export const rolesResponseSchema = z.object({
  data: z.array(roleSchema),
  links: z.object({
    first: z.string().nullable(),
    last: z.string().nullable(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  meta: paginationMetaSchema,
})

export type RolesResponse = z.infer<typeof rolesResponseSchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>

export const roleListSchema = z.array(roleSchema)
