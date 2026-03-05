import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from 'lucide-react'

export function FeaturesManagement() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">The ultimate toolkit for your next big role</h2>
                    <p className="text-muted-foreground">Novatypalcv goes beyond basic editing. It provides a complete ecosystem of AI tools to help you stand out and land interviews faster.</p>
                </div>

                <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y border border-white/5 *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-emerald-500" />
                            <h3 className="text-sm font-medium">LinkedIn Sync</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Keep your resume up to date with your latest achievements in one click.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-blue-500" />
                            <h3 className="text-sm font-medium">AI Rewriting</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Instantly improve bullet points with stronger action verbs and metrics.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4 text-purple-500" />

                            <h3 className="text-sm font-medium">Keyword Match</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Scan job descriptions to identify and add missing mandatory keywords.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4 text-amber-500" />

                            <h3 className="text-sm font-medium">Pro Templates</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Choose from battle-tested, ATS-friendly designs that recruiters love.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4 text-zinc-400" />

                            <h3 className="text-sm font-medium">Instant PDF</h3>
                        </div>
                        <p className="text-sm text-zinc-400">Export clean, high-quality PDFs that preserve formatting on any system.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-emerald-400" />

                            <h3 className="text-sm font-medium">Live Preview</h3>
                        </div>
                        <p className="text-sm text-zinc-400">See exactly how your resume looks to recruiters as you type and edit.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
