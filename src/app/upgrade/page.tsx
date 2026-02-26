'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, Sparkles, Shield, Zap, Globe, Download } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleUpgrade = async () => {
        setIsLoading(true)
        try {
            const resp = await fetch('/api/stripe/checkout', { method: 'POST' })
            const data = await resp.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || 'Failed to start checkout')
            }
        } catch (error: any) {
            toast.error('Upgrade Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <Badge className="bg-zinc-900 text-white hover:bg-zinc-800 px-3 py-1">Pricing Plans</Badge>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900">
                        Elevate Your Career with AI
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Get unlimited access to ATS-optimized resumes, AI-powered matching, and professional public links.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    {/* FREE PLAN (TRIAL OVERVIEW) */}
                    <Card className="border-zinc-200 bg-white shadow-sm relative overflow-hidden">
                        <CardHeader>
                            <CardTitle>7-Day Free Trial</CardTitle>
                            <CardDescription>Try all premium features for free</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-zinc-500">/week</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-zinc-600">
                                    <Check className="h-4 w-4 text-green-500" /> Full LinkedIn Import
                                </li>
                                <li className="flex items-center gap-2 text-sm text-zinc-600">
                                    <Check className="h-4 w-4 text-green-500" /> AI Resume Generation
                                </li>
                                <li className="flex items-center gap-2 text-sm text-zinc-600">
                                    <Check className="h-4 w-4 text-green-500" /> ATS Matching Analysis
                                </li>
                                <li className="flex items-center gap-2 text-sm text-zinc-600">
                                    <Check className="h-4 w-4 text-green-500" /> Public Profile Link
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/dashboard">Back to Dashboard</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* PRO PLAN */}
                    <Card className="border-zinc-900 bg-zinc-900 shadow-2xl relative overflow-hidden scale-105">
                        <div className="absolute top-4 right-4">
                            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white">Professional Annual</CardTitle>
                            <CardDescription className="text-zinc-400">Everything you need for your job search</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$99</span>
                                <span className="text-zinc-400">/year</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Zap className="h-4 w-4 text-yellow-400" /> **Unlimited** Resume Generations
                                </li>
                                <li className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Shield className="h-4 w-4 text-blue-400" /> Advanced ATS Optimization
                                </li>
                                <li className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Globe className="h-4 w-4 text-purple-400" /> Permanent Public URL
                                </li>
                                <li className="flex items-center gap-2 text-sm text-zinc-300">
                                    <Download className="h-4 w-4 text-zinc-100" /> Priority Support & V2 Access
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold h-12"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                                Upgrade Now
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <p className="text-center text-zinc-400 text-sm mt-12">
                    Secure payment processing by Stripe. Cancel anytime.
                </p>
            </div>
        </div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    )
}
