import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // If you have class merging helper

interface NotificationBtnProps {
  count?: number;
  onClick?: () => void;
}

export function NotificationBtn({ count = 0, onClick }: NotificationBtnProps) {
  const displayCount = count > 9 ? '9+' : count;

  return (
    <div className='relative'>
      <Button
        variant='ghost'
        size='icon'
        onClick={onClick}
        aria-label='Notifications'
        title='Notifications'
      >
        <Bell className='h-5 w-5' />
      </Button>

      {count > 0 && (
        <span
          className={cn(
            'absolute -top-0.5 -right-0.5',
            'inline-flex h-5 min-w-[1.25rem] items-center justify-center',
            'rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm',
            'animate-in zoom-in-75 transition-all'
          )}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
}
