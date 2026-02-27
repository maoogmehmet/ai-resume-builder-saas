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
        <aside className="w-[260px] border-r border-zinc-200 bg-white h-screen flex flex-col sticky top-0 hidden md:flex">
            <div className="p-6 pt-8 mb-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="font-bold tracking-tight text-xl text-zinc-900">CV Optimizer</span>
                </Link>
            </div>

            <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200",
                                isActive
                                    ? "font-semibold text-zinc-900 bg-zinc-50"
                                    : "text-zinc-600 font-medium hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-zinc-900" : "text-zinc-500")} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 mt-auto">
                <form action={signout}>
                    <Button variant="outline" className="w-full justify-start gap-3 h-10 px-4 text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-all" type="submit">
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </Button>
                </form>
            </div>
        </aside>
    )
}
