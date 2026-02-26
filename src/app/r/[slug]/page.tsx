import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResumePreview } from '@/components/resume-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { PdfDownloadButton } from '@/components/pdf-download-button'

export default async function PublicResumePage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    const { data: link, error: linkError } = await supabase
        .from('public_links')
        .select('*, resumes(*), profiles(*)')
        .eq('slug', params.slug)
        .single()

    if (linkError || !link) {
        notFound()
    }

    if (!link.is_active) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-4 shadow-sm border-zinc-200">
                    <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Link Inactive</h1>
                    <p className="text-zinc-500 pb-4">This resume link has expired or been disabled by the owner.</p>
                    <Button asChild className="w-full bg-zinc-900"><Link href="/">Build your own with AI</Link></Button>
                </Card>
            </div>
        )
    }

    const resumeData = link.resumes?.ai_generated_json || link.resumes?.original_linkedin_json

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col">
            <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight">AI Resume Builder</span>
                </div>
                <div className="flex gap-4 items-center">
                    <PdfDownloadButton resumeData={resumeData} />
                    <Button asChild variant="default" className="bg-zinc-900 shadow-sm hidden sm:flex">
                        <Link href="/">Create your own resume</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 h-[calc(100vh-73px)] overflow-hidden">
                <div className="w-full h-full pb-20 aspect-[1/1.414] shadow-2xl relative mx-auto bg-white rounded-lg overflow-hidden border">
                    <ResumePreview data={resumeData} isLoading={false} />
                </div>
            </main>
        </div>
    )
}
