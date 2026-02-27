import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeId, jobTitle, companyName, optimizedJson, atsScore, atsAnalysis } = await req.json();

        if (!resumeId || !optimizedJson) {
            return NextResponse.json({ error: 'Resume ID and Optimized JSON are required' }, { status: 400 });
        }

        const { data: version, error } = await supabase
            .from('resume_versions')
            .insert({
                resume_id: resumeId,
                job_title: jobTitle,
                company_name: companyName,
                optimized_json: optimizedJson,
                ats_score: atsScore,
                ats_analysis: atsAnalysis
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: 'Failed to create resume version' }, { status: 500 });
        }

        return NextResponse.json({ success: true, version });

    } catch (error: any) {
        console.error('Resume Version API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const resumeId = searchParams.get('resumeId');

        if (!resumeId) {
            return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
        }

        const { data: versions, error } = await supabase
            .from('resume_versions')
            .select('*')
            .eq('resume_id', resumeId)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
        }

        return NextResponse.json({ success: true, versions });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
