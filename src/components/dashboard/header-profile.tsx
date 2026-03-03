'use client'

import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { signout } from '@/app/auth/actions'
import { toast } from 'sonner'
import { useState } from 'react'
import { LogOut, Settings } from 'lucide-react'

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
        <div className="flex items-center gap-6 bg-black p-1.5 pr-2 rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex flex-col text-right pl-4">
                <span className="text-xs font-black text-white italic tracking-tighter lowercase">{fullName || email?.split('@')[0]}</span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-zinc-600 italic">
                    {isSubscribed ? 'Elite Tier' : 'Standard Core'}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {isSubscribed && (
                    <AnimatedGenerateButton
                        onClick={handleManageSubscription}
                        disabled={isPortalLoading}
                        generating={isPortalLoading}
                        labelIdle="Manage"
                        labelActive="..."
                        size="sm"
                        className="h-9 px-4 font-black italic lowercase text-[11px] bg-white/5 border-white/10"
                        icon={<Settings className="h-3.5 w-3.5" />}
                    />
                )}

                <form action={signout}>
                    <AnimatedGenerateButton
                        type="submit"
                        size="icon"
                        className="h-9 w-9 bg-transparent border-transparent text-zinc-600 hover:text-red-500 hover:bg-red-500/5"
                        icon={<LogOut className="h-3.5 w-3.5" />}
                    />
                </form>
            </div>
        </div>
    )
}
