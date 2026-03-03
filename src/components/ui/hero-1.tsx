import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, PhoneCallIcon, Sparkles } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud";

export function HeroSection() {
	return (
		<section className="mx-auto w-full max-w-5xl">
			{/* Top Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
			>
				<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
			</div>

			{/* X Bold Faded Borders */}
			<div
				aria-hidden="true"
				className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
			>
				<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" />
				<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" />
			</div>

			{/* main content */}

			<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-30">
				{/* X Content Faded Borders */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-1 size-full overflow-hidden"
				>
					<div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
					<div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
					<div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
					<div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
				</div>

				<a
					className={cn(
						"group mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl px-4 py-2 shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/10",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out font-heading uppercase tracking-widest text-[10px] italic font-black"
					)}
					href="#"
				>
					<Sparkles className="size-3 text-white opacity-40" />
					<span>Neural Pipeline • Powered by Claude 3.5 Sonnet</span>
					<ArrowRightIcon className="size-3 opacity-40 group-hover:translate-x-1 transition-transform" />
				</a>

				<h1
					className={cn(
						"fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-6xl font-black tracking-[-0.04em] delay-100 duration-700 ease-out md:text-8xl lg:text-9xl font-heading leading-[0.9]",
						"text-shadow-[0_0px_60px_theme(--color-foreground/.1)]"
					)}
				>
					The Career <br /> Operating System.
				</h1>

				<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-2xl animate-in fill-mode-backwards text-center text-lg text-foreground/60 font-medium delay-200 duration-700 ease-out sm:text-xl px-6">
					The ultimate ATS-optimized builder for elite professionals. <br /> Stop applying, start being recruited with AI narratives.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-10 fill-mode-backwards pt-10 delay-300 duration-700 ease-out">
					<Button asChild className="rounded-2xl shadow-2xl h-16 px-12 font-bold text-lg bg-white text-black hover:bg-zinc-100 border-none transition-all hover:scale-105 !bg-white !text-black" size="lg">
						<a href="/auth/signup">
							GET STARTED
							<ArrowRightIcon className="size-5 ms-2" />
						</a>
					</Button>
					<a href="#features" className="text-zinc-500 hover:text-white transition-colors font-bold text-lg">
						EXPLORE FEATURES
					</a>
				</div>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in text-[10px] font-bold text-zinc-400 uppercase tracking-widest gap-8 mt-4 delay-500 duration-500 ease-out fill-mode-backwards">
					<span className="flex items-center gap-1"><span className="text-green-500 text-lg leading-none">✓</span> NO CREDIT CARD REQUIRED</span>
					<span className="flex items-center gap-1"><span className="text-green-500 text-lg leading-none">✓</span> 7-DAY FREE TRIAL</span>
				</div>
			</div>
		</section>
	);
}

export function LogosSection() {
	return (
		<section className="relative space-y-4 border-t pt-6 pb-10">
			<h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
				Trusted by <span className="text-foreground">experts</span>
			</h2>
			<div className="relative z-10 mx-auto max-w-4xl">
				<LogoCloud logos={logos} />
			</div>
		</section>
	);
}

const logos = [
	{
		src: "https://storage.efferd.com/logo/nvidia-wordmark.svg",
		alt: "Nvidia Logo",
	},
	{
		src: "https://storage.efferd.com/logo/supabase-wordmark.svg",
		alt: "Supabase Logo",
	},
	{
		src: "https://storage.efferd.com/logo/openai-wordmark.svg",
		alt: "OpenAI Logo",
	},
	{
		src: "https://storage.efferd.com/logo/turso-wordmark.svg",
		alt: "Turso Logo",
	},
	{
		src: "https://storage.efferd.com/logo/vercel-wordmark.svg",
		alt: "Vercel Logo",
	},
	{
		src: "https://storage.efferd.com/logo/github-wordmark.svg",
		alt: "GitHub Logo",
	},
	{
		src: "https://storage.efferd.com/logo/claude-wordmark.svg",
		alt: "Claude AI Logo",
	},
	{
		src: "https://storage.efferd.com/logo/clerk-wordmark.svg",
		alt: "Clerk Logo",
	},
];