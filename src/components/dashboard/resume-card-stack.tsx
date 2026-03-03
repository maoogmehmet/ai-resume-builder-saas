'use client';

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eye, Type, Copy, Trash2, MoreHorizontal, FileText, Sparkles } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AnimatedGenerateButton from '@/components/ui/animated-generate-button';

interface ResumeCardStackProps {
    resume: {
        id: string;
        title: string;
        updated_at: string;
        pdf_url?: string;
    };
    onEdit: () => void;
    onRename: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    className?: string;
}

export const ResumeCardStack = ({
    resume,
    onEdit,
    onRename,
    onDuplicate,
    onDelete,
    className,
}: ResumeCardStackProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isCompleted = !!resume.pdf_url;

    // Decorative stack layers
    const stackItems = [
        { id: 'layer-1', delay: 0.1, offset: 16, rotate: 2 },
        { id: 'layer-2', delay: 0.05, offset: 8, rotate: -2 },
    ];

    return (
        <div className={cn("group relative w-full", className)}>
            <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative h-[320px] w-full"
            >
                {/* Background Stack Layers */}
                {stackItems.map((layer) => (
                    <motion.div
                        key={layer.id}
                        animate={{
                            rotate: isHovered ? layer.rotate : 0,
                            y: isHovered ? -layer.offset : 0,
                            opacity: isHovered ? 0.4 : 0.2,
                        }}
                        transition={{ type: "spring", stiffness: 280, damping: 22, delay: layer.delay }}
                        className="absolute inset-x-4 top-0 h-[220px] rounded-[1.5rem] bg-zinc-800 border border-white/5 pointer-events-none"
                        style={{ zIndex: 1 }}
                    />
                ))}

                {/* Main Card */}
                <motion.div
                    animate={{
                        y: isHovered ? -20 : 0,
                        boxShadow: isHovered
                            ? "0 20px 40px rgba(0,0,0,0.6)"
                            : "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="relative z-10 bg-[#0a0a0a] border border-white/10 group-hover:border-white/20 rounded-[1.5rem] overflow-hidden flex flex-col h-full"
                >
                    {/* Preview Area (Top) */}
                    <div
                        className="relative h-[200px] w-full bg-zinc-900/50 cursor-pointer overflow-hidden border-b border-white/5"
                        onClick={onEdit}
                    >
                        {/* Abstract Resume Pattern */}
                        <div className="absolute inset-0 p-8 flex flex-col gap-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
                            <div className="h-6 w-2/3 bg-white rounded-md" />
                            <div className="h-2 w-full bg-white rounded-sm" />
                            <div className="h-2 w-full bg-white rounded-sm" />
                            <div className="h-2 w-4/5 bg-white rounded-sm" />
                            <div className="mt-4 h-2 w-full bg-white rounded-sm" />
                            <div className="h-2 w-full bg-white rounded-sm" />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute bottom-4 left-4">
                            <div className={cn(
                                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border backdrop-blur-md flex items-center gap-1.5",
                                isCompleted
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-zinc-500/10 text-zinc-400 border-white/10"
                            )}>
                                <div className={cn("h-1 w-1 rounded-full", isCompleted ? "bg-emerald-400 animate-pulse" : "bg-zinc-500")} />
                                {isCompleted ? 'Finalized' : 'Draft'}
                            </div>
                        </div>

                        {/* Action Menu */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <AnimatedGenerateButton
                                        size="icon"
                                        className="h-8 w-8 !bg-black/40 hover:!bg-black/80 border-white/10 rounded-xl backdrop-blur-xl"
                                        onClick={(e) => e.stopPropagation()}
                                        icon={<MoreHorizontal className="h-4 w-4 text-white" />}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 bg-[#0a0a0a] border-white/10 text-zinc-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-1.5 backdrop-blur-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenuItem onClick={onEdit} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-black uppercase tracking-widest group/item italic">
                                        <Eye className="h-4 w-4 text-zinc-500 group-hover/item:text-white" /> View & Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={onRename} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-black uppercase tracking-widest group/item italic">
                                        <Type className="h-4 w-4 text-zinc-500 group-hover/item:text-white" /> Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={onDuplicate} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-black uppercase tracking-widest group/item italic">
                                        <Copy className="h-4 w-4 text-zinc-500 group-hover/item:text-white" /> Duplicate
                                    </DropdownMenuItem>
                                    <div className="my-1.5 h-px bg-white/5" />
                                    <DropdownMenuItem onClick={onDelete} className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer text-xs font-black uppercase tracking-widest group/item italic">
                                        <Trash2 className="h-4 w-4 text-red-500/70" /> Delete Forever
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Content Area (Bottom) */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tighter truncate mb-1 italic">
                                {resume.title}
                            </h3>
                            <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase opacity-60 italic">
                                Last updated {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <div className="h-6 w-6 rounded-full border border-black bg-zinc-800 flex items-center justify-center">
                                    <FileText className="h-3 w-3 text-zinc-400" />
                                </div>
                                <div className="h-6 w-6 rounded-full border border-black bg-zinc-700 flex items-center justify-center">
                                    <Sparkles className="h-3 w-3 text-zinc-400" />
                                </div>
                            </div>
                            <AnimatedGenerateButton
                                size="sm"
                                onClick={onEdit}
                                className="h-7 w-auto px-4"
                                labelIdle="Open Lab"
                                labelActive="Opening..."
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResumeCardStack;
