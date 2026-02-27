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

        const { action, resumeId, title } = await req.json();

        if (action === 'create_blank') {
            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    title: 'New Resume',
                    ai_generated_json: {
                        personal_info: { full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
                        summary: '',
                        experience: [],
                        education: [],
                        skills: { technical: [], soft: [] }
                    }
                })
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, resumeId: data.id });
        }

        if (action === 'delete') {
            const { error } = await supabase
                .from('resumes')
                .delete()
                .eq('id', resumeId)
                .eq('user_id', user.id);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === 'rename') {
            const { error } = await supabase
                .from('resumes')
                .update({ title })
                .eq('id', resumeId)
                .eq('user_id', user.id);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === 'duplicate') {
            const { data: original, error: fetchError } = await supabase
                .from('resumes')
                .select('*')
                .eq('id', resumeId)
                .single();

            if (fetchError) throw fetchError;

            const { data, error } = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    title: `${original.title} (Copy)`,
                    original_linkedin_json: original.original_linkedin_json,
                    ai_generated_json: original.ai_generated_json
                })
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, resumeId: data.id });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Resume Manage API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
