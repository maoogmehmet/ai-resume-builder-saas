'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Slide {
    title: string;
    subtitle: string;
    content: string;
}

interface PresentationViewerProps {
    slides: Slide[];
    onClose?: () => void;
}

export function PresentationViewer({ slides, onClose }: PresentationViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? prev : prev + 1))
    }, [slides.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1))
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide()
            if (e.key === 'ArrowLeft') prevSlide()
            if (e.key === 'Escape' && isFullscreen) toggleFullscreen()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide, isFullscreen])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false)
            }
        }
    }

    if (!slides || slides.length === 0) return null

    const currentSlide = slides[currentIndex]
    const progress = ((currentIndex + 1) / slides.length) * 100

    return (
        <div className={`fixed inset-0 z-50 bg-zinc-950 flex flex-col font-sans transition-all duration-300 ${isFullscreen ? 'p-0' : 'p-4 sm:p-8 lg:p-12'}`}>
            {/* Top Bar */}
            <div className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between pointer-events-none p-6 ${isFullscreen ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
                <div className="flex items-center gap-4 pointer-events-auto">
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                    <span className="text-zinc-500 font-bold text-sm tracking-widest uppercase">
                        Slide {currentIndex + 1} of {slides.length}
                    </span>
                </div>
                <div className="pointer-events-auto">
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900 z-20">
                <div
                    className="h-full bg-[#2563EB] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Stage */}
            <div className="flex-1 w-full max-w-7xl mx-auto relative overflow-hidden flex items-center justify-center bg-zinc-900/50 rounded-3xl shadow-2xl border border-zinc-800/50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-4xl p-8 sm:p-16 flex flex-col justify-center min-h-[50vh]"
                    >
                        {currentSlide.subtitle && (
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="text-blue-500 font-black tracking-[0.2em] uppercase text-sm mb-4 block"
                            >
                                {currentSlide.subtitle}
                            </motion.span>
                        )}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8"
                        >
                            {currentSlide.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="prose prose-invert prose-lg max-w-none text-zinc-300 space-y-4"
                        >
                            {currentSlide.content.split('\\n').map((paragraph, idx) => (
                                <p key={idx} className="leading-relaxed text-lg sm:text-xl font-medium">{paragraph.trim()}</p>
                            ))}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Left/Right Navigation Areas */}
                <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="absolute left-0 top-0 bottom-0 w-1/4 sm:w-32 flex items-center justify-start px-4 opacity-0 hover:opacity-100 disabled:hidden transition-opacity bg-gradient-to-r from-zinc-950/80 to-transparent z-10"
                >
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                        <ChevronLeft className="h-6 w-6 relative right-0.5" />
                    </div>
                </button>
                <button
                    onClick={nextSlide}
                    disabled={currentIndex === slides.length - 1}
                    className="absolute right-0 top-0 bottom-0 w-1/4 sm:w-32 flex items-center justify-end px-4 opacity-0 hover:opacity-100 disabled:hidden transition-opacity bg-gradient-to-l from-zinc-950/80 to-transparent z-10"
                >
                    <div className="h-12 w-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <ChevronRight className="h-6 w-6 relative left-0.5" />
                    </div>
                </button>
            </div>

            {/* Bottom Controls Indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                <div className="flex gap-2 bg-zinc-900/80 backdrop-blur border border-zinc-800 py-2 px-4 rounded-full shadow-2xl items-center pointer-events-auto">
                    <Button variant="ghost" size="sm" onClick={prevSlide} disabled={currentIndex === 0} className="rounded-full text-zinc-400 hover:text-white px-2">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-1.5 px-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'}`}
                            />
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" onClick={nextSlide} disabled={currentIndex === slides.length - 1} className="rounded-full text-zinc-400 hover:text-white px-2">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
