import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Trophy, AlertTriangle, Lightbulb, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
            <div className="relative overflow-hidden grid gap-2 border-none ring-1 ring-zinc-200 p-8 bg-zinc-50/50 rounded-3xl flex-col items-center justify-center text-center">
                <div className="absolute top-0 right-0 p-4">
                    <Badge variant="outline" className={`font-bold ${scoreColor} border-zinc-200 bg-white`}>
                        {scoreLabel}
                    </Badge>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className={`h-10 w-10 ${scoreColor} drop-shadow-sm`} />
                    <span className={`text-6xl font-black tracking-tighter ${scoreColor}`}>
                        {score}<span className="text-2xl text-zinc-300">/100</span>
                    </span>
                </div>
                <p className="font-bold text-zinc-900 text-lg">ATS Optimization Score</p>
                <div className="w-full max-w-sm mx-auto mt-4 relative">
                    <Progress value={score} className="h-4 rounded-full bg-zinc-200"
                        style={{ '--progress-background': progressColor } as any} />
                </div>
            </div>

            {/* KEYWORD ANALYSIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-6 border-zinc-100 shadow-sm rounded-2xl bg-white">
                    <h3 className="font-bold text-zinc-900 border-b border-zinc-50 pb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Keywords
                        <Badge variant="secondary" className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-100">
                            {analysis.matched_keywords?.length || 0}
                        </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {analysis.matched_keywords?.map((kw: string, i: number) => (
                            <Badge key={i} variant="default" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 shadow-none font-medium rounded-lg px-3 py-1">
                                {kw}
                            </Badge>
                        ))}
                        {analysis.matched_keywords?.length === 0 && <p className="text-xs text-zinc-400 italic">No core keywords matched yet.</p>}
                    </div>
                </Card>

                <Card className="p-6 border-zinc-100 shadow-sm rounded-2xl bg-white">
                    <h3 className="font-bold text-zinc-900 border-b border-zinc-50 pb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <XCircle className="w-4 h-4 text-rose-500" /> Missing Keywords
                        <Badge variant="secondary" className="ml-auto bg-rose-50 text-rose-700 border-rose-100">
                            {analysis.missing_keywords?.length || 0}
                        </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {analysis.missing_keywords?.map((kw: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-rose-600 bg-rose-50/50 border-rose-100 font-medium rounded-lg px-3 py-1">
                                {kw}
                            </Badge>
                        ))}
                        {analysis.missing_keywords?.length === 0 && <p className="text-xs text-zinc-400 italic">Perfect! All terms present.</p>}
                    </div>
                </Card>
            </div>

            {/* SUGGESTIONS & ACTION */}
            {scoreData.suggestions && scoreData.suggestions.length > 0 && (
                <Card className="p-6 border-zinc-900 bg-zinc-900 text-white rounded-3xl shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">AI Optimization Strategy</h3>
                            <p className="text-zinc-400 text-xs">Recommended actions to reach 90+ score</p>
                        </div>
                    </div>

                    <ul className="text-sm text-zinc-300 space-y-3 mb-8">
                        {scoreData.suggestions.map((sug: string, i: number) => (
                            <li key={i} className="flex gap-3 leading-relaxed">
                                <span className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                                {sug}
                            </li>
                        ))}
                    </ul>

                    <Button
                        className="w-full gap-2 bg-white text-zinc-900 hover:bg-zinc-100 font-black h-14 rounded-2xl shadow-xl shadow-black/50 transition-all active:scale-95"
                        onClick={() => onApplyOptimization(scoreData.optimized_bullets)}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 fill-zinc-900" />}
                        Rewrite & Optimize My Resume
                    </Button>
                    <p className="text-[10px] text-zinc-500 text-center mt-3 font-medium uppercase tracking-widest">
                        Creates a new optimized version of your resume
                    </p>
                </Card>
            )}

            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest" onClick={onRecalculate}>
                Analyze Again
            </Button>
        </div>
    )
}
