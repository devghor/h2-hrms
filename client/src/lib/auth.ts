import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        console.log(credentials);
        let user = null;
        user = {
          id: '1',
          name: 'Aditya Singh',
          email: 'jojo@jojo.com',
          role: 'admin'
        };

        if (!user) {
          console.log('Invalid credentials');
          return null;
        }

        return user;
      }
    })
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
});
