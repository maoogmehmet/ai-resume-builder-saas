'use client'

import { PDFViewer } from '@react-pdf/renderer'
import { ResumePDFDocument } from '@/lib/pdf-generator'
import { Card } from './ui/card'
import { useState, useEffect } from 'react'
import { Skeleton } from './ui/skeleton'

interface ResumePreviewProps {
    data: any;
    isLoading: boolean;
    template?: 'classic' | 'modern';
}

export function ResumePreview({ data, isLoading, template = 'classic' }: ResumePreviewProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (isLoading || !isClient) {
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

    // Check if data has at least something to show
    const hasData = data && (data.personal_info?.full_name || data.experience?.length > 0 || data.education?.length > 0)

    if (!hasData) {
        return (
            <Card className="flex flex-col items-center justify-center h-full w-full min-h-[800px] border-zinc-200 border-dashed bg-zinc-50/50">
                <p className="text-zinc-500 font-medium tracking-wide">Enter data on the left to see live preview</p>
            </Card>
        )
    }

    return (
        <div className="h-full w-full bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 shadow-inner flex flex-col">
            <PDFViewer showToolbar={false} className="w-full h-full border-none">
                <ResumePDFDocument data={data} template={template} />
            </PDFViewer>
        </div>
    )
}
