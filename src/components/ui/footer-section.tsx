'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, Link2 } from 'lucide-react';
import { cn } from "@/lib/utils";

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
            { title: 'Templates', href: '/dashboard' },
            { title: 'Builder', href: '/dashboard/builder' },
        ],
    },
    {
        label: 'Company',
        links: [
            { title: 'FAQs', href: '#' },
            { title: 'About Us', href: '#' },
            { title: 'Privacy Policy', href: '#' },
            { title: 'Terms of Services', href: '#' },
        ],
    },
    {
        label: 'Resources',
        links: [
            { title: 'Career Guide', href: '#' },
            { title: 'Resume Tips', href: '#' },
            { title: 'AI Insights', href: '#' },
            { title: 'Help Center', href: '#' },
        ],
    },
    {
        label: 'Social',
        links: [
            { title: 'Facebook', href: '#', icon: FacebookIcon },
            { title: 'Instagram', href: '#', icon: InstagramIcon },
            { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
            { title: 'Youtube', href: '#', icon: YoutubeIcon },
        ],
    },
];

export function Footer() {
    return (
        <footer className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center border-t border-white/5 bg-black px-6 py-24 lg:py-32">
            <div className="bg-emerald-500/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2px]" />

            <div className="grid w-full gap-16 xl:grid-cols-3 xl:gap-8">
                <AnimatedContainer className="space-y-6">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                            <Link2 className="h-6 w-6 text-black" />
                        </div>
                        <span className="text-2xl font-black text-white italic tracking-tighter">CV Builder</span>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
                        Professional Resume components for professional people. Build your future today.
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
                        © {new Date().getFullYear()} CV Builder. All rights reserved.
                    </p>
                </AnimatedContainer>

                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
                    {footerLinks.map((section, index) => (
                        <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-10 md:mb-0">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-6 italic">{section.label}</h3>
                                <ul className="text-zinc-500 space-y-4 text-sm font-medium">
                                    {section.links.map((link) => (
                                        <li key={link.title}>
                                            <a
                                                href={link.href}
                                                className="hover:text-white inline-flex items-center transition-all duration-300 group"
                                            >
                                                {link.icon && <link.icon className="me-3 size-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                                                {link.title}
                                            </a>
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
    className?: string;
    children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: 8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
