import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Trophy, AlertTriangle, Lightbulb, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react"

import { Card } from "@/components/ui/card"
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

interface AtsScoreDisplayProps {
    scoreData: any;
    isLoading?: boolean;
    onRecalculate?: () => void;
    onOptimize?: () => void;
    onApplyOptimization: (optimizedBullets: any) => void;
}

export function AtsScoreDisplay({ scoreData, isLoading, onRecalculate, onOptimize, onApplyOptimization }: AtsScoreDisplayProps) {
    if (!scoreData) return null

    const score = scoreData.ats_score || 0
    const analysis = scoreData.keyword_analysis || {}

    let scoreColor = 'text-red-500'
    let progressColor = 'bg-red-500'
    let scoreLabel = 'Poor Match'

    if (score >= 80) {
        scoreColor = 'text-emerald-500'
        progressColor = 'bg-emerald-500'
        scoreLabel = 'Excellent Match'
    } else if (score >= 60) {
        scoreColor = 'text-amber-500'
        progressColor = 'bg-amber-500'
        scoreLabel = 'Good Match'
    }

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-6">
            {/* SCORE GAUGE */}
            <div className="relative overflow-hidden grid gap-2 border border-white/5 p-8 bg-white/[0.02] rounded-3xl flex-col items-center justify-center text-center">
                <div className="absolute top-0 right-0 p-4">
                    <Badge variant="outline" className={`font-black uppercase tracking-widest text-[10px] ${scoreColor} border-white/5 bg-black`}>
                        {scoreLabel}
                    </Badge>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className={`h-12 w-12 ${scoreColor} drop-shadow-2xl opacity-80`} />
                    <span className={`text-7xl font-black tracking-tighter ${scoreColor} italic`}>
                        {score}<span className="text-2xl text-zinc-800 not-italic">/100</span>
                    </span>
                </div>
                <p className="font-black text-white text-lg italic uppercase tracking-tighter">ATS Optimization Score</p>
                <div className="w-full max-w-sm mx-auto mt-6 relative">
                    <Progress value={score} className="h-3 rounded-full bg-white/5 border border-white/5"
                        style={{ '--progress-background': progressColor } as any} />
                </div>
            </div>

            {/* KEYWORD ANALYSIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-6 border-white/5 shadow-2xl rounded-[2rem] bg-white/[0.01]">
                    <h3 className="font-black text-zinc-500 border-b border-white/5 pb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] italic">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Matched Keywords
                        <Badge variant="secondary" className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black">
                            {analysis.matched_keywords?.length || 0}
                        </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {analysis.matched_keywords?.map((kw: string, i: number) => (
                            <Badge key={i} variant="default" className="bg-white/5 text-zinc-300 hover:bg-white/10 border-white/5 shadow-none font-bold rounded-lg px-3 py-1 text-[11px] lowercase italic">
                                {kw}
                            </Badge>
                        ))}
                        {analysis.matched_keywords?.length === 0 && <p className="text-[10px] text-zinc-700 italic font-black uppercase tracking-widest">No core keywords matched yet.</p>}
                    </div>
                </Card>

                <Card className="p-6 border-white/5 shadow-2xl rounded-[2rem] bg-white/[0.01]">
                    <h3 className="font-black text-zinc-500 border-b border-white/5 pb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] italic">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> Missing Keywords
                        <Badge variant="secondary" className="ml-auto bg-rose-500/10 text-rose-400 border-rose-500/20 font-black">
                            {analysis.missing_keywords?.length || 0}
                        </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {analysis.missing_keywords?.map((kw: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-zinc-500 bg-white/5 border-white/5 font-bold rounded-lg px-3 py-1 text-[11px] lowercase italic">
                                {kw}
                            </Badge>
                        ))}
                        {analysis.missing_keywords?.length === 0 && <p className="text-[10px] text-zinc-700 italic font-black uppercase tracking-widest">Perfect! All terms present.</p>}
                    </div>
                </Card>
            </div>

            {/* SUGGESTIONS & ACTION */}
            {scoreData.suggestions && scoreData.suggestions.length > 0 && (
                <Card className="p-8 border border-white/10 bg-black text-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="h-48 w-48 -mr-12 -mt-12" />
                    </div>

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl italic tracking-tighter uppercase">AI Strategy</h3>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Recommended actions for 90+ score</p>
                        </div>
                    </div>

                    <ul className="text-sm text-zinc-400 space-y-4 mb-10 relative z-10">
                        {scoreData.suggestions.map((sug: string, i: number) => (
                            <li key={i} className="flex gap-4 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                <span className="h-6 w-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-500 flex-shrink-0">{i + 1}</span>
                                <span className="font-medium">{sug}</span>
                            </li>
                        ))}
                    </ul>

                    <AnimatedGenerateButton
                        className="w-full h-14 relative z-10"
                        onClick={() => onApplyOptimization(scoreData.optimized_bullets)}
                        disabled={isLoading}
                        generating={isLoading}
                        labelIdle="Optimize resume now"
                        labelActive="Optimizing..."
                        highlightHueDeg={140}
                        size="lg"
                    />
                    <p className="text-[9px] text-zinc-600 text-center mt-4 font-black uppercase tracking-[0.2em] italic">
                        Creates a new high-performance version of your resume
                    </p>
                </Card>
            )}

            <div className="flex justify-center pt-2">
                <AnimatedGenerateButton
                    onClick={onRecalculate}
                    labelIdle="Analyze Again"
                    size="sm"
                    className="w-auto px-8 italic font-black text-zinc-500 hover:text-white"
                    icon={<RotateCcw className="h-3.5 w-3.5" />}
                />
            </div>
        </div>
    )
}
