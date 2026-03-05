import React from 'react'

export const VercelFull = ({ height = 22, width = 84, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 283 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M37 0l37 64H0L37 0z" fill="currentColor" />
        <path d="M128 50c-4.4 0-8.2-1.8-11-4.8l-2.2 2.2V62h-8V16h8v2.4c2.8-3 6.6-4.8 11-4.8 10 0 17 8 17 18.2 0 10.4-7 18.2-17 18.2zm0-28.4c-6 0-10 4.6-10 10.2 0 5.6 4 10.2 10 10.2 6 0 10-4.6 10-10.2 0-5.6-4-10.2-10-10.2zm48 28.4c-10 0-17-7.8-17-18.2 0-10.4 7-18.2 17-18.2s17 7.8 17 18.2c0 10.4-7 18.2-17 18.2zm0-28.4c-6 0-10 4.6-10 10.2 0 5.6 4 10.2 10 10.2 6 0 10-4.6 10-10.2 0-5.6-4-10.2-10-10.2z" fill="currentColor" />
    </svg>
)
