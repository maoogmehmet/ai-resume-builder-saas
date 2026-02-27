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

        const { title, companyName, location, jobUrl, salary, description, companyLogo } = await req.json();

        if (!title || !companyName || !jobUrl) {
            return NextResponse.json({ error: 'Missing required job parameters' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('saved_jobs')
            .upsert(
                {
                    user_id: user.id,
                    title,
                    company_name: companyName,
                    location,
                    job_url: jobUrl,
                    salary,
                    description,
                    company_logo: companyLogo
                },
                { onConflict: 'user_id,job_url' }
            )
            .select()
            .single();

        if (error) {
            console.error('Save Job Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, job: data });

    } catch (error: any) {
        console.error('Save Job Try/Catch Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
