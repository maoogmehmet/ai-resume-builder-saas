'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Briefcase, Users, Loader2, ExternalLink, AlertCircle, Sparkles } from 'lucide-react'
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
        <Card className="border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden bg-black rounded-[2.5rem]">
            <CardHeader className="bg-white/5 p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Search className="h-64 w-64 -mr-16 -mt-16 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-yellow-400" />
                        </div>
                        <Badge variant="outline" className="bg-white/5 text-zinc-500 border-white/10 px-4 py-1 text-[10px] tracking-[0.3em] uppercase font-black italic">Neural Intelligence active</Badge>
                    </div>
                    <CardTitle className="text-4xl font-black tracking-tighter italic lowercase">
                        career research
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-sm font-black uppercase tracking-widest italic mt-2 opacity-60">
                        Benchmark your growth against elite market data and industry leaders.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-10">
                <Tabs defaultValue="jobs" className="space-y-10">
                    <TabsList className="flex w-fit bg-white/5 p-1.5 rounded-2xl border border-white/10">
                        <TabsTrigger value="jobs" className="px-8 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 font-black uppercase text-[10px] tracking-widest italic transition-all">
                            <Briefcase className="h-3.5 w-3.5 mr-2" /> Market Jobs
                        </TabsTrigger>
                        <TabsTrigger value="people" className="px-8 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 font-black uppercase text-[10px] tracking-widest italic transition-all">
                            <Users className="h-3.5 w-3.5 mr-2" /> Expert Profiles
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="jobs" className="space-y-8">
                        <div className="relative group">
                            <Input
                                placeholder="Search roles, companies, or locations..."
                                className="h-16 pl-14 pr-44 rounded-[1.5rem] border-white/5 bg-white/[0.02] focus:bg-white/[0.04] transition-all text-sm font-medium placeholder:text-zinc-700 italic"
                                value={jobQuery}
                                onChange={(e) => setJobQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                            <div className="absolute right-2 top-2 bottom-2 w-40">
                                <AnimatedGenerateButton
                                    onClick={handleJobSearch}
                                    disabled={isJobsLoading}
                                    generating={isJobsLoading}
                                    labelIdle="Deep Search"
                                    labelActive="Scanning..."
                                    className="w-full h-full font-black italic lowercase"
                                    size="lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job, i) => (
                                <div key={i} className="group relative flex flex-col border border-white/5 p-8 rounded-[2.5rem] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-700 shadow-2xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="h-14 w-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                                            {job.companyLogo ? <img src={job.companyLogo} className="w-10 h-10 rounded-lg grayscale group-hover:grayscale-0 transition-all" /> : <Briefcase className="h-7 w-7 text-zinc-700" />}
                                        </div>
                                        <AnimatedGenerateButton
                                            size="icon"
                                            href={job.jobUrl}
                                            className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            icon={<ExternalLink className="h-4 w-4" />}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-xl text-white tracking-tighter leading-tight italic truncate mb-1">{job.title}</h4>
                                        <p className="text-zinc-500 font-black uppercase tracking-widest text-[9px] mb-6 opacity-60 italic">{job.companyName}</p>

                                        <div className="flex flex-wrap items-center gap-2 mb-6">
                                            <Badge variant="outline" className="bg-white/5 text-zinc-500 border-white/5 font-black text-[9px] px-3 py-1 uppercase italic">{job.location}</Badge>
                                            {job.salary && <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500/60 border-emerald-500/10 font-black text-[9px] px-3 py-1 uppercase italic">{job.salary}</Badge>}
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/[0.03] flex justify-between items-center mt-4">
                                        <span className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.2em] italic">{job.postedAt || 'Recently Posted'}</span>
                                        <Badge variant="outline" className="border-white/10 text-white font-black text-[9px] px-4 py-1 uppercase italic bg-black">Apply</Badge>
                                    </div>
                                </div>
                            ))}
                            {jobs.length === 0 && !isJobsLoading && (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-40 italic">
                                    {jobError ? (
                                        <>
                                            <div className="h-20 w-20 bg-red-500/5 rounded-full flex items-center justify-center mb-6 border border-red-500/10">
                                                <AlertCircle className="h-10 w-10 text-red-500/40" />
                                            </div>
                                            <h5 className="text-xl font-black text-white italic lowercase tracking-tighter">Search Error</h5>
                                            <p className="text-zinc-500 max-w-sm mt-2 text-[10px] font-black uppercase tracking-widest">{jobError}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                                <Search className="h-10 w-10 text-zinc-700" />
                                            </div>
                                            <h5 className="text-2xl font-black text-white italic lowercase tracking-tighter">Market Research Hub</h5>
                                            <p className="text-zinc-500 max-w-xs mt-2 text-[10px] font-black uppercase tracking-widest">Neural diagnostic for positions, requirements, and benchmarks.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="people" className="space-y-8">
                        <div className="relative group">
                            <Input
                                placeholder="Search for experts (e.g. 'CTO San Francisco' or 'Lead Designer')..."
                                className="h-16 pl-14 pr-44 rounded-[1.5rem] border-white/5 bg-white/[0.02] focus:bg-white/[0.04] transition-all text-sm font-medium placeholder:text-zinc-700 italic"
                                value={peopleQuery}
                                onChange={(e) => setPeopleQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePeopleSearch()}
                            />
                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                            <div className="absolute right-2 top-2 bottom-2 w-40">
                                <AnimatedGenerateButton
                                    onClick={handlePeopleSearch}
                                    disabled={isPeopleLoading}
                                    generating={isPeopleLoading}
                                    labelIdle="Locate Peers"
                                    labelActive="Parsing..."
                                    className="w-full h-full font-black italic lowercase"
                                    size="lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {people.map((person, i) => (
                                <div key={i} className="group relative flex items-center gap-8 border border-white/5 p-8 rounded-[3rem] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-700 shadow-2xl overflow-hidden">
                                    <div className="h-24 w-24 rounded-[2rem] bg-zinc-900 overflow-hidden shrink-0 border-2 border-white/10 shadow-2xl relative">
                                        {person.profilePicture ? (
                                            <img src={person.profilePicture} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" alt={person.fullName} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-black text-3xl italic">
                                                {person.fullName?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-12">
                                        <h4 className="font-black text-2xl text-white italic tracking-tighter truncate leading-none mb-2">{person.fullName}</h4>
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic line-clamp-2 leading-relaxed opacity-60">{person.headline || person.title || 'Elite Industry Professional'}</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <Badge variant="outline" className="text-[8px] text-zinc-600 font-black uppercase tracking-widest border-white/5 bg-white/5 italic">{person.location || 'Encrypted Node'}</Badge>
                                        </div>
                                    </div>
                                    <AnimatedGenerateButton
                                        size="icon"
                                        href={person.url}
                                        className="h-12 w-12 shrink-0 absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        icon={<ExternalLink className="h-5 w-5" />}
                                    />
                                </div>
                            ))}
                            {people.length === 0 && !isPeopleLoading && (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-30 italic">
                                    {peopleError ? (
                                        <>
                                            <div className="h-20 w-20 bg-red-500/5 rounded-full flex items-center justify-center mb-6 border border-red-500/10">
                                                <AlertCircle className="h-10 w-10 text-red-500/40" />
                                            </div>
                                            <h5 className="text-xl font-black text-white italic lowercase tracking-tighter">Diagnostic Error</h5>
                                            <p className="text-zinc-500 max-w-sm mt-2 text-[10px] font-black uppercase tracking-widest">{peopleError}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                                <Users className="h-10 w-10 text-zinc-700" />
                                            </div>
                                            <h5 className="text-2xl font-black text-white italic lowercase tracking-tighter">Expert Discovery</h5>
                                            <p className="text-zinc-500 max-w-xs mt-2 text-[10px] font-black uppercase tracking-widest">Benchmark your trajectory against successful high-impact professionals.</p>
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
