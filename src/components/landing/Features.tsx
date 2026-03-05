import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built for your career success</h2>
                    <p className="mt-4 text-muted-foreground">Everything you need to turn your experience into a job-winning resume in minutes.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 md:grid-cols-3 md:max-w-none">
                    <Card className="group shadow-black-950/5 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap className="size-6 text-white" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-white">LinkedIn Import</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-zinc-400">Import your entire profile with one click. We transform your data into a structured, professional format instantly.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-black-950/5 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2 className="size-6 text-white" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-white">AI Job Tailoring</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-zinc-400">Paste a job description and let AI optimize your resume. Match the exact keywords recruiters are looking for.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-black-950/5 bg-zinc-900/50 border-white/5 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles className="size-6 text-white" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-white">ATS Score & Match</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-zinc-400">Get a real-time ATS score (0-100) and actionable tips to improve your match before you even hit apply.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">{children}</div>
    </div>
)
