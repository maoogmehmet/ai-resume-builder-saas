import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResumePreview } from '@/components/resume-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download, Globe, Sparkles } from 'lucide-react'
import { PdfDownloadButton } from '@/components/pdf-download-button'

export default async function PublicResumePage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    // Fetch link with joined resume and profile
    const { data: link, error: linkError } = await supabase
        .from('public_links')
        .select('*, resumes(*), profiles(*), version:resume_versions(*)')
        .eq('slug', params.slug)
        .single()

    if (linkError || !link) {
        notFound()
    }

    if (!link.is_active) {
        return (
            <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-6 sm:p-12">
                <Card className="max-w-md w-full p-10 text-center space-y-6 shadow-2xl border-zinc-200 rounded-[2rem] bg-white">
                    <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-100">
                        <Globe className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Link Expired</h1>
                        <p className="text-zinc-500 text-lg">This professional profile is no longer public or the subscription has lapsed.</p>
                    </div>
                    <Button asChild className="w-full h-14 rounded-2xl bg-zinc-900 font-bold text-lg shadow-lg hover:bg-black transition-all">
                        <Link href="/">Create Your AI Resume</Link>
                    </Button>
                </Card>
            </div>
        )
    }

    // Use versioned JSON if specified, otherwise main resume JSON
    const resumeData = link.version?.optimized_json || link.resumes?.ai_generated_json || link.resumes?.original_linkedin_json
    const template = link.template || 'classic'

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col selection:bg-zinc-900 selection:text-white">
            <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 sm:px-12 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tighter leading-none text-zinc-900">AI RESUME.</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Verified Profile</span>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <PdfDownloadButton resumeData={resumeData} template={template as any} />
                    <Button asChild variant="default" className="bg-zinc-900 shadow-xl hidden sm:flex h-10 px-6 font-bold rounded-xl hover:bg-black">
                        <Link href="/">Build Yours Free</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-10 lg:p-16 h-[calc(100vh-73px)] overflow-hidden">
                <div className="w-full h-full pb-24 shadow-2xl relative mx-auto bg-white rounded-3xl overflow-hidden border border-zinc-200">
                    <ResumePreview data={resumeData} isLoading={false} template={template as any} />
                </div>
                <div className="mt-8 text-center text-zinc-400 font-bold text-xs uppercase tracking-[0.2em]">
                    Powered by AI Resume Builder • Claude 3.5 Sonnet
                </div>
            </main>
        </div>
    )
}
