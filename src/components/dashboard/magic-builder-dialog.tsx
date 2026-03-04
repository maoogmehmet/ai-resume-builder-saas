'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export function MagicBuilderDialog({ customTrigger }: { customTrigger?: React.ReactNode }) {
    const router = useRouter()

    const handleMagicBuild = () => {
        router.push('/dashboard/magic-build')
    }

    if (customTrigger) {
        return (
            <div onClick={handleMagicBuild} className="cursor-pointer inline-block w-full">
                {customTrigger}
            </div>
        )
    }

    return (
        <AnimatedGenerateButton
            labelIdle="New AI Resume"
            highlightHueDeg={45}
            size="lg"
            className="hover:scale-[1.02] transition-all"
            onClick={handleMagicBuild}
        />
    )
}
