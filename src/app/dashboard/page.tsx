import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/auth/actions'
import { LinkedinImportDialog } from '@/components/linkedin-import-dialog'
import { FileText, MoreVertical, Pencil, Upload, Eye } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/signup')
    }

    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 w-full">
            <div className="max-w-6xl mx-auto w-full p-8 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Resumes</h1>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="font-normal">{user.email}</Badge>
                        <form action={signout}>
                            <Button variant="outline" size="sm">Sign Out</Button>
                        </form>
                    </div>
                </header>

                <main className="grid gap-8">
                    <div className="flex flex-wrap gap-4">
                        <Button className="gap-2">
                            <FileText className="h-4 w-4" />
                            Create Blank Resume
                        </Button>
                        <LinkedinImportDialog />
                        <Button variant="outline" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload PDF (Coming soon)
                        </Button>
                    </div>

                    {!resumes || resumes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-white rounded-xl p-16 text-center shadow-sm">
                            <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-zinc-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-zinc-900">No resumes yet</h3>
                            <p className="text-zinc-500 mb-6 max-w-sm">Create a new resume from scratch or import your work history directly from LinkedIn to begin building.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume) => (
                                <Card key={resume.id} className="group relative overflow-hidden flex flex-col hover:shadow-md transition-all">
                                    <CardHeader className="p-6 pb-4 border-b bg-zinc-50/50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg text-zinc-900 truncate">{resume.title}</h3>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    Last edited {new Date(resume.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 p-6">
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex -space-x-2">
                                                {/* Placeholder for any related badges or status info */}
                                                {resume.is_active && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active Link</Badge>}
                                            </div>
                                            <div className="flex items-center text-sm text-zinc-500">
                                                {resume.ai_generated_json ? 'AI Optimized' : 'Raw Data'}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 justify-between">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Eye className="w-4 h-4" /> Preview
                                        </Button>
                                        <Button size="sm" className="gap-2">
                                            <Pencil className="w-4 h-4" /> Edit
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
