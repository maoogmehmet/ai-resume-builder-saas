'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Sparkles, ArrowRightIcon } from 'lucide-react';
import AnimatedGenerateButton from '@/components/ui/animated-generate-button';
import { Button } from '@/components/ui/button';

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
                'fixed top-0 z-[100] mx-auto w-full border-b border-transparent transition-all duration-300 ease-out font-sans',
                {
                    'bg-black/80 backdrop-blur-3xl border-white/5 md:top-6 md:max-w-6xl md:rounded-[2rem] md:shadow-[0_50px_100px_rgba(0,0,0,0.8)]':
                        scrolled && !open,
                    'bg-black': open,
                    'left-1/2 -translate-x-1/2': scrolled && !open
                },
            )}
        >
            <nav
                className={cn(
                    'flex h-20 w-full items-center justify-between px-8 md:h-16 md:transition-all md:ease-out max-w-7xl mx-auto',
                    {
                        'md:px-6': scrolled,
                    },
                )}
            >
                <Link className="flex items-center gap-3 group" href="/">
                    <div className="flex items-center justify-center transition-transform group-hover:scale-110">
                        <Logo className="h-8 w-8 text-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tighter text-white">Novatypalcv</span>
                </Link>

                <div className="hidden items-center gap-4 md:flex">
                    {links.map((link, i) => (
                        <a key={i} className="px-4 py-2 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors" href={link.href}>
                            {link.label}
                        </a>
                    ))}

                    <div className="h-4 w-px bg-white/10 mx-2" />

                    <div className="flex items-center gap-8">
                        <Link className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors" href="/auth/signin">
                            SIGN IN
                        </Link>
                        <Button asChild className="rounded-xl shadow-2xl h-9 px-4 font-bold text-[11px] bg-white text-black hover:bg-zinc-100 border-none transition-all hover:scale-105 !bg-white !text-black" size="lg">
                            <a href="/auth/signup">
                                GET STARTED
                                <ArrowRightIcon className="size-3.5 ms-2" />
                            </a>
                        </Button>
                    </div>
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/10 text-white"
                >
                    <MenuToggleIcon open={open} className="size-5" duration={300} />
                </button>
            </nav>

            <div
                className={cn(
                    'fixed top-20 right-0 bottom-0 left-0 z-[90] flex flex-col overflow-hidden bg-black md:hidden transition-all duration-500',
                    open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none',
                )}
            >
                <div
                    className={cn(
                        'flex h-full w-full flex-col justify-between gap-y-12 p-10 pt-16',
                    )}
                >
                    <div className="grid gap-y-8">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                className="text-5xl font-black text-white tracking-tighter hover:text-emerald-400 transition-colors italic lowercase"
                                href={link.href}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6 pb-20">
                        {user ? (
                            <>
                                <AnimatedGenerateButton
                                    href="/dashboard"
                                    labelIdle="Go to Dashboard"
                                    className="w-full h-16 rounded-2xl font-black italic lowercase text-lg"
                                />
                                <form action="/auth/signout" method="POST" className="w-full">
                                    <button type="submit" className="w-full h-16 flex items-center justify-center text-zinc-600 font-black italic lowercase text-lg hover:text-white transition-colors">
                                        Sign Out
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="w-full h-16 flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.01] text-zinc-400 font-black italic lowercase text-lg hover:text-white transition-all shadow-xl"
                                >
                                    Sign In
                                </Link>
                                <AnimatedGenerateButton
                                    href="/auth/signup"
                                    labelIdle="Get Started"
                                    className="w-full h-16 rounded-2xl font-black italic lowercase text-lg shadow-2xl"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
