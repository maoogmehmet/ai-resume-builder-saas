'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    BarChart3, ExternalLink, Copy, Trash2, Loader2,
    Eye, Clock, Link2, Lock, Check, Globe, Shield
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

        if (!link.is_active) return { status: 'expired', label: 'Deactivated', color: 'bg-red-100 text-red-700', remainingDays: 0 }
        if (remainingDays <= 0) return { status: 'expired', label: 'Expired (7d)', color: 'bg-red-100 text-red-700', remainingDays: 0 }
        if (remainingDays <= 2) return { status: 'expiring', label: `${remainingDays}d left`, color: 'bg-amber-100 text-amber-700', remainingDays }
        return { status: 'active', label: `${remainingDays}d left`, color: 'bg-emerald-100 text-emerald-700', remainingDays }
    }

    const totals = {
        views: links.reduce((sum, l) => sum + (l.view_count || 0), 0),
        active: links.filter(l => getLinkStatus(l).status !== 'expired').length,
        expired: links.filter(l => getLinkStatus(l).status === 'expired').length,
    }

    return (
        <div className="flex flex-col min-h-screen bg-white w-full font-sans">
            <div className="max-w-7xl mx-auto w-full p-8 space-y-8">

                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                            <BarChart3 className="h-5 w-5 text-slate-700" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#1E293B] leading-none mb-1">
                                Link Analytics
                            </h1>
                            <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">
                                Track your shared CV links
                            </p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-500">Total Views</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{totals.views}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <Globe className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-500">Active Links</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{totals.active}</p>
                    </div>
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-9 w-9 bg-red-50 rounded-lg flex items-center justify-center">
                                <Lock className="h-4 w-4 text-red-500" />
                            </div>
                            <span className="text-sm font-semibold text-slate-500">Expired Links</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{totals.expired}</p>
                    </div>
                </div>

                {/* Links Table */}
                <div className="border border-slate-200 rounded-2xl bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Link2 className="h-5 w-5 text-slate-400" />
                            All Shared Links
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                        </div>
                    ) : links.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                            <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <Link2 className="h-7 w-7 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No shared links yet</h3>
                            <p className="text-sm text-slate-500 max-w-sm">
                                When you create a public link for your CV, it will appear here with detailed view analytics.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {links.map((link) => {
                                const statusInfo = getLinkStatus(link)
                                const isExpired = statusInfo.status === 'expired'

                                return (
                                    <div key={link.id} className={`p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors ${isExpired ? 'opacity-70' : ''}`}>
                                        {/* Left: Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 truncate">
                                                    {link.link_name || link.resumes?.title || 'Untitled Resume'}
                                                </h4>
                                                <Badge className={`${statusInfo.color} text-[10px] font-bold px-2 py-0.5 border-0`}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium truncate">
                                                {appUrl}/r/{link.slug}
                                            </p>
                                            {link.version && (
                                                <p className="text-xs text-blue-500 font-semibold mt-1">
                                                    Tailored for: {link.version.job_title} at {link.version.company_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Middle: Views & Date */}
                                        <div className="flex items-center gap-6 text-sm shrink-0">
                                            <div className="flex items-center gap-1.5 text-slate-700">
                                                <Eye className="h-4 w-4 text-slate-400" />
                                                <span className="font-bold">{link.view_count || 0}</span>
                                                <span className="text-slate-400 text-xs">views</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <Clock className="h-3.5 w-3.5" />
                                                {link.last_viewed_at
                                                    ? new Date(link.last_viewed_at).toLocaleDateString()
                                                    : 'Never viewed'}
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1.5 text-xs font-semibold"
                                                onClick={() => copyLink(link.slug)}
                                            >
                                                {copiedSlug === link.slug ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                {copiedSlug === link.slug ? 'Copied' : 'Copy'}
                                            </Button>
                                            <a
                                                href={`/r/${link.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                            {isExpired && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white"
                                                    onClick={() => window.location.href = '/dashboard/upgrade'}
                                                >
                                                    <Shield className="h-3.5 w-3.5" />
                                                    Unlock
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 mb-1">Free Plan: 7-Day Links</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                On the free plan, shared CV links expire after 7 days. Upgrade to Premium for permanent links,
                                unlimited views, and advanced analytics. Your recruiters will always have access to your profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
