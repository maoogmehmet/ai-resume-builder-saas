'use client'

import { Download, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { ResumePDFDocument } from '@/lib/pdf-generator'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface PdfDownloadButtonProps {
    resumeData: any;
    disabled?: boolean;
    template?: 'classic' | 'modern' | 'executive';
}

export function PdfDownloadButton({ resumeData, disabled, template = 'classic' }: PdfDownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('trial_end_date, subscription_status').eq('id', user.id).single();
                if (profile) {
                    const isTrialActive = new Date(profile.trial_end_date) > new Date();
                    const isSubscribed = profile.subscription_status === 'active' || profile.subscription_status === 'trialing';
                    if (!isTrialActive && !isSubscribed) {
                        toast.error('Trial expired', { description: 'Please upgrade to download PDFs' })
                        router.push('/upgrade')
                        return;
                    }
                }
            }

            if (!resumeData) throw new Error('No resume data to download')

            const doc = <ResumePDFDocument data={resumeData} template={template} />
            const blob = await pdf(doc).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `resume_${new Date().getTime()}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast.success('Successfully downloaded resume')
        } catch (error: any) {
            toast.error('Error downloading', { description: error.message })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading || disabled || !resumeData}
            className="h-9 px-3 gap-2 font-bold text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center disabled:opacity-50"
        >
            {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Download PDF</span>
        </button>
    )
}
