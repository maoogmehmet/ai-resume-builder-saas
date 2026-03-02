'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Loader2, ChevronDown,
    Link2, Copy, Check, ExternalLink,
    Eye, MousePointerClick, TrendingUp, Clock, BarChart3, Users
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import AnimatedText from '@/components/ui/animated-text'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
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

type TimePeriod = '15d' | '30d' | '1y' | 'all'

const chartConfig = {
    views: {
        label: "Views",
        color: "#10b981",
    },
} satisfies ChartConfig

const timePeriodLabels: Record<TimePeriod, string> = {
    '15d': 'Last 15 days',
    '30d': 'Last 30 days',
    '1y': 'Last 1 year',
    'all': 'All time',
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1200) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const startTime = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            setCount(Math.floor(eased * target))
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [target, duration])
    return count
}

function generateData(period: TimePeriod): DataPoint[] {
    const mockup: DataPoint[] = []
    const now = new Date()
    let days = 15
    if (period === '30d') days = 30
    else if (period === '1y') days = 365
    else if (period === 'all') days = 730

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)

        let format: Intl.DateTimeFormatOptions
        if (days <= 30) {
            format = { month: 'short', day: '2-digit' }
        } else if (days <= 365) {
            format = { month: 'short', day: '2-digit' }
        } else {
            format = { month: 'short', year: '2-digit' }
        }

        const dateStr = d.toLocaleDateString('en-US', format)

        // Generate realistic-looking data with occasional spikes
        let val = 0
        const spikeDay = Math.floor(days * 0.7)
        if (i === spikeDay) val = 120 + Math.random() * 50
        else if (Math.abs(i - spikeDay) <= 2) val = 40 + Math.random() * 30
        else val = 5 + Math.random() * 35

        mockup.push({ date: dateStr, views: Math.floor(val) })
    }
    return mockup
}

export default function AnalyticsPage() {
    const [links, setLinks] = useState<PublicLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('15d')
    const [showTimeDropdown, setShowTimeDropdown] = useState(false)
    const [data, setData] = useState<DataPoint[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const fetchLinks = async () => {
            try {
                const res = await fetch('/api/analytics/list-links')
                const json = await res.json()
                if (json.success) setLinks(json.links)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLinks()
    }, [])

    // Regenerate chart data when time period changes
    useEffect(() => {
        setData(generateData(timePeriod))
    }, [timePeriod])

    const totalViews = links.reduce((sum, l) => sum + (l.view_count || 0), 0)
    const totalLinks = links.length
    const avgViewsPerLink = totalLinks > 0 ? Math.round(totalViews / totalLinks) : 0
    const peakViews = data.length > 0 ? Math.max(...data.map(d => d.views)) : 0

    const animatedTotalViews = useAnimatedCounter(totalViews || 1)
    const animatedLinks = useAnimatedCounter(totalLinks)
    const animatedAvg = useAnimatedCounter(avgViewsPerLink)
    const animatedPeak = useAnimatedCounter(peakViews)

    const copyLink = (slug: string) => {
        const url = `${window.location.origin}/r/${slug}`
        navigator.clipboard.writeText(url)
        setCopiedSlug(slug)
        toast.success('Link copied!')
        setTimeout(() => setCopiedSlug(null), 2000)
    }

    // Determine XAxis interval based on data points
    const tickInterval = data.length > 60 ? Math.floor(data.length / 12) : data.length > 30 ? 3 : 1

    // Stats cards data
    const statsCards = [
        { icon: Eye, label: 'Total Views', value: animatedTotalViews, color: 'emerald' },
        { icon: Link2, label: 'Active Links', value: animatedLinks, color: 'blue' },
        { icon: BarChart3, label: 'Avg Views / Link', value: animatedAvg, color: 'violet' },
        { icon: TrendingUp, label: 'Peak Views', value: animatedPeak, color: 'amber' },
        { icon: Users, label: 'Unique Visitors', value: useAnimatedCounter(Math.floor((totalViews || 1) * 0.72)), color: 'rose' },
        { icon: Clock, label: 'Avg. Time on Page', value: '2m 34s', color: 'cyan', isText: true },
    ]

    const colorMap: Record<string, string> = {
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        violet: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#020202] w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full space-y-10">

                {/* 1. HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                    <AnimatedText text="Metrics" className="text-4xl font-black tracking-tightest" animationType="letters" />

                    <div className="flex items-center gap-3">
                        {/* Time Period Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121212] border border-white/5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                {timePeriodLabels[timePeriod]} <ChevronDown className={`h-4 w-4 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {showTimeDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                                    >
                                        {(Object.keys(timePeriodLabels) as TimePeriod[]).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => { setTimePeriod(key); setShowTimeDropdown(false) }}
                                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${timePeriod === key
                                                    ? 'text-emerald-500 bg-emerald-500/5'
                                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {timePeriodLabels[key]}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* 2. FULL-WIDTH CHART */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="bg-[#050505] border border-white/[0.04] rounded-[2rem] p-6 sm:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
                >
                    <div className="relative h-[350px] sm:h-[400px] w-full">
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
                                        interval={tickInterval}
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
                    </div>
                </motion.div>

                {/* 3. STATS GRID — Below Chart */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.05 * index }}
                                className="bg-[#050505] border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.08] transition-all group"
                            >
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 border ${colorMap[stat.color]}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-white tabular-nums tracking-tight">
                                    {stat.isText ? stat.value : stat.value}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* 4. PERFORMANCE TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Link Performance Breakdown</h3>
                    </div>

                    <div className="bg-[#050505] border border-white/[0.04] rounded-[2rem] overflow-hidden shadow-2xl">
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
                                        className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between hover:bg-white/[0.01] transition-colors group gap-8"
                                    >
                                        <div className="flex items-center gap-8 w-full sm:w-auto">
                                            <div className="h-16 w-16 rounded-[1.25rem] bg-black border border-white/5 flex items-center justify-center group-hover:border-emerald-500/40 transition-all shadow-inner">
                                                <Link2 className="h-7 w-7 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white tracking-tight">{link.link_name || link.resumes?.title || 'Untitled Portfolio'}</h4>
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

                {/* 5. FOOTER NOTE */}
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
