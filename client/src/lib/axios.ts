import axios from 'axios';
import { getSession } from 'next-auth/react';

const isServer = typeof window === 'undefined';

const axiosInstance = axios.create({
    baseURL: isServer
        ? process.env.API_BASE_URL // Not used on client, but okay to keep for shared file
        : process.env.NEXT_PUBLIC_API_BASE_URL || '' // e.g. /api or https://yourdomain.com/api
});

if (!isServer) {
    axiosInstance.interceptors.request.use(
        async (config) => {
            const session = await getSession();
            if (session?.user.accessToken) {
                config.headers.Authorization = `Bearer ${session?.user.accessToken || session?.user.accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );
}

export default axiosInstance;
