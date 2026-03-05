import React from 'react'

export const FirebaseFull = ({ height = 24, width = 80, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M3.89 15.67L2.4 18.42c-.22.41 0 .91.45.91h18.3c.45 0 .67-.5.45-.91l-1.49-2.75h-16.22z M12 2L4.5 14h15L12 2z" />
    </svg>
)
