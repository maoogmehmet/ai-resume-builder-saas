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

        const { id, content } = await req.json();

        if (!id || !content) {
            return NextResponse.json({ error: 'Letter ID and content are required' }, { status: 400 });
        }

        // Update the cover letter
        const { data, error } = await supabase
            .from('cover_letters')
            .update({
                content: content,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating cover letter:', error);
            return NextResponse.json({ error: 'Failed to update cover letter' }, { status: 500 });
        }

        return NextResponse.json({ success: true, letter: data });

    } catch (error: any) {
        console.error('Update Letter Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
