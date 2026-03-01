'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { ResumeMagicCard } from './resume-card-magic'

interface Resume {
    id: string;
    title: string;
    updated_at: string;
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
            <ResumeMagicCard
                resume={resume}
                onEdit={() => router.push(`/editor/${resume.id}`)}
                onRename={() => setIsRenameOpen(true)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
            />

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="bg-black border-white/10 text-white sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Rename Resume</DialogTitle>
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
        </>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 pb-20">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onRefresh={refreshResumes} />
            ))}
        </div>
    )
}
