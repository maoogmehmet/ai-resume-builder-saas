'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    MoreVertical,
    Pencil,
    Eye,
    Trash2,
    Copy,
    Type,
    Loader2,
    Sparkles,
    DownloadCloud,
    LinkIcon
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MagicBuilderDialog } from './magic-builder-dialog'

interface Resume {
    id: string;
    title: string;
    updated_at: string;
    ai_generated_json: any;
    pdf_url?: string;
}

export function ResumeCard({ resume, onRefresh }: { resume: Resume, onRefresh: () => void }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(resume.title)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        setIsLoading(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', resumeId: resume.id })
            })
            if (!res.ok) throw new Error('Failed to delete')
            toast.success('Resume deleted')
            onRefresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDuplicate = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'duplicate', resumeId: resume.id })
            })
            if (!res.ok) throw new Error('Failed to duplicate')
            toast.success('Resume duplicated')
            onRefresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRename = async () => {
        if (!newTitle.trim()) return
        setIsLoading(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rename', resumeId: resume.id, title: newTitle })
            })
            if (!res.ok) throw new Error('Failed to rename')
            toast.success('Resume renamed')
            setIsRenameOpen(false)
            onRefresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Card className="group flex flex-col border-zinc-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden bg-white">
                <CardHeader className="p-0 border-b relative">
                    <div className="aspect-[16/9] bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center overflow-hidden relative">
                        {resume.pdf_url ? (
                            <FileText className="h-16 w-16 text-blue-500/50 group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <FileText className="h-16 w-16 text-zinc-300 group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300" />
                    </div>
                    {/* Floating PDF Badge */}
                    {resume.pdf_url && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-sm">PDF Ready</Badge>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-5 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 overflow-hidden">
                            <h3 className="font-bold text-lg text-zinc-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                                {resume.title}
                            </h3>
                            <p className="text-xs font-semibold text-zinc-400 capitalize flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                                Edited {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-600 -mr-2 shrink-0" onClick={() => setIsRenameOpen(true)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 bg-white space-y-3 flex-col">
                    <div className="w-full h-px bg-zinc-100 mb-2 mt-0" />
                    <div className="flex items-center justify-between w-full">
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg shadow-sm shadow-blue-600/20 transition-all">
                            <Link href={`/editor/${resume.id}`}>
                                Edit CV
                            </Link>
                        </Button>
                        <div className="flex items-center gap-1.5">
                            {resume.pdf_url && (
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-colors tooltip-trigger" title="Download PDF" onClick={() => window.open(resume.pdf_url, '_blank')}>
                                    <DownloadCloud className="h-4 w-4" />
                                </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors tooltip-trigger" title="Duplicate CV" onClick={handleDuplicate} disabled={isLoading}>
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors tooltip-trigger" title="Delete CV" onClick={handleDelete} disabled={isLoading}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Resume</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">New Title</Label>
                            <Input
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename} disabled={isLoading}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export function ResumeList({ initialResumes }: { initialResumes: Resume[] }) {
    const router = useRouter()
    const [resumes, setResumes] = useState<Resume[]>(initialResumes)
    const [isCreating, setIsCreating] = useState(false)

    const refreshResumes = async () => {
        const res = await fetch('/api/resume/list')
        const data = await res.json()
        setResumes(data.resumes)
    }

    const createBlank = async () => {
        setIsCreating(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create_blank' })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            router.push(`/editor/${data.resumeId}`)
            toast.success('Created Blank Resume')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onRefresh={refreshResumes} />
            ))}
        </div>
    )
}
