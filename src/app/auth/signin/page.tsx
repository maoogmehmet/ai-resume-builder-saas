import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
    const resolvedParams = await searchParams

    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Desktop Side - Image */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-zinc-900 to-zinc-900"></div>
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="h-8 w-8 bg-black/30 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-white">AI RESUME.</span>
                    </Link>
                </div>

                <div className="relative z-10 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-medium leading-relaxed">
                            "The ATS optimization completely transformed my job search. It's not just a builder, it's a career growth engine."
                        </p>
                        <footer className="text-sm">
                            <div className="font-bold">Sofia Davis</div>
                            <div className="text-zinc-400">Software Engineer @ Microsoft</div>
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 h-screen">
                <div className="mx-auto w-full max-w-[400px] flex flex-col justify-center space-y-6">
                    <div className="flex flex-col space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
                        <p className="text-sm text-zinc-500">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    <form className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-semibold text-zinc-900">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="h-11 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="font-semibold text-zinc-900">Password</Label>
                                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-11 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-blue-500"
                            />
                        </div>
                        {resolvedParams?.error && (
                            <p className="text-sm text-red-500 font-medium">{resolvedParams.error}</p>
                        )}
                        {resolvedParams?.message && (
                            <p className="text-sm text-green-500 font-medium">{resolvedParams.message}</p>
                        )}

                        <Button className="w-full h-12 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 text-base mt-2" formAction={login}>
                            Sign In
                        </Button>
                    </form>

                    <div className="text-center text-sm text-zinc-500 mt-6">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                            Sign up today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
