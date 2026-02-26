import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { createClient } from '@/lib/supabase/server';

const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});

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

        const run = await apifyClient.actor('curious_coder/linkedin-jobs-scraper').call({
            queries: [jobUrl],
            limit: 1 // only one job from URL
        });

        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Could not scrape job data' }, { status: 404 });
        }

        const jobData = items[0];

        return NextResponse.json({
            title: jobData.title,
            company: jobData.companyName,
            description: jobData.descriptionText || jobData.descriptionHTML || jobData.description
        });

    } catch (error: any) {
        console.error('LinkedIn Job Scrape API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
