'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { Wand2, CheckCircle2, Sparkles, Loader2 } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

const LOADING_STEPS = [
    { label: 'Analyzing target role requirements...', duration: 4000 },
    { label: 'Crafting your executive summary...', duration: 6000 },
    { label: 'Building experience bullets with impact metrics...', duration: 8000 },
    { label: 'Optimizing for ATS systems...', duration: 5000 },
    { label: 'Polishing and finalizing your resume...', duration: 99999 },
]

export function MagicBuilderDialog() {
    const [role, setRole] = useState('')
    const [skills, setSkills] = useState('')
    const [accomplishments, setAccomplishments] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState(0)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    // Animate through loading steps while API call runs
    useEffect(() => {
        if (!isLoading) {
            setLoadingStep(0)
            return
        }
        let currentStep = 0
        const advance = () => {
            if (currentStep < LOADING_STEPS.length - 1) {
                currentStep++
                setLoadingStep(currentStep)
                setTimeout(advance, LOADING_STEPS[currentStep].duration)
            }
        }
        const timer = setTimeout(advance, LOADING_STEPS[0].duration)
        return () => clearTimeout(timer)
    }, [isLoading])

    const handleMagicBuild = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!role.trim()) {
            toast.error('Please enter a target role')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/resume/magic-build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, skills, accomplishments }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Failed to generate resume')

            toast.success('🎉 AI Resume Ready!', { description: 'Your tailored resume has been created. Opening editor...' })
            setOpen(false)
            router.push(`/editor/${data.resumeId}`)

        } catch (error: any) {
            toast.error('Generation Failed', {
                description: error.message || 'Please try again.',
                duration: 6000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!isLoading) setOpen(v) }}>
            <DialogTrigger asChild>
                <AnimatedGenerateButton
                    labelIdle="New AI Resume"
                    highlightHueDeg={45}
                    className="hover:scale-[1.02] transition-all"
                />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-[0_30px_90px_rgba(0,0,0,0.3)] rounded-[2.5rem] bg-zinc-950">
                {/* Dark header */}
                <DialogHeader className="p-0">
                    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fbbf24 0%, transparent 50%)' }} />
                        <div className="absolute top-0 right-0 p-4">
                            <Badge className="bg-yellow-400/20 text-yellow-500 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">Elite Access</Badge>
                        </div>
                        <div className="h-12 w-12 bg-white/10 rounded-[1.25rem] border border-white/10 flex items-center justify-center mb-5 shadow-2xl relative z-10">
                            <Sparkles className="h-6 w-6 text-yellow-400" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white mb-1 leading-none relative z-10">AI Magic Lab</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm font-medium relative z-10">
                            Our AI engine crafts high-impact resume drafts in seconds.
                        </DialogDescription>
                        <div className="flex items-center gap-2 mt-4 relative z-10">
                            <div className="flex -space-x-1.5">
                                <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-zinc-900 flex items-center justify-center text-[7px] font-black text-white">G</div>
                                <div className="h-5 w-5 rounded-full bg-orange-600 border-2 border-zinc-900 flex items-center justify-center text-[7px] font-black text-white">A</div>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Powered by Gemini &amp; Anthropic</span>
                        </div>
                    </div>
                </DialogHeader>

                {/* Loading overlay */}
                {isLoading && (
                    <div className="bg-white p-8 flex flex-col items-center text-center gap-6">
                        <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-2xl">
                            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                        </div>
                        <div>
                            <p className="font-black text-zinc-900 text-lg mb-1">Building your resume...</p>
                            <p className="text-zinc-400 text-sm font-medium">This usually takes 20–40 seconds</p>
                        </div>
                        <div className="w-full space-y-2.5">
                            {LOADING_STEPS.map((step, i) => (
                                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${i === loadingStep ? 'bg-zinc-900 text-white' : i < loadingStep ? 'opacity-50' : 'opacity-20'}`}>
                                    {i < loadingStep ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                                    ) : i === loadingStep ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-yellow-400 shrink-0" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-zinc-300 shrink-0" />
                                    )}
                                    <span className={`text-sm font-semibold text-left ${i === loadingStep ? 'text-white' : 'text-zinc-600'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form */}
                {!isLoading && (
                    <form onSubmit={handleMagicBuild} className="p-8 bg-white grid gap-6 rounded-t-[2.5rem] -mt-5 relative z-10">
                        <div className="grid gap-2">
                            <Label htmlFor="role" className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Target Position *</Label>
                            <Input
                                id="role"
                                placeholder="e.g. Senior Product Manager, Lead Engineer"
                                className="rounded-2xl h-12 border-zinc-100 bg-zinc-50 focus:bg-white transition-all font-medium px-4 shadow-inner"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="skills" className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">Key Expertise</Label>
                            <Input
                                id="skills"
                                placeholder="e.g. React, Leadership, AI, Cloud, Strategy"
                                className="rounded-2xl h-12 border-zinc-100 bg-zinc-50 focus:bg-white transition-all font-medium px-4 shadow-inner"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc" className="flex justify-between text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                                Signature Achievement
                                <span className="normal-case font-normal tracking-normal">{accomplishments.length}/500</span>
                            </Label>
                            <Textarea
                                id="desc"
                                maxLength={500}
                                placeholder="Describe your most impactful achievement — include numbers, scale, and results..."
                                className="rounded-2xl min-h-[110px] border-zinc-100 bg-zinc-50 focus:bg-white transition-all p-4 font-medium resize-none shadow-inner"
                                value={accomplishments}
                                onChange={(e) => setAccomplishments(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 pt-1">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 h-12 rounded-2xl font-bold text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <AnimatedGenerateButton
                                type="submit"
                                disabled={!role.trim()}
                                generating={isLoading}
                                labelIdle="Ignite AI Build"
                                labelActive="Igniting..."
                                highlightHueDeg={45}
                                className="flex-[2] h-12"
                            />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
