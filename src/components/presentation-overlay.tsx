'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Presentation } from 'lucide-react'
import { PresentationViewer } from '@/components/presentation-viewer'
import { AnimatePresence } from 'framer-motion'

interface PresentationOverlayProps {
    slides: any[] | null;
}

export function PresentationOverlay({ slides }: PresentationOverlayProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!slides || slides.length === 0) return null;

    return (
        <>
            <Button
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 font-bold hidden sm:flex h-10 px-4 rounded-xl shadow-sm transition-all"
                onClick={() => setIsOpen(true)}
            >
                <Presentation className="h-4 w-4 mr-2" />
                Pitch Deck
            </Button>

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
