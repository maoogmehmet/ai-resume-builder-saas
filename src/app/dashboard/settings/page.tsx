import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/signup')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

    return (
        <SettingsClient
            email={user.email || ''}
            resumeCount={resumeCount || 0}
            isSubscribed={isSubscribed}
            initialName={profile?.full_name || ''}
        />
    )
}
