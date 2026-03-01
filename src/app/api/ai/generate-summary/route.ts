import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { SUMMARY_GENERATION_PROMPT } from '@/lib/ai-prompts';

export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-placeholder',
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeData } = await req.json();

        if (!resumeData) {
            return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
        }

        // Prepare context for AI (experience and skills are most relevant for summary)
        const context = {
            experience: resumeData.experience || [],
            skills: resumeData.skills || { technical: [], soft: [] }
        };

        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 500,
            temperature: 0.7,
            system: "You are a professional resume writer. Write ONLY the summary text.",
            messages: [
                {
                    role: "user",
                    content: SUMMARY_GENERATION_PROMPT.replace('{resume_data}', JSON.stringify(context))
                }
            ]
        });

        const summary = response.content.find(block => block.type === 'text')?.text || "";

        // Track AI usage
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'job_analysis' // Using job_analysis as a close enough type
        });

        return NextResponse.json({ success: true, summary: summary.trim() });

    } catch (error: any) {
        console.error('AI Summary Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
