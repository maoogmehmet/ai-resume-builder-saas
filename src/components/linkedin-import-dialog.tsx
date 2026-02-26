'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { Linkedin } from 'lucide-react'

export function LinkedinImportDialog() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url.includes('linkedin.com/in/')) {
            toast.error('Invalid URL', {
                description: 'Please enter a valid LinkedIn profile URL.',
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/linkedin/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileUrl: url }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to import profile')
            }

            toast.success('Successfully imported!', {
                description: 'Your LinkedIn profile has been imported.',
            })

            setOpen(false)
            // Navigate to the dashboard or resume editor with the new ID
            router.push(`/dashboard/resume/${data.resumeId}`)

        } catch (error: any) {
            toast.error('Import Error', {
                description: error.message || 'An unexpected error occurred.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                    <Linkedin className="h-4 w-4" />
                    Import from LinkedIn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import your Profile</DialogTitle>
                    <DialogDescription>
                        Paste your LinkedIn profile URL below. We'll extract your work experience, education, and skills.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleImport}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                            <Input
                                id="linkedin-url"
                                placeholder="https://www.linkedin.com/in/username"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Importing...' : 'Start Import'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
