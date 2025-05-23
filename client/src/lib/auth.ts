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
          const {data} = await axiosInstance.post('auth/login', credentials);

          const { user, access_token, refresh_token} = data.data;
         const newUser = {
            id: user.id,
            name: user.name,
            fullName: user.full_name,
            emailAddress: user.email,
            imageUrl: user.image,
            roles: user.roles,
            accessToken: access_token,
            refreshToken: refresh_token
          } as User;

          console.log('user', access_token)
          return user;
        } catch (error) {
          console.log(error);
        }

        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {

      return {...token, ...user};
    },
    session({ session, token }) {
        session.user = token as any;
        return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
});
