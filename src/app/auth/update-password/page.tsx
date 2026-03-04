import { updatePassword } from './actions'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const { error } = await searchParams
    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)]" />
            <div className="w-full max-w-md relative z-10">
                <div className="flex items-center gap-3 mb-12">
                    <div className="h-10 w-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-white">Novatypalcv</span>
                </div>
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Set New Password</h1>
                    <p className="text-zinc-500 font-medium">Enter a strong new password for your account.</p>
                </div>
                {error && (
                    <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold">
                        {error}
                    </div>
                )}
                <form action={updatePassword} className="space-y-5" autoComplete="off">
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-white font-bold text-sm ml-1">New Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Min. 8 characters"
                            className="w-full h-14 rounded-2xl bg-white border-none text-black font-medium px-5 placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20 transition-all shadow-lg outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-white font-bold text-sm ml-1">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Repeat password"
                            className="w-full h-14 rounded-2xl bg-white border-none text-black font-medium px-5 placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20 transition-all shadow-lg outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base transition-all mt-2 shadow-lg"
                    >
                        Update Password
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <Link href="/auth/signin" className="flex items-center justify-center gap-2 text-zinc-600 text-sm font-bold hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Sign In
                    </Link>
                </div>
            </div>
        </main>
    )
}
