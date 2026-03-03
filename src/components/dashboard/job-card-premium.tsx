'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Briefcase, MapPin, ExternalLink, Bookmark, BookmarkCheck, Loader2, Sparkles } from 'lucide-react';
import AnimatedGenerateButton from "@/components/ui/animated-generate-button";

interface JobCardPremiumProps {
    job: {
        _uid?: string;
        id?: string;
        title: string;
        location: string;
        companyName: string;
        companyLogo: string;
        jobUrl: string;
        description?: string;
        postedAt?: string;
    };
    onOptimize: () => void;
    onView: () => void;
    onSave: () => void;
    isSaved: boolean;
    isSaving: boolean;
    className?: string;
}

export const JobCardPremium = ({
    job,
    onOptimize,
    onView,
    onSave,
    isSaved,
    isSaving,
    className,
}: JobCardPremiumProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const stackItems = [
        { id: 'layer-1', delay: 0.1, offset: 12, rotate: 2 },
        { id: 'layer-2', delay: 0.05, offset: 6, rotate: -2 },
    ];

    return (
        <div className={cn("group relative w-full", className)}>
            <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative h-[340px] w-full"
            >
                {/* Background Stack Layers */}
                {stackItems.map((layer) => (
                    <motion.div
                        key={layer.id}
                        animate={{
                            rotate: isHovered ? layer.rotate : 0,
                            y: isHovered ? -layer.offset : 0,
                            opacity: isHovered ? 0.3 : 0.15,
                        }}
                        transition={{ type: "spring", stiffness: 280, damping: 22, delay: layer.delay }}
                        className="absolute inset-x-4 top-0 h-[220px] rounded-[1.5rem] bg-zinc-800 border border-white/5 pointer-events-none"
                    />
                ))}

                {/* Main Card */}
                <motion.div
                    animate={{
                        y: isHovered ? -15 : 0,
                        boxShadow: isHovered
                            ? "0 20px 40px rgba(0,0,0,0.6)"
                            : "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="relative z-10 bg-[#0a0a0a] border border-white/10 group-hover:border-white/20 rounded-[1.8rem] overflow-hidden flex flex-col h-full transition-colors duration-300"
                >
                    {/* Visual Area (Top) */}
                    <div
                        className="relative h-[180px] w-full bg-zinc-900/30 cursor-pointer overflow-hidden border-b border-white/5 flex items-center justify-center p-12"
                        onClick={onView}
                    >
                        {/* Company Logo with Glow */}
                        <div className="relative group/logo">
                            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150 opacity-0 group-hover/logo:opacity-50 transition-opacity" />
                            <div className="relative h-20 w-20 rounded-2xl bg-[#0d0d0d] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                                {job.companyLogo ? (
                                    <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                                ) : (
                                    <Briefcase className="h-8 w-8 text-zinc-700" />
                                )}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                            <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-white/10 bg-black/40 backdrop-blur-md text-zinc-400">
                                {job.postedAt || 'New Role'}
                            </div>
                        </div>

                        {/* Save Action */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <AnimatedGenerateButton
                                size="icon"
                                highlightHueDeg={isSaved ? 140 : 210}
                                className="h-9 w-9"
                                onClick={(e) => { e.stopPropagation(); onSave(); }}
                                disabled={isSaving}
                                icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : isSaved ? <BookmarkCheck className="h-4 w-4 text-emerald-500" /> : <Bookmark className="h-4 w-4 text-zinc-400" />}
                            />
                        </div>
                    </div>

                    {/* Content Area (Bottom) - Using "My CV" Style */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{job.companyName}</span>
                                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tighter line-clamp-2 leading-[1.1] mb-2 italic">
                                {job.title}
                            </h3>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <AnimatedGenerateButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOptimize();
                                }}
                                className="flex-1 h-11"
                                labelIdle="Optimize"
                                labelActive="Optimizing..."
                                icon={<Sparkles className="h-3.5 w-3.5" />}
                            />
                            <AnimatedGenerateButton
                                size="icon"
                                className="h-11 w-11"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView();
                                }}
                                icon={<ExternalLink className="h-4 w-4 text-white" />}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
