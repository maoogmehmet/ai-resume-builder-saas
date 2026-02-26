'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { History, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface ResumeVersion {
    id: string;
    job_title: string;
    company_name: string;
    ats_score: number;
    created_at: string;
    optimized_json: any;
}

interface ResumeVersionsProps {
    resumeId: string;
    onSelectVersion: (version: ResumeVersion) => void;
    currentVersionId?: string;
}

export function ResumeVersions({ resumeId, onSelectVersion, currentVersionId }: ResumeVersionsProps) {
    const [versions, setVersions] = useState<ResumeVersion[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchVersions() {
            try {
                const resp = await fetch(`/api/resume/versions?resumeId=${resumeId}`)
                const data = await resp.json()
                if (resp.ok) {
                    setVersions(data.versions)
                }
            } catch (error) {
                console.error('Failed to fetch versions', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVersions()
    }, [resumeId])

    if (isLoading) return <div className="p-4 text-center text-zinc-500">Loading versions...</div>
    if (versions.length === 0) return null

    return (
        <div className="grid gap-4 mt-6">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <History className="h-4 w-4" /> Optimization History
            </h3>
            <div className="grid gap-3">
                {versions.map((ver) => (
                    <Card
                        key={ver.id}
                        className={`cursor-pointer hover:border-zinc-300 transition-all ${currentVersionId === ver.id ? 'border-zinc-900 bg-white shadow-sm' : 'bg-zinc-50/50'}`}
                        onClick={() => onSelectVersion(ver)}
                    >
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md ${currentVersionId === ver.id ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-zinc-900 truncate max-w-[150px]">
                                        {ver.company_name || 'Generic'} - {ver.job_title || 'Role'}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                        {new Date(ver.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={ver.ats_score >= 80 ? 'default' : 'secondary'} className={ver.ats_score >= 80 ? 'bg-green-500' : ''}>
                                    {ver.ats_score}% ATS
                                </Badge>
                                {currentVersionId === ver.id && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
