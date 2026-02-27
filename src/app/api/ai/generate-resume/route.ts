import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

import Anthropic from '@anthropic-ai/sdk';
import { RESUME_GENERATION_PROMPT } from '@/lib/ai-prompts';

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

        const { resumeId } = await req.json();

        if (!resumeId) {
            return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
        }

        // 1. Get raw linkedin data from DB
        const { data: resumeRow, error: fetchError } = await supabase
            .from('resumes')
            .select('original_linkedin_json')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !resumeRow || !resumeRow.original_linkedin_json) {
            return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 404 });
        }

        const linkedInData = JSON.stringify(resumeRow.original_linkedin_json);

        // 2. Pass to Anthropic for AI generation
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 3500,
            temperature: 0.2, // low temperature for structured output
            system: "You are a specialized AI assistant that takes raw data and returns ONLY strictly formatted JSON strings as output without any markdown.",
            messages: [
                {
                    role: "user",
                    content: `${RESUME_GENERATION_PROMPT}\n\nDATA:\n${linkedInData}`
                }
            ]
        });

        const aiText = response.content.find(block => block.type === 'text')?.text || "{}";

        let aiGeneratedJson;
        try {
            // Attempt to parse to ensure it's valid JSON
            // Clean up markdown in case the model failed to follow "no markdown" rules
            const cleaned = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
            aiGeneratedJson = JSON.parse(cleaned);
        } catch {
            console.error("Claude returned invalid JSON", aiText);
            return NextResponse.json({ error: 'AI returned invalid formatting' }, { status: 500 });
        }

        // 3. Save into DB
        const { data: updatedResume, error: updateError } = await supabase
            .from('resumes')
            .update({
                ai_generated_json: aiGeneratedJson,
                updated_at: new Date().toISOString()
            })
            .eq('id', resumeId)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: 'Failed to save generated resume' }, { status: 500 });
        }

        // 4. Track AI usage
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'resume_creation'
        });

        return NextResponse.json({ success: true, aiGenerated: updatedResume.ai_generated_json });

    } catch (error: any) {
        console.error('LinkedIn AI Resume API Error:', error);
        let message = error.message || 'Internal Server Error';
        if (message.includes('credit balance is too low')) {
            message = 'Anthropic API credit limit reached. Please add funds to your Anthropic account to generate resumes.';
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
