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
import { Linkedin, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

export function LinkedinImportDialog() {
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
                description: 'Your LinkedIn profile has been imported.',
            })

            setOpen(false)
            // Navigate to the dashboard or resume editor with the new ID
            router.push(`/editor/${data.resumeId}`)

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
                <Button variant="secondary" className="gap-2">
                    <Linkedin className="h-4 w-4" />
                    Import from LinkedIn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-transparent shadow-none">
                <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md">
                    <DialogHeader className="pt-8 px-6 pb-4">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900">
                            <Linkedin className="h-6 w-6 text-blue-600" />
                            Import LinkedIn Profile
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Paste your URL to instantly extract your work experience, education, and skills into a ATS-ready CV.
                        </DialogDescription>
                    </DialogHeader>
                    <CardContent className="px-6 pb-8 pt-2 space-y-5">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="linkedin-url" className="text-sm font-semibold text-zinc-700">
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
                                className={`h-12 bg-zinc-50 transition-all duration-200 ${error
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
                                        className="text-red-500 text-sm font-medium mt-1"
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

                        <Button
                            onClick={() => handleImport()}
                            className="w-full relative h-12 overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/20"
                            disabled={isLoading || !url.trim()}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isLoading ? (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center absolute inset-0 justify-center"
                                    >
                                        <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                                        Importing...
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="import"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center absolute inset-0 justify-center gap-2"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                        Start Import
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
