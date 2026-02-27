import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { RESUME_GENERATION_PROMPT } from '@/lib/ai-prompts';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for AI

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json({ error: 'AI service not configured. Please add ANTHROPIC_API_KEY.' }, { status: 503 });
        }

        const { role, skills, accomplishments } = await req.json();

        if (!role?.trim()) {
            return NextResponse.json({ error: 'Target role is required' }, { status: 400 });
        }

        console.log(`[MagicBuild] Generating resume for role: "${role}"`);

        const systemPrompt = `You are an elite executive resume writer with 20 years of experience crafting ATS-optimized, high-impact resumes for Fortune 500 candidates. You ONLY output valid JSON — never markdown, never prose, never explanations. Just the raw JSON object.`;

        const userPrompt = `Create a professional ATS-optimized resume for someone targeting the role of "${role}".

Key skills to highlight: ${skills || 'Infer relevant technical and soft skills for this role'}.
Key accomplishment to showcase: ${accomplishments || 'Generate 3 highly quantified, impactful bullet points per role'}.

REQUIREMENTS:
- Use placeholder personal info: name "Your Name", email "your@email.com", phone "+1 (555) 000-0000"
- Write a compelling 3-sentence professional summary
- Create 3 experience entries with 4-5 quantified bullet points each
- Each bullet: [Strong Verb] + [What] + [Measurable Impact with %/$/numbers]
- Include 1 education entry
- Include 8-12 technical skills and 4-6 soft skills

${RESUME_GENERATION_PROMPT}`;

        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            temperature: 0.6,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const aiText = response.content.find(block => block.type === 'text')?.text || '{}';

        let aiGeneratedJson;
        try {
            const cleaned = aiText
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();
            aiGeneratedJson = JSON.parse(cleaned);
        } catch (parseError) {
            console.error('[MagicBuild] JSON parse failed. Raw output:', aiText.slice(0, 500));
            return NextResponse.json({
                error: 'AI returned invalid JSON formatting. Please try again.',
            }, { status: 500 });
        }

        // Validate the structure
        if (!aiGeneratedJson.personal_info || !aiGeneratedJson.experience) {
            console.error('[MagicBuild] Invalid resume structure:', Object.keys(aiGeneratedJson));
            return NextResponse.json({
                error: 'AI generated an incomplete resume. Please try again with more specific details.',
            }, { status: 500 });
        }

        const { data: insertedResume, error: dbError } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                title: `${role} — AI Draft`,
                ai_generated_json: aiGeneratedJson,
            })
            .select()
            .single();

        if (dbError) {
            console.error('[MagicBuild] DB insert failed:', dbError);
            return NextResponse.json({ error: 'Failed to save resume. Please try again.' }, { status: 500 });
        }

        // Track usage (fire and forget)
        supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'resume_creation'
        }).then();

        console.log(`[MagicBuild] Successfully created resume: ${insertedResume.id}`);
        return NextResponse.json({ success: true, resumeId: insertedResume.id });

    } catch (error: any) {
        console.error('[MagicBuild] Critical error:', error);

        // Specific Anthropic errors
        if (error.status === 529 || error.message?.includes('overloaded')) {
            return NextResponse.json({ error: 'AI service is temporarily overloaded. Please try again in a moment.' }, { status: 503 });
        }
        if (error.status === 401) {
            return NextResponse.json({ error: 'Invalid AI API key. Check ANTHROPIC_API_KEY.' }, { status: 503 });
        }

        return NextResponse.json({
            error: error.message || 'An unexpected error occurred. Please try again.',
        }, { status: error.status || 500 });
    }
}
