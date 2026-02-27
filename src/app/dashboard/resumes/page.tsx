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
        <div className="flex flex-col min-h-screen bg-white w-full font-sans">
            <div className="max-w-7xl mx-auto w-full p-8 space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                    <div>
                        <h1 className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                            My CVs
                        </h1>
                        <p className="text-[#64748B] text-base font-medium mt-1">
                            A complete library of all your generated resumes and specific variations.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 h-11 rounded-xl shadow-sm">
                        <Link href="/dashboard/builder">
                            <Plus className="h-5 w-5 mr-2" /> New CV
                        </Link>
                    </Button>
                </header>

                <main>
                    {(!resumes || resumes.length === 0) ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
                            <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Your CV Library is Empty</h3>
                            <p className="text-slate-500 text-base max-w-sm mb-8">
                                Create your first AI-optimized resume to start building your professional portfolio.
                            </p>
                            <Button asChild className="bg-slate-900 hover:bg-black text-white px-8 h-12 text-base rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                                <Link href="/dashboard/builder">
                                    <Plus className="h-5 w-5 mr-2" /> Create First CV
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
