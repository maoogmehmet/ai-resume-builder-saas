'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LinkIcon, Loader2, Copy, ExternalLink, Linkedin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PublicLinkManagerProps {
    resumeId: string;
}

export function PublicLinkManager({ resumeId }: PublicLinkManagerProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [linkData, setLinkData] = useState<{ url: string, isActive: boolean } | null>(null)

    const handleGenerate = async () => {
        setIsLoading(true)
        toast.info('Generating public link...')

        try {
            const resp = await fetch('/api/resume/create-public-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId })
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
            <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-md border text-sm">
                <Badge className={linkData.isActive ? 'bg-green-500' : 'bg-red-500 hover:bg-red-600'}>
                    {linkData.isActive ? 'Active' : 'Expired'}
                </Badge>
                <span className="font-mono truncate max-w-[200px]">{linkData.url}</span>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-6 w-6 ml-auto">
                    <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                    <a href={linkData.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isLoading}
            className="gap-2 text-zinc-600 font-medium"
            size="sm"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
            Share Link
        </Button>
    )
}
