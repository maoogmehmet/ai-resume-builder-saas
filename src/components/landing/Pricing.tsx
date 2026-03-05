import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

export default function Pricing() {
    return (
        <section className="py-16 md:py-32 text-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
                    <p className="text-muted-foreground">Novatypalcv is evolving to be more than just the models. It supports an entire ecosystem — from products innovate.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    <Card className="flex flex-col bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-2xl transition-all hover:scale-[1.02]">
                        <CardHeader>
                            <CardTitle className="font-medium">Free</CardTitle>
                            <span className="my-3 block text-2xl font-semibold text-white">$0 / year</span>
                            <CardDescription className="text-sm text-zinc-400">Perfect for individuals</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-white/10 border-dashed" />

                            <ul className="list-outside space-y-3 text-sm text-zinc-300">
                                {[
                                    { text: 'LinkedIn Import up to 1 import / 7 days', included: true },
                                    { text: '1 Resume ', included: true },
                                    { text: 'Resume editor + live preview', included: true },
                                    { text: 'ATS Score Preview', included: true },
                                    { text: 'Public Resume Link', included: true },
                                    { text: 'Draft storage access', included: true },
                                    { text: 'Watermarked PDF export', included: true },
                                    { text: 'Job-specific AI optimization', included: false },
                                    { text: 'Multiple versions', included: false },
                                    { text: 'No-watermark premium export', included: false },
                                    { text: 'Recruiter analytics', included: false },
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        {item.included ? (
                                            <Check className="size-3 text-emerald-500" />
                                        ) : (
                                            <X className="size-3 text-zinc-500" />
                                        )}
                                        <span className={item.included ? "" : "text-zinc-500 line-through"}>
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto pt-6">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 transition-colors">
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="relative flex flex-col bg-zinc-900/80 border-purple-500/50 backdrop-blur-md shadow-2xl transition-all hover:scale-[1.05] ring-2 ring-purple-500/20">
                        <span className="bg-linear-to-br absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-amber-950 shadow-lg">Most Popular</span>

                        <CardHeader>
                            <CardTitle className="font-medium text-white">Pro</CardTitle>
                            <span className="my-3 block text-2xl font-semibold text-white">$99 / year</span>
                            <CardDescription className="text-sm text-zinc-400">Power user performance</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-white/10 border-dashed" />
                            <ul className="list-outside space-y-3 text-sm text-zinc-300">
                                {['Unlimited resumes', 'Unlimited resume versions', 'Advanced AI job optimization', 'ATS score + 1-click improvements', 'Public Resume Link — never expires', 'No-watermark PDF export', 'Recruiter analytics', 'Priority support', 'Early access to new features'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3 text-purple-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto pt-6">
                            <Button
                                asChild
                                className="w-full bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-900/40 transition-all">
                                <Link href="/login">Get Started Now</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="flex flex-col bg-zinc-900/50 border-white/5 backdrop-blur-sm shadow-2xl transition-all hover:scale-[1.02]">
                        <CardHeader>
                            <CardTitle className="font-medium">Startup</CardTitle>
                            <span className="my-3 block text-2xl font-semibold text-white">$29 / mo</span>
                            <CardDescription className="text-sm text-zinc-400">Scale your vision</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-white/10 border-dashed" />

                            <ul className="list-outside space-y-3 text-sm text-zinc-300">
                                {['Everything in Pro Plan', 'Unlimited Cloud Storage', 'Priority Support'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3 text-white/60" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="mt-auto pt-6">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 transition-colors">
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    )
}
