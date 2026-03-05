import React from 'react'

export const Claude = ({ height = 26, width = 90, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="15" cy="15" r="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="15" r="4" fill="currentColor" />
        <text x="35" y="20" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="currentColor">CLAUDE</text>
    </svg>
)
