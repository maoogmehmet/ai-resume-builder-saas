"use client";
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import AnimatedGenerateButton from '@/components/ui/animated-generate-button';

import {
    FileText,
    TrendingUp,
    Sparkles,
    History as HistoryIcon,
    Briefcase,
    Users,
    DollarSign,
    CheckCircle,
    Clock
} from 'lucide-react';

const ICON_MAP = {
    'file-text': FileText,
    'trending-up': TrendingUp,
    'sparkles': Sparkles,
    'history': HistoryIcon,
    'briefcase': Briefcase,
    'users': Users,
    'dollar-sign': DollarSign,
    'check-circle': CheckCircle,
    'clock': Clock,
};

export interface CardDisplayItem {
    id: string;
    title: string;
    value: string;
    description: string;
    icon?: keyof typeof ICON_MAP;
    actionLabel?: string;
    isDisabled?: boolean;
    onActionClick?: (id: string) => void;
}

export interface CardDisplayProps {
    items: CardDisplayItem[];
    className?: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ items, className }) => {
    if (!items || items.length === 0) {
        return <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 p-12 border border-white/5 rounded-[2rem] bg-white/[0.01] italic">No display metrics available.</p>;
    }

    return (
        <div
            className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
                className
            )}
        >
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                >
                    <Card
                        className="flex flex-col h-full bg-[#0a0a0a] border-white/5 group transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 rounded-[1.5rem] overflow-hidden"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors italic">
                                {item.title}
                            </CardTitle>
                            {item.icon && ICON_MAP[item.icon] && (
                                <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                                    {(() => {
                                        const IconComponent = ICON_MAP[item.icon];
                                        return <IconComponent className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />;
                                    })()}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow pt-2 pb-6 px-6">
                            <div className="text-4xl font-black text-white tracking-tighter italic mb-1 lowercase">
                                {item.value}
                            </div>
                            <CardDescription className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                                {item.description}
                            </CardDescription>
                        </CardContent>
                        {item.actionLabel && (
                            <CardFooter className="pt-0 pb-6 px-6">
                                <AnimatedGenerateButton
                                    size="sm"
                                    onClick={() => item.onActionClick?.(item.id)}
                                    disabled={item.isDisabled}
                                    className="w-full"
                                    labelIdle={item.actionLabel}
                                />
                            </CardFooter>
                        )}
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};
