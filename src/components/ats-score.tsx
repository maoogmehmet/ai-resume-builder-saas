import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Trophy, AlertTriangle, Lightbulb } from "lucide-react"

interface AtsScoreDisplayProps {
    scoreData: any;
    onRecalculate?: () => void;
    onOptimize?: () => void;
}

export function AtsScoreDisplay({ scoreData, onRecalculate, onOptimize }: AtsScoreDisplayProps) {
    if (!scoreData) return null

    const score = scoreData.ats_score || 0
    const analysis = scoreData.keyword_analysis || {}

    let scoreColor = 'text-red-500'
    let progressColor = 'bg-red-500'
    if (score >= 80) {
        scoreColor = 'text-green-500'
        progressColor = 'bg-green-500'
    } else if (score >= 60) {
        scoreColor = 'text-yellow-500'
        progressColor = 'bg-yellow-500'
    }

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SCORE GAUGE */}
            <div className="grid gap-2 border rounded-lg p-6 bg-zinc-50 flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className={`h-8 w-8 ${scoreColor}`} />
                    <span className={`text-4xl font-extrabold tracking-tighter ${scoreColor}`}>
                        {score}/100
                    </span>
                </div>
                <p className="font-semibold text-zinc-700">Overall Match Score</p>
                <div className="w-full mt-2 relative">
                    <Progress value={score} className="h-3"
                        style={{ ['--progress-background' as string]: progressColor }} />
                </div>
            </div>

            {/* KEYWORD ANALYSIS */}
            <div className="grid gap-4 mt-2">
                <h3 className="font-semibold text-zinc-900 border-b pb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" /> Found Keywords
                    <Badge variant="secondary" className="ml-auto">{analysis.match_percentage || 0}% Match</Badge>
                </h3>
                <div className="flex flex-wrap gap-2">
                    {analysis.matched_keywords?.map((kw: string, i: number) => (
                        <Badge key={i} variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 shadow-none font-normal">
                            {kw}
                        </Badge>
                    ))}
                    {analysis.matched_keywords?.length === 0 && <p className="text-sm text-zinc-400">No core keywords matched.</p>}
                </div>

                <h3 className="font-semibold text-zinc-900 border-b pb-2 mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords?.map((kw: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-red-600 bg-red-50 border-red-200 font-normal">
                            {kw}
                        </Badge>
                    ))}
                    {analysis.missing_keywords?.length === 0 && <p className="text-sm text-zinc-400">All key terms are present!</p>}
                </div>

                {/* SUGGESTIONS */}
                {scoreData.suggestions && scoreData.suggestions.length > 0 && (
                    <>
                        <h3 className="font-semibold text-zinc-900 border-b pb-2 mt-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" /> Specific Feedback
                        </h3>
                        <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
                            {scoreData.suggestions.map((sug: string, i: number) => <li key={i}>{sug}</li>)}
                        </ul>
                    </>
                )}
            </div>

        </div>
    )
}
