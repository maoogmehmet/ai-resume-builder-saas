'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

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

    const toggleFullscreen = useCallback(() => {
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
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide()
            if (e.key === 'ArrowLeft') prevSlide()
            if (e.key === 'Escape' && isFullscreen) toggleFullscreen()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide, isFullscreen, toggleFullscreen])

    if (!slides || slides.length === 0) return null

    const currentSlide = slides[currentIndex]
    const progress = ((currentIndex + 1) / slides.length) * 100

    return (
        <div className={`fixed inset-0 z-50 bg-black flex flex-col font-sans transition-all duration-700 ${isFullscreen ? 'p-0' : 'p-6 sm:p-12 lg:p-20'}`}>
            {/* Background Grain/Grid */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* Top Bar */}
            <div className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-10 pointer-events-none transition-all duration-700 ${isFullscreen ? 'opacity-0 hover:opacity-100' : ''}`}>
                <div className="flex items-center gap-6 pointer-events-auto">
                    {onClose && (
                        <AnimatedGenerateButton
                            size="icon"
                            onClick={onClose}
                            className="h-12 w-12 bg-white/5 border-white/10 text-zinc-500 hover:text-white rounded-2xl"
                            icon={<X className="h-5 w-5" />}
                        />
                    )}
                    <div className="flex flex-col">
                        <span className="text-zinc-600 font-black text-[9px] tracking-[0.4em] uppercase italic">
                            timeline segment
                        </span>
                        <span className="text-white font-black text-sm tracking-tighter italic">
                            {currentIndex + 1} <span className="text-zinc-700 not-italic">/</span> {slides.length}
                        </span>
                    </div>
                </div>
                <div className="pointer-events-auto">
                    <AnimatedGenerateButton
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-12 w-12 bg-white/5 border-white/10 text-zinc-500 hover:text-white rounded-2xl"
                        icon={isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-40 overflow-hidden">
                <motion.div
                    className="h-full bg-white transition-all duration-700 ease-[0.16,1,0.3,1]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Stage */}
            <div className="flex-1 w-full max-w-[1400px] mx-auto relative overflow-hidden flex items-center justify-center bg-black/40 rounded-[3rem] shadow-[0_100px_200px_rgba(0,0,0,0.9)] border border-white/5 group">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none opacity-20" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 150, filter: 'blur(15px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -150, filter: 'blur(15px)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-5xl p-10 sm:p-24 flex flex-col justify-center min-h-[60vh] relative z-10"
                    >
                        {currentSlide.subtitle && (
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-zinc-600 font-black tracking-[0.5em] uppercase text-[10px] mb-6 block italic"
                            >
                                {currentSlide.subtitle}
                            </motion.span>
                        )}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-12 italic lowercase"
                        >
                            {currentSlide.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="max-w-none text-zinc-500 space-y-8"
                        >
                            {currentSlide.content.split('\\n').map((paragraph, idx) => (
                                <p key={idx} className="leading-relaxed text-xl sm:text-2xl font-black tracking-tight italic">{paragraph.trim()}</p>
                            ))}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Left/Right Navigation Areas (Invisible but active) */}
                <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-pointer disabled:cursor-default"
                />
                <button
                    onClick={nextSlide}
                    disabled={currentIndex === slides.length - 1}
                    className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-pointer disabled:cursor-default"
                />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-30">
                <div className="flex gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-2.5 rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] items-center pointer-events-auto group/controls">
                    <AnimatedGenerateButton
                        size="icon"
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="h-10 w-10 bg-transparent border-transparent text-zinc-600 hover:text-white"
                        icon={<ChevronLeft className="h-5 w-5" />}
                    />
                    <div className="flex gap-2.5 px-3">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-700 ${idx === currentIndex ? 'w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/10 hover:bg-white/30'}`}
                            />
                        ))}
                    </div>
                    <AnimatedGenerateButton
                        size="icon"
                        onClick={nextSlide}
                        disabled={currentIndex === slides.length - 1}
                        className="h-10 w-10 bg-transparent border-transparent text-zinc-600 hover:text-white"
                        icon={<ChevronRight className="h-5 w-5" />}
                    />
                </div>
            </div>
        </div>
    )
}
