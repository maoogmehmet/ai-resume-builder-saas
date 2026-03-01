'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { LinkIcon, Loader2, Copy, ExternalLink, Linkedin } from 'lucide-react'

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
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] p-2 rounded-xl text-sm">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${linkData.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {linkData.isActive ? 'Active' : 'Expired'}
                </span>
                <span className="font-mono text-zinc-400 truncate max-w-[200px] text-xs">{linkData.url}</span>
                <button onClick={copyToClipboard} className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all ml-auto">
                    <Copy className="h-3 w-3" />
                </button>
                <a href={linkData.url} target="_blank" rel="noopener noreferrer" className="h-7 w-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all">
                    <ExternalLink className="h-3 w-3" />
                </a>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkData.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
                >
                    <Linkedin className="h-3.5 w-3.5 fill-current" />
                </a>
            </div>
        )
    }

    return (
        <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="h-9 px-3 gap-2 font-bold text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LinkIcon className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Share Link</span>
        </button>
    )
}
