import { NextResponse } from 'next/server';
import { searchLinkedInPeople } from '@/lib/apify';
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

        const { query, limit = 5 } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        const people = await searchLinkedInPeople(query, limit);

        return NextResponse.json({ success: true, people });

    } catch (error: any) {
        console.error('PEOPLE SEARCH CRITICAL ERROR:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
