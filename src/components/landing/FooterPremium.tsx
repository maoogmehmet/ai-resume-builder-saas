'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

interface FooterLink {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
    label: string;
    links: FooterLink[];
}

const footerLinks: FooterSection[] = [
    {
        label: 'Product',
        links: [
            { title: 'Features', href: '#features' },
            { title: 'Pricing', href: '#pricing' },
            { title: 'Wall of Love', href: '#testimonials' },
            { title: 'Dashboard', href: '/dashboard' },
        ],
    },
    {
        label: 'Legal',
        links: [
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Terms of Service', href: '/terms' },
            { title: 'Cookie Policy', href: '/privacy#cookies' },
        ],
    },
    {
        label: 'Support',
        links: [
            { title: 'Help Center', href: 'mailto:support@maoog.software' },
            { title: 'Contact Us', href: 'mailto:support@maoog.software' },
            { title: 'Bug Report', href: 'mailto:support@maoog.software' },
        ],
    },
    {
        label: 'Social',
        links: [
            { title: 'X', href: 'https://x.com/mehtOzdede' },
            { title: 'Instagram', href: 'https://www.instagram.com/novatypalcv/', icon: InstagramIcon },
            { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
            { title: 'Youtube', href: '#', icon: YoutubeIcon },
        ],
    },
];

export function FooterPremium() {
    return (
        <footer className="relative w-full border-t border-white/5 bg-black px-6 py-24 lg:py-32 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />

            <div className="max-w-7xl mx-auto grid w-full gap-16 xl:grid-cols-3">
                <AnimatedContainer className="space-y-8">
                    <Link className="flex items-center gap-2.5 group" href="/">
                        <div className="flex items-center justify-center transition-transform group-hover:scale-110">
                            <Logo className="h-7 w-7 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tighter text-white italic">Novatypalcv</span>
                    </Link>
                    <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs">
                        Elevate your career with the world&apos;s most advanced AI-powered resume builder. Built for professionals who want to stand out.
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                        © {new Date().getFullYear()} Novatypalcv. ALL RIGHTS RESERVED.
                    </p>
                </AnimatedContainer>

                <div className="grid grid-cols-2 gap-12 md:grid-cols-4 xl:col-span-2">
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">{section.label}</h3>
                                <ul className="text-zinc-500 space-y-4 text-xs font-bold uppercase tracking-widest">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <Link
                                                href={link.href}
                                                className="hover:text-emerald-400 inline-flex items-center transition-all duration-300 group"
                                            >
                                                {link.icon && <link.icon className="mr-2 size-3.5 group-hover:scale-110 transition-transform" />}
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedContainer>
                    ))}
                </div>
            </div>
        </footer>
    );
};

type ViewAnimationProps = {
    delay?: number;
    className?: ComponentProps<typeof motion.div>['className'];
    children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: 20, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
