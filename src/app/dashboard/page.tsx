import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/auth/actions'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'
import { FileText, MoreVertical, Pencil, Upload, Eye, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { success?: string; error?: string }
}) {
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

    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const isTrialActive = profile && new Date(profile.trial_end_date) > new Date()
    const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 w-full font-sans">
            <div className="max-w-6xl mx-auto w-full p-8 px-4 sm:px-6 lg:px-8">
                {searchParams.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-green-600">Success</Badge>
                            <p className="font-medium text-sm">Your subscription is now active! Enjoy unlimited resume generations.</p>
                        </div>
                    </div>
                )}

                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-zinc-200 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Dashboard</h1>
                        <p className="text-zinc-500 mt-1">Manage your resumes and career applications.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border shadow-sm px-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-zinc-900">{profile?.full_name || user.email?.split('@')[0]}</span>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                                {isSubscribed ? 'Premium Account' : 'Free Trial'}
                            </span>
                        </div>
                        <form action={signout}>
                            <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-red-600 hover:bg-red-50">Sign Out</Button>
                        </form>
                    </div>
                </header>

                <main className="grid gap-10">
                    {/* STATUS BANNER */}
                    {!isSubscribed && isTrialActive && (
                        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                                    <TrendingUp className="text-yellow-400 h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Free Trial Active</h3>
                                    <p className="text-zinc-400 text-sm">Your trial ends in {Math.ceil((new Date(profile.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days. Upgrade for lifetime access.</p>
                                </div>
                            </div>
                            <Button asChild className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold whitespace-nowrap shadow-lg px-8">
                                <Link href="/upgrade">Upgrade to Pro</Link>
                            </Button>
                        </div>
                    )}

                    {!isTrialActive && !isSubscribed && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5 text-red-900">
                                <AlertTriangle className="h-8 w-8" />
                                <div>
                                    <h3 className="text-lg font-bold">Your Trial Has Expired</h3>
                                    <p className="text-red-700 text-sm">Download and sharing privileges have been disabled. Upgrade to continue.</p>
                                </div>
                            </div>
                            <Button asChild variant="destructive" className="font-bold py-6 px-10 rounded-xl shadow-lg">
                                <Link href="/upgrade">Upgrade Now</Link>
                            </Button>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-zinc-400" /> Recent Resumes
                            </h2>
                            <div className="flex gap-3">
                                <LinkedinImportDialog />
                                <Button size="sm" className="hidden sm:flex items-center gap-2 bg-zinc-900">
                                    <Sparkles className="h-4 w-4" /> Create Blank
                                </Button>
                            </div>
                        </div>

                        {!resumes || resumes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-white rounded-2xl p-20 text-center shadow-sm">
                                <FileText className="h-16 w-16 text-zinc-100 mb-4" />
                                <h3 className="text-2xl font-bold text-zinc-900">Start Your Journey</h3>
                                <p className="text-zinc-500 mt-2 mb-8 max-w-sm">Import your LinkedIn profile or start from a blank slate to see the power of AI resume building.</p>
                                <LinkedinImportDialog />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {resumes.map((resume) => (
                                    <Card key={resume.id} className="group overflow-hidden flex flex-col border-zinc-200 hover:border-zinc-300 hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="p-0 border-b relative">
                                            <div className="aspect-[1.5/1] bg-zinc-100 flex items-center justify-center overflow-hidden">
                                                {/* Visual Placeholder for Resume */}
                                                <FileText className="h-20 w-20 text-zinc-200 group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
                                            </div>
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Rename</DropdownMenuItem>
                                                        <DropdownMenuItem>Duplicate Search Version</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Delete Permanently</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 flex-1">
                                            <h3 className="font-bold text-lg text-zinc-900 truncate leading-tight">{resume.title}</h3>
                                            <div className="flex items-center gap-3 mt-3">
                                                <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-medium">
                                                    {resume.ai_generated_json ? 'AI Optimized' : 'Raw Import'}
                                                </Badge>
                                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                                    Edited {new Date(resume.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 gap-3">
                                            <Button asChild variant="outline" size="sm" className="flex-1 font-semibold group-hover:bg-zinc-50 transition-colors">
                                                <Link href={`/dashboard/resume/${resume.id}`}>
                                                    <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                                                </Link>
                                            </Button>
                                            <Button asChild size="sm" className="flex-1 bg-zinc-900 group-hover:bg-black transition-colors">
                                                <Link href={`/dashboard/resume/${resume.id}`}>
                                                    <Eye className="w-3.5 h-3.5 mr-2" /> Preview
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
