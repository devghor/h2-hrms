import React from 'react'

interface PageHeadingProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
}

export const PageHeading = ({
  title,
  description,
  actions,
  ...props
}: PageHeadingProps) => {
  return (
    <div
      className='mb-2 flex flex-wrap items-center justify-between space-y-2'
      {...props}
    >
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
        <p className='text-muted-foreground'>{description}</p>
      </div>
      {actions}
    </div>
  )
}
