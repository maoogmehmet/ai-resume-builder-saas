'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, Pencil, Type, Copy, Trash2, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ResumeMagicCardProps {
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

export function ResumeMagicCard({
    resume,
    onEdit,
    onRename,
    onDuplicate,
    onDelete,
    className
}: ResumeMagicCardProps) {
    const isCompleted = !!resume.pdf_url;

    return (
        <div className={cn("group relative w-full", className)}>
            {/* Animated Border Beam Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-500/0 via-yellow-500/40 to-yellow-500/0 rounded-[1.6rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            <div className="relative z-10 bg-[#0a0a0a] border border-white/5 group-hover:border-white/10 rounded-[1.5rem] overflow-hidden transition-all duration-300 shadow-2xl">
                {/* Preview Area */}
                <div
                    className="relative aspect-[16/10] w-full bg-black/40 cursor-pointer overflow-hidden"
                    onClick={onEdit}
                >
                    {/* Abstract Resume Pattern */}
                    <div className="absolute inset-0 p-8 flex flex-col gap-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                        <div className="h-6 w-2/3 bg-white rounded-md" />
                        <div className="h-3 w-full bg-white rounded-sm" />
                        <div className="h-3 w-full bg-white rounded-sm" />
                        <div className="h-3 w-4/5 bg-white rounded-sm" />
                        <div className="mt-6 h-3 w-full bg-white rounded-sm" />
                        <div className="h-3 w-full bg-white rounded-sm" />
                        <div className="h-3 w-full bg-white rounded-sm" />
                    </div>

                    {/* Hover Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Status Badge - Refined */}
                    <div className="absolute bottom-5 left-5">
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

                    {/* Action Menu Trigger */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-9 w-9 bg-black/40 hover:bg-black/80 text-white border border-white/10 rounded-xl backdrop-blur-xl">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-white/10 text-zinc-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-1.5 backdrop-blur-2xl">
                                <DropdownMenuItem onClick={onEdit} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-medium group/item">
                                    <Eye className="h-4 w-4 text-zinc-500 group-hover/item:text-white" /> View & Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onRename} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-medium group/item">
                                    <Type className="h-4 w-4 text-zinc-500 group-hover/item:text-white" /> Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDuplicate} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs font-medium group/item">
                                    <Copy className="h-4 w-4 text-zinc-500 group-hover/item:text-white" /> Duplicate
                                </DropdownMenuItem>
                                <div className="my-1.5 h-px bg-white/5" />
                                <DropdownMenuItem onClick={onDelete} className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer text-xs font-medium group/item">
                                    <Trash2 className="h-4 w-4 text-red-500/70" /> Delete Forever
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Info Area */}
                <div className="p-6 pt-5">
                    <h3 className="text-lg font-bold text-white tracking-tight truncate mb-1">
                        {resume.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500 text-[11px] font-mono tracking-wider uppercase opacity-60">
                            {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <motion.div
                            className="text-yellow-500/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Open Lab <span className="text-lg leading-none">→</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
