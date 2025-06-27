'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRefreshToken } from './use-refresh-token';
import axiosInstance from '@/lib/api-client';

const useAxiosAuth = () => {
    const { data: session } = useSession();
    const refreshToken = useRefreshToken();
    console.log(session);

    useEffect(() => {
        const requestIntercept = axiosInstance.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] =
                        `Bearer ${session?.user?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    await refreshToken();
                    prevRequest.headers['Authorization'] =
                        `Bearer ${session?.user.accessToken}`;
                    return axiosInstance(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        };
    }, [session, refreshToken]);

    return axiosInstance;
};

export default useAxiosAuth;
