import { NextResponse } from 'next/server';
import { scrapeSingleLinkedInJob } from '@/lib/apify';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { jobUrl } = await req.json();

        if (!jobUrl || !jobUrl.includes('linkedin.com/jobs/')) {
            return NextResponse.json({ error: 'Invalid LinkedIn Job URL' }, { status: 400 });
        }

        const jobData = await scrapeSingleLinkedInJob(jobUrl);

        return NextResponse.json({
            title: jobData.title,
            company: jobData.company,
            description: jobData.description
        });

    } catch (error: any) {
        console.error('LinkedIn Job Scrape API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
