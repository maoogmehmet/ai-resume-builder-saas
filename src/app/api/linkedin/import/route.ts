import { NextResponse } from 'next/server';
import { scrapeLinkedInProfile } from '@/lib/apify';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
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

        // 1. Apify ile veri çek
        const scrapedData = await scrapeLinkedInProfile(profileUrl);

        if (!scrapedData) {
            return NextResponse.json({ error: 'No data found for this profile.' }, { status: 404 });
        }

        // 2. Database'e kaydet
        // Kullanıcının ilk resume'ü ise is_active = true yapalım, değilse varsayılan.
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
