'use client';

import { signIn, useSession } from 'next-auth/react';
import axiosInstance from '../lib/api-client';

export const useRefreshToken = () => {
    const { data: session } = useSession();

    const refreshToken = async () => {
        const res = await axiosInstance.post('/auth/refresh', {
            refresh: session?.user.refreshToken
        });

        if (session) session.user.accessToken = res.data.accessToken;
        else signIn();
    };
    return refreshToken;
};
