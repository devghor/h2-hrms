import React from 'react'

interface PageBodyProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export const PageBody = ({ children, ...props }: PageBodyProps) => {
  return (
    <div
      className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'
      {...props}
    >
      {children}
    </div>
  )
}
