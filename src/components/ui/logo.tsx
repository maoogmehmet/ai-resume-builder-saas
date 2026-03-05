import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 32, ...props }: any) {
    return (
        <img
            src="/logo.png"
            alt="Novatypalcv Logo"
            width={size}
            height={size}
            className={cn("object-contain", className)}
            {...props}
        />
    );
}
