import { QueryKeys } from '@/constants/query-keys';
import apiClient from '@/lib/api-client';
import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * Get roles
 */
export async function getRoles() {
  const response = await apiClient.get(`/uam/roles`);
  return response.data;
}

export async function createRole(data: any) {
  const response = await apiClient.post(`/uam/roles`, data);
  return response.data;
}

export async function updateRole(data: any) {
  const response = await apiClient.put(`/uam/roles/${data['id']}`, data);
  return response.data;
}

export async function deleteRole(data: any) {
  const response = await apiClient.delete(`/uam/roles/${data['id']}`, data);
  return response.data;
}

export const useRoles = () => {
  return useQuery({
    queryKey: QueryKeys.UAM_ROLES.GET_ALL,
    queryFn: getRoles
  });
};

export const useCreateRole = () => {
  return useMutation({ mutationFn: createRole });
};

export const useUpdateRole = () => {
  return useMutation({ mutationFn: updateRole });
};

export const useDeleteRole = () => {
  return useMutation({ mutationFn: deleteRole });
};
