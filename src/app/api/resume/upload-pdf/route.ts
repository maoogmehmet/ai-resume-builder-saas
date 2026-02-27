import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Use service role for storage uploads to bypass complex client RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as Blob | null;
        const resumeId = formData.get('resumeId') as string | null;

        if (!file || !resumeId) {
            return NextResponse.json({ error: 'Missing file or resumeId' }, { status: 400 });
        }

        // Verify the user owns this resume
        const { data: resumeCheck } = await supabase
            .from('resumes')
            .select('id')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single();

        if (!resumeCheck) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const fileExt = 'pdf';
        const fileName = `${user.id}/${resumeId}-${Date.now()}.${fileExt}`;

        // Upload to Storage
        const { error: uploadError } = await supabaseAdmin
            .storage
            .from('resumes')
            .upload(fileName, file, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) {
            console.error('Storage Upload Error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload PDF to storage' }, { status: 500 });
        }

        // Get public URL
        const { data: publicUrlData } = supabaseAdmin
            .storage
            .from('resumes')
            .getPublicUrl(fileName);

        const pdfUrl = publicUrlData.publicUrl;

        // Update database record
        const { error: dbError } = await supabase
            .from('resumes')
            .update({ pdf_url: pdfUrl })
            .eq('id', resumeId);

        if (dbError) {
            return NextResponse.json({ error: 'Failed to save PDF url to database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, pdfUrl });

    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
