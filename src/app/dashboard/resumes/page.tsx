import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ResumeList } from '@/components/dashboard/resume-list'

export default async function ResumesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/signup')
    }

    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-7xl mx-auto w-full p-8 pt-12 space-y-12">
                {/* Header - Matching "Webhooks" Style */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            My CVs
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium mt-2">
                            Manage your professional resume library and AI-generated variations.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold px-5 h-10 rounded-lg shadow-sm">
                            <Link href="/dashboard/builder">
                                <Plus className="h-4 w-4 mr-2" /> New Resume
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-white/5 text-zinc-400 hover:text-white rounded-lg">
                            <span className="text-[10px]">&lt;/&gt;</span>
                        </Button>
                    </div>
                </header>

                <main>
                    {(!resumes || resumes.length === 0) ? (
                        <div className="bg-[#0A0A0A] border border-white/[0.05] rounded-3xl p-20 flex flex-col items-center justify-center text-center min-h-[500px] shadow-2xl relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">No CVs yet</h3>
                            <p className="text-zinc-500 text-base max-w-sm mb-10 relative z-10">
                                Create your first AI-optimized resume to start building your professional career growth.
                            </p>

                            <Button asChild className="bg-white text-black hover:bg-zinc-200 px-10 h-12 text-base rounded-xl font-bold transition-all shadow-xl relative z-10">
                                <Link href="/dashboard/builder">
                                    <Plus className="h-5 w-5 mr-2" /> Add Resume
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="pb-24">
                            <ResumeList initialResumes={resumes} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
