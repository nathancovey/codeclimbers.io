import React from 'react'

// Simplified type definition
type LinkedInIconProps = React.SVGProps<SVGSVGElement>

export const LinkedInIcon: React.FC<LinkedInIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 455 455"
      fill="currentColor"
      {...props} // Pass down other props like className, style, etc.
    >
      <path
        style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
        d="M246.4 204.35v-.665c-.136.223-.324.446-.442.665h.442z"
      />
      <path
        style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
        d="M0 0v455h455V0H0zm141.522 378.002H74.016V174.906h67.506v203.096zM107.77 147.186h-.446C84.678 147.186 70 131.585 70 112.085c0-19.928 15.107-35.087 38.21-35.087 23.11 0 37.31 15.16 37.752 35.087 0 19.5-14.637 35.1-38.192 35.1zM385 378.002h-67.524V269.345c0-27.29-9.756-45.92-34.195-45.92-18.664 0-29.755 12.543-34.64 24.693-1.777 4.34-2.24 10.373-2.24 16.46v113.425h-67.537c0 0 .905-184.043 0-203.096H246.4v28.78c8.973-13.808 24.986-33.547 60.856-33.547 44.437 0 77.744 29.02 77.744 91.397v113.426z"
      />
    </svg>
  )
} 