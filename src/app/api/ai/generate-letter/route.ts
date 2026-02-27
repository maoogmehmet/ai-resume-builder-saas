import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchCompanyInfo } from '@/lib/apify';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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

        const { resumeId, jobTitle, companyName, jobDescription } = await req.json();

        if (!resumeId || !jobTitle) {
            return NextResponse.json({ error: 'Resume ID and Job Title are required' }, { status: 400 });
        }

        // Get current AI Generated Resume Data
        const { data: resumeRow, error: fetchError } = await supabase
            .from('resumes')
            .select('ai_generated_json, title')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !resumeRow || !resumeRow.ai_generated_json) {
            return NextResponse.json({ error: 'Failed to fetch resume data' }, { status: 404 });
        }

        const resumeStr = JSON.stringify(resumeRow.ai_generated_json);

        // Get Company Intelligence via Apify
        let companyIntel = "No specific intelligence gathered.";
        if (companyName && companyName !== 'Unknown Company') {
            companyIntel = await searchCompanyInfo(companyName);
        }

        const prompt = `You are an expert career coach and presentation designer.
Instead of a standard cover letter, create a highly compelling 4-slide "Pitch Deck" presentation to the hiring manager for the role of ${jobTitle} at ${companyName || 'the company'}.
Use the provided Resume JSON data, the Job Description, and the Recent Company Intelligence to tailor the presentation uniquely to this company's current context.

CRITICAL FORMATTING INSTRUCTIONS:
- You MUST output ONLY a pure JSON array of objects. Do not include any markdown formatting like \`\`\`json, do NOT include any introductory or concluding text. Just the raw JSON array.
- The JSON array MUST contain exactly 4 objects, one for each slide.
- Each slide object MUST have these exact keys: "title" (string), "subtitle" (string), "content" (string - use bullet points if appropriate, using \\n for newlines).

Slide 1: Cover & Intro (Focus on excitement for the role and company)
Slide 2: Current Landscape (Focus on the company's current challenges/position using the Company Intelligence)
Slide 3: Why Me? (Focus on 2-3 specific achievements from the Resume that match the Job Description)
Slide 4: First 90 Days Vision (A proactive 30-60-90 day summary plan)

Resume Data:
${resumeStr}

Job Description:
${jobDescription || 'Unknown Details'}

Recent Company Intelligence (use this context to stand out):
${companyIntel}
`;

        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1500,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const letterContent = response.content.find(block => block.type === 'text')?.text || "";

        // Track AI usage
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'job_analysis'
        });

        let parsedContent: any = [];

        try {
            parsedContent = JSON.parse(letterContent.trim());
            if (!Array.isArray(parsedContent)) {
                throw new Error("AI did not return an array");
            }
        } catch (e) {
            console.warn("Failed to parse Claude JSON response for presentation. Falling back.", e);
            // Fallback to a default structure if AI fails
            parsedContent = [
                {
                    title: `Pitch for ${jobTitle}`,
                    subtitle: `Prepared for ${companyName}`,
                    content: "I am thrilled to apply for this role. My background aligns perfectly with your mission."
                },
                {
                    title: "Company Context",
                    subtitle: "Understanding Your Challenges",
                    content: "Based on recent intelligence, I understand you are scaling rapidly and need proven leadership."
                },
                {
                    title: "Why Me?",
                    subtitle: "Relevant Achievements",
                    content: "• My unique blend of technical expertise\\n• Proven track record in similar roles\\n• Ready to drive immediate value"
                },
                {
                    title: "First 90 Days",
                    subtitle: "Action Plan",
                    content: "• Connect with key stakeholders\\n• Audit current processes\\n• Deliver quick wins in month one"
                }
            ];
        }

        // Save letter as stringified JSON in the content column
        const { data: letterRow, error: saveError } = await supabase.from('cover_letters').insert({
            user_id: user.id,
            resume_id: resumeId,
            job_title: jobTitle,
            company_name: companyName || 'Unknown Company',
            content: JSON.stringify(parsedContent)
        }).select().single();

        if (saveError) {
            console.error('Save letter error:', saveError);
            return NextResponse.json({ error: 'Failed to save cover letter to database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, letter: letterRow });

    } catch (error: any) {
        console.error('Generate Letter Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
