import { MaoogLogo } from '@/components/ui/maoog-logo'

export default function TestimonialsSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <blockquote>
                        <p className="text-lg font-semibold sm:text-xl md:text-3xl tracking-tight text-white/90">Novatypalcv feels like having a personal resume strategist on demand. I dropped my LinkedIn URL in, and within minutes I had an ATS friendly resume that actually highlights impact not just job duties. The job specific optimization and shareable public link made applying faster, cleaner, and way more confident.</p>

                        <div className="mt-12 flex items-center justify-center gap-6">
                            <div className="flex size-14 items-center justify-center rounded-[1rem] overflow-hidden bg-black">
                                <MaoogLogo size={40} style={{ color: '#FCC419' }} />
                            </div>

                            <div className="space-y-1 border-l-2 border-white/10 pl-6 text-left">
                                <cite className="font-semibold text-white">Mehmet Hanifi Özdede</cite>
                                <span className="text-muted-foreground block text-sm">CEO, Maoog Software</span>
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}
