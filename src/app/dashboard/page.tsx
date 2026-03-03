import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Sparkles } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { ResumeList } from '@/components/dashboard/resume-list'
import { MarketingDashboard } from '@/components/dashboard/marketing-dashboard'
import { CardDisplay, CardDisplayItem } from '@/components/dashboard/card-display'

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

    const { count: letterCount = 0 } = await supabase
        .from('cover_letters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Member'
    const trialDaysLeft = profile ? Math.max(0, Math.ceil((new Date(profile.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0
    const totalOptimizations = (resumeCount || 0) + (letterCount || 0)

    const marketingStats = {
        totalHours: totalOptimizations,
        stats: [
            { label: 'resumes', value: totalOptimizations > 0 ? ((resumeCount || 0) / totalOptimizations) * 100 : 0, color: 'bg-white' },
            { label: 'letters', value: totalOptimizations > 0 ? ((letterCount || 0) / totalOptimizations) * 100 : 0, color: 'bg-zinc-600' },
        ]
    }

    const overviewItems: CardDisplayItem[] = [
        {
            id: 'resumes',
            title: 'total resumes',
            value: (resumeCount || 0).toString(),
            description: 'Professional CVs generated',
            icon: 'file-text'
        },
        {
            id: 'letters',
            title: 'cover letters',
            value: (letterCount || 0).toString(),
            description: 'Tailored applications',
            icon: 'history'
        },
        {
            id: 'growth',
            title: 'career score',
            value: '84%',
            description: 'Market readiness index',
            icon: 'trending-up'
        },
        {
            id: 'ai-power',
            title: 'ai usage',
            value: totalOptimizations.toString(),
            description: 'Smart optimizations used',
            icon: 'sparkles'
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-7xl mx-auto w-full p-6 sm:p-12 pt-16 space-y-12">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-white/5 pb-8 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic lowercase">
                            dashboard
                        </h1>
                    </div>
                    <AnimatedGenerateButton
                        labelIdle="new document"
                        href="/dashboard/builder"
                        size="lg"
                        className="italic font-black shadow-2xl shadow-white/5 w-auto lowercase"
                        icon={<Sparkles className="h-5 w-5" />}
                        noMinWidth
                    />
                </header>

                <main className="space-y-20">
                    {/* Top Stats Overview */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <CardDisplay items={overviewItems} />
                    </section>

                    {/* Marketing Dashboard Patterns */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <MarketingDashboard
                            className="xl:col-span-2 shadow-2xl"
                            title="growth activities"
                            teamActivities={marketingStats}
                            team={{
                                memberCount: trialDaysLeft,
                                members: [
                                    { id: '1', name: firstName, avatarUrl: '' }
                                ]
                            }}
                            cta={{
                                text: "Ready to accelerate your career? Transform your CV with AI.",
                                buttonText: "start magic build"
                            }}
                        />

                        {/* Recent Activity Mini-Card or Tip */}
                    </section>

                    {/* Content Area - Resumes */}
                    <section className="space-y-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">
                                Recent Documents
                            </h2>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
                                <button className="hover:text-white transition-colors">View All</button>
                                <div className="h-4 w-px bg-white/10" />
                                <button className="hover:text-white transition-colors">Filter</button>
                            </div>
                        </div>

                        <div className="min-h-[400px]">
                            {(!resumes || resumes.length === 0) ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] group hover:bg-white/[0.02] transition-all">
                                    <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                                        <FileText className="h-8 w-8 text-zinc-700 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-black text-zinc-300 italic uppercase tracking-tighter">No documents yet</h3>
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2 italic">Create high-performance resumes in seconds with our AI builder.</p>
                                    <AnimatedGenerateButton
                                        labelIdle="create first cv"
                                        href="/dashboard/builder"
                                        className="mt-8 italic font-black w-auto lowercase"
                                    />
                                </div>
                            ) : (
                                <ResumeList initialResumes={resumes} />
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
