import { Spotify } from '@/components/ui/svgs/spotify'
import { SupabaseFull } from '@/components/ui/svgs/supabase'
import { Hulu } from '@/components/ui/svgs/hulu'
import { FirebaseFull } from '@/components/ui/svgs/firebase'
import { Beacon } from '@/components/ui/svgs/beacon'
import { Bolt } from '@/components/ui/svgs/bolt'
import { Claude as ClaudeLogo } from '@/components/ui/svgs/claude'
import { Figma } from '@/components/ui/svgs/figma'
import { VercelFull } from '@/components/ui/svgs/vercel'
import { Cisco } from '@/components/ui/svgs/cisco'

export default function LogoCloud() {
    const logoUrls = [
        { src: "https://storage.efferd.com/logo/nvidia-wordmark.svg", alt: "Nvidia" },
        { src: "https://storage.efferd.com/logo/openai-wordmark.svg", alt: "OpenAI" },
        { src: "https://storage.efferd.com/logo/turso-wordmark.svg", alt: "Turso" },
        { src: "https://storage.efferd.com/logo/github-wordmark.svg", alt: "GitHub" },
        { src: "https://storage.efferd.com/logo/clerk-wordmark.svg", alt: "Clerk" },
    ]

    const textStyle = "opacity-40 hover:opacity-100 transition-opacity duration-500 brightness-0 invert"

    return (
        <section className="bg-black py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="text-center text-xs font-black uppercase tracking-[0.3em] text-white mb-20 opacity-80">
                    Trusted by elite professionals worldwide.
                </h2>
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-12 sm:gap-x-16 sm:gap-y-16">
                    {logoUrls.map((logo, index) => (
                        <img
                            key={index}
                            className={`h-6 md:h-8 w-auto ${textStyle}`}
                            src={logo.src}
                            alt={`${logo.alt} Logo`}
                        />
                    ))}
                    <Bolt className={textStyle} height={22} width={56} />
                    <VercelFull className={textStyle} height={22} width={84} />
                    <SupabaseFull className={`h-8 ${textStyle}`} />
                    <Hulu className={textStyle} height={18} width={56} />
                    <Spotify className={textStyle} height={24} width={80} />
                    <FirebaseFull className={textStyle} height={24} width={80} />
                    <Beacon className={textStyle} height={24} width={80} />
                    <ClaudeLogo className={textStyle} height={26} width={90} />
                    <Figma className={textStyle} height={24} width={24} />
                    <Cisco className={textStyle} height={30} width={60} />
                </div>
            </div>
        </section>
    )
}

