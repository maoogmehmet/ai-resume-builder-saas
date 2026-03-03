'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, FileText, CheckCircle2 } from 'lucide-react'

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

    if (isLoading) return <div className="p-4 text-center text-zinc-700 font-black uppercase tracking-widest text-[9px] italic animate-pulse">Scanning Timelines...</div>
    if (versions.length === 0) return null

    return (
        <div className="grid gap-6 mt-12 pb-10">
            <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] flex items-center gap-3 italic mb-2">
                <History className="h-3.5 w-3.5" /> Optimization History
            </h3>
            <div className="grid gap-4">
                {versions.map((ver) => (
                    <Card
                        key={ver.id}
                        className={`cursor-pointer border transition-all duration-500 rounded-[2rem] overflow-hidden group ${currentVersionId === ver.id ? 'border-white/20 bg-white/[0.04] shadow-2xl' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                        onClick={() => onSelectVersion(ver)}
                    >
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition-all duration-500 ${currentVersionId === ver.id ? 'bg-white text-black border-transparent scale-105 shadow-2xl shadow-white/10' : 'bg-white/5 border-white/5 group-hover:bg-white/10 text-zinc-500 group-hover:text-white'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className={`font-black text-sm tracking-tighter truncate max-w-[180px] italic uppercase leading-none mb-1.5 transition-colors ${currentVersionId === ver.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                        {ver.company_name || 'Generic'}
                                    </h4>
                                    <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest italic leading-none">
                                        {ver.job_title || 'Expert Analysis'} — {new Date(ver.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={`font-black text-[9px] px-3 py-1 uppercase italic border-white/5 ${ver.ats_score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-zinc-500'}`}>
                                    {ver.ats_score}% Match
                                </Badge>
                                {currentVersionId === ver.id && <CheckCircle2 className="h-4 w-4 text-emerald-500 shadow-2xl shadow-emerald-500/50" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
