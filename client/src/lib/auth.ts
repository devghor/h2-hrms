import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axiosInstance from './axios';

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
          const { user } = data.data;
          return {
            id: user.id,
            name: user.name,
            fullName: user.full_name,
            emailAddress: user.email,
            imageUrl: user.image,
            roles: user.roles,
            accessToken: data.data.access_token,
            refreshToken: data.data.refresh_token
          } as User;
        } catch (error) {
          console.log(error);
        }

        return false;
      }
    })
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.roles = user.roles;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
});
