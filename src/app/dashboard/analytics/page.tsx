'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
    Loader2, Copy, Check, ExternalLink, Link2, Trash2,
    ChevronDown, HelpCircle, ArrowUpRight, Shield, Globe
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

interface DataPoint {
    time: number
    value: number
}

export default function AnalyticsPage() {
    const [links, setLinks] = useState<PublicLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

    // Real-time chart state
    const [data, setData] = useState<DataPoint[]>([])
    const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const maxPoints = 30
    const width = 800
    const height = 300
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }

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

        // Initialize chart data
        const initial: DataPoint[] = []
        for (let i = 0; i < 20; i++) {
            initial.push({
                time: Date.now() - (20 - i) * 1000,
                value: 30 + Math.random() * 40,
            })
        }
        setData(initial)

        const interval = setInterval(() => {
            setData((prev) => {
                const newPoint: DataPoint = {
                    time: Date.now(),
                    value: Math.max(10, Math.min(90, (prev[prev.length - 1]?.value || 50) + (Math.random() - 0.5) * 20)),
                }
                const updated = [...prev, newPoint]
                return updated.slice(-maxPoints)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const getX = (time: number) => {
        if (data.length < 2) return padding.left
        const minTime = data[0]?.time || 0
        const maxTime = data[data.length - 1]?.time || 1
        const range = maxTime - minTime || 1
        return padding.left + ((time - minTime) / range) * (width - padding.left - padding.right)
    }

    const getY = (value: number) => {
        return padding.top + (1 - value / 100) * (height - padding.top - padding.bottom)
    }

    const getPath = () => {
        if (data.length < 2) return ""
        return data
            .map((point, i) => {
                const x = getX(point.time)
                const y = getY(point.value)
                return `${i === 0 ? "M" : "L"} ${x},${y}`
            })
            .join(" ")
    }

    const getAreaPath = () => {
        if (data.length < 2) return ""
        const linePath = getPath()
        const lastX = getX(data[data.length - 1].time)
        const firstX = getX(data[0].time)
        const bottomY = height - padding.bottom
        return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!svgRef.current) return
        const rect = svgRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        data.forEach((point) => {
            const px = getX(point.time)
            if (Math.abs(px - x) < 30) {
                setHoveredPoint(point)
            }
        })
    }

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

    const currentValue = data[data.length - 1]?.value || 0

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-zinc-100 p-8 pt-12">
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; r: 6; }
                    50% { opacity: 0.7; r: 8; }
                }
                @keyframes drawLine {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
                .flowing-line {
                    stroke-dasharray: 1000;
                    animation: drawLine 2s ease-out forwards;
                }
                .data-dot {
                    animation: pulse 2s ease-in-out infinite;
                }
                .glow {
                    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
                }
            `}</style>

            <div className="max-w-6xl mx-auto w-full space-y-12">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Real-time Analytics</h1>
                        <p className="text-zinc-500 font-medium tracking-wide">Live tracking and engagement metrics for your resumes.</p>
                    </div>

                    <div className="flex items-center gap-6 px-8 py-5 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Status</span>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <span className="text-3xl font-black text-white italic">{currentValue.toFixed(1)}%</span>
                    </div>
                </div>

                {/* Main Analytics Card */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <svg
                        ref={svgRef}
                        width="100%"
                        height={height}
                        viewBox={`0 0 ${width} ${height}`}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="cursor-crosshair relative z-10"
                    >
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981">
                                    <animate attributeName="stop-color" values="#10b981;#34d399;#10b981" dur="3s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="50%" stopColor="#34d399">
                                    <animate attributeName="stop-color" values="#34d399;#10b981;#34d399" dur="3s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="100%" stopColor="#10b981">
                                    <animate attributeName="stop-color" values="#10b981;#34d399;#10b981" dur="3s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((val) => (
                            <g key={val}>
                                <line x1={padding.left} y1={getY(val)} x2={width - padding.right} y2={getY(val)} stroke="white" strokeOpacity="0.03" strokeDasharray="4 4" />
                                <text x={padding.left - 15} y={getY(val)} fill="white" fillOpacity="0.2" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="middle">{val}%</text>
                            </g>
                        ))}

                        <path d={getAreaPath()} fill="url(#areaGradient)" />
                        <path className="flowing-line glow" d={getPath()} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {data.map((point, i) => (
                            <circle
                                key={point.time}
                                className={i === data.length - 1 ? "data-dot" : ""}
                                cx={getX(point.time)}
                                cy={getY(point.value)}
                                r={i === data.length - 1 ? 6 : 3}
                                fill={i === data.length - 1 ? "#10b981" : "#065f46"}
                                style={{ opacity: hoveredPoint?.time === point.time ? 1 : 0.5, transition: "opacity 0.2s ease" }}
                            />
                        ))}

                        {hoveredPoint && (
                            <>
                                <line x1={getX(hoveredPoint.time)} y1={padding.top} x2={getX(hoveredPoint.time)} y2={height - padding.bottom} stroke="#10b981" strokeDasharray="4 4" opacity="0.3" />
                                <circle cx={getX(hoveredPoint.time)} cy={getY(hoveredPoint.value)} r="8" fill="none" stroke="#10b981" strokeWidth="2" />
                            </>
                        )}
                    </svg>

                    {/* Tooltip */}
                    {hoveredPoint && (
                        <div
                            style={{
                                position: "absolute",
                                left: getX(hoveredPoint.time),
                                top: getY(hoveredPoint.value) - 60,
                                transform: "translateX(-50%)",
                                backgroundColor: "#000",
                                border: "1px solid #10b981",
                                borderRadius: "12px",
                                padding: "10px 14px",
                                pointerEvents: "none",
                                zIndex: 20,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                            }}
                        >
                            <div className="text-white font-black text-sm">{hoveredPoint.value.toFixed(1)}%</div>
                            <div className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">{new Date(hoveredPoint.time).toLocaleTimeString()}</div>
                        </div>
                    )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Views", value: totals.views, sub: "All time views", color: "text-white" },
                        { label: "Active Links", value: totals.active, sub: `Of ${links.length} links`, color: "text-emerald-500" },
                        { label: "Avg Views", value: totals.avgViews, sub: "Per resume", color: "text-zinc-300" },
                        { label: "Expired", value: totals.expired, sub: "Inactive links", color: "text-red-500" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors group">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 group-hover:text-zinc-400 transition-colors font-mono">{stat.label}</p>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</span>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-700 tracking-wide uppercase">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Detailed Table */}
                <div className="space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Link Performance Explorer</h2>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white">Filter Results</Button>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {isLoading ? (
                                <div className="py-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
                            ) : links.length === 0 ? (
                                <div className="py-24 text-center text-zinc-600 font-black uppercase tracking-widest text-xs">No links generated yet.</div>
                            ) : (
                                links.map((link) => {
                                    const statusInfo = getLinkStatus(link)
                                    const isExpired = statusInfo.status === 'expired'
                                    return (
                                        <div key={link.id} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors shadow-2xl">
                                                    <Link2 className="h-6 w-6 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white italic tracking-tight">{link.link_name || link.resumes?.title || 'Untitled Resume'}</h4>
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{link.slug} • {new Date(link.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-16">
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-white">{link.view_count || 0}</p>
                                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Impressions</p>
                                                </div>
                                                <div className="text-right w-24">
                                                    <div className={`text-xs font-black uppercase tracking-widest py-1 px-3 rounded-full inline-block ${isExpired ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                        {statusInfo.status === 'active' ? statusInfo.label.split(' ')[0] : 'Expired'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => copyLink(link.slug)} className="h-10 w-10 p-0 text-zinc-600 hover:text-white bg-white/5 rounded-xl">
                                                        {copiedSlug === link.slug ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild className="h-10 w-10 p-0 text-zinc-600 hover:text-white bg-white/5 rounded-xl">
                                                        <a href={`/r/${link.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-r from-[#10b981] to-black p-[1px] rounded-[3rem]">
                    <div className="bg-[#0a0a0a] rounded-[2.95rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex items-center gap-8">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center shrink-0 shadow-2xl">
                                <Shield className="h-8 w-8 text-black" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white italic tracking-tighter mb-2">Upgrade to Permanent Access</h4>
                                <p className="text-zinc-500 text-sm font-medium max-w-lg leading-relaxed">Free links expire. Pro users get permanent presence, heatmaps, and custom domains.</p>
                            </div>
                        </div>
                        <Button className="bg-white text-black hover:bg-zinc-200 font-black px-12 rounded-2xl h-16 text-lg shadow-2xl active:scale-[0.98] transition-all" onClick={() => window.location.href = '/dashboard/upgrade'}>Go Pro Features</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
