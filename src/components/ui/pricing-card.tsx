"use client";

import React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'bg-zinc-950/50 relative w-full rounded-[2rem] backdrop-blur-xl',
                'border border-white/5 shadow-2xl transition-all duration-500',
                'hover:border-white/10 group',
                className,
            )}
            {...props}
        />
    );
}

function Header({
    className,
    children,
    glassEffect = true,
    ...props
}: React.ComponentProps<'div'> & {
    glassEffect?: boolean;
}) {
    return (
        <div
            className={cn(
                'bg-zinc-900/40 relative mb-4 rounded-[1.5rem] border border-white/5 p-6 backdrop-blur-sm shadow-inner',
                className,
            )}
            {...props}
        >
            {/* Top glass gradient - Refined for Pure Black theme */}
            {glassEffect && (
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-48 rounded-[inherit] pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0) 100%)',
                    }}
                />
            )}
            {children}
        </div>
    );
}

function Plan({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('mb-6 flex items-center justify-between', className)}
            {...props}
        />
    );
}

function Description({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p className={cn('text-zinc-500 text-xs font-medium leading-relaxed', className)} {...props} />
    );
}

function PlanName({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                "text-zinc-400 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function Badge({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn(
                'bg-emerald-500 text-black rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20',
                className,
            )}
            {...props}
        />
    );
}

function Price({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('mb-3 flex items-end gap-2', className)} {...props} />
    );
}

function MainPrice({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn('text-5xl md:text-6xl font-black tracking-tighter italic text-white', className)}
            {...props}
        />
    );
}

function Period({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn('text-zinc-600 pb-1 text-xs font-bold uppercase tracking-widest', className)}
            {...props}
        />
    );
}

function OriginalPrice({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn(
                'text-zinc-700 mr-1 ml-auto text-lg line-through font-medium',
                className,
            )}
            {...props}
        />
    );
}

function Body({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('space-y-6 p-4 md:p-6', className)} {...props} />;
}

function List({ className, ...props }: React.ComponentProps<'ul'>) {
    return <ul className={cn('space-y-4', className)} {...props} />;
}

function ListItem({ className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li
            className={cn(
                'text-zinc-400 flex items-start gap-4 text-sm font-medium',
                className,
            )}
            {...props}
        />
    );
}

function Separator({
    children = 'Upgrade to access',
    className,
    ...props
}: React.ComponentProps<'div'> & {
    children?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'text-zinc-700 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]',
                className,
            )}
            {...props}
        >
            <span className="bg-white/5 h-[1px] flex-1" />
            <span className="shrink-0">{children}</span>
            <span className="bg-white/5 h-[1px] flex-1" />
        </div>
    );
}

export {
    Card,
    Header,
    Description,
    Plan,
    PlanName,
    Badge,
    Price,
    MainPrice,
    Period,
    OriginalPrice,
    Body,
    List,
    ListItem,
    Separator,
};
