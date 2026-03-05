export default function LogoCloud() {
    const logos = [
        { src: "https://cdn.simpleicons.org/nvidia/white", alt: "Nvidia" },
        { src: "https://storage.efferd.com/logo/supabase-wordmark.svg", alt: "Supabase" },
        { src: "https://cdn.simpleicons.org/openai/white", alt: "OpenAI" },
        { src: "https://storage.efferd.com/logo/turso-wordmark.svg", alt: "Turso" },
        { src: "https://cdn.simpleicons.org/vercel/white", alt: "Vercel" },
        { src: "https://cdn.simpleicons.org/github/white", alt: "GitHub" },
        { src: "https://storage.efferd.com/logo/claude-wordmark.svg", alt: "Claude" },
        { src: "https://storage.efferd.com/logo/clerk-wordmark.svg", alt: "Clerk" },
        { src: "https://cdn.simpleicons.org/nike/white", alt: "Nike" },
        { src: "https://cdn.simpleicons.org/laravel/white", alt: "Laravel" },
        { src: "https://cdn.simpleicons.org/lemonsqueezy/white", alt: "Lemon Squeezy" },
        { src: "https://cdn.simpleicons.org/tailwindcss/white", alt: "Tailwind CSS" },
        { src: "https://cdn.simpleicons.org/zapier/white", alt: "Zapier" },
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

