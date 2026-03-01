import { NextResponse } from 'next/server';
import { searchLinkedInJobs } from '@/lib/apify';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { query, location } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        const jobs = await searchLinkedInJobs(query, location || '');

        return NextResponse.json({ success: true, jobs });

    } catch (error: any) {
        console.error('LinkedIn Job Search API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
