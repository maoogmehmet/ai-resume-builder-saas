import React from 'react'

export const Beacon = ({ height = 24, width = 80, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 30"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="20" cy="15" r="10" fill="currentColor" />
        <path d="M40 10L60 15L40 20V10Z" fill="currentColor" />
    </svg>
)
