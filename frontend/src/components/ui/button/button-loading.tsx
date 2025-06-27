import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

interface ButtonLoadingProps {
  children?: React.ReactNode;
  className?: string;
}

export function ButtonLoading({
  children = 'Please wait',
  ...props
}: ButtonLoadingProps) {
  return (
    <Button disabled size='sm' {...props}>
      <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
      {children}
    </Button>
  );
}
