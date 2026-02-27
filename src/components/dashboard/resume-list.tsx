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
            <Card className="group overflow-hidden flex flex-col border-zinc-200 hover:border-zinc-300 hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-0 border-b relative">
                    <div className="aspect-[1.5/1] bg-zinc-100 flex items-center justify-center overflow-hidden">
                        <FileText className="h-20 w-20 text-zinc-200 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
                    </div>
                    <div className="absolute top-4 right-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {resume.pdf_url && (
                                    <>
                                        <DropdownMenuItem onClick={() => window.open(resume.pdf_url, '_blank')}>
                                            <DownloadCloud className="h-4 w-4 mr-2" /> Download PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                            navigator.clipboard.writeText(resume.pdf_url!)
                                            toast.success('PDF Link Copied to Clipboard')
                                        }}>
                                            <LinkIcon className="h-4 w-4 mr-2" /> Copy PDF Link
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                                    <Type className="h-4 w-4 mr-2" /> Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDuplicate}>
                                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-6 flex-1">
                    <h3 className="font-bold text-lg text-zinc-900 truncate leading-tight">{resume.title}</h3>
                    <div className="flex items-center gap-3 mt-3">
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-medium">
                            {resume.ai_generated_json ? 'AI Optimized' : 'Raw Import'}
                        </Badge>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                            Edited {new Date(resume.updated_at).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-3">
                    <Button asChild variant="outline" size="sm" className="flex-1 font-semibold group-hover:bg-zinc-50 transition-colors">
                        <Link href={`/editor/${resume.id}`}>
                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1 bg-zinc-900 group-hover:bg-black transition-colors">
                        <Link href={`/editor/${resume.id}`}>
                            <Eye className="w-3.5 h-3.5 mr-2" /> Preview
                        </Link>
                    </Button>
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
