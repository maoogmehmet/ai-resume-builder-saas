'use client';
import { cn } from "@/lib/utils";
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card";

interface TestimonialsSectionProps {
    title: string;
    description: string;
    testimonials: Array<{
        author: TestimonialAuthor;
        text: string;
        href?: string;
    }>;
    className?: string;
}

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className
}: TestimonialsSectionProps) {
    return (
        <section id="testimonials" className={cn(
            "bg-black text-white",
            "py-24 sm:py-32 px-6",
            className
        )}>
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 text-center sm:gap-20">
                <div className="flex flex-col items-center gap-6 px-4">
                    <h2 className="max-w-[800px] text-4xl font-medium tracking-tighter sm:text-7xl leading-[1.1]">
                        {title}
                    </h2>
                    <p className="text-lg max-w-[600px] font-medium text-zinc-500 sm:text-xl">
                        {description}
                    </p>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <div className="group flex overflow-hidden p-4 [--gap:1.5rem] [gap:var(--gap)] flex-row">
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row hover:[animation-play-state:paused]">
                            {[...Array(4)].map((_, setIndex) => (
                                testimonials.map((testimonial, i) => (
                                    <div key={`${setIndex}-${i}`} className="w-[350px] shrink-0">
                                        <TestimonialCard
                                            {...testimonial}
                                        />
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>

                    {/* Gradients to fade edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black z-10" />
                </div>
            </div>

            <style jsx global>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 50s linear infinite;
        }
      `}</style>
        </section>
    );
}
