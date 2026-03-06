import { NextResponse } from 'next/server';
import { scrapeLinkedInProfile } from '@/lib/apify';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function normalizeLinkedInUrl(url: string) {
    try {
        const u = new URL(url.toLowerCase());
        // Remove trailing slashes and common query params
        let path = u.pathname;
        if (path.endsWith('/')) path = path.slice(0, -1);
        return `https://www.linkedin.com${path}`;
    } catch (e) {
        return url.toLowerCase().replace(/\/$/, '');
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { profileUrl } = await req.json();

        if (!profileUrl || !profileUrl.includes('linkedin.com/in/')) {
            return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
        }

        const normalizedUrl = normalizeLinkedInUrl(profileUrl);

        // 1. Check unique LinkedIn profile limit (max 2)
        const { data: usedUrls } = await supabase
            .from('resumes')
            .select('linkedin_url')
            .eq('user_id', user.id)
            .not('linkedin_url', 'is', null);

        const uniqueUrls = new Set(usedUrls?.map(r => r.linkedin_url));

        if (uniqueUrls.size >= 2 && !uniqueUrls.has(normalizedUrl)) {
            return NextResponse.json({
                error: 'Profile Limit Reached',
                message: 'You can only import from a maximum of 2 unique LinkedIn profiles. This limit ensures platform integrity.'
            }, { status: 403 });
        }

        // 2. Apify ile veri çek
        const scrapedData = await scrapeLinkedInProfile(profileUrl);

        if (!scrapedData) {
            return NextResponse.json({ error: 'No data found for this profile.' }, { status: 404 });
        }

        // 3. Database'e kaydet
        const { data: existingResumes } = await supabase
            .from('resumes')
            .select('id')
            .eq('user_id', user.id);

        const isFirstResume = !existingResumes || existingResumes.length === 0;

        const { data: insertedResume, error: dbError } = await supabase
            .from('resumes')
            .insert({
                user_id: user.id,
                title: profileUrl.split('/in/')[1]?.replace('/', '') || 'LinkedIn Import',
                original_linkedin_json: scrapedData,
                linkedin_url: normalizedUrl,
                is_active: isFirstResume,
            })
            .select()
            .single();

        if (dbError) {
            console.error(dbError);
            return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, resumeId: insertedResume.id });

    } catch (error: any) {
        console.error('LinkedIn Import API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
