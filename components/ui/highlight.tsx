import React from 'react'

export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-primary/10 text-primary px-1 py-0.5 rounded-sm">
    {children}
  </span>
) 