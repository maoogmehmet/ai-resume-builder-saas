import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { ATS_MATCHING_PROMPT } from '@/lib/ai-prompts';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeId, jobDescription, jobTitle, companyName, jobUrl } = await req.json();

        if (!resumeId || !jobDescription) {
            return NextResponse.json({ error: 'Resume ID and Job Description are required' }, { status: 400 });
        }

        // Get current AI Generated Resume Data
        const { data: resumeRow, error: fetchError } = await resumeId ? await supabase
            .from('resumes')
            .select('ai_generated_json')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single() : { data: null, error: null };

        if (fetchError || !resumeRow || !resumeRow.ai_generated_json) {
            return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 404 });
        }

        const resumeJson = JSON.stringify(resumeRow.ai_generated_json);

        // AI Request to Score Match
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 3500,
            temperature: 0.1, // strict response formatting
            system: "You are an ATS matching engine. Output ONLY valid JSON representing the ATS score and analysis metrics. Do not include markdown or conversational text.",
            messages: [
                {
                    role: "user",
                    content: ATS_MATCHING_PROMPT
                        .replace('{resume_json}', resumeJson)
                        .replace('{job_description}', jobDescription)
                }
            ]
        });

        const aiText = response.content.find(block => block.type === 'text')?.text || "{}";

        let atsAnalysisResult;
        try {
            const cleaned = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
            atsAnalysisResult = JSON.parse(cleaned);
        } catch {
            return NextResponse.json({ error: 'Invalid JSON from AI' }, { status: 500 });
        }

        return NextResponse.json({ success: true, result: atsAnalysisResult });

    } catch (error: any) {
        console.error('ATS Matching API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
