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
import { Button } from '@/components/ui/button'
import { signout } from '@/app/auth/actions'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'CV Builder', href: '/dashboard/builder', icon: FileText },
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
                    <div className="w-6 h-6 rounded-sm bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
                        C
                    </div>
                    <span className="font-medium tracking-tight text-sm text-zinc-200">CV Workspace</span>
                </Link>
            </div>

            <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200",
                                isActive
                                    ? "font-medium text-white bg-white/10"
                                    : "text-zinc-400 font-medium hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-400")} />
                            <span className="text-[13px]">{item.name}</span>
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Profile / Settings block */}
            <div className="p-4 mt-auto border-t border-white/5">
                <form action={signout}>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-10 px-3 text-zinc-400 hover:bg-white/5 hover:text-white rounded-md transition-all" type="submit">
                        <LogOut className="h-4 w-4" />
                        <span className="text-[13px] font-medium">Log out</span>
                    </Button>
                </form>
            </div>
        </aside>
    )
}
