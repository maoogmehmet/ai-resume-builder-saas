'use client'

import { useState } from 'react'
import { Presentation, Sparkles } from 'lucide-react'
import { PresentationViewer } from '@/components/presentation-viewer'
import { AnimatePresence } from 'framer-motion'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

interface PresentationOverlayProps {
    slides: any[] | null;
}

export function PresentationOverlay({ slides }: PresentationOverlayProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!slides || slides.length === 0) return null;

    return (
        <>
            <AnimatedGenerateButton
                onClick={() => setIsOpen(true)}
                labelIdle="Pitch Deck"
                className="hidden sm:flex h-10 px-6 font-black italic lowercase bg-white/5 border-white/10 text-white"
                icon={<Presentation className="h-4 w-4" />}
                highlightHueDeg={200}
            />

            <AnimatePresence>
                {isOpen && (
                    <PresentationViewer
                        slides={slides}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
