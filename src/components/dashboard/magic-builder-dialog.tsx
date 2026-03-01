'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export function MagicBuilderDialog() {
    const router = useRouter()

    const handleMagicBuild = () => {
        router.push('/dashboard/magic-build')
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
