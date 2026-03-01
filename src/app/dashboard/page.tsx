import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'
import { FileText, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ResumeList } from '@/components/dashboard/resume-list'
import { DashboardHeaderProfile } from '@/components/dashboard/header-profile'
import { CareerInsights } from '@/components/dashboard/career-insights'

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
        .order('created_at', { ascending: false })

    const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: letterCount } = await supabase
        .from('cover_letters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const isTrialActive = profile && new Date(profile.trial_end_date) > new Date()
    const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
    const trialDaysLeft = profile ? Math.max(0, Math.ceil((new Date(profile.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0
    const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'


    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-zinc-100">
            <div className="max-w-7xl mx-auto w-full p-8 pt-16 space-y-12">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
                    <h1 className="text-4xl font-black tracking-tighter text-white italic focus:outline-none">
                        Overview
                    </h1>
                </header>

                <main className="space-y-12">
                    {/* Top Segmented Controls & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                            <button className="px-3 py-1.5 text-sm font-medium bg-white/10 text-white rounded-md shadow-sm">
                                Resumes
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors rounded-md">
                                Cover Letters
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-white/10 bg-black hover:bg-white/5 text-zinc-400">
                                <span className="text-sm">•••</span>
                            </Button>
                            <Button asChild className="ml-2 h-9 px-6 text-sm font-bold bg-white text-black hover:bg-zinc-200 rounded-lg shadow-xl shadow-white/5">
                                <Link href="/dashboard/builder">
                                    New Document
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full h-9 bg-white/5 border border-white/10 rounded-md pl-9 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="h-9 bg-white/5 border border-white/10 rounded-md px-3 py-0 text-sm font-medium text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em] bg-[right_0.5rem_center] bg-no-repeat w-[140px]">
                                <option className="bg-zinc-900">Last 15 days</option>
                                <option className="bg-zinc-900">Last 30 days</option>
                                <option className="bg-zinc-900">All time</option>
                            </select>
                            <select className="h-9 bg-white/5 border border-white/10 rounded-md px-3 py-0 text-sm font-medium text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em] bg-[right_0.5rem_center] bg-no-repeat w-[140px]">
                                <option className="bg-zinc-900">All Statuses</option>
                                <option className="bg-zinc-900">Completed</option>
                                <option className="bg-zinc-900">Drafts</option>
                            </select>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                            </Button>
                        </div>
                    </div>

                    {/* Recent Documents */}
                    <div className="w-full pt-4">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 italic">
                                Recent Documents
                            </h2>
                            <div className="h-px flex-1 bg-white/5 mx-8" />
                        </div>

                        <div className="flex flex-col min-h-[300px]">
                            {(!resumes || resumes.length === 0) ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                    <FileText className="h-10 w-10 text-zinc-700 mb-4" />
                                    <h3 className="text-base font-semibold text-zinc-300 mb-1">No documents found</h3>
                                    <p className="text-zinc-500 text-sm">Create your first CV to see it here.</p>
                                </div>
                            ) : (
                                <ResumeList initialResumes={resumes} />
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}
