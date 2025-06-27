import { paths } from '@/constants/paths';
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect(paths.uam.users);
}
