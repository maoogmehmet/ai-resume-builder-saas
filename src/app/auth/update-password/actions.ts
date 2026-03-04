'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 8) {
        return redirect('/auth/update-password?error=Password must be at least 8 characters')
    }

    if (password !== confirmPassword) {
        return redirect('/auth/update-password?error=Passwords do not match')
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return redirect(`/auth/update-password?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/dashboard?message=Password updated successfully')
}
