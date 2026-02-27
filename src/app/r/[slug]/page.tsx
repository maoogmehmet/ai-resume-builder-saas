import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ResumePreview } from '@/components/resume-preview'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PdfDownloadButton } from '@/components/pdf-download-button'
import { PresentationOverlay } from '@/components/presentation-overlay'

export default async function PublicResumePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch link with joined resume and profile
    const { data: link, error: linkError } = await supabase
        .from('public_links')
        .select('*, resumes(*), profiles(*), version:resume_versions(*)')
        .eq('slug', slug)
        .single()

    if (linkError || !link) {
        notFound()
    }

    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === link.profiles.id

    // Check trial/subscription status
    const isPremium = ['active', 'trialing'].includes(link.profiles?.subscription_status || '')

    // Check if link is older than 7 days
    const linkCreatedAt = new Date(link.created_at)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isLinkOlderThan7Days = linkCreatedAt < sevenDaysAgo;

    const isTrialEndedForLegacy = link.profiles?.trial_end_date && new Date(link.profiles.trial_end_date) < new Date()

    // It's expired if user is not premium AND the link has aged past 7 days (or legacy manual deactivation/trial end)
    const showExpired = !link.is_active || (!isPremium && (isLinkOlderThan7Days || isTrialEndedForLegacy))

    // Increment view count (fire and forget) if active
    if (!showExpired) {
        supabase
            .from('public_links')
            .update({
                view_count: (link.view_count || 0) + 1,
                last_viewed_at: new Date().toISOString()
            })
            .eq('id', link.id)
            .then()
    }

    if (showExpired) {
        if (user) {
            redirect('/dashboard/upgrade')
        } else {
            redirect('/auth/signup?reason=link_expired')
        }
    }

    // Use versioned JSON if specified, otherwise main resume JSON
    const resumeData = link.version?.optimized_json || link.resumes?.ai_generated_json || link.resumes?.original_linkedin_json
    const template = link.template || 'classic'

    // Fetch the automated pitch deck (if any)
    const { data: pitchDeck } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('resume_id', link.resumes?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    let slides = null;
    if (pitchDeck && pitchDeck.content) {
        try {
            slides = JSON.parse(pitchDeck.content);
        } catch (e) { /* ignore */ }
    }

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
                    <PresentationOverlay slides={slides} />
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
