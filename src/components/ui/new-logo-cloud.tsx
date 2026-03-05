export default function LogoCloud() {
    const logos = [
        { src: "https://html.tailus.io/blocks/customers/nvidia.svg", alt: "Nvidia" },
        { src: "https://storage.efferd.com/logo/supabase-wordmark.svg", alt: "Supabase" },
        { src: "https://html.tailus.io/blocks/customers/openai.svg", alt: "OpenAI" },
        { src: "https://storage.efferd.com/logo/turso-wordmark.svg", alt: "Turso" },
        { src: "https://html.tailus.io/blocks/customers/vercel.svg", alt: "Vercel" },
        { src: "https://html.tailus.io/blocks/customers/github.svg", alt: "GitHub" },
        { src: "https://storage.efferd.com/logo/claude-wordmark.svg", alt: "Claude" },
        { src: "https://storage.efferd.com/logo/clerk-wordmark.svg", alt: "Clerk" },
        { src: "https://html.tailus.io/blocks/customers/column.svg", alt: "Column" },
        { src: "https://html.tailus.io/blocks/customers/nike.svg", alt: "Nike" },
        { src: "https://html.tailus.io/blocks/customers/laravel.svg", alt: "Laravel" },
        { src: "https://html.tailus.io/blocks/customers/lilly.svg", alt: "Lilly" },
        { src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg", alt: "Lemon Squeezy" },
        { src: "https://html.tailus.io/blocks/customers/tailwindcss.svg", alt: "Tailwind CSS" },
        { src: "https://html.tailus.io/blocks/customers/zapier.svg", alt: "Zapier" },
    ]

    return (
        <section className="bg-black py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="text-center text-xs font-black uppercase tracking-[0.3em] text-white mb-20 opacity-80">
                    Companies of all sizes trust us to deliver their most important CVs.
                </h2>
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-12 sm:gap-x-16 sm:gap-y-16">
                    {logos.map((logo, index) => (
                        <img
                            key={index}
                            className="h-6 md:h-8 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500 brightness-0 invert"
                            src={logo.src}
                            alt={`${logo.alt} Logo`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

