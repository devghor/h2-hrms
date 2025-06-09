import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';

// API Functions
export async function fetchUser({
  page = 1,
  limit = 10,
  categories,
  search
}: {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
}) {
  const query = new URLSearchParams({
    limit: limit.toString(),
    skip: page.toString(),
    ...(categories && { categories }),
    ...(search && { search })
  });

  const response = await apiClient.get(`/user/users?${query.toString()}`);
  return response.data;
}

export async function createUser(data: any) {
  const response = await apiClient.post(`/user/users`, data);
  return response.data;
}

// React Query Hooks
export const useUsers = ({
  page = 1,
  limit = 10,
  categories = '',
  search = ''
}: {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['users', { page, limit, categories, search }],
    queryFn: () => fetchUser({ page, limit, categories, search })
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const invalidateUsersQuery = () => {
  return queryClient.invalidateQueries({ queryKey: ['users'] });
};
