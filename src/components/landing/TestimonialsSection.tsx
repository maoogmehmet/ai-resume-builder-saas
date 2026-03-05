import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function TestimonialsSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <blockquote>
                        <p className="text-lg font-medium sm:text-xl md:text-3xl italic text-white/90">Using this AI Resume Builder feels like having a personal resume strategist on demand. I dropped my LinkedIn URL in, and within minutes I had an ATS friendly resume that actually highlights impact not just job duties. The job specific optimization and shareable public link made applying faster, cleaner, and way more confident.</p>

                        <div className="mt-12 flex items-center justify-center gap-6">
                            <Avatar className="size-14 border-2 border-primary/20 shadow-xl">
                                <AvatarImage
                                    src="https://tailus.io/images/reviews/shekinah.webp"
                                    alt="Shekinah Tshiokufila"
                                    height="400"
                                    width="400"
                                    loading="lazy"
                                />
                                <AvatarFallback className="bg-zinc-800 text-white">ST</AvatarFallback>
                            </Avatar>

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
