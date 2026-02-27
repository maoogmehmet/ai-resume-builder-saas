import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { User, CreditCard, Trash2, AlertTriangle } from 'lucide-react'
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
        <div className="flex flex-col min-h-screen bg-[#fafafa] w-full font-sans">
            <div className="max-w-4xl w-full p-8 mx-0">
                <header className="pb-8">
                    <h1 className="text-[28px] font-bold tracking-tight text-[#1E293B]">
                        Settings
                    </h1>
                    <p className="text-[#64748B] text-base font-medium mt-1">
                        Manage your account and subscription preferences.
                    </p>
                </header>

                <main className="space-y-8">
                    {/* Account Information */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <User className="h-5 w-5 text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 pb-4 border-b border-slate-100">Your personal account details.</p>

                        <div className="space-y-2 max-w-xl">
                            <label className="text-sm font-semibold text-slate-700">Email</label>
                            <div className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-3 rounded-lg text-sm w-full font-medium">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    {/* Plan & Limits */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <CreditCard className="h-5 w-5 text-slate-700" />
                            <h2 className="text-lg font-bold text-slate-900">Plan & Limits</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 pb-4 border-b border-slate-100">Manage your subscription and view usage limits.</p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                                    </h3>
                                    {!isSubscribed && <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Limited</span>}
                                    {isSubscribed && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Active</span>}
                                </div>
                                <p className="text-sm text-slate-500 font-medium mb-1">Your limits reset every 14 days.</p>
                                <p className="text-xs font-bold text-orange-500">Next Reset: 3/12/2026 (14 days left)</p>
                            </div>

                            {!isSubscribed && (
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg">
                                    <Link href="/dashboard/upgrade">Upgrade to Pro</Link>
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">CV Projects</h4>
                                    <span className="text-sm font-bold text-slate-900">{resumeCount || 0} <span className="text-slate-400 font-normal">/ {isSubscribed ? '∞' : '2'}</span></span>
                                </div>
                                <Progress value={isSubscribed ? 10 : (resumeCount || 0) * 50} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                            </div>
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Cover Letters</h4>
                                    <span className="text-sm font-bold text-slate-900">0 <span className="text-slate-400 font-normal">/ {isSubscribed ? '∞' : '2'}</span></span>
                                </div>
                                <Progress value={0} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                            </div>
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Daily Searches</h4>
                                    <span className="text-sm font-bold text-slate-900">0 <span className="text-slate-400 font-normal">/ {isSubscribed ? '∞' : '2'}</span></span>
                                </div>
                                <Progress value={0} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-1">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 pb-4 border-b border-red-100">Permanently delete your account and all associated data.</p>

                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="font-bold text-red-900 text-base mb-1">Delete Account</h3>
                                <p className="text-sm text-red-700 font-medium">This action cannot be undone. All your CVs, data, and subscription will be permanently deleted.</p>
                            </div>

                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm h-11 px-6 rounded-lg whitespace-nowrap shrink-0">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                            </Button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}
