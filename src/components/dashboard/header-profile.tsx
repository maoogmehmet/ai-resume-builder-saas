'use client'

import { Button } from '@/components/ui/button'
import { signout } from '@/app/auth/actions'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function DashboardHeaderProfile({
    fullName,
    email,
    isSubscribed
}: {
    fullName: string | null,
    email: string | undefined,
    isSubscribed: boolean
}) {
    const [isPortalLoading, setIsPortalLoading] = useState(false)

    const handleManageSubscription = async () => {
        setIsPortalLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Failed to open billing portal')
            }
        } catch {
            toast.error('Failed to open billing portal')
        } finally {
            setIsPortalLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border shadow-sm px-4">
            <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-zinc-900">{fullName || email?.split('@')[0]}</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                    {isSubscribed ? 'Premium Account' : 'Free Trial'}
                </span>
            </div>

            {isSubscribed && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-zinc-200"
                    onClick={handleManageSubscription}
                    disabled={isPortalLoading}
                >
                    {isPortalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Manage'}
                </Button>
            )}

            <form action={signout}>
                <Button variant="ghost" size="sm" className="h-8 text-zinc-500 hover:text-red-600 hover:bg-red-50">Sign Out</Button>
            </form>
        </div>
    )
}
