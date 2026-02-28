import { signup } from '../actions'
import { AuthPage } from '@/components/ui/auth-page'

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
    const resolvedParams = await searchParams;

    return (
        <AuthPage
            type="signup"
            action={signup}
            error={resolvedParams?.error}
            message={resolvedParams?.message}
        />
    )
}
