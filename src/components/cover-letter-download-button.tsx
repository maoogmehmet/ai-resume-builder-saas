'use client'

import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { CoverLetterPDF } from '@/components/dashboard/cover-letter-pdf'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CoverLetterDownloadButtonProps {
    letterData: any;
    profileData: any;
    disabled?: boolean;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    className?: string;
}

export function CoverLetterDownloadButton({ letterData, profileData, disabled, variant = "outline", className = "" }: CoverLetterDownloadButtonProps) {
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
                        router.push('/dashboard/upgrade')
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
        <Button
            variant={variant}
            onClick={handleDownload}
            disabled={isDownloading || disabled || !letterData}
            className={`gap-2 ${className}`}
        >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
        </Button>
    )
}
