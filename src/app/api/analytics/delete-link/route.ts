import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { linkId } = await request.json();

        if (!linkId) {
            return NextResponse.json({ error: 'linkId is required' }, { status: 400 });
        }

        // Verify ownership before deleting
        const { data: existingLink } = await supabase
            .from('public_links')
            .select('id, user_id')
            .eq('id', linkId)
            .eq('user_id', user.id)
            .single();

        if (!existingLink) {
            return NextResponse.json({ error: 'Link not found or unauthorized' }, { status: 404 });
        }

        const { error } = await supabase
            .from('public_links')
            .delete()
            .eq('id', linkId)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
