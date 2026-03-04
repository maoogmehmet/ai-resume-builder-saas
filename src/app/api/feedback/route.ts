import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendFeedbackEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, message } = await req.json();

        if (!message || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Send Email via Resend
        await sendFeedbackEmail(user.email || 'Unknown', message, type);

        // 2. Safely attempt to save to Supabase (if table exists)
        await supabase.from('user_feedbacks').insert({
            user_id: user.id,
            type,
            message,
            email: user.email
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Feedback API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
