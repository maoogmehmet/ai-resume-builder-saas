import { resetPassword } from './actions'
import { AuthPageSimple } from '@/components/ui/auth-page-simple'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
    const { error, message } = await searchParams
    return (
        <AuthPageSimple
            title="Reset Password"
            subtitle="Enter your email address and we'll send you a secure reset link."
            action={resetPassword}
            submitLabel="Send Reset Link"
            error={error}
            message={message}
            backHref="/auth/signin"
            backLabel="Back to Sign In"
            fields={[{ id: 'email', name: 'email', type: 'email', label: 'Email', placeholder: 'name@example.com', autoComplete: 'email' }]}
        />
    )
}
