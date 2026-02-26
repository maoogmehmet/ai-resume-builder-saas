import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const resolvedParams = await searchParams;

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {resolvedParams?.error && (
                            <p className="text-sm text-red-500">{resolvedParams.error}</p>
                        )}
                        <Button className="w-full" formAction={signup}>Sign Up</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="ml-1 underline text-blue-500 hover:text-blue-700">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
