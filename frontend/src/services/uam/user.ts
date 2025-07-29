import apiClient from '@/lib/api-client';
import { sortToQueryParam } from '@/utils/sorting-util';

type GetUserParams = {
  page?: any;
  perPage?: any;
  sort?: any;
  name?: any;
};

/**
 * Get users
 */
export async function getUsers({ page, perPage, sort, name }: GetUserParams) {
  const queryParams: Record<string, string> = {};
  if (page !== undefined) queryParams.page = page.toString();
  if (perPage !== undefined) queryParams.per_page = perPage.toString();
  if (sort !== undefined) queryParams.sort = sortToQueryParam(sort);
  if (name !== undefined && name) queryParams['filter[name]'] = name;
  const query = new URLSearchParams(queryParams);
  const response = await apiClient.get(`/uam/users?${query.toString()}`);
  return response.data;
}

/**
 * Create user
 */
export async function createUser(data: any) {
  const response = await apiClient.post(`/uam/users`, data);
  return response.data;
}

/**
 * Update user
 */
export async function updateUser(data: any) {
  const response = await apiClient.put(`/uam/users/${data['id']}`, data);
  return response.data;
}

/**
 * Delete user
 */
export async function deleteUser(data: any) {
  const response = await apiClient.delete(`/uam/users/${data['id']}`, data);
  return response.data;
}
