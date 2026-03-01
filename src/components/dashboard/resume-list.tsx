'use client'

import { useState } from 'react'

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

import { cn } from '@/lib/utils'

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

    const isCompleted = !!resume.pdf_url;

    return (
        <div className="group relative flex flex-col space-y-4">
            {/* Card Preview Area */}
            <div
                className="relative aspect-[1.5/1] w-full bg-[#111111] border border-white/5 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-lg group-hover:shadow-white/5 group-hover:border-white/10"
                onClick={() => router.push(`/editor/${resume.id}`)}
            >
                {/* Background Pattern Simulating a Resume Preview */}
                <div className="absolute inset-0 p-6 flex flex-col gap-3 opacity-20 pointer-events-none">
                    <div className="h-4 w-1/2 bg-zinc-600 rounded" />
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                    <div className="mt-4 h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-4 right-4 z-10">
                    <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
                        isCompleted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-white/10"
                    )}>
                        {isCompleted ? 'Completed' : 'Draft'}
                    </span>
                </div>

                {/* Top-Right Menu Button */}
                <div className="absolute top-3 right-3 z-20">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full">
                                <span className="text-lg">•••</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-zinc-300 shadow-2xl rounded-xl p-1 pb-2">
                            <DropdownMenuItem onClick={() => router.push(`/editor/${resume.id}`)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer text-[13px] group">
                                <Eye className="h-4 w-4 text-zinc-500 group-hover:text-white" /> View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/editor/${resume.id}`)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer text-[13px] group">
                                <Pencil className="h-4 w-4 text-zinc-500 group-hover:text-white" /> Edit template
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsRenameOpen(true)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer text-[13px] group">
                                <Type className="h-4 w-4 text-zinc-500 group-hover:text-white" /> Rename template
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer text-[13px] group">
                                <Copy className="h-4 w-4 text-zinc-500 group-hover:text-white" /> Duplicate template
                            </DropdownMenuItem>
                            <div className="my-1.5 h-px bg-white/5" />
                            <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-400/10 rounded-lg cursor-pointer text-[13px] group">
                                <Trash2 className="h-4 w-4 text-red-500/70" /> Remove template
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Metadata Below Card */}
            <div className="flex flex-col gap-1 px-1">
                <h4 className="font-bold text-white text-lg tracking-tight truncate group-hover:text-white transition-colors duration-200">
                    {resume.title}
                </h4>
                <p className="text-zinc-500 text-sm font-mono tracking-tight truncate">
                    {resume.title.toLowerCase().replace(/\s+/g, '-') || 'untitled-cv'}
                </p>
            </div>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="bg-black border-white/10 text-white sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Rename CV</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">New Title</Label>
                            <Input
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                className="bg-[#111111] border-white/5 focus-visible:ring-1 focus-visible:ring-white/20 text-white h-11"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)} className="hover:bg-white/5 text-zinc-400">Cancel</Button>
                        <Button onClick={handleRename} disabled={isLoading} className="bg-white text-black hover:bg-zinc-200 font-bold px-6">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function ResumeList({ initialResumes }: { initialResumes: Resume[] }) {
    const [resumes, setResumes] = useState<Resume[]>(initialResumes)

    const refreshResumes = async () => {
        const res = await fetch('/api/resume/list')
        const data = await res.json()
        setResumes(data.resumes)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onRefresh={refreshResumes} />
            ))}
        </div>
    )
}
