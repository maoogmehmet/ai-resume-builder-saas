'use client'

import { Download, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { CoverLetterPDF } from '@/components/dashboard/cover-letter-pdf'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { cn } from '@/lib/utils'

interface CoverLetterDownloadButtonProps {
    letterData: any;
    profileData: any;
    disabled?: boolean;
    className?: string;
    variant?: string;
}

export function CoverLetterDownloadButton({ letterData, profileData, disabled, className = "", variant }: CoverLetterDownloadButtonProps) {
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
                        router.push('/#pricing')
                        return;
                    }
                }
            }

            if (!letterData || !profileData) throw new Error('Missing letter or profile data')

            const doc = <CoverLetterPDF
                fullName={profileData.full_name || 'My Name'}
                email={profileData.email || 'myemail@example.com'}
                targetRole={letterData.job_title}
                companyName={letterData.company_name}
                content={letterData.content}
                date={new Date(letterData.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            />
            const blob = await pdf(doc).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Cover_Letter_${letterData.company_name.replace(/\s+/g, '_')}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast.success('Successfully downloaded cover letter!')
        } catch (error: any) {
            toast.error('Error downloading', { description: error.message })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <AnimatedGenerateButton
            onClick={handleDownload}
            disabled={isDownloading || disabled || !letterData}
            generating={isDownloading}
            labelIdle="get letter"
            labelActive="exporting..."
            size="sm"
            className={cn("font-black italic lowercase h-10 px-8", className)}
            icon={<Download className="h-4 w-4" />}
        />
    )
}
