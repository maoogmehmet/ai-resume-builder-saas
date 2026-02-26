import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white mt-14 sm:mt-24 lg:mt-32 w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-balance text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
                        Build Your <span className="text-zinc-400">ATS-Optimized</span> Resume in Seconds
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-balance text-xl text-zinc-500">
                        Turn your LinkedIn profile into a professional, ATS-friendly resume tailored for any job opening using AI. Land your dream job effortlessly.
                    </p>
                    <div className="mt-10 flex cursor-pointer justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base">
                            <Link href="/auth/signup">Get Started Free</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                            <Link href="#features">See How It Works</Link>
                        </Button>
                    </div>

                    <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-zinc-200/50 bg-zinc-50/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4">
                        <div className="rounded-lg overflow-hidden border border-zinc-200 bg-white">
                            <Image
                                src="https://tailark.com/_next/image?url=%2Fmist%2Ftailark-2.png&w=3840&q=75"
                                alt="Dashboard Preview"
                                width={1920}
                                height={1080}
                                className="w-full h-auto object-cover opacity-90"
                            />
                        </div>
                    </div>

                    <div className="mt-16 pb-20">
                        <p className="text-sm font-semibold text-zinc-400 tracking-wide uppercase">Trusted by professionals exploring roles at</p>
                        <div className="mt-8 flex justify-center gap-8 md:gap-16 items-center opacity-50 grayscale">
                            <img className="h-8 w-auto" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia" />
                            <img className="h-6 w-auto" src="https://html.tailus.io/blocks/customers/google.svg" alt="Google" />
                            <img className="h-8 w-auto" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub" />
                            <img className="h-8 w-auto" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
