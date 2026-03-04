'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { toast } from 'sonner'
import { Linkedin, Check, X, Sparkles, Filter, BriefcaseBusiness, GraduationCap, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import Link from 'next/link'

// Mock Data structure expected from the backend
type ParsedData = {
    experiences: { id: string; title: string; company: string; dates: string; include: boolean }[];
    education: { id: string; school: string; degree: string; include: boolean }[];
    skills: { name: string; isDuplicate: boolean; include: boolean }[];
}

export default function LinkedinMappingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isFinalizing, setIsFinalizing] = useState(false)
    const [data, setData] = useState<ParsedData | null>(null)

    // Simulate fetching parsed data from the session/backend
    useEffect(() => {
        const fetchParsedData = async () => {
            // Simulate network delay for extracting data
            await new Promise(res => setTimeout(res, 2500))

            // Mock realistic data
            setData({
                experiences: [
                    { id: '1', title: 'Senior Software Engineer', company: 'Google', dates: '2020 - Present', include: true },
                    { id: '2', title: 'Software Engineer II', company: 'Microsoft', dates: '2018 - 2020', include: true },
                    { id: '3', title: 'Intern', company: 'Local Tech Co', dates: '2017 - 2017', include: false }, // Automatically excluded due to age/relevance ideally
                ],
                education: [
                    { id: '1', school: 'MIT', degree: 'MS Computer Science', include: true },
                    { id: '2', school: 'State University', degree: 'BS Computer Science', include: true },
                ],
                skills: [
                    { name: 'React', isDuplicate: false, include: true },
                    { name: 'TypeScript', isDuplicate: false, include: true },
                    { name: 'Node.js', isDuplicate: false, include: true },
                    { name: 'React.js', isDuplicate: true, include: false }, // Flagged duplicate
                    { name: 'JavaScript', isDuplicate: false, include: true },
                ]
            })
            setIsLoading(false)
        }

        fetchParsedData()
    }, [])

    const toggleExperience = (id: string) => {
        if (!data) return
        setData({
            ...data,
            experiences: data.experiences.map(exp => exp.id === id ? { ...exp, include: !exp.include } : exp)
        })
    }

    const toggleEducation = (id: string) => {
        if (!data) return
        setData({
            ...data,
            education: data.education.map(edu => edu.id === id ? { ...edu, include: !edu.include } : edu)
        })
    }

    const toggleSkill = (name: string) => {
        if (!data) return
        setData({
            ...data,
            skills: data.skills.map(skill => skill.name === name ? { ...skill, include: !skill.include } : skill)
        })
    }

    const handleFinalize = async () => {
        setIsFinalizing(true)
        try {
            // Simulate backend save
            await new Promise(res => setTimeout(res, 1500))

            toast.success('LinkedIn Data Imported', {
                description: 'Your verified data has been mapped into your new CV.'
            })
            // Redirect to editor (mocking a generated ID)
            router.push('/editor/linkedin-mock-id-123')

        } catch (error) {
            toast.error('Failed to finalize import')
            setIsFinalizing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-8"
                >
                    <div className="h-24 w-24 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.15)] relative">
                        <Linkedin className="h-10 w-10 text-blue-500 animate-pulse" />
                        <div className="absolute inset-0 border-2 border-blue-500/50 rounded-3xl border-t-transparent animate-spin" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-md">Extracting Profile</h2>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Parsing experiences, education, and skills matrix.</p>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 p-6 sm:p-12 pb-24 relative">

            {/* Header */}
            <header className="max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/builder" className="flex items-center justify-center h-12 w-12 bg-[#0a0a0a] border border-white/10 rounded-2xl text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-black border border-blue-500/40 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                <Linkedin className="h-4 w-4 text-blue-500 fill-current" strokeWidth={0} />
                            </div>
                            <h1 className="text-3xl font-black tracking-[-0.05em] italic lowercase text-white">
                                linkedin <span className="text-zinc-600 font-bold ml-1 text-lg tracking-normal uppercase">/ Mapping</span>
                            </h1>
                        </div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic ml-12">Verify and deduplicate extracted entities.</p>
                    </div>
                </div>

                <AnimatedGenerateButton
                    labelIdle="Finalize Import"
                    labelActive="Mapping Data..."
                    generating={isFinalizing}
                    onClick={handleFinalize}
                    icon={<ArrowRight className="h-4 w-4" />}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black italic tracking-wider rounded-full px-8 shrink-0"
                    highlightHueDeg={210}
                />
            </header>

            <main className="max-w-4xl mx-auto grid gap-8 relative z-10">

                {/* Experience Section */}
                <Card className="bg-[#050505] border-white/5 rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-[#080808]">
                        <BriefcaseBusiness className="h-5 w-5 text-blue-400" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-300 italic">Experience Nodes</h2>
                    </div>
                    <div className="p-6 grid gap-4">
                        {data.experiences.map((exp) => (
                            <div
                                key={exp.id}
                                onClick={() => toggleExperience(exp.id)}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${exp.include ? 'bg-[#0f0f0f] border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)] text-white' : 'bg-transparent border-white/5 text-zinc-600 hover:border-white/10'}`}
                            >
                                <div>
                                    <h4 className="font-bold text-base">{exp.title}</h4>
                                    <p className={`text-xs mt-1 ${exp.include ? 'text-zinc-400' : 'text-zinc-700'}`}>{exp.company} • {exp.dates}</p>
                                </div>
                                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${exp.include ? 'bg-blue-500 border-blue-500' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                    {exp.include && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Education Section */}
                <Card className="bg-[#050505] border-white/5 rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-[#080808]">
                        <GraduationCap className="h-5 w-5 text-emerald-400" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-300 italic">Academic Vectors</h2>
                    </div>
                    <div className="p-6 grid gap-4">
                        {data.education.map((edu) => (
                            <div
                                key={edu.id}
                                onClick={() => toggleEducation(edu.id)}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${edu.include ? 'bg-[#0f0f0f] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)] text-white' : 'bg-transparent border-white/5 text-zinc-600 hover:border-white/10'}`}
                            >
                                <div>
                                    <h4 className="font-bold text-base">{edu.degree}</h4>
                                    <p className={`text-xs mt-1 ${edu.include ? 'text-zinc-400' : 'text-zinc-700'}`}>{edu.school}</p>
                                </div>
                                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${edu.include ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                    {edu.include && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Skills Section */}
                <Card className="bg-[#050505] border-white/5 rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#080808]">
                        <div className="flex items-center gap-4">
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-300 italic">Analyzed Competencies</h2>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                            <Filter className="h-3 w-3" /> Auto-Deduplicated
                        </div>
                    </div>
                    <div className="p-8 flex flex-wrap gap-3">
                        {data.skills.map((skill, i) => (
                            <button
                                key={i}
                                onClick={() => toggleSkill(skill.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${skill.include
                                    ? 'bg-[#111111] border border-yellow-500/40 text-white shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                    : 'bg-transparent border border-white/5 text-zinc-600 hover:border-white/20'
                                    } ${skill.isDuplicate && !skill.include ? 'opacity-50 line-through decoration-red-500/50' : ''}`}
                            >
                                {skill.name}
                                {skill.include ? (
                                    <Check className="h-3 w-3 text-yellow-500" strokeWidth={3} />
                                ) : skill.isDuplicate ? (
                                    <span className="text-[8px] text-red-400 font-black tracking-widest uppercase ml-1">Dup</span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                </Card>

            </main>
        </div>
    )
}
