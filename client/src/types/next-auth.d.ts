import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    fullName?: string;
    emailAddress?: string;
    imageUrl?: string;
    roles?: array;
    accessToken?: string;
    refreshToken?: string;
    permissions?: string[];
  }
  interface Session {
    user: User;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    roles: array;
    accessToken?: string;
    refreshToken?: string;
    permissions?: string[];
  }
}
