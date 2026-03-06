import React from 'react';
import { cn } from '@/lib/utils';

interface MaoogLogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    size?: number;
}

export function MaoogLogo({ className, size = 32, ...props }: MaoogLogoProps) {
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
            {/* Background square is not needed as we handle it in the container, 
                but based on the image it's just white lines on black. */}
            <path
                d="M25 70V30L50 50L75 30V70"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />
            <path
                d="M35 70V55L50 65L65 55V70"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />
        </svg>
    );
}
