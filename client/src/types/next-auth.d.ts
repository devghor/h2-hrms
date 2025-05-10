import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    fullName?: string;
    emailAddress?: string;
    imageUrl?: string;
    roles?: string;
    accessToken: string;
    refreshToken: string;
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
