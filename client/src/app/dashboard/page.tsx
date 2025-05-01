import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { data: session } = useSession();

  if (!session?.user) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
