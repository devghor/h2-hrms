import { z } from 'zod'

// API User Schema matching backend response
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  email_verified_at: z.string().nullable(),
  tenant_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type User = z.infer<typeof userSchema>

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
export const usersResponseSchema = z.object({
  data: z.array(userSchema),
  links: z.object({
    first: z.string().nullable(),
    last: z.string().nullable(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  meta: paginationMetaSchema,
})

export type UsersResponse = z.infer<typeof usersResponseSchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>

export const userListSchema = z.array(userSchema)
