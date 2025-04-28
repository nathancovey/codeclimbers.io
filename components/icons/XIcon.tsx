import React from 'react'

type XIconProps = React.HTMLAttributes<HTMLSpanElement>

export const XIcon: React.FC<XIconProps> = (props) => {
  return <span {...props}>𝕏</span>
} 