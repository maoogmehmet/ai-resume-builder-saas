'use client'

import { Card } from './ui/card'
import { useState, useEffect } from 'react'
import { Skeleton } from './ui/skeleton'
import { Loader2 } from 'lucide-react'

interface ResumePreviewProps {
    data: any;
    isLoading: boolean;
    template?: 'classic' | 'modern' | 'executive';
}

export function ResumePreview({ data, isLoading, template = 'classic' }: ResumePreviewProps) {
    const [isClient, setIsClient] = useState(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient || !data || !('personal_info' in data)) return

        let isMounted = true;
        const generatePdf = async () => {
            setIsGenerating(true)
            try {
                // Completely dynamic native import of both the renderer and the component
                // This bypasses Next.js 14 Turbopack SSR + next/dynamic wrapper bugs entirely
                const { pdf } = await import('@react-pdf/renderer');
                const { ResumePDFDocument } = await import('@/lib/pdf-generator');

                const doc = <ResumePDFDocument data={data} template={template} />;
                const blob = await pdf(doc).toBlob();

                if (isMounted) {
                    setPdfUrl(URL.createObjectURL(blob))
                }
            } catch (e) {
                console.error('PDF Generation error:', e)
            } finally {
                if (isMounted) setIsGenerating(false)
            }
        }

        const timeoutId = setTimeout(generatePdf, 500);

        return () => {
            isMounted = false
            clearTimeout(timeoutId)
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, template, isClient])

    if (!isClient || isLoading) {
        return (
            <Card className="flex flex-col h-full w-full min-h-[800px] border-zinc-200 shadow-sm bg-white p-6">
                <Skeleton className="h-10 w-[200px] mb-8" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-12" />
                <Skeleton className="h-8 w-[150px] mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
            </Card>
        )
    }

    const hasData = data && typeof data === 'object' && 'personal_info' in data

    if (!hasData) {
        return (
            <Card className="flex flex-col items-center justify-center h-full w-full min-h-[800px] border-zinc-200 border-dashed bg-zinc-50/50">
                <p className="text-zinc-500 font-medium tracking-wide">Enter data on the left to see live preview</p>
            </Card>
        )
    }

    return (
        <div className="h-full w-full bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 shadow-inner flex flex-col relative">
            {isGenerating && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="bg-white shadow-xl border border-zinc-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-900" />
                        <span className="font-semibold text-sm text-zinc-800">Updating PDF...</span>
                    </div>
                </div>
            )}
            {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full border-none" title="Resume Preview" />
            ) : null}
        </div>
    )
}
