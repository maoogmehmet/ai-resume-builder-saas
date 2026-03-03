"use client";
import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Filter, Users, Clock, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedGenerateButton from "@/components/ui/animated-generate-button";

interface ActivityStat {
    label: string;
    value: number;
    color: string;
}

interface TeamMember {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface MarketingDashboardProps {
    title?: string;
    teamActivities: {
        totalHours: number;
        stats: ActivityStat[];
    };
    team: {
        memberCount: number;
        members: TeamMember[];
    };
    cta: {
        text: string;
        buttonText: string;
        onButtonClick?: () => void;
    };
    onFilterClick?: () => void;
    className?: string;
}

const AnimatedNumber = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest * 10) / 10);

    React.useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.5,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value, count]);

    return <motion.span>{rounded}</motion.span>;
};

export const MarketingDashboard = React.forwardRef<
    HTMLDivElement,
    MarketingDashboardProps
>(({
    title = "Dashboard View",
    teamActivities,
    team,
    cta,
    onFilterClick,
    className
}, ref) => {

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const hoverTransition = { type: "spring" as const, stiffness: 300, damping: 15 };

    return (
        <motion.div
            ref={ref}
            className={cn("w-full p-6 bg-black border border-white/10 text-white rounded-[2rem]", className)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">{title}</h2>
                <AnimatedGenerateButton
                    size="icon"
                    onClick={onFilterClick}
                    className="h-9 w-9"
                    icon={<Filter className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />}
                />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Team Activities Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={hoverTransition}
                >
                    <Card className="h-full p-4 overflow-hidden rounded-[1.5rem] bg-white/[0.03] border-white/5">
                        <CardContent className="p-2">
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500 italic">Activity Level</p>
                                <Clock className="w-4 h-4 text-zinc-500" />
                            </div>
                            <div className="mb-4">
                                <span className="text-4xl font-black tracking-tighter italic">
                                    <AnimatedNumber value={teamActivities.totalHours} />
                                </span>
                                <span className="ml-2 text-zinc-500 font-black uppercase tracking-widest text-xs italic opacity-60">Units</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-2 mb-4 overflow-hidden rounded-full bg-white/5 flex border border-white/5">
                                {teamActivities.stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className={cn("h-full", stat.color)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.value}%` }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                    />
                                ))}
                            </div>
                            {/* Legend */}
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">
                                {teamActivities.stats.map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-1.5">
                                        <span className={cn("w-1.5 h-1.5 rounded-full", stat.color)}></span>
                                        <span>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Team Members Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={hoverTransition}
                >
                    <Card className="h-full p-4 overflow-hidden rounded-[1.5rem] bg-emerald-500/5 border-emerald-500/10">
                        <CardContent className="p-2">
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-500/60 italic">Subscription</p>
                                <Users className="w-4 h-4 text-emerald-500/60" />
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-black tracking-tighter text-emerald-400 italic">
                                    <AnimatedNumber value={team.memberCount} />
                                </span>
                                <span className="ml-2 text-emerald-500/60 font-black uppercase tracking-widest text-xs italic opacity-60">Status</span>
                            </div>
                            {/* Avatar Stack */}
                            <div className="flex -space-x-2">
                                {team.members.slice(0, 4).map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                        whileHover={{ scale: 1.2, zIndex: 10, y: -2 }}
                                    >
                                        <Avatar className="h-8 w-8 border-2 border-black">
                                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                                            <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black">{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* CTA Banner */}
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={hoverTransition}
                className="mt-6"
            >
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                            <Zap className="w-4 h-4 text-yellow-500/80" />
                        </div>
                        <p className="text-xs font-black text-zinc-500 tracking-tight italic uppercase">{cta.text}</p>
                    </div>
                    <AnimatedGenerateButton
                        onClick={cta.onButtonClick}
                        className="shrink-0 w-full sm:w-auto px-8"
                        labelIdle={cta.buttonText}
                        labelActive="Starting..."
                        highlightHueDeg={45} // Gold/Yellow hue for Zap
                        noMinWidth
                    />
                </div>
            </motion.div>
        </motion.div>
    );
});

MarketingDashboard.displayName = "MarketingDashboard";
