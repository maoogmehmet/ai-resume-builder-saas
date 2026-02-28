'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    BarChart3, ExternalLink, Copy, Trash2, Loader2,
    Eye, Clock, Link2, Lock, Check, Globe, Shield,
    ChevronDown, HelpCircle, ArrowUpRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface PublicLink {
    id: string
    slug: string
    is_active: boolean
    template: string
    view_count: number
    last_viewed_at: string | null
    link_name: string | null
    created_at: string
    resumes: { title: string } | null
    version: { job_title: string; company_name: string } | null
}

export default function AnalyticsPage() {
    const [links, setLinks] = useState<PublicLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

    const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await fetch('/api/analytics/list-links')
                const data = await res.json()
                if (data.success) {
                    setLinks(data.links)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLinks()
    }, [])

    const copyLink = (slug: string) => {
        navigator.clipboard.writeText(`${appUrl}/r/${slug}`)
        setCopiedSlug(slug)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopiedSlug(null), 2000)
    }

    const getLinkStatus = (link: PublicLink) => {
        const createdAt = new Date(link.created_at)
        const now = new Date()
        const diffMs = now.getTime() - createdAt.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const remainingDays = 7 - diffDays

        if (!link.is_active) return { status: 'expired', label: 'Deactivated', color: 'bg-red-500/10 text-red-500', remainingDays: 0 }
        if (remainingDays <= 0) return { status: 'expired', label: 'Expired', color: 'bg-red-500/10 text-red-500', remainingDays: 0 }
        if (remainingDays <= 2) return { status: 'expiring', label: `${remainingDays}d left`, color: 'bg-amber-500/10 text-amber-500', remainingDays }
        return { status: 'active', label: `${remainingDays}d left`, color: 'bg-emerald-500/10 text-emerald-500', remainingDays }
    }

    const totals = {
        views: links.reduce((sum, l) => sum + (l.view_count || 0), 0),
        active: links.filter(l => getLinkStatus(l).status !== 'expired').length,
        expired: links.filter(l => getLinkStatus(l).status === 'expired').length,
        avgViews: links.length > 0 ? (links.reduce((sum, l) => sum + (l.view_count || 0), 0) / links.length).toFixed(1) : 0
    }

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-zinc-100">
            <div className="max-w-7xl mx-auto w-full p-8 px-12 space-y-12">

                {/* Header */}
                <header className="flex items-center justify-between pb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Metrics
                    </h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-9 px-4 rounded-lg bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-medium gap-2">
                            All Links <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                        </Button>
                        <Button variant="outline" className="h-9 px-4 rounded-lg bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-medium gap-2">
                            Last 7 days <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </div>
                </header>

                {/* Main Stats Box */}
                <div className="border border-white/10 rounded-2xl bg-[#0a0a0a] overflow-hidden">
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/10">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Total Views</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-white">{totals.views}</span>
                                <span className="text-xs text-emerald-500 font-bold flex items-center gap-0.5">
                                    <ArrowUpRight className="h-3 w-3" /> 12%
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Active Links</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-white">{totals.active}</span>
                                <span className="text-xs text-zinc-500 font-bold">/ {links.length} total</span>
                            </div>
                        </div>
                    </div>
                    {/* Placeholder Chart Area */}
                    <div className="h-64 w-full p-8 relative flex items-end">
                        <div className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none opacity-20">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-dashed border-white/30" />)}
                        </div>
                        <div className="w-full h-full flex items-end gap-1 relative z-10 pt-4 px-2">
                            {/* Simple visual representation of a chart if no data */}
                            {Array.from({ length: 14 }).map((_, i) => {
                                const height = Math.random() * 80 + 10
                                return (
                                    <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                        <div
                                            className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-sm transition-all"
                                            style={{ height: `${height}%` }}
                                        />
                                        {i === 12 && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                                                <div className="bg-emerald-500 h-2 w-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {/* Legend */}
                        <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            <span>Feb 22</span>
                            <span>Feb 24</span>
                            <span>Feb 26</span>
                            <span>Feb 28</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 rounded-2xl p-8 bg-[#0a0a0a] space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Expired Links</p>
                            <HelpCircle className="h-4 w-4 text-zinc-700" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{totals.expired}</span>
                            <span className="text-xs text-zinc-500 font-bold">Total inactive</span>
                        </div>
                        <div className="h-1 w-full bg-red-500/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${(totals.expired / (links.length || 1)) * 100}%` }} />
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-2xl p-8 bg-[#0a0a0a] space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Views per Link</p>
                            <HelpCircle className="h-4 w-4 text-zinc-700" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{totals.avgViews}</span>
                            <span className="text-xs text-zinc-500 font-bold">Average engagement</span>
                        </div>
                        <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
                        </div>
                    </div>
                </div>

                {/* Links Table List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Linked History</h2>
                        <Button variant="ghost" className="text-xs text-zinc-500 hover:text-white font-bold h-8">View all</Button>
                    </div>

                    <div className="divide-y divide-white/5 border-t border-white/10">
                        {isLoading ? (
                            <div className="py-12 flex justify-center w-full">
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-800" />
                            </div>
                        ) : links.length === 0 ? (
                            <div className="py-12 text-center text-zinc-600 font-medium text-sm">
                                No links generated yet.
                            </div>
                        ) : (
                            links.map((link) => {
                                const statusInfo = getLinkStatus(link)
                                const isExpired = statusInfo.status === 'expired'

                                return (
                                    <div key={link.id} className="group py-4 flex items-center justify-between hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                <Link2 className="h-4 w-4 text-zinc-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-white">
                                                        {link.link_name || link.resumes?.title || 'Untitled Resume'}
                                                    </h4>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${isExpired ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                </div>
                                                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                                                    {link.slug} • {new Date(link.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-white">{link.view_count || 0}</p>
                                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Views</p>
                                            </div>
                                            <div className="text-right w-20">
                                                <p className={`text-xs font-bold ${isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {statusInfo.status === 'active' ? statusInfo.label.split(' ')[0] : 'Expired'}
                                                </p>
                                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Status</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyLink(link.slug)}
                                                    className="h-8 w-8 p-0 text-zinc-600 hover:text-white"
                                                >
                                                    {copiedSlug === link.slug ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0 text-zinc-600 hover:text-white"
                                                >
                                                    <a href={`/r/${link.slug}`} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Upgrade CTA */}
                <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-1 bg-gradient-to-br from-white/5 to-transparent">
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                                <Shield className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Make your links permanent</h4>
                                <p className="text-sm text-zinc-400 max-w-md">
                                    Free plan links expire after 7 days. Upgrade to Pro to get permanent URLs,
                                    detailed view location analytics, and custom slugs.
                                </p>
                            </div>
                        </div>
                        <Button
                            className="bg-zinc-100 text-black hover:bg-white font-bold px-8 rounded-xl h-12"
                            onClick={() => window.location.href = '/dashboard/upgrade'}
                        >
                            Upgrade Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
