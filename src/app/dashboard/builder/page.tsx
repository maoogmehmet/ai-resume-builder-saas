import { FileText, Sparkles, Upload } from 'lucide-react'
import { MagicBuilderDialog } from '@/components/dashboard/magic-builder-dialog'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'

export default function BuilderPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-7xl mx-auto w-full p-8 px-12">
                <header className="pb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        CV Builder
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Choose how you want to start building your professional resume.
                    </p>
                </header>

                <main className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

                        {/* Option 1: AI Magic Builder */}
                        <div className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all rounded-[2rem] p-12 flex flex-col items-center text-center group">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-white/5 group-hover:scale-105 transition-transform">
                                <Sparkles className="h-8 w-8 text-black" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Magic Builder</h3>
                            <p className="text-zinc-500 text-sm mb-10 leading-relaxed max-w-[280px]">
                                Our AI will analyze your target role and generate a tailored, professional resume from scratch.
                            </p>
                            <div className="w-full">
                                <MagicBuilderDialog />
                            </div>
                        </div>

                        {/* Option 2: LinkedIn Import */}
                        <div className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all rounded-[2rem] p-12 flex flex-col items-center text-center group">
                            <div className="h-16 w-16 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform">
                                <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">LinkedIn Import</h3>
                            <p className="text-zinc-500 text-sm mb-10 leading-relaxed max-w-[280px]">
                                Import your entire LinkedIn profile instantly. Start with your existing experience and let AI optimize it.
                            </p>
                            <div className="w-full">
                                <LinkedinImportDialog />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
