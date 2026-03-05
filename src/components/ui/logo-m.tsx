import React from 'react';
import { cn } from '@/lib/utils';

interface LogoMProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    size?: number;
}

export function LogoM({ className, size = 32, ...props }: LogoMProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-white", className)}
            {...props}
        >
            <path
                d="M15 85V15H35L50 40L65 15H85V85H70V35L50 65L30 35V85H15Z"
                fill="currentColor"
            />
        </svg>
    );
}
