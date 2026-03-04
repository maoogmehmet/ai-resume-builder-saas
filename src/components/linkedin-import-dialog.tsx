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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { Linkedin, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export function LinkedinImportDialog({ customTrigger }: { customTrigger?: React.ReactNode }) {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleImport = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setError(null)

        if (!url.trim()) {
            setError('Please enter a LinkedIn URL.')
            return
        }

        if (!url.includes('linkedin.com/in/')) {
            setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username).')
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
                description: 'Please verify the extracted data...',
            })

            setOpen(false)
            // Redirect to mapping Validation UI
            router.push('/dashboard/linkedin-mapping')
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred.')
            toast.error('Import Error', {
                description: error.message || 'An unexpected error occurred.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const errorVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' as const } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' as const } },
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {customTrigger ? (
                    customTrigger
                ) : (
                    <AnimatedGenerateButton
                        labelIdle="Import from LinkedIn"
                        icon={<Linkedin className="h-4 w-4" />}
                        size="md"
                        className="w-auto"
                        noMinWidth
                    />
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-transparent shadow-none">
                <Card className="shadow-2xl border-white/10 bg-black/90 backdrop-blur-md">
                    <DialogHeader className="pt-8 px-6 pb-4">
                        <DialogTitle className="text-xl font-black italic tracking-tighter flex items-center gap-3 text-white uppercase">
                            <div className="p-2 bg-blue-600/10 rounded-xl">
                                <Linkedin className="h-6 w-6 text-blue-500" />
                            </div>
                            LinkedIn Import
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">
                            Paste your profile URL to instantly extract your professional history into an ATS-ready framework.
                        </DialogDescription>
                    </DialogHeader>
                    <CardContent className="px-6 pb-8 pt-2 space-y-6">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="linkedin-url" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                Profile URL
                            </Label>
                            <Input
                                id="linkedin-url"
                                type="url"
                                placeholder="https://www.linkedin.com/in/username"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value)
                                    setError(null)
                                }}
                                className={`h-12 bg-black/50 border-white/5 text-white font-bold transition-all duration-200 ${error
                                    ? 'border-red-500 focus-visible:ring-red-500'
                                    : 'focus-visible:ring-blue-600'
                                    }`}
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleImport()
                                }}
                            />
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1"
                                        variants={errorVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <AnimatedGenerateButton
                            labelIdle="Start Magic Import"
                            labelActive="Gathering Profile Data..."
                            generating={isLoading}
                            onClick={() => handleImport()}
                            disabled={isLoading || !url.trim()}
                            size="lg"
                            highlightHueDeg={210}
                            className="w-full h-14"
                            icon={<Linkedin className="h-5 w-5" />}
                        />
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
