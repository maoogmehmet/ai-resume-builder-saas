'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    FileText,
    Settings,
    LogOut,
    Target,
    Briefcase,
    FileCheck2,
    CreditCard,
    BarChart3,
    Files
} from 'lucide-react'
import { cn } from '@/lib/utils'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { signout } from '@/app/auth/actions'
import { Logo } from '@/components/ui/logo'

import { ProfileDropdown } from '@/components/ui/profile-dropdown'
import { FeedbackModal } from '@/components/feedback-modal'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Magic Build', href: '/dashboard/builder', icon: FileText },
    { name: 'My CVs', href: '/dashboard/resumes', icon: Files },
    { name: 'My Letters', href: '/dashboard/letters', icon: FileCheck2 },
    { name: 'Optimize', href: '/dashboard/optimize', icon: Target },
    { name: 'Find Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Upgrade Plan', href: '/dashboard/upgrade', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-[240px] border-r border-white/10 bg-black h-screen flex flex-col sticky top-0 hidden md:flex">
            {/* Top Workspace Selector Simulation */}
            <div className="p-4 mb-2 flex items-center justify-between border-b border-white/5">
                <Link href="/dashboard" className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-md w-full transition-colors">
                    <div className="w-6 h-6 rounded-sm bg-black border border-white/10 flex items-center justify-center">
                        <Logo className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-black tracking-tighter text-sm text-zinc-200 lowercase italic">novatypalcv</span>
                </Link>
            </div>

            <div className="flex-1 px-3 space-y-0.5 overflow-y-auto pt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 italic group",
                                isActive
                                    ? "font-black text-white bg-white/10 shadow-2xl"
                                    : "text-zinc-500 font-black hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-600 group-hover:text-white")} />
                            <span className="text-[11px] uppercase tracking-widest">{item.name}</span>
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Profile / Settings block */}
            <div className="mt-auto border-t border-white/5 flex flex-col items-center">
                <div className="w-full border-b border-white/5 p-2">
                    <FeedbackModal />
                </div>
                <div className="p-4 w-full">
                    <ProfileDropdown className="w-full" />
                </div>
            </div>
        </aside>
    )
}
