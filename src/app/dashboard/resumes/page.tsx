import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Files, Sparkles } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
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
            <div className="max-w-7xl mx-auto w-full p-10 pt-24 space-y-20">
                {/* Header */}
                <header className="flex items-center justify-between pb-8 border-b border-white/5">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter italic lowercase">
                            my cvs
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4 italic opacity-60">
                            Professional library of AI-optimized career variations.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <AnimatedGenerateButton
                            href="/dashboard/builder"
                            labelIdle="New Resume"
                            size="lg"
                            className="font-black italic lowercase px-10 h-14"
                            icon={<Plus className="h-5 w-5" />}
                            noMinWidth
                        />
                    </div>
                </header>

                <main>
                    {(!resumes || resumes.length === 0) ? (
                        <div className="bg-black border border-white/5 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center min-h-[500px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                            {/* Decorative background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none opacity-20" />

                            <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700">
                                <Files className="h-10 w-10 text-zinc-700" />
                            </div>

                            <h3 className="text-3xl font-black text-white mb-4 italic lowercase tracking-tighter relative z-10">Library is empty</h3>
                            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] max-w-sm mb-12 italic opacity-60 relative z-10 leading-relaxed">
                                Initialize your first high-performance node to begin scaling your professional trajectory.
                            </p>

                            <AnimatedGenerateButton
                                href="/dashboard/builder"
                                labelIdle="Initialize CV"
                                size="lg"
                                className="font-black italic lowercase px-12 h-16 text-lg relative z-10"
                                icon={<Sparkles className="h-5 w-5" />}
                            />
                        </div>
                    ) : (
                        <div className="pb-32">
                            <ResumeList initialResumes={resumes} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
