import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/slug-generator';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { resumeId, template, versionId, linkName } = await req.json();

        if (!resumeId) {
            return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
        }

        const { data: resumeRow } = await supabase
            .from('resumes')
            .select('ai_generated_json, is_active')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single();

        if (!resumeRow) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        // Check trial & subscription state
        const { data: profile } = await supabase.from('profiles').select('trial_end_date, subscription_status').eq('id', user.id).single();
        let isLinkActive = true;
        if (profile) {
            const isTrialActive = new Date(profile.trial_end_date) > new Date();
            const isSubscribed = profile.subscription_status === 'active' || profile.subscription_status === 'trialing';
            if (!isTrialActive && !isSubscribed) {
                isLinkActive = false;
            }
        }

        if (!linkName) {
            // Find if default link exists
            const { data: existingLink } = await supabase
                .from('public_links')
                .select('*')
                .eq('resume_id', resumeId)
                .is('link_name', null)
                .single();

            if (existingLink) {
                // Update its state to current
                await supabase.from('public_links').update({
                    is_active: isLinkActive,
                    template: template || existingLink.template,
                    version_id: versionId || existingLink.version_id
                }).eq('id', existingLink.id);
                return NextResponse.json({ success: true, url: `${process.env.NEXT_PUBLIC_APP_URL}/r/${existingLink.slug}`, isActive: isLinkActive });
            }
        }

        let fullName = 'Unknown';
        let jobTitle = 'Professional';

        if (resumeRow.ai_generated_json) {
            fullName = resumeRow.ai_generated_json.personal_info?.full_name || fullName;
            if (resumeRow.ai_generated_json.experience && resumeRow.ai_generated_json.experience.length > 0) {
                jobTitle = resumeRow.ai_generated_json.experience[0].title || jobTitle;
            }
        }

        let baseSlug = generateSlug(fullName, jobTitle);
        let finalSlug = baseSlug;
        let counter = 1;

        // Check slug uniqueness
        while (true) {
            const { data: checkSlug } = await supabase.from('public_links').select('id').eq('slug', finalSlug).single();
            if (!checkSlug) break;
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        const { data: inserted, error: insertError } = await supabase
            .from('public_links')
            .insert({
                resume_id: resumeId,
                user_id: user.id,
                slug: finalSlug,
                is_active: isLinkActive,
                template: template || 'classic',
                version_id: versionId || null,
                link_name: linkName || null
            })
            .select()
            .single();

        if (insertError) {
            console.error(insertError);
            return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
        }

        return NextResponse.json({ success: true, url: `${process.env.NEXT_PUBLIC_APP_URL}/r/${inserted.slug}`, isActive: isLinkActive });

    } catch (error: any) {
        console.error('Public Link API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
