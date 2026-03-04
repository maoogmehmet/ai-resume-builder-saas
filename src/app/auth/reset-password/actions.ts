'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
        return redirect('/auth/reset-password?error=Please enter a valid email address')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/update-password`,
    })

    if (error) {
        return redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/auth/reset-password?message=Check your email for a password reset link')
}
