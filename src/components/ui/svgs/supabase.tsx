import React from 'react'

export const SupabaseFull = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 400 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
    >
        <path d="M21.5 68.5L50 10L100 55.5H65.5L88 100L21.5 68.5Z" fill="#3ECF8E" />
        <text x="110" y="65" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="40">Supabase</text>
    </svg>
)
