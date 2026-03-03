'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { LinkIcon, Loader2, Copy, ExternalLink, Linkedin } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

interface PublicLinkManagerProps {
    resumeId: string;
    template?: string;
    versionId?: string;
}

export function PublicLinkManager({ resumeId, template, versionId }: PublicLinkManagerProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [linkData, setLinkData] = useState<{ url: string, isActive: boolean } | null>(null)

    const handleGenerate = async () => {
        setIsLoading(true)
        toast.info('Generating public link...')

        try {
            const resp = await fetch('/api/resume/create-public-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId, template, versionId })
            })

            const data = await resp.json()
            if (!resp.ok) throw new Error(data.error)

            setLinkData(data)
            toast.success('Public link generated successfully')

        } catch (error: any) {
            toast.error('Failed to generate link', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (!linkData) return;
        navigator.clipboard.writeText(linkData.url)
        toast.success('Link copied to clipboard')
    }

    if (linkData) {
        return (
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-2xl text-sm">
                <div className="flex items-center gap-2 px-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${linkData.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {linkData.isActive ? 'Active' : 'Expired'}
                    </span>
                    <span className="font-mono text-zinc-500 truncate max-w-[120px] text-[10px] lowercase">{linkData.url.replace(/^https?:\/\//, '')}</span>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    <AnimatedGenerateButton
                        size="icon"
                        onClick={copyToClipboard}
                        className="h-8 w-8"
                        icon={<Copy className="h-3 w-3" />}
                    />
                    <AnimatedGenerateButton
                        size="icon"
                        href={linkData.url}
                        className="h-8 w-8"
                        icon={<ExternalLink className="h-3 w-3" />}
                    />
                    <AnimatedGenerateButton
                        size="icon"
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkData.url)}`}
                        className="h-8 w-8"
                        highlightHueDeg={210} // LinkedIn Blue
                        icon={<Linkedin className="h-3.5 w-3.5 fill-current" />}
                    />
                </div>
            </div>
        )
    }

    return (
        <AnimatedGenerateButton
            onClick={handleGenerate}
            disabled={isLoading}
            generating={isLoading}
            labelIdle="share"
            labelActive="linking..."
            size="sm"
            className="font-black italic lowercase"
            icon={<LinkIcon className="h-3.5 w-3.5" />}
        />
    )
}
