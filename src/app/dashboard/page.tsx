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
        <div className="flex flex-col min-h-screen bg-white w-full font-sans">
            <div className="max-w-7xl mx-auto w-full p-8 space-y-8">
                {/* Header matching screenshot exactly */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
                    <div>
                        <h1 className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                            Dashboard
                        </h1>
                        <p className="text-[#64748B] text-base font-medium mt-1">
                            Manage your CVs and cover letters.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 h-11 rounded-xl shadow-sm">
                        <Link href="/dashboard/builder">
                            <span className="text-lg mr-2 leading-none">+</span> CV Builder
                        </Link>
                    </Button>
                </header>

                <main className="space-y-10">
                    {/* The 3 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="h-14 w-14 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{resumeCount || 0}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Documents</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{resumeCount || 0}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">CVs Created</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="h-14 w-14 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{letterCount || 0}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Cover Letters</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent CVs Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-900">Recent CVs</h2>
                            <span className="text-sm font-medium text-slate-500">Sorted by last updated</span>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[300px] flex items-center justify-center shadow-sm">
                            {(!resumes || resumes.length === 0) ? (
                                <div className="text-center flex flex-col items-center max-w-sm mx-auto">
                                    <FileText className="h-14 w-14 text-slate-300 mb-5" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No CVs yet</h3>
                                    <p className="text-slate-500 text-sm mb-6">Create your first CV to get started</p>
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 h-11 rounded-xl shadow-sm w-full">
                                        <Link href="/dashboard/builder">
                                            <span className="text-lg mr-2 leading-none">+</span> Create Your First CV
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <ResumeList initialResumes={resumes} />
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}
