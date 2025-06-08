import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const isServer = typeof window === 'undefined';

const apiClient = axios.create({
    baseURL: isServer
        ? process.env.API_BASE_URL
        : process.env.NEXT_PUBLIC_API_BASE_URL || ''
});

// Add request interceptor on client side
if (!isServer) {
    apiClient.interceptors.request.use(
        async (config) => {
            const session = await getSession();
            if (session?.user?.accessToken) {
                config.headers.Authorization = `Bearer ${session.user.accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add response interceptor to handle 401 Unauthorized
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                await signOut();
            }
            return Promise.reject(error);
        }
    );
}

export default apiClient;
