'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Activity, BarChart3, Clock, Copy, Eye, Globe2, Link as LinkIcon, MoreHorizontal, MousePointerClick, Smartphone, Trash, TrendingUp, Users } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import Link from 'next/link'

// Type Definitions
type Timeframe = '24h' | '7d' | '30d' | 'all'

interface ChartData {
    time: string;
    views: number;
}

interface FunnelData {
    stage: string;
    count: number;
    color: string;
}

interface LinkData {
    id: string;
    name: string;
    url: string;
    views: number;
    uniques: number;
    avgTime: string;
    created: string;
    status: 'active' | 'archived';
}

// Mock Data Generator Functions
const generateViewsData = (timeframe: Timeframe): ChartData[] => {
    const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 12;
    const format = timeframe === '24h' ? (i: number) => `${i}:00` : timeframe === 'all' ? (i: number) => `Month ${i + 1}` : (i: number) => `Day ${i + 1}`;

    return Array.from({ length: points }).map((_, i) => {
        // Create a fake spike somewhere
        const isSpike = i === Math.floor(points * 0.7);
        return {
            time: format(i),
            views: isSpike ? Math.floor(Math.random() * 500) + 1000 : Math.floor(Math.random() * 200) + 50
        }
    })
}

// Main Component
export default function AnalyticsDashboard() {
    const [timeframe, setTimeframe] = useState<Timeframe>('7d')
    const [chartData, setChartData] = useState<ChartData[]>([])

    // Trigger chart animation on timeframe change
    useEffect(() => {
        setChartData(generateViewsData(timeframe))
    }, [timeframe])

    // Derived Mock Metrics based on timeframe
    const multiplier = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 120;

    const stats = {
        totalViews: 1245 * multiplier,
        viewsChange: '+12.4%',
        viewsPositive: true,

        activeLinks: 4,
        linksChange: '0%',
        linksPositive: true,

        avgViews: 311 * multiplier,
        avgChange: '+8.2%',
        avgPositive: true,

        uniqueVisitors: 892 * multiplier,
        uniqueChange: '-2.1%',
        uniquePositive: false,
    }

    const funnelData: FunnelData[] = [
        { stage: 'Profile Views', count: stats.totalViews, color: '#3b82f6' },
        { stage: 'Scroll 50%', count: Math.floor(stats.totalViews * 0.65), color: '#8b5cf6' },
        { stage: 'Contact Click', count: Math.floor(stats.totalViews * 0.25), color: '#ec4899' },
        { stage: 'CV Download', count: Math.floor(stats.totalViews * 0.12), color: '#eab308' },
    ]

    const activeLinks: LinkData[] = [
        { id: '1', name: 'Software Engineer - Google', url: 'cv.bld/johndoe-se', views: 4200, uniques: 3100, avgTime: '02m 45s', created: 'Oct 12, 2023', status: 'active' },
        { id: '2', name: 'Product Manager - Microsoft', url: 'cv.bld/johndoe-pm', views: 850, uniques: 720, avgTime: '01m 20s', created: 'Jan 05, 2024', status: 'active' },
        { id: '3', name: 'Startup Generalist', url: 'cv.bld/johndoe-gen', views: 320, uniques: 290, avgTime: '00m 45s', created: 'Feb 20, 2024', status: 'active' },
        { id: '4', name: 'Legacy Resume 2022', url: 'cv.bld/johndoe-old', views: 12000, uniques: 9000, avgTime: '03m 10s', created: 'Mar 15, 2022', status: 'archived' },
    ]

    const deviceData = [
        { name: 'Desktop', value: 65, color: '#3b82f6' },
        { name: 'Mobile', value: 30, color: '#8b5cf6' },
        { name: 'Tablet', value: 5, color: '#ec4899' },
    ]

    const geoData = [
        { country: 'United States', percentage: 45 },
        { country: 'United Kingdom', percentage: 20 },
        { country: 'Germany', percentage: 15 },
        { country: 'Other', percentage: 20 },
    ]

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(`https://${url}`)
        toast.success('Link Copied', { description: `Copied ${url} to clipboard.` })
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#3b82f6]/30 p-6 sm:p-8 lg:p-12 pb-24">

            {/* Header & Sticky Controls */}
            <header className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#0a0a0a] border border-[#3b82f6]/30 rounded-[1rem] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <Activity className="h-5 w-5 text-[#3b82f6]" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-4xl font-black tracking-[-0.08em] italic lowercase text-white">
                            neural analytics
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic ml-14">Aggregate telemetry and pipeline conversion data.</p>
                </div>

                <div className="flex items-center gap-2 bg-[#050505] p-1.5 rounded-full border border-white/5">
                    {['24h', '7d', '30d', 'all'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t as Timeframe)}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic transition-all ${timeframe === t ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            {/* Top Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-[#050505] border-white/5 rounded-[1.5rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Eye className="w-16 h-16 text-[#3b82f6]" />
                    </div>
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest italic">Total Views</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-opacity-10 border ${stats.viewsPositive ? 'text-emerald-400 bg-emerald-500 border-emerald-500/20' : 'text-rose-400 bg-rose-500 border-rose-500/20'}`}>
                                {stats.viewsChange}
                            </span>
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-white">{stats.totalViews.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="bg-[#050505] border-white/5 rounded-[1.5rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <LinkIcon className="w-16 h-16 text-[#8b5cf6]" />
                    </div>
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest italic">Active Links</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300`}>
                                {stats.linksChange}
                            </span>
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-white">{stats.activeLinks}</div>
                    </CardContent>
                </Card>

                <Card className="bg-[#050505] border-white/5 rounded-[1.5rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <BarChart3 className="w-16 h-16 text-[#eab308]" />
                    </div>
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest italic">Avg Views/Link</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-opacity-10 border ${stats.avgPositive ? 'text-emerald-400 bg-emerald-500 border-emerald-500/20' : 'text-rose-400 bg-rose-500 border-rose-500/20'}`}>
                                {stats.avgChange}
                            </span>
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-white">{stats.avgViews.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="bg-[#050505] border-white/5 rounded-[1.5rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Users className="w-16 h-16 text-[#ec4899]" />
                    </div>
                    <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest italic">Unique Visitors</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-opacity-10 border ${stats.uniquePositive ? 'text-emerald-400 bg-emerald-500 border-emerald-500/20' : 'text-rose-400 bg-rose-500 border-rose-500/20'}`}>
                                {stats.uniqueChange}
                            </span>
                        </div>
                        <div className="text-4xl font-black tracking-tighter text-white">{stats.uniqueVisitors.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Traffic Line Chart */}
                <Card className="lg:col-span-2 bg-[#050505] border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                        <div className="h-2 w-2 bg-[#3b82f6] rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#3b82f6] italic">Live Telemetry</span>
                    </div>
                    <h3 className="text-xl font-black tracking-[-0.05em] text-white italic lowercase mb-2">traffic vector</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-8">Views mapped over {timeframe === 'all' ? 'All Time' : timeframe}</p>

                    <div className="flex-1 min-h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#52525b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    formatter={(value: any) => {
                                        // Spike Alert Logic inside tooltip
                                        if (typeof value === 'number' && value > 800) return [<span key="spike" className="text-rose-400">⚠️ {value} (Unusual Spike)</span>, 'Views']
                                        return [value, 'Views']
                                    }}
                                />
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#000', strokeWidth: 2 }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Conversion Funnel */}
                <Card className="bg-[#050505] border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black tracking-[-0.05em] text-white italic lowercase">conversion funnel</h3>
                        <span className="text-2xl font-black text-emerald-400 tracking-tighter">12%</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-8">View-to-Download Rate</p>

                    <div className="flex-1 w-full flex flex-col justify-end min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={funnelData} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="stage" type="category" stroke="#a1a1aa" fontSize={10} fontWeight="bold" width={80} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1000}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Geo and Breakdown Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Device Breakdown */}
                <Card className="bg-[#050505] border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-3 text-zinc-400 mb-4">
                            <Smartphone className="w-5 h-5" />
                            <h3 className="text-sm font-black tracking-widest uppercase italic">Device Telemetry</h3>
                        </div>
                        <div className="space-y-4">
                            {deviceData.map(d => (
                                <div key={d.name} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-zinc-300">
                                        <span>{d.name}</span>
                                        <span>{d.value}%</span>
                                    </div>
                                    <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-[120px] w-[120px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Geo Breakdown */}
                <Card className="bg-[#050505] border-white/5 rounded-[2rem] p-6">
                    <div className="flex items-center gap-3 text-zinc-400 mb-6">
                        <Globe2 className="w-5 h-5" />
                        <h3 className="text-sm font-black tracking-widest uppercase italic">Global Heatmap</h3>
                    </div>
                    <div className="space-y-5">
                        {geoData.map((loc, i) => (
                            <div key={loc.country} className="flex items-center gap-4">
                                <span className="text-[10px] text-zinc-600 font-black w-4">{i + 1}</span>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-zinc-300">
                                        <span>{loc.country}</span>
                                        <span>{loc.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${loc.percentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Link-level Table */}
            <Card className="bg-[#050505] border-white/5 rounded-[2rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black tracking-[-0.05em] text-white italic lowercase mb-1">public endpoints</h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Link-level performance analysis</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]">
                                <th className="p-6 text-[10px] font-black tracking-widest uppercase italic text-zinc-500">Node Designation</th>
                                <th className="p-6 text-[10px] font-black tracking-widest uppercase italic text-zinc-500">Status</th>
                                <th className="p-6 text-[10px] font-black tracking-widest uppercase italic text-zinc-500 text-right">Views</th>
                                <th className="p-6 text-[10px] font-black tracking-widest uppercase italic text-zinc-500 text-right">Uniques</th>
                                <th className="p-6 text-[10px] font-black tracking-widest uppercase italic text-zinc-500 text-right">Avg Time</th>
                                <th className="p-6 text-[10px] font-black tracking-widest uppercase italic text-zinc-500 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeLinks.map((link) => (
                                <tr key={link.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-sm text-zinc-200">{link.name}</div>
                                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                            <span className="truncate max-w-[200px] hover:text-white transition-colors cursor-pointer" onClick={() => handleCopy(link.url)}>{link.url}</span>
                                            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-white" onClick={() => handleCopy(link.url)} />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border ${link.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                                            {link.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right font-bold text-zinc-300">{link.views.toLocaleString()}</td>
                                    <td className="p-6 text-right font-medium text-zinc-400">{link.uniques.toLocaleString()}</td>
                                    <td className="p-6 text-right font-medium text-zinc-400 flex items-center justify-end gap-2">
                                        <Clock className="w-3 h-3 text-zinc-600" /> {link.avgTime}
                                    </td>
                                    <td className="p-6 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg outline-none transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#111] border-white/10 shadow-2xl rounded-xl p-2 min-w-[160px]">
                                                <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-md mb-1"><Eye className="w-3 h-3 mr-2" /> View Public CV</DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-bold text-zinc-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-md mb-1" onClick={() => handleCopy(link.url)}><Copy className="w-3 h-3 mr-2" /> Copy Link</DropdownMenuItem>
                                                <div className="h-px bg-white/10 my-1 -mx-2" />
                                                <DropdownMenuItem className="text-xs font-bold text-rose-400 focus:bg-rose-500/20 focus:text-rose-300 cursor-pointer rounded-md"><Trash className="w-3 h-3 mr-2" /> Deactivate Link</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
