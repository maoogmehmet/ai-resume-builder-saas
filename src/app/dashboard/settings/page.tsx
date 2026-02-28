import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { User, CreditCard, Trash2, AlertTriangle, Shield, Check } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/signup')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-4xl w-full p-8 px-12 pb-24 space-y-12">

                <header className="pb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Manage your account and subscription preferences.
                    </p>
                </header>

                <main className="space-y-16">
                    {/* Account Information */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-zinc-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Account Information</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 max-w-xl">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                                <div className="bg-[#0a0a0a] border border-white/10 text-zinc-300 px-4 py-3 rounded-xl text-sm w-full font-medium">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Plan & Limits */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-zinc-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Plan & Usage</h2>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-black">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white text-lg">
                                            {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                                        </h3>
                                        <div className={`h-1.5 w-1.5 rounded-full ${isSubscribed ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium">Auto-renews on March 12, 2026</p>
                                </div>
                            </div>

                            {!isSubscribed && (
                                <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold h-11 px-8 rounded-xl">
                                    <Link href="/dashboard/upgrade">Upgrade now</Link>
                                </Button>
                            )}
                            {isSubscribed && (
                                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-11 px-8 rounded-xl">
                                    Manage billing
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">CV Projects</h4>
                                    <span className="text-xs font-bold text-white">{resumeCount || 0} <span className="text-zinc-600">/ {isSubscribed ? '∞' : '3'}</span></span>
                                </div>
                                <Progress value={isSubscribed ? 10 : ((resumeCount || 0) / 3) * 100} className="h-1 bg-white/5 [&>div]:bg-white" />
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Cover Letters</h4>
                                    <span className="text-xs font-bold text-white">0 <span className="text-zinc-600">/ {isSubscribed ? '∞' : '5'}</span></span>
                                </div>
                                <Progress value={0} className="h-1 bg-white/5 [&>div]:bg-white" />
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">AI Credits</h4>
                                    <span className="text-xs font-bold text-white">0 <span className="text-zinc-600">/ {isSubscribed ? '∞' : '10'}</span></span>
                                </div>
                                <Progress value={0} className="h-1 bg-white/5 [&>div]:bg-white" />
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="pt-12 border-t border-white/5 space-y-8">
                        <div className="flex items-center gap-3 text-red-500">
                            <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                            <h2 className="text-lg font-bold">Danger Zone</h2>
                        </div>

                        <div className="bg-red-500/[0.02] border border-red-500/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="space-y-1">
                                <h3 className="font-bold text-white text-base">Delete Account</h3>
                                <p className="text-sm text-zinc-500 max-w-md leading-relaxed">Permanently remove your account and all associated data. This action is irreversible.</p>
                            </div>

                            <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold h-11 px-8 rounded-xl whitespace-nowrap shrink-0 border border-red-500/20">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                            </Button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
