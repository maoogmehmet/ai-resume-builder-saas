'use client'

import { useState, useEffect } from 'react'
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
            <div className="flex flex-col h-full w-full min-h-[800px] bg-[#0c0c0c] p-8 space-y-6 animate-pulse">
                <div className="h-10 w-48 bg-white/[0.04] rounded-lg" />
                <div className="h-4 w-full bg-white/[0.04] rounded" />
                <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
                <div className="h-8 w-40 bg-white/[0.04] rounded-lg mt-6" />
                <div className="h-24 w-full bg-white/[0.04] rounded-lg" />
                <div className="h-24 w-full bg-white/[0.04] rounded-lg" />
                <div className="h-24 w-full bg-white/[0.04] rounded-lg" />
            </div>
        )
    }

    const hasData = data && typeof data === 'object' && 'personal_info' in data

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full min-h-[800px] bg-[#0c0c0c] border border-dashed border-white/[0.06]">
                <p className="text-zinc-600 font-medium tracking-wide text-sm">Enter data on the left to see live preview</p>
            </div>
        )
    }

    return (
        <div className="h-full w-full bg-white rounded-lg overflow-hidden flex flex-col relative">
            {isGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="bg-[#141414] shadow-2xl border border-white/[0.08] rounded-xl px-4 py-3 flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                        <span className="font-semibold text-sm text-zinc-300">Updating PDF...</span>
                    </div>
                </div>
            )}
            {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full border-none" title="Resume Preview" />
            ) : null}
        </div>
    )
}
