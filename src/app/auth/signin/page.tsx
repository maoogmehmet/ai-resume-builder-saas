import { login } from '../actions'
import { AuthPage } from '@/components/ui/auth-page'

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
    const resolvedParams = await searchParams

    return (
        <AuthPage
            type="signin"
            action={login}
            error={resolvedParams?.error}
            message={resolvedParams?.message}
        />
    )
}
