import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axiosInstance from './api-client';
import { paths } from '@/constants/paths';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        try {
          const { data } = await axiosInstance.post('auth/login', credentials);

          const { user, access_token, refresh_token } = data.data;

          const newUser = {
            id: user.id,
            name: user.name,
            fullName: user.full_name,
            emailAddress: user.email,
            imageUrl: user.image,
            accessToken: access_token,
            refreshToken: refresh_token,
            roles: user.roles,
            permissions: user.permissions
          } as User;

          return newUser;
        } catch (error) {
          console.log(error);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.accessToken = user.accessToken ?? '';
        token.refreshToken = user.refreshToken ?? '';
        token.permissions = user.permissions;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.fullName = token.name as string;
      session.user.email = token.email as string;
      session.user.roles = token.roles;
      session.user.accessToken = token.accessToken ?? '';
      session.user.refreshToken = token.refreshToken ?? '';
      session.user.permissions = token.permissions;
      return session;
    }
  },
  pages: {
    signIn: paths.auth.signIn
  }
});
