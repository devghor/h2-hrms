import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import { QueryKeys } from '@/constants/query-keys';

// API Functions
export async function fetchUser({
  page = 1,
  perPage = 10
}: {
  page?: number;
  perPage?: number;
  categories?: string;
  search?: string;
}) {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString()
  });

  const response = await apiClient.get(`/user/users?${query.toString()}`);
  return response.data;
}

export async function createUser(data: any) {
  const response = await apiClient.post(`/user/users`, data);
  return response.data;
}

export async function updateUser(data: any) {
  const response = await apiClient.put(`/user/users/${data['id']}`, data);
  return response.data;
}

export async function deleteUser(data: any) {
  const response = await apiClient.delete(`/user/users/${data['id']}`, data);
  return response.data;
}

// React Query Hooks
export const invalidateUsersQuery = () => {
  return queryClient.invalidateQueries({
    queryKey: QueryKeys.UAM_USERS.GET_ALL
  });
};

export const useUsers = ({
  page,
  perPage
}: {
  page: number;
  perPage: number;
}) => {
  return useQuery({
    queryKey: [...QueryKeys.UAM_USERS.GET_ALL, page, perPage],
    queryFn: () => fetchUser({ page, perPage })
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
