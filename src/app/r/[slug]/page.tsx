import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ResumePreview } from '@/components/resume-preview'
import { Logo } from '@/components/ui/logo'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
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
        <div className="min-h-screen bg-black flex flex-col selection:bg-white/10 font-sans">
            <header className="bg-black/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 px-6 sm:px-12 py-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                        <Logo className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tighter leading-none text-white italic lowercase">novatypalcv</span>
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1 italic">Verified Professional</span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <PresentationOverlay slides={slides} />
                    <PdfDownloadButton resumeData={resumeData} template={template as any} />
                    <AnimatedGenerateButton
                        href="/"
                        labelIdle="Build Yours"
                        className="hidden sm:flex h-10 px-8 font-black italic lowercase"
                    />
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-12 lg:p-20 overflow-hidden">
                <div className="w-full h-full pb-24 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative mx-auto bg-white rounded-[3rem] overflow-hidden border border-white/5">
                    <ResumePreview data={resumeData} isLoading={false} template={template as any} />
                </div>
                <div className="mt-12 text-center text-zinc-700 font-black text-[9px] uppercase tracking-[0.5em] italic opacity-40">
                    Neural Intelligence Protocol • Claude 3.5 Sonnet Synthesis
                </div>
            </main>
        </div>
    )
}
