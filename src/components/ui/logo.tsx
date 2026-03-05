import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 32, ...props }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-current", className)}
            {...props}
        >
            <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="10"
            />
            <path
                d="M32 68V32L68 68V32"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
