import { FileText, Sparkles, Upload, ArrowRight, LayoutDashboard } from 'lucide-react'
import { MagicBuilderDialog } from '@/components/dashboard/magic-builder-dialog'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function BuilderPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-7xl mx-auto w-full p-8 px-12 pt-16 space-y-16">

                {/* Simplified Header */}
                <header className="flex flex-col items-baseline justify-between gap-4 border-b border-white/5 pb-10">
                    <div className="space-y-1">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic lowercase">
                            builder
                        </h1>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl">

                    {/* Option 1: AI Magic Builder */}
                    <div className="bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 transition-all duration-500 rounded-[2.5rem] p-12 flex flex-col items-start group relative overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="h-48 w-48 -mr-12 -mt-12" />
                        </div>

                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-white/10 group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="h-8 w-8 text-black" />
                        </div>

                        <div className="space-y-4 mb-12 relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Magic Builder</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[320px]">
                                Our neural network analyzes target roles to architect a high-performance, tailored resume with semantic optimization.
                            </p>
                        </div>

                        <div className="w-full relative z-10">
                            <MagicBuilderDialog />
                        </div>
                    </div>

                    {/* Option 2: LinkedIn Import */}
                    <div className="bg-[#0a0a0a] border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 transition-all duration-500 rounded-[2.5rem] p-12 flex flex-col items-start group relative overflow-hidden">
                        {/* Icon Watermark */}
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="h-48 w-48 -mr-12 -mt-12" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </div>

                        <div className="h-16 w-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </div>

                        <div className="space-y-4 mb-12 relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">LinkedIn Import</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[320px]">
                                Instant synchronization of your professional history. Seamlessly transition your LinkedIn presence into a high-end CV framework.
                            </p>
                        </div>

                        <div className="w-full relative z-10">
                            <LinkedinImportDialog />
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}
