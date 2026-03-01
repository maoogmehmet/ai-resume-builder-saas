'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function HeaderPremium({ user }: { user: any }) {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);

    const links = [
        {
            label: 'Features',
            href: '#features',
        },
        {
            label: 'Pricing',
            href: '#pricing',
        },
        {
            label: 'Wall of Love',
            href: '#testimonials',
        },
    ];

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header
            className={cn(
                'sticky top-0 z-[100] mx-auto w-full border-b border-transparent transition-all duration-300 ease-out',
                {
                    'bg-black/80 backdrop-blur-xl border-white/5 md:top-4 md:max-w-5xl md:rounded-2xl md:shadow-[0_0_50px_rgba(0,0,0,1)]':
                        scrolled && !open,
                    'bg-black': open,
                    'left-1/2 -translate-x-1/2': scrolled && !open
                },
            )}
        >
            <nav
                className={cn(
                    'flex h-16 w-full items-center justify-between px-6 md:h-14 md:transition-all md:ease-out max-w-7xl mx-auto',
                    {
                        'md:px-4': scrolled,
                    },
                )}
            >
                <Link className="flex items-center gap-2.5 group" href="/">
                    <div className="h-7 w-7 bg-white rounded flex items-center justify-center transform rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                        <Sparkles className="h-3.5 w-3.5 text-black -rotate-45" />
                    </div>
                    <span className="font-bold text-lg tracking-tighter text-white uppercase italic">AI Resume</span>
                </Link>

                <div className="hidden items-center gap-2 md:flex">
                    {links.map((link, i) => (
                        <a key={i} className={cn(buttonVariants({ variant: 'ghost' }), "text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest")} href={link.href}>
                            {link.label}
                        </a>
                    ))}

                    <div className="h-4 w-px bg-white/10 mx-2" />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <form action="/auth/signout" method="POST">
                                <Button type="submit" variant="ghost" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400">Sign Out</Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link className={cn(buttonVariants({ variant: 'ghost' }), "text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white")} href="/auth/signin">
                                Sign In
                            </Link>
                            <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold px-6 rounded-xl h-9 text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                <Link href="/auth/signup">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden text-zinc-400">
                    <MenuToggleIcon open={open} className="size-5" duration={300} />
                </Button>
            </nav>

            <div
                className={cn(
                    'fixed top-16 right-0 bottom-0 left-0 z-[90] flex flex-col overflow-hidden bg-black md:hidden transition-all duration-500',
                    open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none',
                )}
            >
                <div
                    className={cn(
                        'flex h-full w-full flex-col justify-between gap-y-2 p-8 pt-12',
                    )}
                >
                    <div className="grid gap-y-6">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                className="text-3xl font-black text-white tracking-tighter hover:text-emerald-400 transition-colors"
                                href={link.href}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-4 pb-12">
                        {user ? (
                            <>
                                <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-white/5 text-lg font-bold">
                                    <Link href="/dashboard">Go to Dashboard</Link>
                                </Button>
                                <form action="/auth/signout" method="POST">
                                    <Button type="submit" variant="ghost" className="w-full h-16 text-zinc-500 font-bold">Sign Out</Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="outline" className="w-full h-16 rounded-2xl border-white/10 bg-white/5 text-white text-lg font-bold">
                                    <Link href="/auth/signin">Sign In</Link>
                                </Button>
                                <Button asChild className="w-full h-16 rounded-2xl bg-white text-black text-lg font-bold shadow-2xl">
                                    <Link href="/auth/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
