import React from 'react'

export const Bolt = ({ height = 22, width = 56, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M45 2L35 15H45L35 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="55" y="20" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="currentColor">BOLT</text>
    </svg>
)
