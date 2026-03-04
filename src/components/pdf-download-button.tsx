'use client'

import { Download, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { ResumePDFDocument } from '@/lib/pdf-generator'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { LinkedinExportGuide } from '@/components/linkedin-export-guide'

interface PdfDownloadButtonProps {
    resumeData: any;
    disabled?: boolean;
    template?: 'classic' | 'modern' | 'executive';
    isAtsSafe?: boolean;
}

export function PdfDownloadButton({ resumeData, disabled, template = 'classic', isAtsSafe = false }: PdfDownloadButtonProps) {
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

            const doc = <ResumePDFDocument data={resumeData} template={template} isAtsSafe={isAtsSafe} />
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
        <div className="flex items-center gap-2">
            <AnimatedGenerateButton
                onClick={handleDownload}
                disabled={isDownloading || disabled || !resumeData}
                generating={isDownloading}
                labelIdle="get pdf"
                labelActive="exporting..."
                size="sm"
                className="font-black italic lowercase"
                icon={<Download className="h-3.5 w-3.5" />}
            />
            <LinkedinExportGuide />
        </div>
    )
}
