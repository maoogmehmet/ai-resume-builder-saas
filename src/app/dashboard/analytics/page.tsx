'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    Loader2, ChevronDown,
    Link2, Copy, Check, ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart'

interface PublicLink {
    id: string
    slug: string
    is_active: boolean
    view_count: number
    link_name: string | null
    created_at: string
    resumes: { title: string } | null
}

interface DataPoint {
    date: string
    views: number
}

const chartConfig = {
    views: {
        label: "Views",
        color: "#10b981",
    },
} satisfies ChartConfig

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1200) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const startTime = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setCount(Math.floor(eased * target))
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [target, duration])
    return count
}

export default function AnalyticsPage() {
    const [links, setLinks] = useState<PublicLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
    const [data, setData] = useState<DataPoint[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
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

        // Generate mockup data for the last 15 days
        const mockup: DataPoint[] = []
        const now = new Date()
        for (let i = 14; i >= 0; i--) {
            const d = new Date()
            d.setDate(now.getDate() - i)
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })

            // Spike on Feb 27
            let val = 0
            if (i === 4) val = 150
            else if (i === 3 || i === 5) val = 45 + Math.random() * 20
            else val = 10 + Math.random() * 30

            mockup.push({
                date: dateStr,
                views: Math.floor(val),
            })
        }
        setData(mockup)
    }, [])

    const totalViews = links.reduce((sum, l) => sum + (l.view_count || 0), 0)
    const deliverabilityRate = links.length > 0 ? 100 : 0
    const animatedViews = useAnimatedCounter(totalViews || 1)
    const animatedRate = useAnimatedCounter(deliverabilityRate)

    const copyLink = (slug: string) => {
        const url = `${window.location.origin}/r/${slug}`
        navigator.clipboard.writeText(url)
        setCopiedSlug(slug)
        toast.success('Link copied!')
        setTimeout(() => setCopiedSlug(null), 2000)
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" as const }
        }
    }

    const numberVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.3 }
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#020202] w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full space-y-12">

                {/* 1. HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                    <h1 className="text-4xl font-black tracking-tightest">Metrics</h1>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121212] border border-white/5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            All Domains <ChevronDown className="h-4 w-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121212] border border-white/5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Last 15 days <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>

                {/* 2. CHIEF METRICS CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="bg-[#050505] border border-white/[0.04] rounded-[3rem] p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">

                        {/* Summary Stats (Left) — Animated */}
                        <motion.div
                            className="lg:col-span-1 space-y-12"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants}>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2"
                                >
                                    TOTAL VIEWS
                                </motion.p>
                                <motion.h2
                                    variants={numberVariants}
                                    className="text-6xl font-black italic tracking-tighter text-white"
                                >
                                    {animatedViews}
                                </motion.h2>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2"
                                >
                                    DELIVERABILITY RATE
                                </motion.p>
                                <motion.h2
                                    variants={numberVariants}
                                    className="text-6xl font-black italic tracking-tighter text-white"
                                >
                                    {animatedRate}%
                                </motion.h2>
                            </motion.div>
                        </motion.div>

                        {/* Chart Area (Right) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                            className="lg:col-span-3 relative h-[400px]"
                        >
                            <div className="absolute top-0 right-0 z-20">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121212]/50 border border-white/5 text-xs font-bold text-zinc-400">
                                    All Events <ChevronDown className="h-3 w-3" />
                                </button>
                            </div>

                            {mounted && (
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <LineChart
                                        data={data}
                                        margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
                                    >
                                        <CartesianGrid
                                            vertical={false}
                                            stroke="white"
                                            strokeOpacity={0.05}
                                            strokeDasharray="4 4"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "white", fillOpacity: 0.35, fontSize: 10, fontWeight: 600 }}
                                            dy={15}
                                            interval={1}
                                            angle={-35}
                                            textAnchor="end"
                                        />
                                        <YAxis
                                            orientation="right"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "white", fillOpacity: 0.4, fontSize: 12, fontWeight: "bold" }}
                                            tickFormatter={(val) => val > 0 ? val.toString() : "0"}
                                        />
                                        <ChartTooltip
                                            cursor={{ stroke: "white", strokeOpacity: 0.1, strokeWidth: 1 }}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="var(--color-views)"
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 6, fill: "#10b981", stroke: "#050505", strokeWidth: 2 }}
                                            animationDuration={2000}
                                            animationEasing="ease-out"
                                        />
                                    </LineChart>
                                </ChartContainer>
                            )}
                        </motion.div>
                    </div>
                </motion.div>

                {/* 3. PERFORMANCE TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="space-y-8"
                >
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Link Performance Breakdown</h3>
                    </div>

                    <div className="bg-[#050505] border border-white/[0.04] rounded-[2.5rem] overflow-hidden shadow-2xl">
                        {isLoading ? (
                            <div className="p-32 flex flex-col items-center justify-center gap-4 text-zinc-600">
                                <Loader2 className="h-10 w-10 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Hydrating data layer...</span>
                            </div>
                        ) : links.length === 0 ? (
                            <div className="p-32 text-center text-zinc-700 font-black uppercase tracking-widest text-xs">
                                No active resume links found.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.03]">
                                {links.map((link, index) => (
                                    <motion.div
                                        key={link.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                        className="p-8 sm:p-10 flex flex-col sm:row items-center justify-between hover:bg-white/[0.01] transition-colors group gap-8"
                                    >
                                        <div className="flex items-center gap-8 w-full sm:w-auto">
                                            <div className="h-16 w-16 rounded-[1.25rem] bg-black border border-white/5 flex items-center justify-center group-hover:border-emerald-500/40 transition-all shadow-inner">
                                                <Link2 className="h-7 w-7 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white italic tracking-tight">{link.link_name || link.resumes?.title || 'Untitled Portfolio'}</h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">r/{link.slug}</span>
                                                    <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(link.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto">
                                            <div className="text-center sm:text-right">
                                                <p className="text-3xl font-black text-white">{link.view_count || 0}</p>
                                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Views</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyLink(link.slug)}
                                                    className="h-12 w-12 p-0 text-zinc-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/5"
                                                >
                                                    {copiedSlug === link.slug ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-12 w-12 p-0 text-zinc-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/5"
                                                >
                                                    <a href={`/r/${link.slug}`} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-5 w-5" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 4. FOOTER NOTE */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex justify-center pt-8"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">Elite Career Intelligence Layer</p>
                </motion.div>
            </div>
        </div>
    )
}
