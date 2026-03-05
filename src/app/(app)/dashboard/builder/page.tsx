import { Sparkles, Linkedin } from 'lucide-react'
import { MagicBuilderDialog } from '@/components/dashboard/magic-builder-dialog'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'

export default function BuilderPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-6xl mx-auto w-full p-8 px-6 sm:px-12 pt-16 space-y-16">

                {/* Header */}
                <header className="flex flex-col items-baseline justify-between pb-4">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg">
                        Builder
                    </h1>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

                    {/* Option 1: AI Magic Builder */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10 sm:p-12 flex flex-col items-start group relative overflow-hidden h-[480px]">

                        {/* Background Giant Icon */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Sparkles className="h-64 w-64 -mr-16 -mt-16 text-white" strokeWidth={1} />
                        </div>

                        {/* Top Icon */}
                        <div className="h-16 w-16 bg-white rounded-[1.25rem] flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10">
                            <Sparkles className="h-8 w-8 text-black" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 mb-auto relative z-10 w-full">
                            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase select-none">Magic Builder</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[280px] select-none">
                                Our neural network analyzes target roles to architect a high-performance, tailored resume with semantic optimization.
                            </p>
                        </div>

                        {/* Action Button Area */}
                        <div className="w-full relative z-10 mt-12">
                            <MagicBuilderDialog
                                customTrigger={
                                    <button className="flex items-center justify-center gap-2 bg-black border border-white/20 hover:border-white/40 text-white rounded-full px-6 py-3 font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] w-fit">
                                        <Sparkles className="w-4 h-4" />
                                        New AI Resume
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    {/* Option 2: LinkedIn Import */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-10 sm:p-12 flex flex-col items-start group relative overflow-hidden h-[480px]">

                        {/* Background Giant Icon */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Linkedin className="h-64 w-64 -mr-16 -mt-16 text-white fill-current" strokeWidth={0} />
                        </div>

                        {/* Top Icon */}
                        <div className="h-16 w-16 bg-[#1a1a1a] border border-white/5 rounded-[1.25rem] flex items-center justify-center mb-10 relative z-10">
                            <Linkedin className="h-7 w-7 text-white fill-current" strokeWidth={0} />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4 mb-auto relative z-10 w-full">
                            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase select-none">LinkedIn Import</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[280px] select-none">
                                Instant synchronization of your professional history. Seamlessly transition your LinkedIn presence into a high-end CV framework.
                            </p>
                        </div>

                        {/* Action Button Area */}
                        <div className="w-full relative z-10 mt-12">
                            <LinkedinImportDialog
                                customTrigger={
                                    <button className="flex items-center justify-center gap-2 bg-black border border-white/20 hover:border-white/40 text-zinc-300 hover:text-white rounded-full px-6 py-3 font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] w-fit">
                                        <Linkedin className="w-4 h-4" />
                                        Import from LinkedIn
                                    </button>
                                }
                            />
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}
