import axiosInstance from '@/lib/axios';

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
  const response = await axiosInstance.get(
    `/user/users?limit=${limit}&skip=${page}`
  );
  return response.data;
}
