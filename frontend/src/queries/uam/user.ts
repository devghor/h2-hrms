import { QueryKeys } from '@/constants/query-keys';
import { queryClient } from '@/lib/query-client';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser
} from '@/services/uam/user';
import { useMutation, useQuery } from '@tanstack/react-query';

type GetUserParams = {
  page?: any;
  perPage?: any;
  sort?: any;
  name?: any;
};

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
