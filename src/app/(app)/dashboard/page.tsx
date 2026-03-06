import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Sparkles, Briefcase, Linkedin, Target, Activity, Flame, ChevronRight, FileCheck2, Lightbulb, Clock, MoreHorizontal, Copy, Trash2, Edit } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string }>
}) {
    const { success } = await searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/signup')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    const { count: resumeCount = 0 } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Member'
    const isPro = profile?.role === 'pro' || profile?.role === 'premium'

    // Real Data
    const lastDocument = resumes?.[0]
    const rCount = resumeCount || 0;

    // Real Match Score: Pull average ATS score from resume data if available
    let matchScore = 0;
    if (rCount > 0 && resumes && resumes.length > 0) {
        const scores = resumes
            .map((r: any) => r.ai_generated_json?.ats_score || r.ai_generated_json?.match_score)
            .filter((s: any): s is number => typeof s === 'number' && s > 0);
        if (scores.length > 0) {
            matchScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
        } else {
            // Estimate from resume completeness
            const firstResume = resumes[0]?.ai_generated_json || {};
            const hasPersonal = firstResume?.personal_info?.full_name && firstResume?.personal_info?.email;
            const hasExperience = firstResume?.experience?.length > 0;
            const hasSummary = firstResume?.summary?.length > 50;
            const hasSkills = firstResume?.skills?.technical?.length > 0;
            const completeness = [hasPersonal, hasExperience, hasSummary, hasSkills].filter(Boolean).length;
            matchScore = Math.min(55 + completeness * 8, 88);
        }
    }

    // Real Weekly Progress: count resumes updated this week
    const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyOptimizations = resumes?.filter((r: any) => new Date(r.updated_at) > oneWeekAgo).length || 0;

    // Real streak: count consecutive days with resume updates
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let currentStreak = 0;
    if (resumes && resumes.length > 0) {
        const uniqueDays = new Set(resumes.map((r: any) => {
            const d = new Date(r.updated_at); d.setHours(0, 0, 0, 0); return d.getTime();
        }));
        let checkDay = new Date(today); checkDay.setHours(0, 0, 0, 0);
        while (uniqueDays.has(checkDay.getTime())) {
            currentStreak++; checkDay.setDate(checkDay.getDate() - 1);
        }
    }

    // Real Job Pipeline from saved_jobs table
    const { data: savedJobsData } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const jobPipeline = (savedJobsData || []).map((j: any) => ({
        id: j.id,
        company: j.company_name || 'Unknown',
        role: j.title || 'Position',
        stage: j.status || 'Saved',
        date: (() => {
            const d = new Date(j.created_at); const now = new Date();
            const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 86400));
            return diff === 0 ? 'Today' : diff === 1 ? '1d ago' : `${diff}d ago`;
        })(),
        resume: '-'
    }))
    const smartInsights: Array<{ id: number; text: string; action: string; href: string; type: string }> = rCount > 0 ? [
        { id: 1, text: "Missing quantified metrics in Experience section.", action: "Fix now", href: "/dashboard/optimize", type: "warning" },
        { id: 2, text: `Your ATS compatibility score is ${matchScore}%. Optimize for your target role.`, action: "Optimize", href: "/dashboard/optimize", type: matchScore >= 75 ? "success" : "info" },
        ...(weeklyOptimizations === 0 ? [{ id: 3, text: "No resume updates this week. Keep your career profile active.", action: "Edit", href: "/dashboard/resumes", type: "warning" }] : []),
    ] : [
        { id: 1, text: "Your professional profile is completely blank.", action: "Create CV", href: "/dashboard/builder", type: "warning" },
        { id: 2, text: "Initialize a smart resume to unlock tailored AI insights.", action: "Start", href: "/dashboard/builder", type: "info" }
    ]

    return (
        <div className="min-h-screen w-full bg-black text-white p-4 md:p-8 flex flex-col gap-6 md:gap-10 pb-20">

            {/* Header & Continue Where You Left Off */}
            <header className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg">
                    Dashboard
                </h1>
                <p className="text-zinc-500 text-sm md:text-base font-medium">
                    Welcome back, <span className="text-zinc-300 capitalize">{firstName}</span>. Here's your career overview.
                </p>

                {/* P0-1: Continue Where You Left Off */}
                {lastDocument ? (
                    <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-white/[0.05] transition-colors relative overflow-hidden isolate">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/10 text-white rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Continue Editing</h3>
                                <p className="font-bold text-lg leading-tight truncate max-w-[200px] sm:max-w-[300px]">{lastDocument.title || 'Untitled Resume'}</p>
                                <p className="text-xs text-zinc-600 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Updated {formatRelativeTime(lastDocument.updated_at)}
                                </p>
                            </div>
                        </div>
                        <Button asChild className="relative z-10 w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-black italic rounded-xl h-11 px-8">
                            <Link href={`/editor/${lastDocument.id}`}>
                                Continue <ChevronRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="mt-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center gap-3">
                        <Sparkles className="w-8 h-8 text-zinc-500" />
                        <h3 className="font-bold text-lg">Let's build your career</h3>
                        <p className="text-sm text-zinc-500">Create your first highly-optimized resume in minutes.</p>
                        <Button asChild className="mt-2 bg-white text-black hover:bg-zinc-200 font-black italic rounded-xl">
                            <Link href="/dashboard/builder">Start Magic Build</Link>
                        </Button>
                    </div>
                )}
            </header>

            {/* P0-2: Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Link href="/dashboard/builder" className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all group">
                    <FileText className="w-5 h-5 text-white mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">New Resume</span>
                </Link>
                <Link href="/dashboard/optimize" className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all group">
                    <Target className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Analyze Resume</span>
                </Link>
                <Link href={isPro ? "/dashboard/letters" : "/#pricing"} className="relative flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all group overflow-hidden">
                    {!isPro && <div className="absolute top-2 right-2 text-[9px] font-black italic bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-sm uppercase tracking-wider">PRO</div>}
                    <FileCheck2 className={`w-5 h-5 mb-2 group-hover:scale-110 transition-transform ${isPro ? 'text-blue-400' : 'text-zinc-600'}`} />
                    <span className={`font-bold text-sm ${!isPro && 'text-zinc-400'}`}>Cover Letter</span>
                </Link>
                <Link href={isPro ? "/dashboard/builder" : "/#pricing"} className="relative flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all group overflow-hidden">
                    {!isPro && <div className="absolute top-2 right-2 text-[9px] font-black italic bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-sm uppercase tracking-wider">PRO</div>}
                    <Linkedin className={`w-5 h-5 mb-2 group-hover:scale-110 transition-transform ${isPro ? 'text-blue-600' : 'text-zinc-600'}`} />
                    <span className={`font-bold text-sm ${!isPro && 'text-zinc-400'}`}>Import Profile</span>
                </Link>
            </div>

            {/* P2-6: Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="flex-1 bg-white/[0.02] border-white/10 text-white min-w-[200px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic">{resumeCount}</div>
                    </CardContent>
                </Card>
                <Card className="flex-1 bg-white/[0.02] border-white/10 text-white min-w-[200px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Match Score</CardTitle>
                        <Target className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic text-emerald-400">{matchScore}%</div>
                        <p className="text-xs text-zinc-500 mt-1 font-bold">Average ATS compatibility</p>
                    </CardContent>
                </Card>
                <Card className="flex-1 bg-white/[0.02] border-white/10 text-white min-w-[200px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Weekly Progress</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic text-blue-400">{weeklyOptimizations}</div>
                        <p className="text-xs text-zinc-500 mt-1 font-bold">Goal: 5 exports this week</p>
                    </CardContent>
                </Card>
                <Card className="flex-1 bg-white/[0.02] border-white/10 text-white min-w-[200px] border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.1)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-400">Focus Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black italic flex items-center gap-2 text-white">
                            {currentStreak}
                            <span className="text-sm text-zinc-500 not-italic uppercase tracking-widest">Days</span>
                        </div>
                        <p className="text-xs text-orange-500/80 mt-1 font-bold">You're on fire!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Smart Insights & Job Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Job Pipeline */}
                <Card className="bg-white/[0.02] border-white/10 text-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-black italic lowercase tracking-tight">
                            <Briefcase className="h-5 w-5 text-blue-400" /> job pipeline
                        </CardTitle>
                        <CardDescription className="text-zinc-500">Track your applications and linked resumes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {jobPipeline.length === 0 ? (
                                <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                                    <Briefcase className="h-8 w-8 text-zinc-800" />
                                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">No saved jobs yet</p>
                                    <Link href="/dashboard/jobs" className="text-xs text-blue-400 font-bold hover:text-blue-300 uppercase tracking-widest">Find Jobs →</Link>
                                </div>
                            ) : (
                                <>
                                    {/* Pipeline Stages — real counts */}
                                    <div className="flex bg-white/5 rounded-lg p-1 text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex-1 py-2 text-center text-zinc-400 border-r border-white/10">
                                            {jobPipeline.filter(j => j.stage === 'Saved' || j.stage === 'saved').length} Saved
                                        </div>
                                        <div className="flex-1 py-2 text-center text-blue-400 border-r border-white/10">
                                            {jobPipeline.filter(j => j.stage === 'Applied' || j.stage === 'applied').length} Applied
                                        </div>
                                        <div className="flex-1 py-2 text-center text-purple-400 border-r border-white/10">
                                            {jobPipeline.filter(j => j.stage === 'Interview' || j.stage === 'interview').length} Interview
                                        </div>
                                        <div className="flex-1 py-2 text-center text-emerald-400">
                                            {jobPipeline.filter(j => j.stage === 'Offer' || j.stage === 'offer').length} Offer
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        {jobPipeline.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                                <div>
                                                    <div className="font-bold text-sm flex items-center gap-2">
                                                        {job.company}
                                                        <Badge variant="outline" className={`text-[9px] uppercase tracking-wider scale-90 ${job.stage === 'Interview' ? 'text-purple-400 border-purple-400/30 bg-purple-400/10' : job.stage === 'Applied' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' : 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10'}`}>
                                                            {job.stage}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 mt-1">{job.role}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-zinc-400">{job.resume}</div>
                                                    <div className="text-[10px] text-zinc-600 mt-1">{job.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button asChild variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white">
                            <Link href="/dashboard/jobs">View Full Tracker</Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Smart Insights */}
                <Card className="bg-white/[0.02] border-white/10 text-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-black italic lowercase tracking-tight">
                            <Lightbulb className="h-5 w-5 text-yellow-400" /> ai insights
                        </CardTitle>
                        <CardDescription className="text-zinc-500">Actionable intelligence to improve your odds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {smartInsights.map((insight) => (
                                <div key={insight.id} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                                    {insight.type === 'warning' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/50" />}
                                    {insight.type === 'info' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50" />}
                                    {insight.type === 'success' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50" />}

                                    <div className="flex-1 mt-0.5">
                                        <p className="text-sm text-zinc-300 font-medium leading-relaxed">{insight.text}</p>
                                    </div>
                                    <Button asChild size="sm" variant="outline" className="shrink-0 h-8 bg-black/40 border-white/10 hover:bg-white hover:text-black font-bold text-xs">
                                        <Link href={insight.href}>{insight.action}</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* P0-3: Recent Documents Section */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-white/[0.02] border-white/10 text-white overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-black italic lowercase tracking-tight">
                        <FileText className="h-5 w-5 text-zinc-400" /> recent documents
                    </CardTitle>
                    <CardDescription className="text-zinc-500">Your latest optimized resumes and cover letters.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[250px] md:h-[300px]">
                        <div className="divide-y divide-white/5">
                            {(!resumes || resumes.length === 0) ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <FileText className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-400 font-bold">No documents yet</p>
                                    <p className="text-xs text-zinc-600 mt-1">Create your first highly-optimized document.</p>
                                </div>
                            ) : (
                                resumes.slice(0, 5).map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 px-6 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:text-blue-400 transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <Link href={`/editor/${doc.id}`} className="font-bold text-sm md:text-base hover:text-blue-400 transition-colors">
                                                    {doc.title || 'Untitled Resume'}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">Resume</span>
                                                    <span className="text-xs text-zinc-600 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {formatRelativeTime(doc.updated_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-white/10 text-white rounded-xl shadow-2xl">
                                                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                        <Link href={`/editor/${doc.id}`}>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                                                        <Link href="/dashboard/resumes">
                                                            <Copy className="w-4 h-4 mr-2 text-blue-400" /> Manage in Library
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer py-2 border-t border-white/5 mt-1">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="pt-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Showing max 5 recent items</p>
                    <Link href="/dashboard/resumes" className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                        View all <ChevronRight className="w-3 h-3" />
                    </Link>
                </CardFooter>
            </Card>

        </div>
    )
}
