'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Briefcase, Users, Loader2, ExternalLink, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export function CareerInsights() {
    const [jobQuery, setJobQuery] = useState('')
    const [jobs, setJobs] = useState<any[]>([])
    const [isJobsLoading, setIsJobsLoading] = useState(false)
    const [jobError, setJobError] = useState<string | null>(null)

    const [peopleQuery, setPeopleQuery] = useState('')
    const [people, setPeople] = useState<any[]>([])
    const [isPeopleLoading, setIsPeopleLoading] = useState(false)
    const [peopleError, setPeopleError] = useState<string | null>(null)

    const handleJobSearch = async () => {
        if (!jobQuery.trim()) return
        setIsJobsLoading(true)
        setJobs([])
        setJobError(null)
        try {
            const res = await fetch('/api/linkedin/search-jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: jobQuery })
            })
            const data = await res.json()
            if (!res.ok) {
                setJobError(data.error || 'Search failed')
                toast.error(data.error || 'Job search failed')
            } else if (data.jobs && data.jobs.length > 0) {
                setJobs(data.jobs)
            } else {
                setJobError('No jobs found for this search. Try different keywords.')
            }
        } catch (error: any) {
            setJobError('Failed to connect to job search service.')
            toast.error('Search failed: ' + error.message)
        } finally {
            setIsJobsLoading(false)
        }
    }

    const handlePeopleSearch = async () => {
        if (!peopleQuery.trim()) return
        setIsPeopleLoading(true)
        setPeople([])
        setPeopleError(null)
        try {
            const res = await fetch('/api/linkedin/search-people', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: peopleQuery })
            })
            const data = await res.json()
            if (!res.ok) {
                setPeopleError(data.error || 'Search failed')
                toast.error(data.error || 'People search failed')
            } else if (data.people && data.people.length > 0) {
                setPeople(data.people)
            } else {
                setPeopleError('No profiles found. Try broader search terms.')
            }
        } catch (error: any) {
            setPeopleError('Failed to connect to people search service.')
            toast.error('Search failed: ' + error.message)
        } finally {
            setIsPeopleLoading(false)
        }
    }

    return (
        <Card className="border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
            <CardHeader className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Search className="h-5 w-5 text-yellow-400" />
                    </div>
                    <Badge className="bg-white/10 text-white/80 border-white/20 px-3 py-1 text-[10px] tracking-widest uppercase font-black">AI Powered Intelligence</Badge>
                </div>
                <CardTitle className="text-3xl font-black tracking-tighter">
                    Career Research
                </CardTitle>
                <CardDescription className="text-zinc-400 text-base font-medium mt-2">
                    Access elite market data. Research top companies and find industry experts to benchmark your growth.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                <Tabs defaultValue="jobs" className="space-y-8">
                    <TabsList className="flex w-fit bg-zinc-100/50 p-1.5 rounded-2xl border border-zinc-200/50">
                        <TabsTrigger value="jobs" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-zinc-900 text-zinc-500 font-bold transition-all">
                            <Briefcase className="h-4 w-4 mr-2" /> Market Jobs
                        </TabsTrigger>
                        <TabsTrigger value="people" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-zinc-900 text-zinc-500 font-bold transition-all">
                            <Users className="h-4 w-4 mr-2" /> Expert Profiles
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="jobs" className="space-y-6">
                        <div className="relative group">
                            <Input
                                placeholder="Search roles, companies, or locations..."
                                className="h-14 pl-12 pr-32 rounded-2xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all text-base font-medium shadow-inner"
                                value={jobQuery}
                                onChange={(e) => setJobQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                            <Button
                                onClick={handleJobSearch}
                                disabled={isJobsLoading}
                                className="absolute right-2 top-2 bottom-2 bg-zinc-900 hover:bg-black text-white rounded-xl px-6 font-bold"
                            >
                                {isJobsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search Jobs'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job, i) => (
                                <div key={i} className="group relative flex flex-col border border-zinc-100 p-6 rounded-[2rem] bg-zinc-50/20 hover:bg-white hover:border-zinc-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center shrink-0">
                                            {job.companyLogo ? <img src={job.companyLogo} className="w-8 h-8 rounded-lg" /> : <Briefcase className="h-6 w-6 text-zinc-400" />}
                                        </div>
                                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-zinc-900 leading-tight group-hover:text-zinc-900 mb-1">{job.title}</h4>
                                        <p className="text-zinc-500 font-semibold mb-4 text-sm">{job.companyName}</p>

                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge variant="secondary" className="bg-zinc-100/80 text-zinc-600 border-none font-bold text-[10px] py-1">{job.location}</Badge>
                                            {job.salary && <Badge variant="secondary" className="bg-green-50 text-green-700 border-none font-bold text-[10px] py-1">{job.salary}</Badge>}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center mt-4">
                                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter">{job.postedAt || 'Recently Posted'}</span>
                                        <Badge className="bg-zinc-900 text-[10px] font-bold">Apply Now</Badge>
                                    </div>
                                </div>
                            ))}
                            {jobs.length === 0 && !isJobsLoading && (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                    {jobError ? (
                                        <>
                                            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                                <AlertCircle className="h-8 w-8 text-red-400" />
                                            </div>
                                            <h5 className="text-lg font-bold text-zinc-900">Search Error</h5>
                                            <p className="text-red-500 max-w-sm mt-2 text-sm font-medium">{jobError}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="opacity-30">
                                                <Search className="h-12 w-12 text-zinc-300 mb-4 mx-auto" />
                                            </div>
                                            <h5 className="text-xl font-bold text-zinc-900 opacity-50">Start Your Market Research</h5>
                                            <p className="text-zinc-400 max-w-xs mt-2 font-medium opacity-50">Search for positions to see skill requirements and salary benchmarks.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="people" className="space-y-6">
                        <div className="relative group">
                            <Input
                                placeholder="Search for experts (e.g. 'CTO San Francisco' or 'Lead Designer')..."
                                className="h-14 pl-12 pr-32 rounded-2xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all text-base font-medium shadow-inner"
                                value={peopleQuery}
                                onChange={(e) => setPeopleQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePeopleSearch()}
                            />
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                            <Button
                                onClick={handlePeopleSearch}
                                disabled={isPeopleLoading}
                                className="absolute right-2 top-2 bottom-2 bg-zinc-900 hover:bg-black text-white rounded-xl px-6 font-bold"
                            >
                                {isPeopleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find Experts'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {people.map((person, i) => (
                                <div key={i} className="group relative flex items-center gap-6 border border-zinc-100 p-6 rounded-[2.5rem] bg-zinc-50/20 hover:bg-white hover:border-zinc-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500">
                                    <div className="h-20 w-20 rounded-[1.5rem] bg-zinc-200 overflow-hidden shrink-0 border-4 border-white shadow-lg ring-1 ring-zinc-100">
                                        {person.profilePicture ? (
                                            <img src={person.profilePicture} className="object-cover w-full h-full" alt={person.fullName} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400 font-black text-2xl bg-zinc-100">
                                                {person.fullName?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-10">
                                        <h4 className="font-bold text-xl text-zinc-900 truncate leading-tight mb-1">{person.fullName}</h4>
                                        <p className="text-sm text-zinc-500 line-clamp-2 font-medium leading-relaxed mb-3">{person.headline || person.title || 'Elite Industry Professional'}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight border-zinc-200">{person.location || 'LinkedIn Expert'}</Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" asChild className="h-10 w-10 shrink-0 absolute top-6 right-6 hover:bg-zinc-900 hover:text-white rounded-full transition-all">
                                        <a href={person.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-5 w-5" />
                                        </a>
                                    </Button>
                                </div>
                            ))}
                            {people.length === 0 && !isPeopleLoading && (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                    {peopleError ? (
                                        <>
                                            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                                <AlertCircle className="h-8 w-8 text-red-400" />
                                            </div>
                                            <h5 className="text-lg font-bold text-zinc-900">Search Error</h5>
                                            <p className="text-red-500 max-w-sm mt-2 text-sm font-medium">{peopleError}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="opacity-30">
                                                <Users className="h-12 w-12 text-zinc-300 mb-4 mx-auto" />
                                            </div>
                                            <h5 className="text-xl font-bold text-zinc-900 opacity-50">Discover Top Professionals</h5>
                                            <p className="text-zinc-400 max-w-xs mt-2 font-medium opacity-50">Study profiles of successful people in your dream roles to optimize your own path.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
