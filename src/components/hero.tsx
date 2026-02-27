import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative pt-24 sm:pt-32 pb-16 lg:pb-32 overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100/50 via-white to-white -z-10" />

            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="flex flex-col items-center text-center space-y-8 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Sparkles className="h-3 w-3 fill-white" />
                        Powered by Claude 3.5 Sonnet
                    </div>

                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.9] sm:leading-[0.9] lg:leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Your career, <br /><span className="text-zinc-400">optimized by AI.</span>
                    </h1>

                    <p className="max-w-xl text-lg sm:text-xl text-zinc-500 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        The elite resume builder for high-performance professionals.
                        Import LinkedIn, optimize for ATS, and land interviews at top-tier companies.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Button asChild size="lg" className="h-16 px-10 bg-zinc-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-2xl shadow-zinc-200 group">
                            <Link href="/auth/signup" className="flex items-center gap-2">
                                Start Building for Free
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-16 px-10 border-zinc-200 text-zinc-900 font-bold text-lg rounded-2xl bg-white hover:bg-zinc-50">
                            <Play className="h-4 w-4 mr-2 fill-zinc-900" /> Watch Demo
                        </Button>
                    </div>

                    <div className="flex items-center gap-8 pt-4 animate-in fade-in duration-1000 delay-500">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No Credit Card Required
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 7-Day Free Trial
                        </div>
                    </div>
                </div>

                {/* Main Preview Component */}
                <div className="relative mx-auto max-w-[1000px] animate-in fade-in zoom-in-95 duration-1000 delay-700">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-[2.5rem] blur opacity-50" />
                    <div className="relative bg-white border border-zinc-200 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center">
                        {/* CSS Mockup of Editor */}
                        <div className="w-full h-full flex">
                            <div className="w-1/3 border-r p-6 space-y-4 bg-zinc-50/50">
                                <div className="h-4 w-2/3 bg-zinc-200 rounded animate-pulse" />
                                <div className="h-24 w-full bg-white border rounded-lg shadow-sm" />
                                <div className="h-40 w-full bg-white border rounded-lg shadow-sm" />
                                <div className="h-32 w-full bg-white border rounded-lg shadow-sm" />
                            </div>
                            <div className="flex-1 p-8 bg-white flex flex-col pt-16 items-center">
                                <div className="w-[300px] aspect-[1/1.414] bg-white border shadow-2xl rounded-sm p-6 space-y-3">
                                    <div className="h-3 w-1/2 bg-zinc-800 rounded mx-auto mb-4" />
                                    <div className="h-2 w-full bg-zinc-100 rounded" />
                                    <div className="h-2 w-full bg-zinc-100 rounded" />
                                    <div className="h-2 w-2/3 bg-zinc-100 rounded" />
                                    <div className="h-2 w-full bg-zinc-100 rounded mt-6" />
                                    <div className="h-10 w-full border-l-2 border-zinc-200 pl-2 space-y-1">
                                        <div className="h-1.5 w-full bg-zinc-50 rounded" />
                                        <div className="h-1.5 w-full bg-zinc-50 rounded" />
                                        <div className="h-1.5 w-2/3 bg-zinc-50 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute top-1/4 right-10 bg-zinc-900 p-4 rounded-2xl shadow-2xl scale-75 sm:scale-100 border border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-emerald-500">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">ATS Match Score</div>
                                    <div className="text-xl font-black text-white">94/100</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-1/4 left-10 bg-white p-4 rounded-2xl shadow-2xl scale-75 sm:scale-100 border border-zinc-100">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div className="text-sm font-bold text-zinc-900">Keywords Optimized</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
