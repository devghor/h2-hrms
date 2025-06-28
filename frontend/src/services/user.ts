import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import { QueryKeys } from '@/constants/query-keys';
import { sortToQueryParam } from '@/utils/sorting-util';

type GetUserParams = {
  page?: any;
  perPage?: any;
  sort?: any;
  name?: any;
};

/**
 * API Functions
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

export async function createUser(data: any) {
  const response = await apiClient.post(`/uam/users`, data);
  return response.data;
}

export async function updateUser(data: any) {
  const response = await apiClient.put(`/uam/users/${data['id']}`, data);
  return response.data;
}

export async function deleteUser(data: any) {
  const response = await apiClient.delete(`/uam/users/${data['id']}`, data);
  return response.data;
}

/**
 * React Query Hooks
 */
export const invalidateUsersQuery = () => {
  return queryClient.invalidateQueries({
    queryKey: QueryKeys.UAM_USERS.GET_ALL
  });
};

export const useUsers = (params: GetUserParams) => {
  return useQuery({
    queryKey: [...QueryKeys.UAM_USERS.GET_ALL, params],
    queryFn: () => getUsers(params)
  });
};

export const useCreateUser = () => {
  return useMutation({ mutationFn: createUser });
};

export const useUpdateUser = () => {
  return useMutation({ mutationFn: updateUser });
};

export const useDeleteUser = () => {
  return useMutation({ mutationFn: deleteUser });
};
