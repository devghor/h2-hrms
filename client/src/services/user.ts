import apiClient from '@/lib/api-client';

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
    const response = await apiClient.get(
        `/user/users?limit=${limit}&skip=${page}`
    );
    return response.data;
}
