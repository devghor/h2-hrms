import React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

export default function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading title={title} description={description} />
        {actions}
      </div>
      <Separator />
    </>
  );
}
