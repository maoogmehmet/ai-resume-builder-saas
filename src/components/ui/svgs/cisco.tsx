import React from 'react'

export const Cisco = ({ height = 30, width = 60, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 100 60"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect x="5" y="40" width="4" height="15" rx="2" />
        <rect x="15" y="25" width="4" height="30" rx="2" />
        <rect x="25" y="10" width="4" height="45" rx="2" />
        <rect x="35" y="20" width="4" height="35" rx="2" />
        <rect x="45" y="10" width="4" height="45" rx="2" />
        <rect x="55" y="20" width="4" height="35" rx="2" />
        <rect x="65" y="10" width="4" height="45" rx="2" />
        <rect x="75" y="25" width="4" height="30" rx="2" />
        <rect x="85" y="40" width="4" height="15" rx="2" />
    </svg>
)
