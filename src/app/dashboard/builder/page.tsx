import { FileText, Sparkles, Upload } from 'lucide-react'
import { MagicBuilderDialog } from '@/components/dashboard/magic-builder-dialog'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'

export default function BuilderPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] w-full font-sans">
            <div className="max-w-7xl mx-auto w-full p-8 mx-0">
                <header className="pb-8">
                    <h1 className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                        CV Builder
                    </h1>
                    <p className="text-[#64748B] text-base font-medium mt-1">
                        Choose how you want to start building your professional resume.
                    </p>
                </header>

                <main className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl">

                        {/* Option 1: AI Magic Builder */}
                        <div className="bg-white border hover:border-blue-300 transition-colors border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
                            <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                                <Sparkles className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Magic Builder</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Our AI will analyze your target role and generate a tailored, professional resume from scratch. Takes about 30 seconds.
                            </p>
                            <div className="w-full">
                                <MagicBuilderDialog />
                            </div>
                        </div>

                        {/* Option 2: LinkedIn Import */}
                        <div className="bg-white border hover:border-indigo-300 transition-colors border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
                            <div className="h-20 w-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-9 w-9 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">LinkedIn Import</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
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
